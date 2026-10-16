/**
 * Web Dashboard Server for Google Maps Business Intelligence & Directory Scraper
 */

import http from 'http';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import ExcelJS from 'exceljs';
import { exportToExcel } from './lib/excel.js';
import { CATEGORY_SECTORS, REGION_CLUSTERS } from './lib/catalog.js';
import { buildRegionIndex, resolveRegion } from './lib/region.js';
import { getLicenseStatus, markOnboarded, activateLicenseOnline, validateSerial, loadLicenseState, deactivateLicense } from './lib/license.js';
import { executeScrapePlan, provinceForCity } from './lib/scrape-runner.js';
import { WEBHOOK_PATH, CLAIM_PATH, PLANS, verifySingapaySignature, 
fulfillPaymentLink, claimByReff, findLatestOrderAfter, normalizeLicenseEntries, normalizeRevoked, findPlanForSerial, 
paymentOptions, createDynamicPaymentLink, verifyDynamicPaymentToken, markOrderActivated, isOrderStillActive, 
orderReuseStatus, fetchVpsOrderByReff } from './lib/payment.js';

// NOTE: ./lib/scraper.js (engine Google RPC) TIDAK diimpor statis di sini.
// Ia di-load lazy oleh scrape-runner agar paket klien bisa diedarkan
// tanpa file engine (hasil reverse engineering tidak bisa scraping).

// Mode engine:
// - local  : scraping jalan di mesin ini (default, dev & VPS-engine standalone)
// - engine : mode VPS — hanya melayani POST /api/engine/run (butuh serial valid)
// - client : mode aplikasi paket — /api/scrape/start di-proxy ke VPS,
//            engine lokal tidak dipakai (file scraper.js bahkan tidak dibundel)
const ENGINE_MODE = (process.env.ENGINE_MODE || 'local').toLowerCase();
const ENGINE_URL = (process.env.ENGINE_URL || '').replace(/\/+$/, '');
const ENGINE_ALLOWLIST_FILE = process.env.ENGINE_ALLOWLIST_FILE || null;

// Indeks wilayah (kota + kecamatan -> kota/provinsi induk) untuk anchor query.
const REGION_INDEX = buildRegionIndex(REGION_CLUSTERS.flatMap((cl) => cl.cities));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const MASTER_EXCEL_PATH = path.join(__dirname, 'Data_Bisnis_Google_Maps_Indonesia_Lengkap.xlsx');
// Mode klien (aplikasi paket): dataset persisten di file JSON userData
// (bebas read-only asar), bukan Excel master vendor.
const CLIENT_DATASET_FILE = process.env.GMST_DATASET_FILE || null;
let clientSaveTimer = null;
let clientSaving = false;

async function loadClientDataset() {
  if (!CLIENT_DATASET_FILE || ENGINE_MODE !== 'client') return;
  try {
    if (!fs.existsSync(CLIENT_DATASET_FILE)) return;
    const raw = JSON.parse(fs.readFileSync(CLIENT_DATASET_FILE, 'utf8'));
    const records = Array.isArray(raw) ? raw : raw.records;
    if (!Array.isArray(records)) return;
    for (const item of records) {
      if (!item || !item.name) continue;
      const key = item.placeId || `${String(item.name).toLowerCase()}_${String(item.city || '').toLowerCase()}`;
      if (!seenPlaceIds.has(key)) {
        seenPlaceIds.add(key);
        activeDataset.push(item);
      }
    }
    console.log(`[Dataset] Memuat ${activeDataset.length} listing dari arsip lokal pengguna.`);
  } catch (err) {
    console.warn(`[Dataset] Arsip lokal tak terbaca, mulai kosong: ${err.message}`);
  }
}

function scheduleClientSave() {
  if (!CLIENT_DATASET_FILE || ENGINE_MODE !== 'client' || clientSaving) return;
  if (clientSaveTimer) return;
  clientSaveTimer = setTimeout(async () => {
    clientSaveTimer = null;
    clientSaving = true;
    try {
      fs.mkdirSync(path.dirname(CLIENT_DATASET_FILE), { recursive: true });
      fs.writeFileSync(CLIENT_DATASET_FILE, JSON.stringify({ savedAt: new Date().toISOString(), records: activeDataset }));
    } catch (err) {
      console.warn(`[Dataset] Gagal menyimpan arsip lokal: ${err.message}`);
    } finally {
      clientSaving = false;
    }
  }, 8000);
}

// In-memory dataset
let activeDataset = [];
let seenPlaceIds = new Set();
let sseClients = [];
let currentScrapeJob = null; // { abort: false, running: boolean }

const MAX_BODY_BYTES = 2 * 1024 * 1024; // 2MB cap against oversized export/scrape payloads
const MAX_EXPORT_RECORDS = 50000;

function setSecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
}

function safeJsonParse(raw) {
  if (!raw || typeof raw !== 'string') return null;
  let s = raw.trim();
  if (!s.length) return null;
  if (s.charCodeAt(0) === 0xFEFF) s = s.slice(1);
  try { return JSON.parse(s); } catch (e) { return null; }
}

