/**
 * License & Trial Module — monetisasi GMST Scraper
 *
 * Model:
 * - Install baru mendapat trial 3 hari (firstRun tercatat di license.json).
 * - Setelah trial habis: scraping + semua unduhan (xlsx/csv/json) DIBLOKIR
 *   sampai kode aktivasi valid dimasukkan.
 * - Format serial: GMST-YYMM-XXXXXX
 *   - YYMM  = bulan terbit kode (validasi: bulan kalender valid,
 *             tidak di masa depan, tidak lebih tua dari 36 bulan).
 *   - XXXXXX = 4 char acak + 2 char checksum HMAC-SHA256(secret).
 *     Tanpa secret, kode tidak bisa dipalsukan.
 * - Kode-kode valid yang diterbitkan vendor disimpan di VPS
 *   (file JSON statis). Jika LICENSE_SERVER_URL diset, aplikasi
 *   memverifikasi keanggotaan kode ke VPS saat aktivasi (gagal jaringan
 *   = fallback ke validasi kriptografi lokal, fail-open).
 *
 * Env:
 *   LICENSE_FILE        path file lisensi (default: ./license.json).
 *                         Di Electron diisi ke folder userData aplikasi.
 *   LICENSE_SECRET      secret HMAC (wajib diset sama antara generator
 *                         dan server produksi; default dev hanya untuk coba).
 *   LICENSE_SERVER_URL  URL basis engine di VPS, mis:
 *                         https://gmst.dewa.ai.id
 *                         verifikasi via GET <basis>/api/license/verify?serial=...
 *                         (hanya jawab valid/tidak; daftar kode tetap privat).
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const TRIAL_DAYS = 3;
export const TRIAL_MS = TRIAL_DAYS * 24 * 3600 * 1000;
const CLOCK_SKEW_TOLERANCE_MS = 5 * 60 * 1000;
const SERIAL_MAX_AGE_MONTHS = 36;

const B32_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZU23456789'; // 32 char, tanpa I,L,O,0,1 agar mudah dibaca

let warnedDefaultSecret = false;

export function licenseFilePath() {
  return process.env.LICENSE_FILE || path.join(__dirname, '..', 'license.json');
}

export function licenseSecret() {
  const s = process.env.LICENSE_SECRET || '';
  if (!s && !warnedDefaultSecret) {
    warnedDefaultSecret = true;
    console.warn('[License] LICENSE_SECRET tidak diset — memakai secret dev. Set env yang sama di generator & server produksi.');
  }
  return s || 'gmst-dev-secret-change-me';
}

export function licenseServerUrl() {
  return (process.env.LICENSE_SERVER_URL || '').trim();
}

// ---------------------------------------------------------------------------
// Serial helpers
// ---------------------------------------------------------------------------

function hmacHex(secret, data) {
  return crypto.createHmac('sha256', secret).update(data).digest('hex');
}

function checksumChars(secret, prefix, randomPart) {
  // 2 char checksum dari HMAC -> 10 bit
  const hex = hmacHex(secret, `${prefix}-${randomPart}`);
  const n = parseInt(hex.slice(0, 3), 16); // 12 bit
  return B32_ALPHABET[(n >> 5) & 31] + B32_ALPHABET[n & 31];
}

function randomPart() {
  const bytes = crypto.randomBytes(3); // 24 bit -> 4x 5bit + sisa dibuang
  const n = (bytes[0] << 16) | (bytes[1] << 8) | bytes[2];
  let out = '';
  let v = n;
  for (let i = 0; i < 4; i++) {
    out = B32_ALPHABET[v & 31] + out;
    v >>= 5;
  }
  return out;
}

function currentYYMM(now = new Date()) {
  const yy = String(now.getFullYear()).slice(2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  return `${yy}${mm}`;
}

/** Terbitkan 1 serial untuk bulan YYMM tertentu (default bulan berjalan). */
export function generateSerial(secret, yymm = null) {
  const tag = yymm || currentYYMM();
  if (!/^\d{4}$/.test(tag)) throw new Error('YYMM harus 4 digit, mis. 2601');
  const mm = parseInt(tag.slice(2), 10);
  if (mm < 1 || mm > 12) throw new Error('Bulan YYMM tidak valid');
  const rnd = randomPart();
  const cc = checksumChars(secret, tag, rnd);
  return `GMST-${tag}-${rnd}${cc}`;
}

