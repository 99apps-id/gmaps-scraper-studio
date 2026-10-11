/**
 * Excel Exporter Module menggunakan ExcelJS
 * Menyusun data terurut: Jenis Usaha -> Wilayah -> Kota -> Nama Usaha
 * Dilengkapi kolom: Kampus Terdekat & Kawasan Perkantoran Terdekat
 */

import ExcelJS from 'exceljs';

const HEADER_FILL = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FF1E293B' } // Dark Navy / Slate
};

const HEADER_FONT = {
  name: 'Calibri',
  size: 11,
  bold: true,
  color: { argb: 'FFFFFFFF' }
};

const BORDER_STYLE = {
  top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
  left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
  bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
  right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
};

const COLUMNS = [
  { header: 'No', key: 'no', width: 6 },
  { header: 'Jenis Usaha', key: 'category', width: 22 },
  { header: 'Wilayah (Provinsi)', key: 'province', width: 20 },
  { header: 'Kota / Kabupaten', key: 'city', width: 18 },
  { header: 'Nama Usaha', key: 'name', width: 36 },
  { header: 'Nomor Telepon', key: 'phone', width: 20 },
  { header: 'Alamat Lengkap', key: 'address', width: 55 },
  { header: 'Kampus Terdekat', key: 'nearestCampus', width: 38 },
  { header: 'Kawasan Perkantoran Terdekat', key: 'nearestOffice', width: 40 },
  { header: 'Rating', key: 'rating', width: 10 },
  { header: 'Jumlah Ulasan', key: 'reviewsCount', width: 14 },
  { header: 'Website', key: 'website', width: 30 },
  { header: 'Link Google Maps', key: 'mapsUrl', width: 45 },
  { header: 'Koordinat', key: 'coordinates', width: 24 }
];

function sanitizeSheetName(name, usedNames) {
  let safe = String(name || 'Lainnya').replace(/[:\\/?*[\]]/g, '-').trim().slice(0, 31) || 'Sheet';
  if (!usedNames.has(safe)) return safe;
  // Dedup: append suffix while keeping <= 31 chars
  for (let i = 2; i < 100; i++) {
    const suffix = ` (${i})`;
    const candidate = (safe.slice(0, 31 - suffix.length) + suffix);
    if (!usedNames.has(candidate)) return candidate;
  }
  return safe;
}

function applyTableStyling(worksheet, rowCount) {
  // Style Header Row
  const headerRow = worksheet.getRow(1);
  headerRow.height = 28;
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
  headerRow.eachCell((cell) => {
    cell.fill = HEADER_FILL;
    cell.font = HEADER_FONT;
    cell.border = BORDER_STYLE;
  });

  // Freeze header row
  worksheet.views = [{ state: 'frozen', ySplit: 1 }];

  // Enable Auto Filter
  worksheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: COLUMNS.length }
  };

  // Style Data Rows
  for (let r = 2; r <= rowCount + 1; r++) {
    const row = worksheet.getRow(r);
    row.height = 22;
    const isEven = r % 2 === 0;

    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      cell.border = BORDER_STYLE;
      cell.font = { name: 'Calibri', size: 10 };
      if (isEven) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF8FAFC' } // Slate ultra-light
        };
      }

      // Column alignments
      // col 1: No, col 10: Rating, col 11: Reviews
      if (colNumber === 1 || colNumber === 10 || colNumber === 11) {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      } else if (colNumber === 6) {
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
        cell.numFmt = '@'; // Force text format untuk nomor telepon
      } else {
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
      }
    });
  }
}

/**
 * Menyusun data ke dalam Excel Workbook dengan multi-sheet dan sorting hierarkis
 */
