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

export const MAX_EXTRA_PAGES = 3;

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
  const cLower = String(city || '').toLowerCase();
  for (const cluster of REGION_CLUSTERS) {
    for (const c of cluster.cities) {
      if (c.name.toLowerCase() === cLower || cLower.includes(c.name.toLowerCase()) || c.name.toLowerCase().includes(cLower)) {
        return c.province || city;
      }
    }
  }
  return city;
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
    onLog(`\nMemproses Kota [${cIdx + 1}/${cityQueries.length}]: ${city} (${cityQueries[cIdx].queries.length} query)...`);
    const queries = cityQueries[cIdx].queries;
    const province = provinceForCity(city);

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
        for (const item of results) {
          const key = item.placeId || `${String(item.name || '').toLowerCase()}_${city.toLowerCase()}`;
          if (!seen.has(key)) {
            seen.add(key);
            const { nearestCampus, nearestOffice } = findNearestPOIs(city, item.lat, item.lng, item.address, query);
            const record = {
              ...item,
              category: item.category || keyword,
              city,
              province,
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
