/**
 * Payment Singapay (Payment Link, money-in) -> penerbitan serial otomatis.
 *
 * Alur:
 *  1. Vendor buat 2 Payment Link di dashboard Singapay (harian Rp15rb,
 *     mingguan Rp50rb), set transaction_notif_url ke WEBHOOK_URL di bawah.
 *  2. Pembeli bayar via link -> Singapay POST webhook ke server ini.
 *  3. Server verifikasi HMAC-SHA512, petakan nominal -> paket, generate
 *     serial GMST, simpan ke licenses store + catat reff_no (idempoten).
 *  4. success_redirect_url payment link menunjuk ke CLAIM_URL; pembeli
 *     membuka -> GET JSON berisi serialnya untuk dimasukkan ke aplikasi.
 *
 * Env (VPS):
 *   SINGAPAY_CLIENT_ID      Client ID dashboard
 *   SINGAPAY_CLIENT_SECRET  Client Secret dashboard (auth token API)
 *   SINGAPAY_HMAC_KEY       HMAC Validation Key dashboard (verifikasi
 *                           signature webhook; fallback ke CLIENT_SECRET
 *                           bila tidak diset)
 *   SINGAPAY_PARTNER_ID / SINGAPAY_API_KEY  API Key / Partner ID
 *   SINGAPAY_ACCOUNT_ID     Account ID payment-link (lihat dashboard Singapay)
 *   PAYMENT_STORE_FILE      licenses store (default ./licenses.json)
 *   PAYMENT_ORDERS_FILE     catatan order idempoten (default ./payments.json)
 */

import fs from 'fs';
import crypto from 'crypto';
import { generateSerial } from './license.js';
import { licenseSecret } from './license.js';

export const WEBHOOK_PATH = '/api/payment/singapay';
export const CLAIM_PATH = '/api/payment/claim';

// Hardcoded hosted URLs are retained only as a fallback UI target.
// The primary renewal flow now uses Singapay dynamic Payment Links.
export const PLANS = {
  harian: {
    amount: 15000, days: 1, label: 'Harian', shortLabel: '1 Hari',
    url: 'https://payment-link.singapay.id/b2b/PL202610111742326acb6818a083e'
  },
  mingguan: {
    amount: 50000, days: 7, label: 'Mingguan', shortLabel: '7 Hari',
    url: 'https://payment-link.singapay.id/b2b/PL202610111745086acb68b4360e7'
  }
};