function readRawBody(req, limit = MAX_BODY_BYTES) {
  return new Promise((resolve, reject) => {
    let size = 0;
    let body = '';
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > limit) {
        reject(Object.assign(new Error('Payload terlalu besar'), { status: 413 }));
        req.destroy();
        return;
      }
      body += chunk;
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function readJsonBody(req, limit = MAX_BODY_BYTES) {
  return readRawBody(req, limit).then((body) => {
    if (!body) return {};
    const parsed = safeJsonParse(body);
    if (parsed === null) {
      throw Object.assign(new Error('Body JSON tidak valid'), { status: 400 });
    }
    return parsed;
  });
}

function cleanStr(v, max = 80) {
  return String(v ?? '').replace(/[\r\n\t]+/g, ' ').trim().slice(0, max);
}

function validateScrapePayload(payload) {
  const keyword = cleanStr(payload?.keyword, 80);
  if (keyword.length < 2) throw Object.assign(new Error('Kata kunci minimal 2 karakter'), { status: 400 });
  let cities = payload?.cities;
  if (typeof cities === 'string') cities = [cities];
  if (!Array.isArray(cities) || cities.length === 0) throw Object.assign(new Error('Pilih minimal 1 kota target'), { status: 400 });
  cities = [...new Set(cities.map((c) => cleanStr(c, 60)).filter((c) => c.length >= 2))].slice(0, 20);
  if (cities.length === 0) throw Object.assign(new Error('Nama kota tidak valid'), { status: 400 });
  let depth = parseInt(payload?.depth, 10);
  if (!Number.isFinite(depth)) depth = 3;
  depth = Math.max(1, Math.min(7, depth));
  const proximity = payload?.proximity !== false;
  const deepMatrix = payload?.deepMatrix === true;
  let keywordVariants = payload?.keywordVariants;
  if (typeof keywordVariants === 'string') keywordVariants = [keywordVariants];
  if (!Array.isArray(keywordVariants)) keywordVariants = [];
  keywordVariants = [...new Set(
    keywordVariants.map((v) => cleanStr(v, 40)).filter((v) => v.length >= 2)
  )].filter((v) => v.toLowerCase() !== keyword.toLowerCase()).slice(0, 8);
  return { keyword, keywordVariants, cities, depth, proximity, deepMatrix };
}

// Escape CSV formula injection (= + - @, also tab/CR) per OWASP
function csvCell(v) {
  if (v === null || v === undefined) return '""';
  let s = String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

// 1. INITIALIZE DATASET FROM EXCEL
async function initDataset() {
  const filePath = fs.existsSync(MASTER_EXCEL_PATH)
    ? MASTER_EXCEL_PATH
    : path.join(__dirname, 'Data_Bisnis_Google_Maps_Indonesia.xlsx');

  if (!fs.existsSync(filePath)) {
    console.log('[Dataset] Belum ada file Excel master. Dataset awal kosong.');
    return;
  }

  try {
    console.log(`[Dataset] Memuat master data dari: ${path.basename(filePath)}...`);
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(filePath);

    const masterSheet = wb.getWorksheet('Semua Data (Master)');
    if (!masterSheet) {
      console.warn('[Dataset] Sheet "Semua Data (Master)" tidak ditemukan.');
      return;
    }

    const loaded = [];
    for (let r = 2; r <= masterSheet.rowCount; r++) {
      const row = masterSheet.getRow(r);
      const name = row.getCell(5).value;
      if (!name) continue;

      const placeIdMatch = String(row.getCell(13).value || '').match(/place_id:(.+)$/);
      const placeId = placeIdMatch ? placeIdMatch[1] : '';

      const coordsStr = String(row.getCell(14).value || '');
      let lat = null;
      let lng = null;
      if (coordsStr.includes(',')) {
        const parts = coordsStr.split(',').map(s => parseFloat(s.trim()));
        if (!isNaN(parts[0])) lat = parts[0];
        if (!isNaN(parts[1])) lng = parts[1];
      }

      const item = {
        category: String(row.getCell(2).value || ''),
        province: String(row.getCell(3).value || ''),
        city: String(row.getCell(4).value || ''),
        name: String(name),
        phone: String(row.getCell(6).value || ''),
        address: String(row.getCell(7).value || ''),
        nearestCampus: String(row.getCell(8).value || '-'),
        nearestOffice: String(row.getCell(9).value || '-'),
        rating: typeof row.getCell(10).value === 'number' ? row.getCell(10).value : null,
        reviewsCount: typeof row.getCell(11).value === 'number' ? row.getCell(11).value : 0,
        website: String(row.getCell(12).value || ''),
        mapsUrl: String(row.getCell(13).value || ''),
        lat,
        lng,
        placeId
      };

      const key = placeId || `${item.name.toLowerCase()}_${item.city.toLowerCase()}`;
      if (!seenPlaceIds.has(key)) {
        seenPlaceIds.add(key);
        loaded.push(item);
      }
    }

    activeDataset = loaded;
    console.log(`[Dataset] Berhasil memuat ${activeDataset.length} listing bisnis ke memori.`);
  } catch (err) {
    console.error('[Dataset] Gagal membaca Excel master:', err.message);
  }
}

// 2. SSE BROADCAST
function broadcastSSE(data) {
  const payload = `data: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach(client => {
    try {
      client.write(payload);
    } catch {
      // client disconnected
    }
  });
}

function broadcastLog(text) {
  broadcastSSE({ type: 'log', text });
}

function broadcastProgress(percent, statusText, totalRecords) {
  broadcastSSE({ type: 'progress', percent, statusText, totalRecords });
}

// 3. GENERATE SUB-QUERIES FOR ANY KEYWORD & CITY (DEEP DIRECTORY MODE)
// Generates layered queries: base city -> ALL sub-districts -> qualifier
// variants (murah/eksklusif/terbaik/segment) -> proximity/landmark ->
// optional keyword-variant & deep-matrix expansion. Capped per city.
const MAX_QUERIES_PER_CITY = 100;
const DEEP_QUALIFIERS = ['murah', 'eksklusif', 'terbaik', 'populer', 'rekomendasi', 'harga murah', 'berkualitas'];
const KOST_SEGMENTS = ['putra', 'putri', 'campur', 'pasutri', 'harian', 'bulanan'];

function isKostLike(keyword) {
  return /(kost|kosan|kos\b|kontrakan|pondokan|apartemen|penginapan|homestay|guest\s?house|villa|hotel)/i.test(keyword || '');
}

function generateQueriesForCity(city, keyword, withProximity = true, opts = {}) {
  const cleanCity = String(city || '').trim();
  const primaryKw = String(keyword || '').trim();
  if (!cleanCity || !primaryKw) return [];
  const variants = Array.isArray(opts.keywordVariants)
    ? [...new Set(opts.keywordVariants.map((v) => String(v || '').trim()).filter((v) => v.length >= 2 && v.toLowerCase() !== primaryKw.toLowerCase()))].slice(0, 8)
    : [];
  const deepMatrix = opts.deepMatrix === true;

  const queries = [];
  const push = (...items) => {
    for (const q of items) {
      const s = String(q || '').replace(/\s+/g, ' ').trim();
      if (s.length >= 3) queries.push(s);
    }
  };

  // Resolusi wilayah: kecamatan/desa -> kota + provinsi induk.
  // Contoh: "Bojonggede" -> kota "Kabupaten Bogor", provinsi "Jawa Barat".
  const resolved = resolveRegion(cleanCity, REGION_INDEX);
  const isDistrict = Boolean(resolved.district);
  const searchCity = resolved.city || cleanCity;
  const place = isDistrict ? `${cleanCity} ${searchCity}` : searchCity;
  const regionSuffix = resolved.province ? ` ${resolved.province}` : '';
  const cLower = searchCity.toLowerCase();
  const subs = (!isDistrict && resolved.cityEntry && Array.isArray(resolved.cityEntry.subDistricts))
    ? resolved.cityEntry.subDistricts.filter(Boolean)
    : [];

  // Layer 1: base queries di-anchor ke kota + provinsi (cegah lintas wilayah).
  push(`${primaryKw} ${place}${regionSuffix}`);
  push(`${primaryKw} ${place}`);
  if (!isDistrict) {
    push(`${primaryKw} ${place} kota`);
    push(`${primaryKw} ${place} pusat`);
    push(`${primaryKw} terbaik ${place}`);
  } else {
    push(`${primaryKw} di ${cleanCity} ${resolved.province}`);
  }

  // Layer 2: cakupan kecamatan (hanya saat input berupa kota yang dikenali)
  if (subs.length > 0) {
    for (const sub of subs) {
      push(`${primaryKw} ${sub} ${searchCity}`);
      push(`${primaryKw} ${sub}`);
    }
  } else if (resolved.city) {
    for (const dir of ['selatan', 'barat', 'timur', 'utara', 'pusat']) {
      push(`${primaryKw} ${searchCity} ${dir}`);
    }
  }

  // Layer 3: qualifier variants at city level
  for (const q of DEEP_QUALIFIERS) {
    push(`${primaryKw} ${q} ${place}`);
  }
  // Layer 3b: segment variants for lodging-type keywords
  // (dilewati bila keyword sudah mengandung segmen — cegah "kost putra putra")
  const kwLower = primaryKw.toLowerCase();
  const hasSegment = KOST_SEGMENTS.some((seg) => kwLower.includes(seg));
  if (isKostLike(primaryKw) && !hasSegment) {
    for (const seg of KOST_SEGMENTS) {
      push(`${primaryKw} ${seg} ${place}`);
    }
    // Segment x top sub-districts (cheap deepening, max 6)
    for (const sub of subs.slice(0, 3)) {
      push(`${primaryKw} putra ${sub}`);
      push(`${primaryKw} putri ${sub}`);
    }
  }

  // Layer 4: keyword-variant expansion (synonyms from catalog category)
  for (const v of variants) {
    push(`${v} ${place}`);
    for (const sub of subs.slice(0, 3)) {
      push(`${v} ${sub} ${place}`);
    }
  }

  // Layer 5: deep-matrix mode (sub-district x qualifier grid)
  if (deepMatrix) {
    for (const sub of subs) {
      for (const q of DEEP_QUALIFIERS) {
        push(`${primaryKw} ${q} ${sub}`);
      }
    }
    for (const v of variants.slice(0, 3)) {
      for (const sub of subs.slice(0, 5)) {
        push(`${v} ${sub}`);
      }
    }
  }

  if (withProximity) {
    push(`${primaryKw} dekat kampus di ${place}`);
    push(`${primaryKw} dekat universitas ${place}`);
    push(`${primaryKw} dekat perkantoran ${place}`);
    push(`${primaryKw} dekat pusat bisnis ${place}`);
    push(`${primaryKw} dekat stasiun ${place}`);
    push(`${primaryKw} dekat pusat kota ${place}`);

    // Query spesifik landmark populer jika kota dikenali
    if (cLower.includes('jakarta')) {
      push(`${primaryKw} dekat UI salemba`, `${primaryKw} dekat SCBD`, `${primaryKw} dekat binus`, `${primaryKw} dekat mega kuningan`, `${primaryKw} dekat grogol trisakti`, `${primaryKw} dekat tebet`, `${primaryKw} dekat kalibata`);
    } else if (cLower.includes('bandung')) {
      push(`${primaryKw} dekat ITB ganesha`, `${primaryKw} dekat UNPAD dipatiukur`, `${primaryKw} dekat telkom university`, `${primaryKw} dekat asia afrika bandung`, `${primaryKw} dekat cimahi`);
    } else if (cLower.includes('jogja') || cLower.includes('yogyakarta')) {
      push(`${primaryKw} dekat UGM bulaksumur`, `${primaryKw} dekat UNY gejayan`, `${primaryKw} dekat UPN seturan`, `${primaryKw} dekat malioboro sudirman jogja`);
    } else if (cLower.includes('solo') || cLower.includes('surakarta')) {
      push(`${primaryKw} dekat UNS kentingan`, `${primaryKw} dekat UMS pabelan`, `${primaryKw} dekat ISI 2 surakarta`, `${primaryKw} dekat slamet riyadi solo`, `${primaryKw} dekat solo baru`);
    } else if (cLower.includes('surabaya')) {
      push(`${primaryKw} dekat ITS sukolilo`, `${primaryKw} dekat UNAIR gubeng`, `${primaryKw} dekat basuki rahmat tunjungan`, `${primaryKw} dekat hr muhammad`);
    } else if (cLower.includes('semarang')) {
      push(`${primaryKw} dekat undip tembalang`, `${primaryKw} dekat unnes sekaran`, `${primaryKw} dekat udinus imam bonjol`, `${primaryKw} dekat simpang lima semarang`);
    } else if (cLower.includes('medan')) {
      push(`${primaryKw} dekat USU padang bulan`, `${primaryKw} dekat unimed tembung`, `${primaryKw} dekat balai kota kesawan`, `${primaryKw} dekat gatot subroto medan`);
    } else if (cLower.includes('malang')) {
      push(`${primaryKw} dekat universitas brawijaya ub`, `${primaryKw} dekat suhat malang`, `${primaryKw} dekat um malang`);
    } else if (cLower.includes('bali') || cLower.includes('denpasar')) {
      push(`${primaryKw} dekat unud jimbaran`, `${primaryKw} sunset road bali`, `${primaryKw} renon denpasar`);
    } else if (cLower.includes('makassar')) {
      push(`${primaryKw} dekat unhas tamalanrea`, `${primaryKw} panakkukang makassar`, `${primaryKw} ap pettarani`);
    }
  }

  const deduped = [...new Set(queries)];
  return deduped.slice(0, MAX_QUERIES_PER_CITY);
}

// Build full scrape plan (per-city queries + page estimates) synchronously
// so the API can report scope before the background job starts.
function buildScrapePlan({ keyword, keywordVariants = [], cities, depth = 2, proximity = true, deepMatrix = false }) {
  const cityQueries = cities.map((city) => ({
    city,
    queries: generateQueriesForCity(city, keyword, proximity, { keywordVariants, deepMatrix })
  }));
  const totalQueries = cityQueries.reduce((a, c) => a + c.queries.length, 0);
  const estPages = totalQueries * Math.max(1, depth);
  return { cityQueries, totalQueries, estPages };
}

// 4. RUN SCRAPING TASK ASYNCHRONOUSLY (DEEP MODE)
// - Accepts a prebuilt plan (from buildScrapePlan) so the HTTP layer can
//   report scope before the background job starts.
// - Sapuan lanjutan: if the last planned page of a query is still full
//   (20 results), up to MAX_EXTRA_PAGES follow-up offsets are fetched.
const MAX_EXTRA_PAGES = 2;

async function startScrapeJob(job) {
  const { keyword, keywordVariants = [], cities, depth = 2, proximity = true, deepMatrix = false } = job;
  if (currentScrapeJob && currentScrapeJob.running) {
    throw Object.assign(new Error('Tugas scraping lain sedang berjalan.'), { status: 409 });
  }

  currentScrapeJob = { abort: false, running: true };
  broadcastSSE({ type: 'status', running: true });

  const plan = job.cityQueries ? job : buildScrapePlan({ keyword, keywordVariants, cities, depth, proximity, deepMatrix });

  try {
    const { newRecords: newRecordsInJob, aborted } = await executeScrapePlan(
      { keyword: plan.keyword || keyword, cityQueries: plan.cityQueries, depth: plan.depth || depth },
      {
        dataset: activeDataset,
        seen: seenPlaceIds,
        onLog: broadcastLog,
        onProgress: broadcastProgress,
        onBatch: (items) => broadcastSSE({ type: 'new_batch', items }),
        shouldAbort: () => currentScrapeJob.abort
      }
    );

    const wasAborted = aborted || currentScrapeJob.abort;
    broadcastProgress(100, 'Selesai! Menyusun file Excel...', activeDataset.length);
    broadcastLog(wasAborted
      ? `Scraping dihentikan. Didapat ${newRecordsInJob.length} listing baru sebelum berhenti.`
      : `Scraping selesai. Didapat ${newRecordsInJob.length} listing baru.`);

    // Perbarui file Excel master
    if (newRecordsInJob.length > 0) {
      try {
        if (wasAborted) broadcastLog(`Menyimpan ${newRecordsInJob.length} data parsial ke Excel (mungkin butuh beberapa detik)...`);
        await exportToExcel(activeDataset, MASTER_EXCEL_PATH);
        broadcastLog('File Excel master berhasil diperbarui.');
      } catch (e) {
        broadcastLog(`Warning export excel: ${e.message}`);
      }
    }

    broadcastSSE({ type: 'status', running: false, finished: true });
  } catch (err) {
    broadcastLog(`Error saat scraping: ${err.message}`);
    broadcastSSE({ type: 'status', running: false, error: err.message });
  } finally {
    if (currentScrapeJob) currentScrapeJob.running = false;
  }
}

// ---------------------------------------------------------------------------
// VPS ENGINE (ENGINE_MODE=engine): eksekusi scraping di server vendor.
// Klien paket (ENGINE_MODE=client) mem-proxy ke sini; engine & secret
// tidak pernah dikirim ke aplikasi yang diedarkan.
// ---------------------------------------------------------------------------

function readEngineAllowlist() {
  // Format: {"licenses":[...|" {serial,plan,days} "...], "revoked":[...]}
  // file yang sama di-upload ke VPS.
  const candidates = [
    ENGINE_ALLOWLIST_FILE,
    path.join(__dirname, 'licenses.json'),
    process.env.LICENSE_ALLOWLIST || null,
    process.env.PAYMENT_STORE_FILE || null
  ].filter(Boolean);
  for (const f of candidates) {
    try {
      if (fs.existsSync(f)) {
        const data = JSON.parse(fs.readFileSync(f, 'utf8'));
        if (Array.isArray(data.licenses)) {
          const entries = normalizeLicenseEntries(data);
          return {
            licenses: new Set(entries.map((e) => e.serial)),
            revoked: normalizeRevoked(data),
            entries
          };
        }
      }
    } catch { /* abaikan, lanjut kandidat berikut */ }
  }
  return null;
}

/** Durasi paket berbayar untuk serial (aktivasi perangkat ikut kedaluwarsa). */
function planDurationForSerial(serial) {
  const needle = String(serial || '').trim().toUpperCase();
  const files = [
    process.env.PAYMENT_STORE_FILE || null,
    ENGINE_ALLOWLIST_FILE,
    path.join(__dirname, 'licenses.json')
  ].filter(Boolean);
  const hit = findPlanForSerial(needle, files);
  if (hit && hit.days) return { plan: hit.plan, durationDays: hit.days };
  return null;
}

function authorizeEngineSerial(serial) {
  const s = String(serial || '').trim();
  // Trial tanpa serial: diizinkan dengan caps ketat + rate limit (anti-abuse).
  // Set ENGINE_REQUIRE_SERIAL=1 bila VPS hanya untuk pelanggan aktivasi.
  if (!s) {
    if (process.env.ENGINE_REQUIRE_SERIAL === '1') {
      throw Object.assign(new Error('Aktivasi diperlukan untuk VPS engine.'), { status: 403, code: 'ENGINE_AUTH' });
    }
    return { trial: true, listed: false };
  }
  const check = validateSerial(s);
  if (!check.ok) {
    throw Object.assign(new Error(`Serial ditolak (${check.reason})`), { status: 403, code: 'ENGINE_AUTH' });
  }
  const needle = s.toUpperCase();
  const list = readEngineAllowlist();
  if (list) {
    if (list.revoked.has(needle)) {
      throw Object.assign(new Error('Serial telah dicabut (revoked).'), { status: 403, code: 'ENGINE_REVOKED' });
    }
    const strict = process.env.ENGINE_STRICT === '1';
    if (strict && !list.licenses.has(needle)) {
      throw Object.assign(new Error('Serial tidak terdaftar di VPS.'), { status: 403, code: 'ENGINE_NOT_LISTED' });
    }
    return { trial: false, listed: list.licenses.has(needle) };
  }
  return { trial: false, listed: true };
}

// Rate limit sederhana per IP untuk job trial (anti-abuse VPS).
// Serial terdaftar tidak dibatasi.
const engineTrialHits = new Map(); // ip -> { count, resetAt }
function checkEngineTrialLimit(ip) {
  const maxPerHour = Math.max(1, parseInt(process.env.ENGINE_TRIAL_PER_HOUR || '5', 10) || 5);
  const now = Date.now();
  const rec = engineTrialHits.get(ip);
  if (!rec || now > rec.resetAt) {
    engineTrialHits.set(ip, { count: 1, resetAt: now + 3600 * 1000 });
    return true;
  }
  rec.count++;
  if (rec.count > maxPerHour) return false;
  // Bersihkan entri lama sesekali agar Map tak membengkak
  if (engineTrialHits.size > 5000 && Math.random() < 0.01) {
    for (const [k, v] of engineTrialHits) if (now > v.resetAt) engineTrialHits.delete(k);
  }
  return true;
}

function engineClientIp(req) {
  const fwd = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  if (/^[0-9a-fA-F:.]{3,45}$/.test(fwd)) return fwd;
  return req.socket?.remoteAddress || 'unknown';
}

// Proxy job klien -> VPS engine, teruskan event SSE-nya ke klien lokal.
async function proxyScrapeToEngine({ serial, installId, job, plan }) {
  if (!ENGINE_URL) {
    throw Object.assign(new Error('ENGINE_URL belum dikonfigurasi di aplikasi ini.'), { status: 503 });
  }
  const controller = new AbortController();
  const abortWatcher = setInterval(() => {
    if (currentScrapeJob?.abort) controller.abort();
  }, 500);

  try {
    const upstream = await fetch(`${ENGINE_URL}/api/engine/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serial, installId, job }),
      signal: controller.signal
    });
    if (!upstream.ok || !upstream.body) {
      let msg = `VPS engine menolak (${upstream.status})`;
      try {
        const data = JSON.parse(await upstream.text());
        if (data && data.error) msg = data.error;
      } catch { /* pakai pesan default */ }
      throw Object.assign(new Error(msg), { status: 502 });
    }

    broadcastLog(`Terhubung ke VPS engine — ${plan.totalQueries} query diproses di server.`);
    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();
    let buf = '';
    const handleEvent = (obj) => {
      if (!obj || typeof obj !== 'object') return;
      if (obj.type === 'new_batch' && Array.isArray(obj.items)) {
        for (const item of obj.items) {
          const key = item.placeId || `${String(item.name || '').toLowerCase()}_${String(item.city || '').toLowerCase()}`;
          if (!seenPlaceIds.has(key)) {
            seenPlaceIds.add(key);
            activeDataset.unshift(item);
          }
        }
        scheduleClientSave(); // arsipkan progres ke userData (debounced)
      }
      broadcastSSE(obj);
    };

    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      let idx;
      while ((idx = buf.indexOf('\n\n')) >= 0) {
        const raw = buf.slice(0, idx);
        buf = buf.slice(idx + 2);
        for (const line of raw.split('\n')) {
          const t = line.trim();
          if (!t.startsWith('data:')) continue;
          try { handleEvent(JSON.parse(t.slice(5).trim())); } catch { /* abaikan */ }
        }
      }
    }
  } finally {
    clearInterval(abortWatcher);
  }
}

