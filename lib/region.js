/**
 * Resolusi wilayah Indonesia.
 *
 * Masalah yang diperbaiki: user kadang hanya mengetik kecamatan/desa
 * (mis. "Bojonggede"). Tanpa resolusi, engine menganggapnya sebuah kota,
 * query tak ter-anchor, dan SEMUA hasil dilabeli city/provinsi = input
 * (malah muncul "provinsi bojonggede" walau alamat di Bekasi).
 *
 * Modul ini: kenali kota/kabupaten/provinsi, petakan kecamatan -> kota +
 * provinsi induk, dan baca kota/provinsi ASLI dari alamat hasil supaya
 * lead yang lintas wilayah bisa disaring.
 */

export const PROVINCES = [
  'Aceh', 'Sumatera Utara', 'Sumatera Barat', 'Riau', 'Kepulauan Riau', 'Jambi',
  'Bengkulu', 'Sumatera Selatan', 'Kepulauan Bangka Belitung', 'Lampung',
  'Banten', 'DKI Jakarta', 'Jawa Barat', 'Jawa Tengah', 'DI Yogyakarta', 'Jawa Timur',
  'Bali', 'Nusa Tenggara Barat', 'Nusa Tenggara Timur',
  'Kalimantan Barat', 'Kalimantan Tengah', 'Kalimantan Selatan', 'Kalimantan Timur', 'Kalimantan Utara',
  'Sulawesi Utara', 'Gorontalo', 'Sulawesi Tengah', 'Sulawesi Barat', 'Sulawesi Selatan', 'Sulawesi Tenggara',
  'Maluku', 'Maluku Utara', 'Papua', 'Papua Barat', 'Papua Selatan', 'Papua Tengah', 'Papua Pegunungan', 'Papua Barat Daya'
];

const PROVINCE_ALIASES = {
  'jakarta': 'DKI Jakarta',
  'daerah khusus ibukota jakarta': 'DKI Jakarta',
  'dki jakarta': 'DKI Jakarta',
  'yogyakarta': 'DI Yogyakarta',
  'jogja': 'DI Yogyakarta',
  'daerah istimewa yogyakarta': 'DI Yogyakarta',
  'di yogyakarta': 'DI Yogyakarta',
  'bangka belitung': 'Kepulauan Bangka Belitung',
  'kepulauan bangka belitung': 'Kepulauan Bangka Belitung',
  'ntb': 'Nusa Tenggara Barat',
  'ntt': 'Nusa Tenggara Timur',
  'jawa barat': 'Jawa Barat',
  'jawa tengah': 'Jawa Tengah',
  'jawa timur': 'Jawa Timur',
  'kalimantan timur': 'Kalimantan Timur',
  'kalimantan selatan': 'Kalimantan Selatan',
  'kalimantan barat': 'Kalimantan Barat',
  'sulawesi selatan': 'Sulawesi Selatan',
  'sumatera utara': 'Sumatera Utara'
};

const PROVINCE_LOOKUP = (() => {
  const m = new Map();
  for (const p of PROVINCES) m.set(normWilayah(p), p);
  for (const [alias, p] of Object.entries(PROVINCE_ALIASES)) {
    const k = normWilayah(alias);
    if (!m.has(k)) m.set(k, p);
  }
  return m;
})();