export async function exportToExcel(records, outputPath) {
  // Sorting hierarkis:
  // 1. Jenis Usaha (category) ASC
  // 2. Wilayah / Provinsi (province) ASC
  // 3. Kota (city) ASC
  // 4. Nama Usaha (name) ASC
  const sortedRecords = [...records].sort((a, b) => {
    const catComp = (a.category || '').localeCompare(b.category || '', 'id');
    if (catComp !== 0) return catComp;

    const provComp = (a.province || '').localeCompare(b.province || '', 'id');
    if (provComp !== 0) return provComp;

    const cityComp = (a.city || '').localeCompare(b.city || '', 'id');
    if (cityComp !== 0) return cityComp;

    return (a.name || '').localeCompare(b.name || '', 'id');
  });

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Termixgo Google Maps Scraper';
  workbook.created = new Date();

  // 1. MASTER SHEET (Semua Data Terurut)
  const masterSheet = workbook.addWorksheet('Semua Data (Master)');
  masterSheet.columns = COLUMNS;

  sortedRecords.forEach((item, idx) => {
    masterSheet.addRow({
      no: idx + 1,
      category: item.category || 'Kost',
      province: item.province || '',
      city: item.city || '',
      name: item.name || '',
      phone: item.phone || '',
      address: item.address || '',
      nearestCampus: item.nearestCampus || '-',
      nearestOffice: item.nearestOffice || '-',
      rating: item.rating !== null ? item.rating : '',
      reviewsCount: item.reviewsCount || 0,
      website: item.website || '',
      mapsUrl: item.mapsUrl || '',
      coordinates: item.lat && item.lng ? `${item.lat}, ${item.lng}` : ''
    });
  });

  applyTableStyling(masterSheet, sortedRecords.length);

  // 2. PER-CITY SHEETS
  const cities = [...new Set(sortedRecords.map(r => r.city).filter(Boolean))];
  const usedSheetNames = new Set(['Semua Data (Master)']);
  for (const city of cities) {
    const cityRecords = sortedRecords.filter(r => r.city === city);
    const safeSheetName = sanitizeSheetName(city, usedSheetNames);
    usedSheetNames.add(safeSheetName);
    const citySheet = workbook.addWorksheet(safeSheetName);
    citySheet.columns = COLUMNS;

    cityRecords.forEach((item, idx) => {
      citySheet.addRow({
        no: idx + 1,
        category: item.category || 'Kost',
        province: item.province || '',
        city: item.city || '',
        name: item.name || '',
        phone: item.phone || '',
        address: item.address || '',
        nearestCampus: item.nearestCampus || '-',
        nearestOffice: item.nearestOffice || '-',
        rating: item.rating !== null ? item.rating : '',
        reviewsCount: item.reviewsCount || 0,
        website: item.website || '',
        mapsUrl: item.mapsUrl || '',
        coordinates: item.lat && item.lng ? `${item.lat}, ${item.lng}` : ''
      });
    });

    applyTableStyling(citySheet, cityRecords.length);
  }

  // 3. STATISTICAL SUMMARY SHEET
  const summarySheet = workbook.addWorksheet('Ringkasan & Statistik');
  summarySheet.columns = [
    { header: 'No', key: 'no', width: 6 },
    { header: 'Kota / Wilayah', key: 'city', width: 22 },
    { header: 'Provinsi', key: 'province', width: 22 },
    { header: 'Total Kost Terdata', key: 'total', width: 20 },
    { header: 'Memiliki Nomor Telepon', key: 'withPhone', width: 24 },
    { header: 'Persentase Kontak (%)', key: 'phonePct', width: 22 },
    { header: 'Rata-rata Rating', key: 'avgRating', width: 18 }
  ];

  let summaryRowIdx = 1;
  let grandTotal = 0;
  let grandPhone = 0;

  for (const city of cities) {
    const cityRecords = sortedRecords.filter(r => r.city === city);
    const withPhoneCount = cityRecords.filter(r => Boolean(r.phone)).length;
    const ratings = cityRecords.map(r => r.rating).filter(r => typeof r === 'number' && r > 0);
    const avgRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2) : '-';
    const province = cityRecords[0]?.province || '';

    grandTotal += cityRecords.length;
    grandPhone += withPhoneCount;

    summarySheet.addRow({
      no: summaryRowIdx++,
      city,
      province,
      total: cityRecords.length,
      withPhone: withPhoneCount,
      phonePct: cityRecords.length > 0 ? `${((withPhoneCount / cityRecords.length) * 100).toFixed(1)}%` : '0%',
      avgRating
    });
  }

  // Grand Total Row
  const totalRow = summarySheet.addRow({
    no: '',
    city: 'TOTAL KESELURUHAN',
    province: '',
    total: grandTotal,
    withPhone: grandPhone,
    phonePct: grandTotal > 0 ? `${((grandPhone / grandTotal) * 100).toFixed(1)}%` : '0%',
    avgRating: ''
  });
  totalRow.font = { bold: true };

  applyTableStyling(summarySheet, cities.length + 1);

  let finalPath = outputPath;
  try {
    await workbook.xlsx.writeFile(finalPath);
  } catch (err) {
    if (err.code === 'EBUSY' || String(err.message).includes('busy') || String(err.message).includes('locked')) {
      finalPath = outputPath.replace(/\.xlsx$/i, '_Terbaru.xlsx');
      console.warn(`\n[Info File Lock] File ${outputPath} sedang dibuka di Excel. Menyimpan ke: ${finalPath}`);
      await workbook.xlsx.writeFile(finalPath);
    } else {
      throw err;
    }
  }

  return {
    totalRecords: sortedRecords.length,
    citiesCount: cities.length,
    outputPath: finalPath
  };
}