// Proxy umum ke VPS engine (untuk endpoint yang tidak boleh dijalankan di klien).
// Meneruskan body MENTAH apa adanya agar signature/HMAC & JSON upstream tetap valid.
// Bug lama: body hasil parse (object) dikirim sebagai fetch body -> menjadi
// string "[object Object]" di VPS -> VPS menjawab 400 "Body JSON tidak valid".
async function proxyToEngine(pathname, req, res) {
  if (ENGINE_MODE !== 'client') return false;
  if (!ENGINE_URL) {
    res.writeHead(503, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'ENGINE_URL belum dikonfigurasi di aplikasi ini.' }));
    return true;
  }
  const qs = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
  const upstreamUrl = new URL(`${ENGINE_URL}${pathname}${qs}`);
  const isBodyless = ['GET', 'HEAD'].includes(req.method);
  let rawBody = '';
  if (!isBodyless) {
    try {
      rawBody = await readRawBody(req);
    } catch (err) {
      res.writeHead(err.status || 400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
      return true;
    }
  }
  const headers = {
    Accept: (req.headers['accept'] || 'application/json')
  };
  if (!isBodyless && rawBody) {
    headers['Content-Type'] = (req.headers['content-type'] || 'application/json');
  }
  try {
    const upstream = await fetch(upstreamUrl.toString(), {
      method: req.method,
      headers,
      body: isBodyless || !rawBody ? undefined : rawBody
    });
    const contentType = upstream.headers.get('content-type') || 'application/json';
    const body = await upstream.text();
    res.writeHead(upstream.status, { 'Content-Type': contentType });
    res.end(body);
  } catch (err) {
    res.writeHead(502, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message || 'Gagal terhubung ke VPS engine' }));
  }
  return true;
}