function monthsBetween(yymmOld, now = new Date()) {
  const oldY = 2000 + parseInt(yymmOld.slice(0, 2), 10);
  const oldM = parseInt(yymmOld.slice(2), 10);
  return (now.getFullYear() - oldY) * 12 + (now.getMonth() + 1 - oldM);
}

/**
 * Validasi kriptografi + umur serial. Tidak menyentuh jaringan.
 * @returns {{ok:boolean, reason?:string}}
 */
export function validateSerial(serial, secret = licenseSecret(), now = new Date()) {
  const s = String(serial || '').trim().toUpperCase();
  const m = s.match(/^GMST-(\d{4})-([A-Z2-9]{6})$/);
  if (!m) return { ok: false, reason: 'FORMAT' };
  const [, yymm, uniq] = m;
  const mm = parseInt(yymm.slice(2), 10);
  if (mm < 1 || mm > 12) return { ok: false, reason: 'FORMAT' };
  const rnd = uniq.slice(0, 4);
  const cc = uniq.slice(4);
  if (checksumChars(secret, yymm, rnd) !== cc) return { ok: false, reason: 'CHECKSUM' };
  if (monthsBetween(yymm, now) < 0) return { ok: false, reason: 'YYMM_FUTURE' };
  if (monthsBetween(yymm, now) > SERIAL_MAX_AGE_MONTHS) return { ok: false, reason: 'YYMM_TOO_OLD' };
  return { ok: true };
}

export function serialErrorMessage(reason) {
  switch (reason) {
    case 'FORMAT': return 'Format kode salah. Periksa kembali kode aktivasi Anda.';
    case 'CHECKSUM': return 'Kode tidak dikenali. Periksa kembali kode aktivasi Anda.';
    case 'YYMM_FUTURE': return 'Kode belum berlaku. Periksa kembali kode aktivasi Anda.';
    case 'YYMM_TOO_OLD': return 'Kode sudah kedaluwarsa. Hubungi penyedia aplikasi.';
    case 'NOT_LISTED': return 'Kode tidak terdaftar di server lisensi. Hubungi penyedia aplikasi.';
    case 'REVOKED': return 'Kode telah dicabut. Hubungi penyedia aplikasi.';
    default: return 'Kode aktivasi tidak valid.';
  }
}

// ---------------------------------------------------------------------------
// License state (local file)
// ---------------------------------------------------------------------------

function blankState(now) {
  return {
    installId: crypto.randomUUID(),
    firstRun: now.toISOString(),
    lastSeen: now.toISOString(),
    onboarded: false,
    activated: null // { serial, at }
  };
}

export function loadLicenseState(now = new Date()) {
  const file = licenseFilePath();
  try {
    if (fs.existsSync(file)) {
      const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
      if (raw && typeof raw.installId === 'string' && typeof raw.firstRun === 'string') {
        return raw;
      }
    }
  } catch {
    // corrupt -> reset di bawah
  }
  const fresh = blankState(now);
  try {
    fs.writeFileSync(file, JSON.stringify(fresh, null, 2));
  } catch {
    // read-only env: lanjut in-memory
  }
  return fresh;
}

export function saveLicenseState(state) {
  try {
    fs.writeFileSync(licenseFilePath(), JSON.stringify(state, null, 2));
  } catch (err) {
    throw Object.assign(new Error(`Gagal menyimpan lisensi: ${err.message}`), { status: 500 });
  }
}

