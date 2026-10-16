/**
 * Scrape Runner — inti eksekusi rencana scraping, dipakai BERSAMA oleh:
 *  - server lokal (ENGINE_MODE=local)
 *  - endpoint VPS  (ENGINE_MODE=engine, POST /api/engine/run)
 *
 * File ini SENGAJA tidak mengimpor ./scraper.js secara statis.
 * fetchGoogleMapsPage di-load lazy agar paket klien (ENGINE_MODE=client)
 * dapat diedarkan TANPA file engine — hasil bedah tidak bisa scraping.
 */

import { findNearestPOIs } from './poi.js';
import { REGION_CLUSTERS } from './catalog.js';
import { buildRegionIndex, resolveRegion, regionFromAddress, regionCore, normWilayah } from './region.js';

export const MAX_EXTRA_PAGES = 2;

// Indeks wilayah (kota + kecamatan -> kota/provinsi induk) dibangun sekali.
const REGION_INDEX = buildRegionIndex(REGION_CLUSTERS.flatMap((cl) => cl.cities));

let cachedFetchPage = null;
async function defaultFetchPage(query, offset) {
  if (!cachedFetchPage) {
    try {
      const mod = await import('./scraper.js');
      cachedFetchPage = mod.fetchGoogleMapsPage;
    } catch {
      throw Object.assign(
        new Error('Modul engine scraping tidak tersedia di instalasi ini. Gunakan versi resmi / koneksi VPS.'),
        { status: 503, code: 'ENGINE_MISSING' }
      );
    }
  }
  return cachedFetchPage(query, offset);
}

export function provinceForCity(city) {
  // Hanya kembalikan provinsi bila benar-benar dikenali; jangan pakai input
  // mentah (dulu bisa muncul "provinsi bojonggede").
  return resolveRegion(city, REGION_INDEX).province || '';
}

/**
 * Eksekusi rencana scraping.
 * @param {object} plan { keyword, cityQueries:[{city, queries}], depth }
 * @param {object} ctx {
 *   fetchPage(query, offset) -> array, default lazy engine,
 *   dataset: array (akumulator, unshift),
 *   seen: Set (dedup),
 *   onLog(text), onProgress(percent, statusText, totalRecords), onBatch(items),
 *   shouldAbort() -> bool,
 *   maxExtraPages = 2, baseDelayMs
 * }
 * @returns {Promise<{newRecords:array, pagesDone:number, aborted:boolean}>}
 */