// 5. HTTP SERVER
async function handleRequest(req, res) {
  setSecurityHeaders(res);
  let urlObj;
  try {
    urlObj = new URL(req.url, `http://${req.headers.host}`);
  } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Bad Request');
    return;
  }
  const pathname = urlObj.pathname;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // HEALTH
  if (pathname === '/api/health' && req.method === 'GET') {
    const lic = getLicenseStatus();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      ok: true,
      total: activeDataset.length,
      scraping: Boolean(currentScrapeJob?.running),
      token: process.env.GMST_TOKEN || null, // dicocokkan parent Electron anti-salah-tempel
      license: { activated: lic.activated, expired: lic.expired, blocked: lic.blocked, daysLeft: lic.daysLeft }
    }));
    return;
  }

  // SSE ENDPOINT
  if (pathname === '/api/scrape/stream') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no'
    });

    res.write('data: {"type":"connected"}\n\n');
    sseClients.push(res);
    const heartbeat = setInterval(() => {
      try { res.write(': ping\n\n'); } catch { /* closed */ }
    }, 25000);

    req.on('close', () => {
      clearInterval(heartbeat);
      sseClients = sseClients.filter(c => c !== res);
    });
    return;
  }

  // GET CATALOG METADATA (SECTORS & REGIONS)
  if (pathname === '/api/catalog' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ sectors: CATEGORY_SECTORS, regions: REGION_CLUSTERS }));
    return;
  }

  // RESOLVE WILAYAH (kota/kecamatan -> kota + provinsi induk) untuk pratinjau UI.
  if (pathname === '/api/region/resolve' && req.method === 'GET') {
    if (ENGINE_MODE === 'client') {
      const proxied = await proxyToEngine(pathname, req, res);
      if (proxied) return;
    }
    const q = String(urlObj.searchParams.get('q') || '').trim();
    const r = resolveRegion(q, REGION_INDEX);
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=600' });
    res.end(JSON.stringify({ input: q, city: r.city, province: r.province, district: r.district, known: r.known }));
    return;
  }

  // GET DATASET JSON
  if (pathname === '/api/data' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ total: activeDataset.length, records: activeDataset }));
    return;
  }

  // LICENSE STATUS (public: trial countdown, activated flag, installId)
  if (pathname === '/api/license/status' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(getLicenseStatus()));
    return;
  }

  // LICENSE ONBOARD ("Lanjutkan gratis 3 hari" — first-run only)
  if (pathname === '/api/license/onboard' && req.method === 'POST') {
    try {
      await readJsonBody(req);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, status: markOnboarded() }));
    } catch (err) {
      res.writeHead(err.status || 400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // LICENSE DEACTIVATE (setara logout: cabut serial dari perangkat ini)
  if (pathname === '/api/license/deactivate' && req.method === 'POST') {
    try {
      await readJsonBody(req);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, status: deactivateLicense() }));
    } catch (err) {
      res.writeHead(err.status || 400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }
  // LICENSE ACTIVATE (serial GMST-YYMM-XXXXXX)
  if (pathname === '/api/license/activate' && req.method === 'POST') {
    try {
      const payload = await readJsonBody(req);
      const serial = String(payload?.serial || '').trim();
      if (!serial) throw Object.assign(new Error('Kode aktivasi wajib diisi'), { status: 400 });
      const planOpts = planDurationForSerial(serial) || {};
      const result = await activateLicenseOnline(serial, new Date(), planOpts);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (err) {
      res.writeHead(err.status || 400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message, code: err.code || 'ACTIVATE_FAILED' }));
    }
    return;
  }

  // PAYMENT OPTIONS (daftar paket + URL checkout Singapay untuk UI lisensi)
  // Dikembalikan di semua mode (local/engine/client) agar tombol "Bayar"
  // selalu tampil, termasuk saat perpanjangan dari aplikasi.
  if (pathname === '/api/payment/options' && req.method === 'GET') {
    if (ENGINE_MODE === 'client') {
      const proxied = await proxyToEngine(pathname, req, res);
      if (proxied) return;
    }
    res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600' });
    res.end(JSON.stringify({ currency: 'IDR', claimUrl: CLAIM_PATH, plans: paymentOptions(req) }));
    return;
  }

  // AUTO-ACTIVATION VIA NOMOR REFERENSI ATAU TIMESTAMP POLLING
  // POST /api/payment/auto-activate { reff?: string, since?: string }
  if (pathname === '/api/payment/auto-activate' && req.method === 'POST') {
    try {
      const payload = await readJsonBody(req);
      const reff = String(payload?.reff || '').trim();
      const since = String(payload?.since || '').trim();
      // Keamanan: serial hanya diberikan bila pemanggil menyertakan nomor
      // referensi miliknya (bukti kepemilikan). Fallback "since" dulu
      // membocorkan serial pembayar terbaru ke siapa pun yang memanggil.
      if (!reff && since) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ found: false, message: 'Aktivasi otomatis butuh nomor referensi pembayaran. Masukkan nomor referensi Anda.' }));
        return;
      }
      let order = null;
      if (reff) order = claimByReff(reff);
      // Klien tak menerima webhook: butir reff dicarikan ke VPS (klaim).
      if (!order?.serial && reff && ENGINE_MODE === 'client') {
        const remote = await fetchVpsOrderByReff(reff).catch(() => null);
        if (remote?.serial) order = remote;
      }
      if (!order?.serial) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ found: false, message: 'Pembayaran belum ditemukan atau masih diproses' }));
        return;
      }
      const reuse = orderReuseStatus(reff);
      if (reuse.found && reuse.stillActive) {
        const baseTime = reuse.activatedAt ? new Date(reuse.activatedAt) : new Date();
        const planOpts = { plan: order.plan || 'berbayar', durationDays: order.days || 1 };
        const activateRes = await activateLicenseOnline(order.serial, baseTime, planOpts);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ found: true, serial: order.serial, plan: order.plan, days: order.days, status: activateRes.status, reused: true }));
        return;
      }
      if (reuse.found && !reuse.stillActive) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ found: false, message: 'Masa aktif lisensi dari pembayaran ini sudah habis. Silakan lakukan pembayaran baru untuk melanjutkan.', code: 'ORDER_EXPIRED' }));
        return;
      }
      const planOpts = { plan: order.plan || 'berbayar', durationDays: order.days || 1 };
      const activateRes = await activateLicenseOnline(order.serial, new Date(), planOpts);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ found: true, serial: order.serial, plan: order.plan, days: order.days, status: activateRes.status }));
    } catch (err) {
      res.writeHead(err.status || 500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ found: false, error: err.message }));
    }
    return;
  }

  // DYNAMIC PAYMENT LINK SINGAPAY
  // Flow: frontend panggil checkout -> server panggil Singapay API -> kembalikan payment_url -> open di browser -> callback ke claim/success/expired.
  const dynamicPaymentMatch = pathname.match(/^\/api\/payment\/dynamic\/([^\/]+)\/(checkout|status|success|expired)$/);
  if (dynamicPaymentMatch && req.method !== undefined) {
    if (ENGINE_MODE === 'client') {
      const proxied = await proxyToEngine(pathname, req, res);
      if (proxied) return;
    }
    const [, planId, action] = dynamicPaymentMatch;
    const licState = (() => { try { return loadLicenseState(); } catch { return {}; } })();

    const sendJson = (status, body) => {
      if (!res.headersSent) res.writeHead(status || 400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(body));
    };

    if (action === 'checkout' && req.method === 'POST') {
      const plan = (PLANS && PLANS[planId]) ? PLANS[planId] : null;
      if (!plan) return sendJson(400, { error: 'Paket tidak valid' });
      try {
        // Checkout tidak butuh parameter body; toleran terhadap body kosong,
        // Content-Type non-JSON, atau client lama agar tak 400 "Body JSON tidak valid".
        try {
          await readJsonBody(req);
        } catch {
          /* abaikan: checkout tanpa parameter */
        }
        const result = await createDynamicPaymentLink({ planId, amount: plan.amount, days: plan.days, req, licenseState: licState || {} });
        // Fallback statis (tanpa kredensial Singapay / tanpa redirect host):
        // tetap kembalikan paymentUrl agar frontend bisa membuka link statis.
        const checkoutUrl = result.paymentUrl || result.url || plan.url || null;
        if (!checkoutUrl) return sendJson(result.status || 503, { error: result.error || 'Gagal membuat tautan pembayaran', code: result.code || 'CHECKOUT_FAILED' });
        sendJson(200, { success: true, checkoutUrl, reffNo: result.reffNo || null, planId: result.planId || planId, amount: result.amount || plan.amount, days: result.days || plan.days, expiredAt: result.expiredAt || null, dynamic: result.dynamic !== false });
      } catch (err) {
        // Fallback terakhir: bila Singapay belum dikonfigurasi di server ini,
        // arahkan ke Payment Link statis agar user tetap bisa bayar manual
        // (aktivasi via reff/klaim), bukan error mentah.
        if (err.code === 'SINGAPAY_NOT_CONFIGURED' && plan.url) {
          return sendJson(200, { success: true, checkoutUrl: plan.url, reffNo: null, planId, amount: plan.amount, days: plan.days, expiredAt: null, dynamic: false, fallback: true });
        }
        sendJson(err.status || 500, { error: err.message, code: err.code || 'CHECKOUT_FAILED' });
      }
      return;
    }

    if (action === 'status' && req.method === 'GET') {
      const token = String(urlObj.searchParams.get('token') || '').trim();
      if (!token) return sendJson(400, { error: 'Token tidak valid' });
      const data = verifyDynamicPaymentToken(token);
      if (!data || data.planId !== planId) return sendJson(400, { error: 'Token tidak valid' });
      const rec = data.reffNo ? claimByReff(data.reffNo) : null;
      sendJson(200, { valid: true, planId: data.planId, reffNo: data.reffNo, paid: Boolean(rec), serial: rec?.serial || null });
      return;
    }

    if ((action === 'success' || action === 'expired') && req.method === 'GET') {
      const token = String(urlObj.searchParams.get('token') || '').trim();
      const tokenData = token ? verifyDynamicPaymentToken(token) : null;
      const reff = tokenData?.reffNo || (token ? token : null);
      const rec = reff ? claimByReff(reff) : null;
      const isOk = action === 'success';
      const escHtml = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      const html = isOk
        ? `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pembayaran Berhasil</title><style>body{font-family:system-ui,sans-serif;background:#f8fafc;color:#0f172a;display:flex;justify-content:center;padding:2rem 1rem}main{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:1.5rem;max-width:460px;width:100%}button{background:#0f172a;color:#fff;border:none;border-radius:8px;padding:.6rem 1rem;font-weight:700;cursor:pointer;margin-top:1rem}.missing{color:#be123c}</style></head><body><main><h1>Pembayaran Berhasil</h1>${rec ? `<p>Paket <b>${escHtml(rec.plan)}</b> (${Number(rec.days) || 0} hari).</p><p>Kode aktivasi: <b>${escHtml(rec.serial)}</b></p><p>Salin kode ini ke aplikasi untuk mengaktifkan lisensi.</p>` : '<p>Pembayaran diterima.</p>'}<button onclick="window.close()">Tutup</button></main></body></html>`
        : `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pembayaran Kadaluarsa</title><style>body{font-family:system-ui,sans-serif;background:#f8fafc;color:#0f172a;display:flex;justify-content:center;padding:2rem 1rem}main{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:1.5rem;max-width:460px;width:100%}a{color:#2563eb}button{background:#0f172a;color:#fff;border:none;border-radius:8px;padding:.6rem 1rem;font-weight:700;cursor:pointer;margin-top:1rem}</style></head><body><main><h1>Link Kadaluarsa</h1><p>Silakan buka kembali aplikasi untuk membuat tautan pembayaran baru.</p><a href="/">Buka aplikasi</a></main></body></html>`;
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
      return;
    }

    sendJson(405, { error: 'Metode tidak diizinkan' });
    return;
  }

  // PAYMENT WEBHOOK SINGAPAY (Payment Link money-in -> serial otomatis)
  // Daftarkan URL ini sebagai transaction_notif_url di dashboard Singapay:
  //   https://gmst.dewa.ai.id/api/payment/singapay
  if (pathname === WEBHOOK_PATH && req.method === 'POST') {
    if (ENGINE_MODE === 'client') {
      const proxied = await proxyToEngine(pathname, req, res);
      if (proxied) return;
    }
    // Webhook boleh memakai HMAC Validation Key bila dashboard memberikannya
    // terpisah dari Client Secret; fallback ke Client Secret bila tidak diset.
    const secret = process.env.SINGAPAY_HMAC_KEY || process.env.SINGAPAY_CLIENT_SECRET || '';
    if (!secret) {
      res.writeHead(503, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'error', message: 'Payment belum dikonfigurasi' }));
      return;
    }
    try {
      const rawBody = await new Promise((resolve, reject) => {
        let size = 0;
        let body = '';
        req.on('data', (chunk) => {
          size += chunk.length;
          if (size > MAX_BODY_BYTES) { reject(Object.assign(new Error('Payload terlalu besar'), { status: 413 })); req.destroy(); return; }
          body += chunk;
        });
        req.on('end', () => resolve(body));
        req.on('error', reject);
      });
      const headers = {};
      for (const [k, v] of Object.entries(req.headers)) headers[k.toLowerCase()] = v;
      const endpointPath = urlObj.pathname; // harus persis path terdaftar (/api/payment/singapay)
      const okSig = verifySingapaySignature({ rawBody, headers, clientSecret: secret, endpointPath });
      if (!okSig) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'error', message: 'Invalid signature' }));
        return;
      }
      let payload;
      try {
        if (!rawBody || !rawBody.trim().length) {
          console.error('[Payment] Webhook body kosong:', {
            headers: {
              ct: headers['content-type'],
              sig: headers['x-signature'] ? 'present' : 'missing',
              ts: headers['x-timestamp']
            }
          });
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'error', message: 'Body webhook kosong' }));
          return;
        }
        payload = safeJsonParse(rawBody);
        if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
          console.error('[Payment] Webhook payload bukan object:', {
            type: typeof payload,
            isArray: Array.isArray(payload),
            len: rawBody?.length,
            head: rawBody ? rawBody.slice(0, 200) : ''
          });
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'error', message: 'Payload webhook harus berupa object JSON' }));
          return;
        }
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'error', message: 'Body JSON tidak valid' }));
        return;
      }
      const result = fulfillPaymentLink(payload);
      console.log(`[Payment] Fulfilled ${result.plan} ${result.serial} untuk ${result.email || '?'} (reff ${result.reff_no}${result.reused ? ', duplikat' : ''})`);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'success', plan: result.plan, days: result.days }));
    } catch (err) {
      const code = err.status === 422 ? 422 : 500;
      if (!res.headersSent) res.writeHead(code, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'error', message: err.message }));
    }
    return;
  }

  // ORDER JSON (untuk aktivasi otomatis klien paket tanpa scraping HTML klaim).
  // GET /api/payment/order?ref=REFF_NO -> { found, serial, plan, days }
  if (pathname === '/api/payment/order' && req.method === 'GET') {
    if (ENGINE_MODE === 'client') {
      const proxied = await proxyToEngine(pathname, req, res);
      if (proxied) return;
    }
    const ref = String(urlObj.searchParams.get('ref') || '').trim();
    const rec = ref ? claimByReff(ref) : null;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    if (rec) res.end(JSON.stringify({ found: true, serial: rec.serial, plan: rec.plan, days: rec.days }));
    else res.end(JSON.stringify({ found: false, message: 'Referensi tidak ditemukan' }));
    return;
  }

  // CLAIM PAGE: success_redirect_url payment link -> .../api/payment/claim?ref=REFF_NO
  // Tanpa ?ref: form input reff manual. Dengan ?ref valid: tampilkan serial.
  if (pathname === CLAIM_PATH && req.method === 'GET') {
    if (ENGINE_MODE === 'client') {
      const proxied = await proxyToEngine(pathname, req, res);
      if (proxied) return;
    }
    const ref = String(urlObj.searchParams.get('ref') || '').trim();
    const escapeHtmlClaim = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    let inner;
    if (!ref) {
      inner = `<p>Masukkan nomor referensi pembayaran dari struk/kwitansi Singapay Anda:</p>
        <form method="GET" action="${CLAIM_PATH}">
          <input name="ref" placeholder="cth: 18917720251110094037705" autocomplete="off" />
          <button type="submit">Tampilkan Kode</button>
        </form>`;
    } else {
      const rec = claimByReff(ref);
      inner = rec
        ? `<p>Pembayaran terkonfirmasi (paket <b>${escapeHtmlClaim(rec.plan)}</b>, ${rec.days} hari).</p>
           <p>Kode aktivasi Anda:</p>
           <div class="serial">${escapeHtmlClaim(rec.serial)}</div>
           <p>Salin kode di atas ke aplikasi GMST Scraper: menu Pengaturan → Lisensi → Aktivasi.</p>`
        : `<p class="missing">Referensi tidak ditemukan. Periksa kembali nomornya atau hubungi support@99apps.id.</p>
           <p><a href="${CLAIM_PATH}">← Coba lagi</a></p>`;
    }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Klaim Kode Aktivasi GMST</title>
<style>body{font-family:system-ui,sans-serif;background:#f8fafc;color:#0f172a;display:flex;justify-content:center;padding:2rem 1rem}main{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:1.5rem;max-width:440px;width:100%}h1{font-size:1.05rem}input{width:100%;padding:.55rem;border:1px solid #cbd5e1;border-radius:6px;font-size:.9rem;margin:.5rem 0}button{background:#0f172a;color:#fff;border:none;border-radius:6px;padding:.55rem 1rem;font-weight:700;cursor:pointer}.serial{font-family:monospace;font-size:1.25rem;font-weight:800;letter-spacing:.06em;background:#ecfdf5;border:1px solid #a7f3d0;border-radius:8px;padding:.7rem;text-align:center;color:#047857}.missing{color:#be123c}a{color:#2563eb}</style>
</head><body><main><h1>Klaim Kode Aktivasi</h1>${inner}</main></body></html>`);
    return;
  }

  // START SCRAPE
  if (pathname === '/api/scrape/start' && req.method === 'POST') {
    if (process.env.DISABLE_ENGINE === '1') {
      res.writeHead(403, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: 'Modul scraping dinonaktifkan (integritas aplikasi tidak valid). Instal ulang dari sumber resmi.',
        code: 'ENGINE_DISABLED'
      }));
      return;
    }
    const lic = getLicenseStatus();
    if (lic.blocked) {
      res.writeHead(403, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: lic.tampered
          ? 'Jam sistem tidak valid. Perbaiki tanggal & jam perangkat, atau aktivasi lisensi.'
          : 'Masa trial 3 hari telah habis. Masukkan kode aktivasi untuk melanjutkan scraping.',
        code: 'LICENSE_REQUIRED',
        license: { expired: lic.expired, daysLeft: lic.daysLeft }
      }));
      return;
    }
    try {
      const payload = await readJsonBody(req);
      const job = validateScrapePayload(payload);
      if (currentScrapeJob?.running) {
        res.writeHead(409, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Tugas scraping lain sedang berjalan.' }));
        return;
      }
      const plan = buildScrapePlan(job);
      const scope = {
        keyword: job.keyword,
        cities: job.cities.length,
        totalQueries: plan.totalQueries,
        estPages: plan.estPages,
        depth: job.depth,
        deepMatrix: job.deepMatrix,
        engine: ENGINE_MODE === 'client' ? 'vps' : 'local'
      };
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Scrape job started', scope }));

      if (ENGINE_MODE === 'client') {
        // Mode aplikasi paket: eksekusi di VPS, hasil di-relay via SSE lokal.
        // Trial lokal tanpa aktivasi dibatasi (anti-abuse VPS).
        const licNow = getLicenseStatus();
        let licState = null;
        try { licState = loadLicenseState(); } catch { /* abaikan */ }
        currentScrapeJob = { abort: false, running: true };
        broadcastSSE({ type: 'status', running: true });
        const effJob = { ...job };
        if (!licNow.activated) {
          effJob.depth = 1;
          effJob.deepMatrix = false;
          effJob.cities = effJob.cities.slice(0, 2);
          effJob.keywordVariants = [];
          broadcastLog('Mode trial via VPS: dibatasi 2 kota, kedalaman 1. Aktivasi untuk cakupan penuh.');
        }
        const effPlan = buildScrapePlan(effJob);
        proxyScrapeToEngine({ serial: licState?.activated?.serial || '', installId: licNow.installId, job: effJob, plan: effPlan })
          .catch((err) => {
            broadcastLog(`Error VPS engine: ${err.message}`);
            broadcastSSE({ type: 'status', running: false, error: err.message });
          })
          .finally(() => { if (currentScrapeJob) currentScrapeJob.running = false; });
      } else {
        startScrapeJob({ ...job, cityQueries: plan.cityQueries, totalQueries: plan.totalQueries, estPages: plan.estPages })
          .catch((err) => broadcastLog(`Error saat scraping: ${err.message}`));
      }
    } catch (err) {
      res.writeHead(err.status || 400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // VPS ENGINE RUN (hanya ENGINE_MODE=engine) — eksekusi di server vendor.
  // Auth = serial GMST valid (+ allowlist/revoked bila dikonfigurasi).
  // Verifikasi tanpa membocorkan daftar (jawab ya/tidak saja):
  //   GET /api/license/verify?serial=GMST-...  -> {valid:true|false}
  if (pathname === '/api/license/verify' && ENGINE_MODE === 'engine') {
    const serial = String(urlObj.searchParams.get('serial') || '').trim();
    let valid = false;
    let plan = null;
    let days = null;
    try {
      if (serial) {
        const auth = authorizeEngineSerial(serial);
        valid = true;
        if (!auth.trial) {
          const pd = planDurationForSerial(serial);
          if (pd) { plan = pd.plan; days = pd.durationDays; }
        }
      }
    } catch { valid = false; }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ valid, plan, days }));
    return;
  }
  if (pathname === '/api/engine/run' && req.method === 'POST') {
    if (ENGINE_MODE !== 'engine') {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Engine tidak aktif di server ini.' }));
      return;
    }
    try {
      const payload = await readJsonBody(req);
      const serial = String(payload?.serial || '').trim();
      const auth = authorizeEngineSerial(serial);
      const rawJob = payload?.job || {};
      const job = validateScrapePayload(rawJob);
      // Batas anti-abuse: trial (tanpa serial) & serial tak terdaftar.
      // Trial juga dibatasi rate per IP.
      const list = readEngineAllowlist();
      const allowlistConfigured = Boolean(
        ENGINE_ALLOWLIST_FILE || process.env.LICENSE_ALLOWLIST || process.env.PAYMENT_STORE_FILE ||
        fs.existsSync(path.join(__dirname, 'licenses.json'))
      );
      // Fail-closed: bila allowlist dikonfigurasi tapi tak terbaca,
      // JANGAN anggap terdaftar (sebelumnya fallback listed=true).
      if (!list && allowlistConfigured) {
        throw Object.assign(new Error('Daftar lisensi VPS tak tersedia, coba lagi.'), { status: 503, code: 'ENGINE_ALLOWLIST' });
      }
      const listed = auth.listed || (list ? list.licenses.has(serial.toUpperCase()) : true);
      if (!listed) {
        if (auth.trial) {
          const ip = engineClientIp(req);
          if (!checkEngineTrialLimit(ip)) {
            throw Object.assign(new Error('Batas trial VPS tercapai (maksimal 5 job/jam). Aktivasi untuk tanpa batas.'), { status: 429, code: 'ENGINE_RATE_LIMIT' });
          }
        }
        job.depth = Math.min(job.depth, 1);
        job.cities = job.cities.slice(0, 2);
        job.deepMatrix = false;
        job.keywordVariants = [];
      }
      const plan = buildScrapePlan(job);

      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      });
      const send = (obj) => {
        try { res.write(`data: ${JSON.stringify(obj)}\n\n`); } catch { /* putus */ }
      };
      let aborted = false;
      req.on('close', () => { aborted = true; });

      const dataset = [];
      const seen = new Set();
      send({ type: 'status', running: true });
      try {
        await executeScrapePlan(
          { keyword: job.keyword, cityQueries: plan.cityQueries, depth: job.depth },
          {
            dataset,
            seen,
            onLog: (text) => send({ type: 'log', text }),
            onProgress: (percent, statusText, totalRecords) => send({ type: 'progress', percent, statusText, totalRecords }),
            onBatch: (items) => send({ type: 'new_batch', items }),
            shouldAbort: () => aborted
          }
        );
        send({ type: 'progress', percent: 100, statusText: 'Selesai', totalRecords: dataset.length });
        send({ type: 'status', running: false, finished: true });
      } catch (err) {
        send({ type: 'log', text: `Error engine: ${err.message}` });
        send({ type: 'status', running: false, error: err.message });
      }
      res.end();
    } catch (err) {
      if (!res.headersSent) res.writeHead(err.status || 400, { 'Content-Type': 'application/json' });
      try { res.end(JSON.stringify({ error: err.message, code: err.code || 'ENGINE_FAILED' })); } catch { /* abaikan */ }
    }
    return;
  }

  // STOP SCRAPE
  if (pathname === '/api/scrape/stop' && req.method === 'POST') {
    if (currentScrapeJob && currentScrapeJob.running) {
      currentScrapeJob.abort = true;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Stopping scrape job...' }));
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'No active scrape job' }));
    }
    return;
  }

  // EXPORT (EXCEL / CSV / JSON) - GET (All/Filtered via query) & POST (Filtered records via body)
  // Diblokir saat lisensi kedaluwarsa & belum aktivasi (monetisasi).
  if (pathname === '/api/export') {
    const lic = getLicenseStatus();
    if (lic.blocked) {
      res.writeHead(403, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: 'Masa trial 3 hari telah habis. Masukkan kode aktivasi untuk mengunduh data.',
        code: 'LICENSE_REQUIRED',
        license: { expired: lic.expired, daysLeft: lic.daysLeft }
      }));
      return;
    }
    const handleExport = async (format, targetRecords, downloadLabel) => {
      let records = Array.isArray(targetRecords) && targetRecords.length > 0 ? targetRecords : activeDataset;
      if (records.length > MAX_EXPORT_RECORDS) {
        res.writeHead(413, { 'Content-Type': 'text/plain' });
        res.end(`Terlalu banyak data (${records.length}). Maksimal ${MAX_EXPORT_RECORDS}. Gunakan filter.`);
        return;
      }
      const fmt = String(format || 'xlsx').toLowerCase();
      if (!['xlsx', 'csv', 'json'].includes(fmt)) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Format tidak didukung. Gunakan xlsx, csv, atau json.');
        return;
      }
      const safeLabel = String(downloadLabel || 'Directory').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 60) || 'Directory';

      if (fmt === 'csv') {
        res.writeHead(200, {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="Data_Google_Maps_${safeLabel}.csv"`
        });
        res.write('\uFEFF'); // UTF-8 BOM
        res.write('No,Jenis Usaha,Wilayah (Provinsi),Kota / Kabupaten,Nama Usaha,Nomor Telepon,Alamat Lengkap,Kampus Terdekat,Kawasan Perkantoran Terdekat,Rating,Jumlah Ulasan,Website,Link Google Maps,Koordinat\n');

        records.forEach((item, idx) => {
          const coords = (typeof item.lat === 'number' && typeof item.lng === 'number') ? `${item.lat}, ${item.lng}` : '';
          const line = [
            idx + 1,
            csvCell(item.category),
            csvCell(item.province),
            csvCell(item.city),
            csvCell(item.name),
            csvCell(item.phone),
            csvCell(item.address),
            csvCell(item.nearestCampus),
            csvCell(item.nearestOffice),
            item.rating !== null && item.rating !== undefined ? item.rating : '',
            item.reviewsCount || 0,
            csvCell(item.website),
            csvCell(item.mapsUrl),
            csvCell(coords)
          ].join(',');
          res.write(line + '\n');
        });
        res.end();
        return;
      }

      if (fmt === 'json') {
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Disposition': `attachment; filename="Data_Google_Maps_${safeLabel}.json"`
        });
        res.end(JSON.stringify({ total: records.length, exportedAt: new Date().toISOString(), records }, null, 2));
        return;
      }

      // Default: XLSX
      let tempExport = null;
      try {
        tempExport = path.join(os.tmpdir(), `gmaps-export-${Date.now()}-${Math.floor(Math.random() * 1e6)}.xlsx`);
        await exportToExcel(records, tempExport);
        const stat = fs.statSync(tempExport);

        res.writeHead(200, {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="Hasil_Pencarian_Google_Maps_${safeLabel}.xlsx"`,
          'Content-Length': stat.size
        });
        const fileStream = fs.createReadStream(tempExport);
        fileStream.on('error', () => {
          try { fs.unlinkSync(tempExport); } catch { /* ignore */ }
          if (!res.headersSent) res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Export error');
        });
        fileStream.on('close', () => {
          fs.unlink(tempExport, () => {});
        });
        req.on('close', () => {
          try { fileStream.destroy(); } catch { /* ignore */ }
          fs.unlink(tempExport, () => {});
        });
        fileStream.pipe(res);
        return;
      } catch (err) {
        if (tempExport) fs.unlink(tempExport, () => {});
        if (!res.headersSent) res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Export error: ${err.message}`);
        return;
      }
    };

    if (req.method === 'POST') {
      try {
        const payload = await readJsonBody(req);
        await handleExport(payload.format, payload.records, payload.label || 'Filter');
      } catch (err) {
        if (!res.headersSent) res.writeHead(err.status || 400, { 'Content-Type': 'text/plain' });
        res.end(`Bad export request: ${err.message}`);
      }
      return;
    }

    if (req.method === 'GET') {
      const format = urlObj.searchParams.get('format') || 'xlsx';
      const city = (urlObj.searchParams.get('city') || '').toLowerCase();
      const cat = (urlObj.searchParams.get('category') || '').toLowerCase();
      const q = (urlObj.searchParams.get('query') || '').toLowerCase();
      const phoneOnly = urlObj.searchParams.get('phoneOnly') === '1' || urlObj.searchParams.get('phoneOnly') === 'true';
      const ratingOnly = urlObj.searchParams.get('ratingOnly') === '1' || urlObj.searchParams.get('ratingOnly') === 'true';

      let subset = activeDataset;
      if (city || cat || q || phoneOnly || ratingOnly) {
        subset = activeDataset.filter(item => {
          if (city && (item.city || '').toLowerCase() !== city) return false;
          if (cat && (item.category || '').toLowerCase() !== cat) return false;
          if (phoneOnly && !item.phone) return false;
          if (ratingOnly && (typeof item.rating !== 'number' || item.rating < 4.5)) return false;
          if (q) {
            const match =
              (item.name || '').toLowerCase().includes(q) ||
              (item.address || '').toLowerCase().includes(q) ||
              (item.phone || '').toLowerCase().includes(q);
            if (!match) return false;
          }
          return true;
        });
      }

      await handleExport(format, subset, city || cat || 'Semua');
      return;
    }
  }

  // STATIC ASSETS
  if (pathname === '/favicon.ico') {
    const svgFav = path.join(PUBLIC_DIR, 'favicon.svg');
    if (fs.existsSync(svgFav)) {
      res.writeHead(200, { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=86400' });
      fs.createReadStream(svgFav).pipe(res);
      return;
    }
  }

  let decodedPath;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Bad Request');
    return;
  }
  let filePath = path.normalize(path.join(PUBLIC_DIR, decodedPath === '/' ? 'index.html' : decodedPath));
  if (!filePath.startsWith(PUBLIC_DIR + path.sep) && filePath !== PUBLIC_DIR) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  // Block directory traversal artifacts & hidden files
  if (decodedPath.includes('..') || decodedPath.includes('\0')) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.svg': 'image/svg+xml'
  };

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const cacheControl = ext === '.html' ? 'no-cache' : 'public, max-age=3600';
    res.writeHead(200, { 'Content-Type': (mimeTypes[ext] || 'application/octet-stream') + (ext === '.html' || ext === '.css' || ext === '.js' ? '; charset=utf-8' : ''), 'Cache-Control': cacheControl });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
}

// Bungkus handler: setiap error (termasuk URLError dari decodeURIComponent
// atau fetch yang gagal) dijawab 500, bukan menjatuhkan proses (DoS).
const server = http.createServer((req, res) => {
  handleRequest(req, res).catch((err) => {
    console.error('[server] galat tak tertangani:', err?.message || err);
    try {
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Kesalahan internal' }));
      } else {
        res.end();
      }
    } catch { /* koneksi sudah putus */ }
  });
});

process.on('unhandledRejection', (err) => console.error('[server] unhandledRejection:', err?.message || err));
process.on('uncaughtException', (err) => console.error('[server] uncaughtException:', err?.message || err));

// START SERVER
initDataset()
  .then(() => loadClientDataset())
  .then(() => {
  server.listen(PORT, () => {
    console.log('='.repeat(70));
    console.log(`GOOGLE MAPS INTELLIGENCE DASHBOARD AKTIF!`);
    console.log(`-> URL Browser : http://localhost:${PORT}`);
    console.log(`-> Master Data : ${activeDataset.length} listing siap diakses`);
    console.log('='.repeat(70));
  });
  });