function isoDate(d = new Date()) {
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

function paymentRedirectBase() {
  const host = String(process.env.PAYMENT_REDIRECT_HOST || process.env.HOST || '').trim();
  if (!host) return null;
  return host.replace(/\/+$/, '');
}

function paymentClaimUrl(reffNo) {
  const base = paymentRedirectBase();
  if (!base) return null;
  const path = `${CLAIM_PATH}?ref=${encodeURIComponent(reffNo)}`;
  if (/^https?:\/\//i.test(base)) return `${base}${path}`;
  return `https://${base}${path}`;
}

function jakartaDateYMD(date = new Date()) {
  const d = new Date(date);
  const pad = (n) => String(n).padStart(2, '0');
  const wib = new Date(d.getTime() + (420 + d.getTimezoneOffset()) * 60 * 1000);
  return `${wib.getFullYear()}${pad(wib.getMonth() + 1)}${pad(wib.getDate())}`;
}

function toWibIso(date, offsetMinutes = 7 * 60) {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() + (d.getTimezoneOffset() + offsetMinutes));
  return d.toISOString().replace('Z', '+07:00');
}

export const DYNAMIC_PAYMENT_BASE_URL = (process.env.SINGAPAY_BASE_URL || 'https://payment-b2b.singapay.id').replace(/\/+$/, '');
export const DYNAMIC_PAYMENT_TOKEN_TTL_MS = 1000 * 60 * 60 * 24;
const DYNAMIC_PAYMENT_TOKEN_SECRET = process.env.SINGAPAY_DYNAMIC_PAYMENT_TOKEN_SECRET || '';

export function dynamicPaymentLinkPaths(planId) {
  return {
    checkout: `/api/payment/dynamic/${encodeURIComponent(planId)}/checkout`,
    status: `/api/payment/dynamic/${encodeURIComponent(planId)}/status`,
    successRedirect: `/api/payment/dynamic/${encodeURIComponent(planId)}/success`,
    expiredRedirect: `/api/payment/dynamic/${encodeURIComponent(planId)}/expired`
  };
}

export function buildDynamicPaymentRedirectBase(req) {
  try {
    const fwdHost = String(req.headers['x-forwarded-host'] || '').split(',')[0].trim();
    const host = fwdHost || req.headers.host || 'localhost:3000';
    const proto = (req.headers['x-forwarded-proto'] || (req.socket && req.socket.encrypted ? 'https' : 'http')).toString().split(',')[0].trim() || 'http';
    return `${proto}://${host}`;
  } catch {
    return 'http://localhost:3000';
  }
}

export function signDynamicPaymentToken({ planId, installId, reffNo }) {
  if (!DYNAMIC_PAYMENT_TOKEN_SECRET) return null;
  const exp = String(Date.now() + DYNAMIC_PAYMENT_TOKEN_TTL_MS);
  const payload = [planId, installId || '', reffNo || '', exp].join('|');
  const mac = crypto.createHmac('sha256', DYNAMIC_PAYMENT_TOKEN_SECRET).update(payload).digest('hex');
  return `${payload}|${mac}`;
}

export function verifyDynamicPaymentToken(token) {
  if (!token || !DYNAMIC_PAYMENT_TOKEN_SECRET) return null;
  const parts = String(token).split('|');
  if (parts.length < 5) return null;
  const [planId, installId, reffNo, expStr, mac] = parts;
  const exp = parseInt(expStr, 10);
  if (!Number.isFinite(exp) || Date.now() > exp) return null;
  if (!planId || !mac || !/^[0-9a-f]{64}$/i.test(mac)) return null;
  const payload = [planId, installId, reffNo, expStr].join('|');
  const calc = crypto.createHmac('sha256', DYNAMIC_PAYMENT_TOKEN_SECRET).update(payload).digest('hex');
  try {
    if (!crypto.timingSafeEqual(Buffer.from(calc), Buffer.from(mac))) return null;
  } catch {
    return null;
  }
  return { planId, installId: installId || null, reffNo: reffNo || null };
}

/** Format rupiah tanpa desimal: 15000 -> "Rp15.000" */
export function formatRupiah(value) {
  const n = Number(value) || 0;
  return 'Rp' + n.toLocaleString('id-ID');
}

/** Opsi pembayaran untuk UI (urut dari yang paling hemat). */
export function paymentOptions(req) {
  const base = buildDynamicPaymentRedirectBase(req);
  return ['mingguan', 'harian'].map((id) => {
    const p = PLANS[id];
    const paths = dynamicPaymentLinkPaths(id);
    const dynamicUrl = `${base}${paths.checkout}`;
    return {
      id,
      label: p.label,
      shortLabel: p.shortLabel,
      amount: p.amount,
      amountLabel: formatRupiah(p.amount),
      days: p.days,
      url: dynamicUrl,
      staticUrl: p.url,
      dynamic: true,
      paths
    };
  });
}

export async function createDynamicPaymentLink({ planId, amount, days, req, licenseState = {} }) {
  const plan = PLANS[planId];
  if (!plan || plan.amount !== amount) {
    throw Object.assign(new Error('Paket tidak valid'), { status: 400, code: 'INVALID_PLAN' });
  }

  const clientSecret = process.env.SINGAPAY_CLIENT_SECRET || '';
  const clientId = process.env.SINGAPAY_CLIENT_ID || '';
  const partnerId = process.env.SINGAPAY_PARTNER_ID || process.env.SINGAPAY_API_KEY || '';
  const accountId = process.env.SINGAPAY_ACCOUNT_ID || '';
  const baseUrl = DYNAMIC_PAYMENT_BASE_URL;

  if (!clientSecret || !clientId || !partnerId || !accountId) {
    throw Object.assign(new Error('Konfigurasi Singapay tidak lengkap'), { status: 503, code: 'SINGAPAY_NOT_CONFIGURED' });
  }

  const now = new Date();
  // reff_no aman URL & cocok untuk lookup klaim: alfanumerik + strip secukupnya.
  const clientTag = clientId.replace(/[^A-Z0-9]/gi, '').slice(0, 6).toUpperCase() || 'GMST';
  const dateTag = isoDate(now).replace(/-/g, '');
  const randTag = Math.random().toString(36).slice(2, 8).toUpperCase().replace(/[^A-Z0-9]/g, 'X');
  const reffNo = `${clientTag}${planId.replace(/[^A-Z0-9]/gi, '').toUpperCase()}${dateTag}${randTag}`.slice(0, 32);

  // Basis redirect: env eksplisit dulu, fallback ke host request saat ini
  // (agar VPS tanpa PAYMENT_REDIRECT_HOST tetap bisa checkout dinamis).
  let redirectBase = paymentRedirectBase();
  if (!redirectBase && req) redirectBase = buildDynamicPaymentRedirectBase(req);
  // paymentRedirectBase() mengembalikan host telanjang (tanpa skema) —
  // wajib dinormalisasi ke URL absolut, kalau tidak Singapay menolak
  // ("must start with http:// or https://").
  if (redirectBase && !/^https?:\/\//i.test(redirectBase)) redirectBase = `https://${redirectBase}`;
  if (!redirectBase) {
    return { paymentUrl: String(plan.url || ''), url: String(plan.url || ''), dynamic: false, planId, amount: plan.amount, days: plan.days, reffNo: null, error: 'PAYMENT_REDIRECT_HOST atau HOST belum diatur', code: 'STATIC_FALLBACK' };
  }
  const baseNoSlash = redirectBase.replace(/\/+$/, '');
  const paths = dynamicPaymentLinkPaths(planId);

  // Token dibuat SEBELUM memanggil Singapay agar bisa disematkan di
  // success/expired redirect yang didaftarkan ke Singapay.
  const preToken = signDynamicPaymentToken({ planId, installId: licenseState.installId || '', reffNo });
  const tokenQuery = preToken ? `?token=${encodeURIComponent(preToken)}` : `?ref=${encodeURIComponent(reffNo)}`;
  const successRedirect = `${baseNoSlash}${paths.successRedirect}${tokenQuery}`;
  const expiredRedirect = `${baseNoSlash}${paths.expiredRedirect}${tokenQuery}`;
  const claimFallback = paymentClaimUrl(reffNo);

  const signaturePayload = `${clientId}_${clientSecret}_${jakartaDateYMD(now)}`;
  const signature = crypto.createHmac('sha512', clientSecret).update(signaturePayload, 'utf8').digest('hex');

  const tokenResp = await fetch(`${baseUrl}/api/v1.1/access-token/b2b`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-PARTNER-ID': partnerId,
      'X-CLIENT-ID': clientId,
      'X-Signature': signature
    },
    body: JSON.stringify({ grant_type: 'client_credentials' })
  });

  const tokenText = await tokenResp.text();
  // Jangan log body token mentah: berisi access_token (rahasia, berlaku 1 jam).
  console.log('[Payment] token status=', tokenResp.status, 'ok=', tokenResp.ok);

  if (!tokenResp.ok) {
    throw Object.assign(new Error(`Gagal mendapatkan akses token Singapay: ${tokenResp.status}`), { status: 502, code: 'SINGAPAY_TOKEN_FAILED', details: tokenText });
  }

  let tokenData = {};
  try { tokenData = JSON.parse(tokenText); } catch { /* ignore */ }
  const accessToken = String(tokenData?.data?.access_token || tokenData?.access_token || '').trim();
  if (!accessToken) {
    throw Object.assign(new Error('Respons token Singapay kosong'), { status: 502, code: 'SINGAPAY_TOKEN_EMPTY', details: tokenData });
  }

  const paymentBody = {
    reff_no: reffNo,
    payment_link_type: 'total',
    description: `Paket ${plan.label} - GMST Scraper`,
    // Satu link = satu pembayaran. 999 lama membuat pembayaran kedua di link
    // yang sama tercatat "duplikat" dan menerima serial orang lain.
    max_usage: 1,
    expired_at: toWibIso(now.getTime() + 24 * 60 * 60 * 1000),
    total_amount: plan.amount,
    required_customer_number: false,
    required_customer_email: false,
    whitelisted_payment_method: ['VA_BCA', 'VA_BRI', 'VA_MANDIRI', 'QRIS', 'NICEPAY_CARD'],
    success_redirect_url: successRedirect,
    expired_redirect_url: expiredRedirect
  };

  const createResp = await fetch(`${baseUrl}/api/v2.0/payment-link/${encodeURIComponent(accountId)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'X-PARTNER-ID': partnerId,
      'X-CLIENT-ID': clientId
    },
    body: JSON.stringify(paymentBody)
  });

  const createText = await createResp.text();
  let createData = {};
  try { createData = createText ? JSON.parse(createText) : {}; } catch { createData = { _raw: createText.slice(0, 500) }; }
  if (!createResp.ok || createData.success === false) {
    const message = createData?.error?.message || createData?.message || `Gagal membuat payment link dinamis: ${createResp.status}`;
    throw Object.assign(new Error(message), { status: 502, code: 'SINGAPAY_CREATE_FAILED', details: createData });
  }

  const paymentLink = createData?.data;
  if (!paymentLink?.payment_url) {
    throw Object.assign(new Error('Respons payment link dinamis tidak valid'), { status: 502, code: 'SINGAPAY_INVALID_RESPONSE', details: createData });
  }

  return {
    reffNo,
    planId,
    days,
    amount: plan.amount,
    dynamic: true,
    paymentUrl: paymentLink.payment_url,
    status: paymentLink.status,
    isExpired: paymentLink.is_expired || false,
    currentUsage: paymentLink.current_usage || 0,
    maxUsage: paymentLink.max_usage || 0,
    expiredAt: paymentLink.expired_at || toWibIso(now.getTime() + 24 * 60 * 60 * 1000),
    successRedirectUrl: successRedirect,
    expiredRedirectUrl: expiredRedirect,
    claimFallbackUrl: claimFallback,
    createdAt: paymentLink.created_at || now.toISOString()
  };
}

export function paymentStoreFile() {
  return process.env.PAYMENT_STORE_FILE || 'licenses.json';
}

export function paymentOrdersFile() {
  return process.env.PAYMENT_ORDERS_FILE || 'payments.json';
}

function loadJson(file, fallback) {
  try {
    if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch { /* korup -> fallback */ }
  return fallback;
}

function saveJson(file, data) {
  // Tulis atomik (temp + rename + fsync): mencegah store JSON korup/terpotong
  // saat proses berhenti di tengah tulis, yang bisa memicu serial ganda.
  const tmp = `${file}.tmp-${process.pid}-${Date.now()}`;
  let fd = null;
  try {
    fd = fs.openSync(tmp, 'w');
    fs.writeFileSync(fd, JSON.stringify(data, null, 2));
    fs.fsyncSync(fd);
    fs.closeSync(fd);
    fd = null;
    fs.renameSync(tmp, file);
  } catch (err) {
    if (fd !== null) { try { fs.closeSync(fd); } catch { /* abaikan */ } }
    try { fs.unlinkSync(tmp); } catch { /* abaikan */ }
    throw err;
  }
}

// ---------------------------------------------------------------------------
// HMAC-SHA512 verification (sesuai docs.singapay.id)
// StringToSign = METHOD:ENDPOINT:ACCESS_TOKEN:HASHED_BODY:TIMESTAMP
// HASHED_BODY  = SHA256( JSON keys sorted recursive, unescaped unicode/slashes )
// ---------------------------------------------------------------------------

export function sortRecursive(value) {
  if (Array.isArray(value)) return value.map(sortRecursive);
  if (value && typeof value === 'object') {
    const out = {};
    for (const k of Object.keys(value).sort()) out[k] = sortRecursive(value[k]);
    return out;
  }
  return value;
}

export function verifySingapaySignature({ rawBody, headers, clientSecret, endpointPath }) {
  try {
    const h = {};
    for (const k of Object.keys(headers || {})) h[k.toLowerCase()] = headers[k];
    const received = String(h['x-signature'] || '');
    const timestamp = String(h['x-timestamp'] || '');
    const token = String(h['authorization'] || '').replace(/^Bearer\s+/i, '');
    if (!received || !timestamp || !token || !clientSecret) return false;

    // Replay protection 5 menit
    const ts = parseInt(timestamp, 10);
    if (!Number.isFinite(ts) || Math.abs(Date.now() / 1000 - ts) > 300) return false;

    const parsed = JSON.parse(rawBody);
    const normalized = JSON.stringify(sortRecursive(parsed)); // Node: tanpa spasi, unicode as-is
    const hashedBody = crypto.createHash('sha256').update(normalized, 'utf8').digest('hex');
    const stringToSign = `POST:${endpointPath}:${token}:${hashedBody}:${timestamp}`;
    const calc = crypto.createHmac('sha512', clientSecret).update(stringToSign, 'utf8').digest('hex');
    if (calc.length !== received.length) return false;
    return crypto.timingSafeEqual(Buffer.from(calc), Buffer.from(received));
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Fulfillment
// ---------------------------------------------------------------------------

export function planForAmount(value) {
  const n = Math.floor(parseFloat(String(value).replace(/[^0-9.]/g, '')) || 0);
  for (const [id, p] of Object.entries(PLANS)) {
    if (p.amount === n) return { id, ...p };
  }
  return null;
}

/**
 * Proses payload webhook Payment Link yang sudah tervalidasi signature.
 * Idempoten via data.transaction.reff_no.
 * @returns {{serial, plan, days, email, reused:boolean}}
 */
export function fulfillPaymentLink(payload, now = new Date()) {
  const data = payload?.data || {};
  const trx = data.transaction || {};
  if (trx.status !== 'paid') {
    throw Object.assign(new Error(`Status transaksi bukan paid (${trx.status || '?'})`), { status: 422, code: 'NOT_PAID' });
  }
  const reffNo = String(trx.reff_no || '').trim();
  if (!reffNo) throw Object.assign(new Error('reff_no kosong'), { status: 422, code: 'NO_REFF' });

  const ordersFile = paymentOrdersFile();
  const orders = loadJson(ordersFile, { processed: {} });
  if (orders.processed[reffNo]) {
    return { ...orders.processed[reffNo], reused: true };
  }

  const plan = planForAmount(trx.amount?.value);
  if (!plan) {
    throw Object.assign(new Error(`Nominal ${trx.amount?.value} tidak cocok paket mana pun`), { status: 422, code: 'UNKNOWN_PLAN' });
  }

  const serial = generateSerial(licenseSecret());
  const record = {
    serial,
    plan: plan.id,
    days: plan.days,
    amount: plan.amount,
    email: data.customer?.email || null,
    name: data.customer?.name || null,
    phone: data.customer?.phone || null,
    reff_no: reffNo,
    created_at: now.toISOString()
  };

  const storeFile = paymentStoreFile();
  const store = loadJson(storeFile, { generated_at: null, licenses: [], revoked: [] });
  if (!Array.isArray(store.licenses)) store.licenses = [];
  const expiresAt = plan.days ? new Date(now.getTime() + plan.days * 86400000).toISOString() : null;
  upsertLicenseEntry(store, { serial, plan: plan.id, days: plan.days, source: 'singapay', reff_no: reffNo, created_at: now.toISOString(), expires_at: expiresAt });
  store.generated_at = now.toISOString();
  saveJson(storeFile, store);

  orders.processed[reffNo] = record;
  saveJson(ordersFile, orders);

  return { ...record, reused: false };
}

/** Ambil serial untuk halaman klaim pembeli (GET ?ref=REFF_NO). */
export function claimByReff(reffNo) {
  const orders = loadJson(paymentOrdersFile(), { processed: {} });
  const rec = orders.processed[String(reffNo || '').trim()];
  if (!rec) return null;
  return { serial: rec.serial, plan: rec.plan, days: rec.days };
}

export function markOrderActivated(reffNo, now = new Date()) {
  const ordersFile = paymentOrdersFile();
  const orders = loadJson(ordersFile, { processed: {} });
  const rec = orders.processed[String(reffNo || '').trim()];
  if (!rec) return null;
  if (!rec.activatedAt) {
    rec.activatedAt = now.toISOString();
    rec.activatedCount = 1;
  } else {
    rec.activatedCount = (rec.activatedCount || 1) + 1;
  }
  saveJson(ordersFile, orders);
  return rec;
}

export function isOrderStillActive(rec, now = new Date()) {
  if (!rec?.activatedAt || !rec?.days) return false;
  const created = new Date(rec.activatedAt).getTime();
  const expires = created + rec.days * 24 * 60 * 60 * 1000;
  return now.getTime() < expires;
}

export function orderReuseStatus(reffNo, now = new Date()) {
  const orders = loadJson(paymentOrdersFile(), { processed: {} });
  const rec = orders.processed[String(reffNo || '').trim()];
  if (!rec) return { found: false };
  const stillActive = isOrderStillActive(rec, now);
  return {
    found: true,
    serial: rec.serial,
    plan: rec.plan,
    days: rec.days,
    created_at: rec.created_at,
    activatedAt: rec.activatedAt || null,
    activatedCount: rec.activatedCount || 0,
    stillActive,
    expiredAt: rec.activatedAt ? new Date(new Date(rec.activatedAt).getTime() + rec.days * 24 * 60 * 60 * 1000).toISOString() : null
  };
}

/** Cari order yang dibuat setelah timestamp ISO tertentu (untuk auto-activation polling). */
export function findLatestOrderAfter(sinceIso) {
  const orders = loadJson(paymentOrdersFile(), { processed: {} });
  const sinceTime = sinceIso ? new Date(sinceIso).getTime() : 0;
  let latest = null;

  for (const rec of Object.values(orders.processed || {})) {
    if (!rec || !rec.created_at || !rec.serial) continue;
    const t = new Date(rec.created_at).getTime();
    if (t >= sinceTime) {
      if (!latest || t > new Date(latest.created_at).getTime()) {
        latest = rec;
      }
    }
  }
  return latest ? { serial: latest.serial, plan: latest.plan, days: latest.days, reff_no: latest.reff_no } : null;
}

// ---------------------------------------------------------------------------
// Store entries: string lama ("GMST-...") atau objek {serial, plan, days}.
// ---------------------------------------------------------------------------

/** Normalisasi entri store -> [{serial, plan, days}]. Kompatibel mundur. */
export function normalizeLicenseEntries(store) {
  const out = [];
  for (const e of (store?.licenses || [])) {
    if (typeof e === 'string') {
      out.push({ serial: e.trim().toUpperCase(), plan: null, days: null });
    } else if (e && typeof e.serial === 'string') {
      out.push({
        serial: e.serial.trim().toUpperCase(),
        plan: e.plan || null,
        days: Number.isFinite(e.days) ? e.days : null,
        created_at: e.created_at || null,
        expires_at: e.expires_at || null
      });
    }
  }
  return out;
}

export function normalizeRevoked(store) {
  return new Set((store?.revoked || []).map((x) => String(x).trim().toUpperCase()));
}

export function upsertLicenseEntry(store, entry) {
  if (!Array.isArray(store.licenses)) store.licenses = [];
  const needle = String(entry.serial).trim().toUpperCase();
  const idx = store.licenses.findIndex((e) =>
    (typeof e === 'string' ? e : e.serial) &&
    String(typeof e === 'string' ? e : e.serial).trim().toUpperCase() === needle);
  const obj = { serial: needle, plan: entry.plan || null, days: entry.days ?? null, source: entry.source || 'manual', reff_no: entry.reff_no || null, created_at: entry.created_at || null, expires_at: entry.expires_at || null };
  if (idx >= 0) store.licenses[idx] = obj;
  else store.licenses.push(obj);
}

/** Cari paket berbayar untuk serial (durasi aktivasi perangkat). */
export function findPlanForSerial(serial, storeFiles = []) {
  const needle = String(serial || '').trim().toUpperCase();
  for (const f of storeFiles) {
    try {
      const store = loadJson(f, null);
      if (!store) continue;
      const hit = normalizeLicenseEntries(store).find((e) => e.serial === needle);
      if (hit && hit.days) return { plan: hit.plan, days: hit.days };
    } catch { /* abaikan */ }
  }
  return null;
}

function vpsBase(override = '') {
  const v = String(override || process.env.ENGINE_URL || '').trim();
  if (/^(off|none|local)$/i.test(v)) return '';
  return (v || 'https://gmst.dewa.ai.id').replace(/\/+$/, '');
}

/**
 * Ambil order VPS berdasarkan nomor referensi (untuk aktivasi otomatis
 * di klien yang tidak menerima webhook).
 */
export async function fetchVpsOrderByReff(reff, baseOverride = '', timeoutMs = 12000) {
  const base = vpsBase(baseOverride);
  const ref = String(reff || '').trim();
  if (!base || !ref) return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    // Utama: endpoint JSON (tanpa scraping HTML).
    try {
      const jsonUrl = `${base}/api/payment/order?ref=${encodeURIComponent(ref)}`;
      const jres = await fetch(jsonUrl, { signal: controller.signal, headers: { Accept: 'application/json' } });
      if (jres.ok) {
        const data = await jres.json().catch(() => null);
        if (data?.found && data?.serial) {
          return { serial: String(data.serial).trim().toUpperCase(), plan: data.plan || null, days: data.days ?? null };
        }
      }
    } catch { /* fallback ke HTML klaim */ }
    const url = `${base}${CLAIM_PATH}?ref=${encodeURIComponent(ref)}`;
    const res = await fetch(url, { signal: controller.signal, headers: { Accept: 'text/html' } });
    if (!res.ok) return null;
    return parseClaimHtml(await res.text());
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Ekstrak {serial, plan, days} dari HTML halaman klaim VPS.
 */
export function parseClaimHtml(html) {
  const src = String(html || '');
  const serialMatch = src.match(/<div class="serial">\s*([A-Z0-9-]+)\s*<\/div>/);
  if (!serialMatch) return null;
  const serial = serialMatch[1].trim().toUpperCase();
  if (!/^GMST-\d{4}-[A-Z2-9]{6}$/.test(serial)) return null;
  const planMatch = src.match(/paket\s*<b>\s*([a-z]+)\s*<\/b>\s*,\s*(\d+)\s*hari/);
  return {
    serial,
    plan: planMatch ? planMatch[1] : null,
    days: planMatch ? parseInt(planMatch[2], 10) : null
  };
}