/** Normalisasi untuk perbandingan: huruf kecil, tanpa tanda baca, spasi rapat. */
export function normWilayah(s) {
  return String(s || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Inti nama kota tanpa awalan administratif ("Kota"/"Kabupaten"). */
export function regionCore(s) {
  return normWilayah(s).replace(/^(kota|kabupaten|kab|kota adm|administrasi|municipality|city|regency)\s+/, '').trim();
}

/** Provinsi dari sebuah alamat lengkap (segmentasi koma, anti false-positive). */
export function provinceFromAddress(address) {
  const raw = String(address || '');
  if (!raw) return '';
  const segments = raw.split(',').map((s) => normWilayah(String(s).replace(/\b\d{4,6}\b/g, ' ')));
  // 1) segment persis nama provinsi
  for (const seg of segments) {
    const hit = PROVINCE_LOOKUP.get(seg);
    if (hit) return hit;
  }
  // 2) segment yang diawali/diakhiri nama provinsi (mis. "jawa barat" di akhir)
  for (const seg of segments) {
    for (const [key, prov] of PROVINCE_LOOKUP) {
      if (key.length < 5) continue; // hindari "bali"/"riau" menempel di kata lain
      if (seg === key || seg.startsWith(key + ' ') || seg.endsWith(' ' + key)) return prov;
    }
  }
  return '';
}

/** Rapikan label hasil parsing (buang tanda baca/spasi di ujung). */
function tidy(s) {
  return String(s || '').replace(/[.,;:\s]+$/, '').replace(/\s+/g, ' ').trim();
}

/** Kota/Kabupaten dari alamat lengkap ("Kota Bandung", "Kabupaten Bogor"). */
export function cityFromAddress(address) {
  const a = String(address || '');
  if (!a) return '';
  let m = a.match(/\b(Kota|Kabupaten|Kab\.?)\s+([A-Za-zÀ-ÿ.' -]+?)(?:,|\s+\d{4,6}|\s*$)/i);
  if (m) {
    const label = /^kab/i.test(m[1]) ? 'Kabupaten' : 'Kota';
    return tidy(`${label} ${m[2]}`);
  }
  m = a.match(/([A-Za-zÀ-ÿ.' -]+?)\s+(City|Regency|Municipality)\b/i);
  if (m) return tidy(`${m[1]} ${m[2]}`);
  return '';
}

/** Kecamatan dari alamat lengkap ("Kec. Coblong", "Kecamatan Cimenyan"). */
export function districtFromAddress(address) {
  const a = String(address || '');
  if (!a) return '';
  const m = a.match(/\b(Kecamatan|Kec\.?|Kelurahan|Kel\.?|Desa)\s+([A-Za-zÀ-ÿ.' -]+?)(?:,|\s+\d{4,6}|\s*$)/i);
  if (!m) return '';
  return tidy(m[2]);
}

/** Wilayah asli dari alamat (mengikuti tampilan Google Maps). */
export function regionFromAddress(address) {
  return { province: provinceFromAddress(address), city: cityFromAddress(address), district: districtFromAddress(address) };
}

/**
 * Indeks pencarian wilayah.
 * @param {Array<{name:string, province:string, subDistricts?:string[]}>} cities
 */
export function buildRegionIndex(cities) {
  const list = [];
  const byCity = new Map();
  const subs = new Map();
  for (const c of cities || []) {
    if (!c || !c.name) continue;
    const entry = { name: c.name, province: c.province || '', subDistricts: Array.isArray(c.subDistricts) ? c.subDistricts.filter(Boolean) : [] };
    list.push({ norm: normWilayah(c.name), core: regionCore(c.name), ...entry });
    const ck = regionCore(c.name);
    if (ck && !byCity.has(ck)) byCity.set(ck, entry);
    for (const s of entry.subDistricts) {
      const k = normWilayah(s);
      if (k.length >= 3 && !subs.has(k)) subs.set(k, { city: c.name, province: entry.province });
    }
  }
  return { list, byCity, subs };
}

/**
 * Petakan input user menjadi wilayah.
 * @returns {{input:string, district:string, city:string, province:string,
 *   cityEntry:object|null, known:boolean, provinceOnly:boolean}}
 */
export function resolveRegion(input, index) {
  const raw = String(input || '').trim();
  const n = normWilayah(raw);
  const empty = { input: raw, district: '', city: '', province: '', cityEntry: null, known: false, provinceOnly: false };
  if (!n) return empty;

  // 1) Kota/Kabupaten (persis atau saling-mengandung)
  if (index) {
    for (const c of index.list) {
      if (c.norm === n || n.includes(c.norm) || c.norm.includes(n)) {
        return { input: raw, district: '', city: c.name, province: c.province, cityEntry: index.byCity.get(c.core) || null, known: true, provinceOnly: false };
      }
    }
    // 2) Kecamatan/desa dari katalog -> kota + provinsi induk
    const direct = index.subs.get(n);
    if (direct) {
      return { input: raw, district: raw, city: direct.city, province: direct.province, cityEntry: index.byCity.get(regionCore(direct.city)) || null, known: true, provinceOnly: false };
    }
    for (const [k, v] of index.subs) {
      if (k.length >= 4 && (n.includes(k) || k.includes(n))) {
        return { input: raw, district: raw, city: v.city, province: v.province, cityEntry: index.byCity.get(regionCore(v.city)) || null, known: true, provinceOnly: false };
      }
    }
  }

  // 3) Provinsi saja
  const prov = PROVINCE_LOOKUP.get(n) || provinceFromAddress(raw);
  if (prov) return { input: raw, district: '', city: '', province: prov, cityEntry: null, known: true, provinceOnly: true };

  // 4) Tak dikenali: perlakukan sebagai teks bebas (jangan paksa jadi provinsi)
  return { input: raw, district: '', city: '', province: '', cityEntry: null, known: false, provinceOnly: false };
}
