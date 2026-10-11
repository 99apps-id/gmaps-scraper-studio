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
 *   SINGAPAY_CLIENT_SECRET  client secret dashboard (wajib; tanpa ini
 *                           webhook ditolak fail-closed)
 *   PAYMENT_STORE_FILE      licenses store (default ./licenses.json)
 *   PAYMENT_ORDERS_FILE     catatan order idempoten (default ./payments.json)
 */

import fs from 'fs';
import crypto from 'crypto';
import { generateSerial } from './license.js';
import { licenseSecret } from './license.js';

export const WEBHOOK_PATH = '/api/payment/singapay';
export const CLAIM_PATH = '/api/payment/claim';

// url = Payment Link Singapay (hosted checkout). Nominal di sini HARUS sama
// persis dengan nominal yang dikunci di dashboard Singapay, karena webhook
// memetakan trx.amount -> plan (lihat planForAmount).
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

/** Format rupiah tanpa desimal: 15000 -> "Rp15.000" */
export function formatRupiah(value) {
  const n = Number(value) || 0;
  return 'Rp' + n.toLocaleString('id-ID');
}

/** Opsi pembayaran untuk UI (urut dari yang paling hemat). */
export function paymentOptions() {
  return ['mingguan', 'harian'].map((id) => {
    const p = PLANS[id];
    return {
      id,
      label: p.label,
      shortLabel: p.shortLabel,
      amount: p.amount,
      amountLabel: formatRupiah(p.amount),
      days: p.days,
      url: p.url
    };
  });
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
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
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
  upsertLicenseEntry(store, { serial, plan: plan.id, days: plan.days, source: 'singapay', reff_no: reffNo });
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
        days: Number.isFinite(e.days) ? e.days : null
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
  const obj = { serial: needle, plan: entry.plan || null, days: entry.days ?? null, source: entry.source || 'manual', reff_no: entry.reff_no || null };
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