/**
 * Status lisensi gabungan (trial + aktivasi + tamper jam).
 * @returns {{activated, expired, blocked, tampered, daysLeft, trialEndsAt, installId, onboarded, serialMasked}}
 */
export function getLicenseStatus(now = new Date()) {
  const st = loadLicenseState(now);
  const firstRun = new Date(st.firstRun).getTime();
  const lastSeen = new Date(st.lastSeen || st.firstRun).getTime();
  const t = now.getTime();

  let tampered = false;
  if (Number.isNaN(firstRun)) {
    tampered = true;
  } else {
    if (t < firstRun - CLOCK_SKEW_TOLERANCE_MS) tampered = true;
    if (!Number.isNaN(lastSeen) && t < lastSeen - CLOCK_SKEW_TOLERANCE_MS) tampered = true;
  }

  const trialEndsAt = Number.isNaN(firstRun) ? now.toISOString() : new Date(firstRun + TRIAL_MS).toISOString();
  const msLeft = (Number.isNaN(firstRun) ? 0 : firstRun + TRIAL_MS) - t;
  const daysLeft = msLeft <= 0 ? 0 : Math.ceil(msLeft / (24 * 3600 * 1000));
  const activated = Boolean(st.activated && st.activated.serial);
  let expired = !activated && (tampered || msLeft <= 0);
  // Paket berbayar berbasis durasi: aktivasi ikut kedaluwarsa
  let plan = st.activated?.plan || null;
  let expiresAt = st.activated?.expiresAt || null;
  if (activated && expiresAt && !Number.isNaN(new Date(expiresAt).getTime())) {
    if (t > new Date(expiresAt).getTime()) expired = true;
  }

  // majukan lastSeen monotonik (anti putar-balik jam dideteksi di atas)
  if (!Number.isNaN(lastSeen) && t > lastSeen) {
    st.lastSeen = now.toISOString();
    try { saveLicenseState(st); } catch { /* abaikan */ }
  }

  return {
    activated,
    expired,
    blocked: expired,
    tampered,
    daysLeft,
    plan,
    expiresAt,
    trialEndsAt,
    trialDays: TRIAL_DAYS,
    installId: st.installId,
    onboarded: st.onboarded === true,
    serialMasked: activated ? maskSerial(st.activated.serial) : null
  };
}

function maskSerial(s) {
  const v = String(s || '');
  if (v.length < 9) return '****';
  return `${v.slice(0, 5)}-****-${v.slice(-2)}`;
}

// ---------------------------------------------------------------------------
// Online verification (VPS)
// ---------------------------------------------------------------------------