export async function executeScrapePlan(plan, ctx) {
  const { keyword, cityQueries, depth } = plan;
  const {
    fetchPage = defaultFetchPage,
    dataset,
    seen,
    onLog = () => {},
    onProgress = () => {},
    onBatch = () => {},
    shouldAbort = () => false,
    maxExtraPages = MAX_EXTRA_PAGES,
    baseDelayMs = 500 + Math.max(1, depth) * 120
  } = ctx;

  if (!Array.isArray(dataset) || !(seen instanceof Set)) {
    throw new Error('Runner butuh ctx.dataset (array) & ctx.seen (Set).');
  }

  let pagesDone = 0;
  let totalPagesPlanned = cityQueries.reduce((a, c) => a + c.queries.length * Math.max(1, depth), 0) || 1;
  const newRecords = [];

  onLog(`Memulai job scraping mendalam: "${keyword}" untuk ${cityQueries.length} wilayah, ${cityQueries.reduce((a, c) => a + c.queries.length, 0)} query, kedalaman ${depth}.`);

  for (let cIdx = 0; cIdx < cityQueries.length; cIdx++) {
    if (shouldAbort()) {
      onLog('Scraping dihentikan atas permintaan pengguna.');
      break;
    }
    const city = cityQueries[cIdx].city;
    const intended = resolveRegion(city, REGION_INDEX);
    const cityLabel = intended.city || city;
    const provinceLabel = intended.province || '';
    const resolvedTxt = (intended.city && intended.city.toLowerCase() !== city.toLowerCase()) ? ` → ${intended.city}${provinceLabel ? ', ' + provinceLabel : ''}` : '';
    onLog(`\nMemproses Kota [${cIdx + 1}/${cityQueries.length}]: ${city}${resolvedTxt} (${cityQueries[cIdx].queries.length} query)...`);
    const queries = cityQueries[cIdx].queries;
    // Wilayah efektif penyaringan. Bila input tak dikenali (mis. kecamatan
    // yang tak ada di katalog), ditentukan dari wilayah mayoritas hasil
    // (mengikuti Google Maps) pada halaman pertama.
    let inferredProvince = provinceLabel;
    let inferredCityCore = intended.city ? regionCore(intended.city) : '';

    for (const query of queries) {
      if (shouldAbort()) break;
      const percent = Math.min(98, Math.round((pagesDone / totalPagesPlanned) * 100));
      onProgress(percent, `Query: "${query}"`, dataset.length);

      let page = 0;
      for (;;) {
        if (shouldAbort()) break;
        const isExtra = page >= depth;
        if (page >= depth + maxExtraPages) break;
        const offset = page * 20;

        const results = await fetchPage(query, offset);
        pagesDone++;

        if (!Array.isArray(results) || results.length === 0) break;

        const newBatch = [];
        // Inferensi wilayah dari hasil (bila input tak dikenali / kecamatan
        // tak ada di katalog): mayoritas provinsi & kota/kabupaten dari alamat.
        if (!inferredCityCore) {
          const votes = {};
          for (const it of results) {
            const ck = regionCore(regionFromAddress(it.address).city);
            if (ck) votes[ck] = (votes[ck] || 0) + 1;
          }
          const ranked = Object.entries(votes).sort((a, b) => b[1] - a[1]);
          const total = ranked.reduce((a, [, n]) => a + n, 0);
          if (ranked[0] && total >= 3 && ranked[0][1] / total >= 0.4) inferredCityCore = ranked[0][0];
        }
        if (!inferredProvince) {
          const votes = {};
          for (const it of results) {
            const p = regionFromAddress(it.address).province;
            if (p) votes[p] = (votes[p] || 0) + 1;
          }
          const ranked = Object.entries(votes).sort((a, b) => b[1] - a[1]);
          const total = ranked.reduce((a, [, n]) => a + n, 0);
          if (ranked[0] && total >= 3 && ranked[0][1] / total >= 0.4) inferredProvince = ranked[0][0];
        }
        const targetCityCore = intended.city ? regionCore(intended.city) : inferredCityCore;
        const targetProvince = provinceLabel || inferredProvince;
        for (const item of results) {
          const geo = regionFromAddress(item.address);
          // Bila nama wilayah yang dicari muncul di alamat, hasil jelas relevan.
          const inDistrict = Boolean(intended.district && normWilayah(item.address).includes(normWilayah(intended.district)));
          if (!inDistrict) {
            // Buang hasil di provinsi lain.
            if (targetProvince && geo.province && normWilayah(geo.province) !== normWilayah(targetProvince)) continue;
            // Buang hasil di kota/kabupaten lain (mis. cari Bojonggede -> Bekasi).
            if (targetCityCore && geo.city && regionCore(geo.city) !== targetCityCore) continue;
          }
          const key = item.placeId || `${String(item.name || '').toLowerCase()}_${city.toLowerCase()}`;
          if (!seen.has(key)) {
            seen.add(key);
            const { nearestCampus, nearestOffice } = findNearestPOIs(cityLabel, item.lat, item.lng, item.address, query);
            const record = {
              ...item,
              category: item.category || keyword,
              // Provinsi/kota/kecamatan mengikuti hasil Google Maps.
              city: geo.city || cityLabel,
              province: geo.province || targetProvince || '',
              district: geo.district || intended.district || '',
              nearestCampus,
              nearestOffice
            };
            newBatch.push(record);
            dataset.unshift(record);
            newRecords.push(record);
          }
        }

        if (newBatch.length > 0) onBatch(newBatch);

        if (results.length < 20) break;
        page++;
        if (page >= depth + maxExtraPages) break;
        if (page === depth) {
          totalPagesPlanned += 1;
          onLog(`  ... sapuan lanjutan untuk "${query}" (hasil masih penuh).`);
        } else if (isExtra) {
          totalPagesPlanned += 1;
        }
        await new Promise((r) => setTimeout(r, baseDelayMs + Math.floor(Math.random() * 400)));
      }
    }
  }

  return { newRecords, pagesDone, aborted: shouldAbort() };
}