async function verifyOnline(serial) {
  const url = licenseServerUrl();
  if (!url) return { checked: false };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    let res;
    if (/\.json(\?.*)?$/.test(url)) {
      res = await fetch(url, { signal: controller.signal, headers: { 'Accept': 'application/json' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const needle = String(serial).trim().toUpperCase();
      const revoked = Array.isArray(data.revoked)
        ? data.revoked.map((x) => String(x).trim().toUpperCase())
        : [];
      if (revoked.includes(needle)) return { checked: true, listed: false, revoked: true };
      const list = Array.isArray(data) ? data : data.licenses;
      if (!Array.isArray(list)) throw new Error('Format daftar lisensi VPS tidak valid');
      return { checked: true, listed: list.map((x) => String(typeof x === 'string' ? x : x.serial).trim().toUpperCase()).includes(needle) };
    }
    const base = url.replace(/\/+$/, '');
    const u = new URL(`${base}/api/license/verify`);
    u.searchParams.set('serial', String(serial).trim().toUpperCase());
    res = await fetch(u.toString(), { signal: controller.signal, headers: { 'Accept': 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return {
      checked: true,
      listed: data.valid === true,
      plan: data.plan || null,
      days: Number.isFinite(data.days) ? data.days : null
    };
  } finally {
    clearTimeout(timer);
  }
}

/** Cabut aktivasi di perangkat ini (setara logout). Trial tidak diulang:
 *  bila masa trial sudah lewat, status kembali diblokir sampai kode baru. */
export function deactivateLicense(now = new Date()) {
  const st = loadLicenseState(now);
  st.activated = null;
  saveLicenseState(st);
  return getLicenseStatus(now);
}
/** Tandai onboarding selesai (tombol "Lanjutkan gratis 3 hari"). */
export function markOnboarded(now = new Date()) {
  const st = loadLicenseState(now);
  st.onboarded = true;
  saveLicenseState(st);
  return getLicenseStatus(now);
}

/**
 * Aktivasi dengan serial. Urutan: format+checksum+umur -> (opsional) cek VPS.
 * Offline / VPS tak terjangkau = fallback validasi lokal (fail-open).
 * opts: { plan:'harian'|'mingguan'|..., durationDays:number } untuk paket
 * berbayar berbasis durasi (tanpa opts = perpetual seperti kode vendor).
 */
export function activateLicense(serial, now = new Date(), opts = {}) {
  const secret = licenseSecret();
  const check = validateSerial(serial, secret, now);
  if (!check.ok) {
    throw Object.assign(new Error(serialErrorMessage(check.reason)), { status: 400, code: 'INVALID_SERIAL' });
  }
  const st = loadLicenseState(now);
  st.activated = { serial: String(serial).trim().toUpperCase(), at: now.toISOString() };
  if (opts && Number.isFinite(opts.durationDays) && opts.durationDays > 0) {
    st.activated.plan = String(opts.plan || 'berbayar');
    st.activated.expiresAt = new Date(now.getTime() + opts.durationDays * 24 * 3600 * 1000).toISOString();
  }
  st.onboarded = true;
  saveLicenseState(st);
  return { success: true, status: getLicenseStatus(now), onlineChecked: false };
}

/** Varian async dengan verifikasi VPS bila dikonfigurasi. */
export async function activateLicenseOnline(serial, now = new Date(), opts = {}) {
  const secret = licenseSecret();
  const check = validateSerial(serial, secret, now);
  if (!check.ok) {
    throw Object.assign(new Error(serialErrorMessage(check.reason)), { status: 400, code: 'INVALID_SERIAL' });
  }
  let onlineChecked = false;
  let planOpts = { ...(opts || {}) };
  if (licenseServerUrl()) {
    try {
      const v = await verifyOnline(serial);
      onlineChecked = v.checked;
      if (v.checked && v.revoked) {
        throw Object.assign(new Error(serialErrorMessage('REVOKED')), { status: 403, code: 'REVOKED' });
      }
      if (v.checked && !v.listed) {
        throw Object.assign(new Error(serialErrorMessage('NOT_LISTED')), { status: 403, code: 'NOT_LISTED' });
      }
      // Paket berbayar dari VPS: durasi ikut tersimpan di perangkat
      if (v.checked && v.listed && Number.isFinite(v.days) && v.days > 0 && !planOpts.durationDays) {
        planOpts = { plan: v.plan || 'berbayar', durationDays: v.days };
      }
    } catch (err) {
      if (err && (err.code === 'NOT_LISTED' || err.code === 'REVOKED' || err.status === 403)) throw err;
      // VPS tak terjangkau -> lanjut validasi lokal (fail-open), dicatat
      console.warn(`[License] Verifikasi VPS gagal (${err.message}); memakai validasi lokal.`);
    }
  }
  const st = loadLicenseState(now);
  st.activated = { serial: String(serial).trim().toUpperCase(), at: now.toISOString() };
  if (planOpts && Number.isFinite(planOpts.durationDays) && planOpts.durationDays > 0) {
    st.activated.plan = String(planOpts.plan || 'berbayar');
    st.activated.expiresAt = new Date(now.getTime() + planOpts.durationDays * 24 * 3600 * 1000).toISOString();
  }
  st.onboarded = true;
  saveLicenseState(st);
  return { success: true, status: getLicenseStatus(now), onlineChecked };
}
