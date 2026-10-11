/**
 * Google Maps Business Intelligence Dashboard Frontend
 * Hallmark-grade interaction design, live SSE telemetry, and analytics
 */

// Helper rendering clean SVG icons for sectors
function getSectorSvg(iconName) {
  const icons = {
    'laptop': '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="2" y1="20" x2="22" y2="20"/></svg>',
    'shopping-cart': '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
    'hammer': '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
    'map-pin': '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    'building': '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" y1="22" x2="9" y2="22.01"/><line x1="15" y1="22" x2="15" y2="22.01"/><line x1="9" y1="18" x2="9" y2="18.01"/><line x1="15" y1="18" x2="15" y2="18.01"/><line x1="9" y1="14" x2="9" y2="14.01"/><line x1="15" y1="14" x2="15" y2="14.01"/></svg>',
    'coffee': '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>',
    'activity': '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
    'truck': '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
    'briefcase': '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
    'file-text': '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
    'smile': '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>',
    'camera': '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>'
  };
  return icons[iconName] || '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>';
}

// State
let allRecords = [];
let filteredRecords = [];
let catalogData = { sectors: [], regions: [] };
let currentPage = 1;
const pageSize = 40;
let currentSort = { column: 'name', asc: true };
let eventSource = null;
let isScraping = false;

// Selected chips in Studio (WAJIB memakai nama persis seperti di katalog,
// sonst pilihan tak terlihat tapi tetap terkirim = "kota phantom")
let selectedCategoryKeywords = 'kost';
let selectedCategoryVariants = ['kost', 'kosan', 'rumah pondokan', 'kost eksklusif'];
let selectedCitiesSet = new Set(['Jakarta Selatan', 'Bandung', 'Yogyakarta', 'Solo', 'Surabaya', 'Semarang', 'Medan']);

// Nama kota yang benar-benar ada di katalog (diisi saat katalog dimuat)
let knownCityNames = new Set();

function syncKnownCities() {
  knownCityNames = new Set();
  if (catalogData.regions) {
    for (const cluster of catalogData.regions) {
      for (const c of cluster.cities) knownCityNames.add(c.name);
    }
  }
  // Buang entri phantom (nama yang tidak ada di katalog) dari pilihan
  let dropped = 0;
  for (const n of Array.from(selectedCitiesSet)) {
    if (!knownCityNames.has(n)) {
      selectedCitiesSet.delete(n);
      dropped++;
    }
  }
  // Sinkronkan tampilan pill dengan set yang sudah bersih
  if (dropped > 0 && clusterContainer) {
    clusterContainer.querySelectorAll('.city-pill').forEach(pill => {
      pill.classList.toggle('selected', selectedCitiesSet.has(pill.dataset.cityName));
    });
  }
}

// DOM Elements
const kpiTotal = document.getElementById('kpiTotal');
const kpiPhone = document.getElementById('kpiPhone');
const kpiPhonePct = document.getElementById('kpiPhonePct');
const kpiRating = document.getElementById('kpiRating');
const kpiCities = document.getElementById('kpiCities');
const kpiCitiesList = document.getElementById('kpiCitiesList');

const filterSearch = document.getElementById('filterSearch');
const filterCity = document.getElementById('filterCity');
const filterCategory = document.getElementById('filterCategory');
const filterPhoneOnly = document.getElementById('filterPhoneOnly');
const filterWaOnly = document.getElementById('filterWaOnly');
const filterRatingOnly = document.getElementById('filterRatingOnly');
const filterMatchCount = document.getElementById('filterMatchCount');
const btnExportFiltered = document.getElementById('btnExportFiltered');
const btnExportFilteredLabel = document.getElementById('btnExportFilteredLabel');
const menuExportFiltered = document.getElementById('menuExportFiltered');
const btnExportMenu = document.getElementById('btnExportMenu');
const dropdownMenu = document.getElementById('dropdownMenu');

const tableBody = document.getElementById('tableBody');
const paginationInfo = document.getElementById('paginationInfo');
const pageCurrent = document.getElementById('pageCurrent');
const btnPrevPage = document.getElementById('btnPrevPage');
const btnNextPage = document.getElementById('btnNextPage');
const btnReloadDataset = document.getElementById('btnReloadDataset');
const toastStack = document.getElementById('toastStack');

function showToast(message, kind = 'info') {
  if (!toastStack) {
    // Fallback when container missing (very old cached HTML)
    try { alert(message); } catch { /* ignore */ }
    return;
  }
  const el = document.createElement('div');
  el.className = `toast toast-${kind}`;
  el.setAttribute('role', 'status');
  el.textContent = message;
  toastStack.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 300);
  }, 3600);
  while (toastStack.children.length > 4) toastStack.firstChild.remove();
}

function safeHttpsUrl(raw) {
  if (!raw) return '';
  try {
    const u = new URL(String(raw), window.location.origin);
    if (u.protocol === 'https:' || u.protocol === 'http:') return u.href;
  } catch { /* invalid */ }
  return '';
}

// Suara notifikasi lembut berbasis Web Audio API (tanpa dependensi file audio eksternal)
function playCompletionSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.45);
  } catch { /* audio ditolak browser / muted */ }
}

// =========================================================================
// LICENSE (trial 3 hari + aktivasi serial)
// =========================================================================

let licenseState = null;
let licenseModalMode = 'onboard';
let cachedPaymentPlans = null;
let autoActivationTimer = null;
let checkoutStartedAt = null;

const licensePill = document.getElementById('licensePill');
const licenseDot = document.getElementById('licenseDot');
const licensePillText = document.getElementById('licensePillText');
const licenseModal = document.getElementById('licenseModal');
const licenseTitle = document.getElementById('licenseTitle');
const licenseDesc = document.getElementById('licenseDesc');
const licenseSerialInput = document.getElementById('licenseSerialInput');
const licenseError = document.getElementById('licenseError');
const btnActivateLicense = document.getElementById('btnActivateLicense');
const btnContinueTrial = document.getElementById('btnContinueTrial');
const btnContinueTrialText = document.getElementById('btnContinueTrialText');
const btnDeactivateLicense = document.getElementById('btnDeactivateLicense');
const licenseInstallId = document.getElementById('licenseInstallId');
const titlebarLicense = document.getElementById('titlebarLicense');

async function fetchLicenseStatus() {
  try {
    const res = await fetch('/api/license/status');
    if (!res.ok) throw new Error('status');
    licenseState = await res.json();
  } catch {
    licenseState = null;
  }
  renderLicense();
}

function renderLicense() {
  const lic = licenseState;
  if (!lic) {
    if (licensePillText) licensePillText.textContent = 'Lisensi?';
    applyLicenseGate(false);
    return;
  }
  if (licenseInstallId) licenseInstallId.textContent = lic.installId || '-';

  let label, dotClass;
  if (lic.activated) {
    label = `Aktif${lic.serialMasked ? ` (${lic.serialMasked})` : ''}`;
    dotClass = 'ok';
  } else if (lic.expired) {
    label = 'Trial habis';
    dotClass = 'bad';
  } else {
    label = `Trial: ${lic.daysLeft} hari`;
    dotClass = lic.daysLeft <= 2 ? 'warn' : 'ok';
  }
  if (licensePillText) licensePillText.textContent = label;
  if (licenseDot) licenseDot.className = `license-dot ${dotClass}`;
  if (titlebarLicense) titlebarLicense.textContent = label;

  applyLicenseGate(lic.blocked);

  // Modal: onboarding pertama kali, atau blokir saat kedaluwarsa
  if (!lic.onboarded) {
    openLicenseModal('onboard');
  } else if (lic.blocked) {
    openLicenseModal('expired');
  } else {
    closeLicenseModal();
  }
}

function applyLicenseGate(blocked) {
  const scrapeBtn = document.getElementById('btnRunScrape');
  const dlBtn = document.getElementById('btnExportFiltered');
  if (scrapeBtn) {
    scrapeBtn.disabled = blocked;
    scrapeBtn.title = blocked ? 'Masa trial habis — aktivasi untuk scraping' : '';
  }
  if (dlBtn) {
    dlBtn.disabled = blocked;
    dlBtn.title = blocked ? 'Masa trial habis — aktivasi untuk mengunduh' : '';
  }
}

function openLicenseModal(mode) {
  if (!licenseModal) return;
  licenseModalMode = mode;
  if (licenseError) licenseError.hidden = true;
  if (mode === 'expired') {
    licenseTitle.textContent = 'Masa Trial Telah Habis';
    licenseDesc.textContent = 'Scraping dan unduhan data (Excel/CSV/JSON) dikunci. Masukkan kode aktivasi untuk membuka kembali semua fitur.';
    btnContinueTrial.style.display = 'none';
  } else if (mode === 'status') {
    const lic = licenseState;
    licenseTitle.textContent = 'Status Lisensi';
    if (lic?.activated) {
      const planTxt = lic.plan ? ` (paket ${lic.plan})` : '';
      const expTxt = lic.expiresAt
        ? ` hingga ${new Date(lic.expiresAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`
        : ' permanen';
      licenseDesc.textContent = `Lisensi AKTIF${lic.serialMasked ? ` (${lic.serialMasked})` : ''}${planTxt}${expTxt}. Semua fitur terbuka.`;
    } else {
      licenseDesc.textContent = `Mode TRIAL — tersisa ${lic?.daysLeft ?? 7} hari (hingga ${lic?.trialEndsAt ? new Date(lic.trialEndsAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}). Setelah habis, scraping & unduhan dikunci sampai aktivasi.`;
    }
    btnContinueTrial.style.display = '';
    if (btnContinueTrialText) btnContinueTrialText.textContent = 'Tutup';
  } else {
    licenseTitle.textContent = 'Selamat Datang';
    licenseDesc.textContent = 'Masukkan kode aktivasi jika Anda sudah memilikinya, atau lanjutkan untuk memakai gratis selama 3 hari penuh.';
    btnContinueTrial.style.display = '';
    if (btnContinueTrialText) {
      const d = licenseState?.daysLeft ?? 7;
      btnContinueTrialText.textContent = `Lanjutkan gratis selama ${d} hari`;
    }
  }
  licenseModal.hidden = false;
  // Tombol nonaktifkan (setara logout) hanya relevan bila sudah aktivasi
  if (btnDeactivateLicense) {
    btnDeactivateLicense.hidden = !(mode === 'status' && licenseState?.activated);
  }
  // Kilau kartu setiap kali dibuka/diklik ulang — feedback walau modal sudah terbuka
  const card = licenseModal.querySelector('.license-card');
  if (card) {
    card.classList.remove('flash');
    void card.offsetWidth;
    card.classList.add('flash');
  }

  // Muat opsi paket pembayaran Singapay secara dinamis
  loadPaymentPlans();
}

async function loadPaymentPlans() {
  const container = document.getElementById('licensePlansGrid');
  if (!container) return;

  if (cachedPaymentPlans && cachedPaymentPlans.length > 0) {
    renderPaymentPlans(cachedPaymentPlans);
    return;
  }

  try {
    const res = await fetch('/api/payment/options');
    if (!res.ok) throw new Error('options fetch failed');
    const data = await res.json();
    if (Array.isArray(data.plans) && data.plans.length > 0) {
      cachedPaymentPlans = data.plans;
      renderPaymentPlans(cachedPaymentPlans);
    }
  } catch (err) {
    // Fallback paket default Singapay jika offline / endpoint lokal gagal
    const fallback = [
      { id: 'harian', label: 'Paket 1 Hari', shortLabel: '1 Hari', amountLabel: 'Rp15.000', days: 1, url: 'https://payment-link.singapay.id/b2b/PL202610111742326acb6818a083e' },
      { id: 'mingguan', label: 'Paket 7 Hari', shortLabel: '7 Hari', amountLabel: 'Rp50.000', days: 7, url: 'https://payment-link.singapay.id/b2b/PL202610111745086acb68b4360e7' }
    ];
    renderPaymentPlans(fallback);
  }
}

function renderPaymentPlans(plans) {
  const container = document.getElementById('licensePlansGrid');
  if (!container) return;

  // Urutkan: 1 hari Rp15.000, 7 hari Rp50.000
  const sorted = [...plans].sort((a, b) => (a.days || 0) - (b.days || 0));

  container.innerHTML = sorted.map((p) => {
    const isWeek = p.days >= 7;
    const badgeHtml = isWeek ? '<span class="license-plan-badge">Hemat</span>' : '';
    return `
      <div class="license-plan-card" data-url="${escapeHtml(p.url)}" role="button" tabindex="0" title="Beli ${escapeHtml(p.label)} (${escapeHtml(p.amountLabel)})">
        ${badgeHtml}
        <div class="license-plan-name">${escapeHtml(p.shortLabel || p.label)}</div>
        <div class="license-plan-price">${escapeHtml(p.amountLabel)}</div>
        <div class="license-plan-cta">
          <span>Beli Paket</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.license-plan-card').forEach((card) => {
    const handleOpen = () => {
      const url = card.dataset.url;
      if (!url) return;
      if (window.electronAPI && typeof window.electronAPI.openExternal === 'function') {
        window.electronAPI.openExternal(url);
      } else {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
      showToast('Halaman checkout Singapay dibuka. Aplikasi akan aktif otomatis setelah pembayaran selesai.', 'info');
      startAutoActivationPolling();
    };
    card.addEventListener('click', handleOpen);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleOpen();
      }
    });
  });
}

function startAutoActivationPolling() {
  checkoutStartedAt = new Date().toISOString();
  const statusBox = document.getElementById('licenseAutoStatus');
  const statusTxt = document.getElementById('licenseAutoStatusText');
  if (statusBox) statusBox.hidden = false;
  if (statusTxt) statusTxt.textContent = 'Menunggu pembayaran Singapay... (aplikasi aktif otomatis)';

  stopAutoActivationPolling();

  let attempts = 0;
  const maxAttempts = 100; // ~5 menit polling (setiap 3 detik)

  autoActivationTimer = setInterval(async () => {
    attempts++;
    if (attempts > maxAttempts || licenseState?.activated) {
      stopAutoActivationPolling();
      return;
    }

    try {
      const res = await fetch('/api/payment/auto-activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ since: checkoutStartedAt })
      });
      const data = await res.json();
      if (data.found && data.status) {
        licenseState = data.status;
        renderLicense();
        stopAutoActivationPolling();
        showToast(`Pembayaran Singapay terverifikasi! Lisensi (${data.plan || 'berbayar'}) aktif otomatis.`, 'success');
      }
    } catch {
      // lanjut polling berikutnya
    }
  }, 3000);
}

function stopAutoActivationPolling() {
  if (autoActivationTimer) {
    clearInterval(autoActivationTimer);
    autoActivationTimer = null;
  }
}

async function handleQuickReffActivation() {
  const input = document.getElementById('inputQuickReff');
  const btn = document.getElementById('btnVerifyQuickReff');
  const reff = (input?.value || '').trim();

  if (!reff) {
    showToast('Masukkan nomor referensi transaksi Singapay.', 'warn');
    return;
  }

  if (btn) btn.disabled = true;
  try {
    const res = await fetch('/api/payment/auto-activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reff })
    });
    const data = await res.json();
    if (!res.ok || !data.found) {
      throw new Error(data.message || data.error || 'Referensi belum ditemukan. Pastikan pembayaran sudah lunas.');
    }

    licenseState = data.status;
    renderLicense();
    if (input) input.value = '';
    stopAutoActivationPolling();
    showToast(`Sukses! Pembayaran diverifikasi dan lisensi paket ${data.plan || ''} telah aktif.`, 'success');
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    if (btn) btn.disabled = false;
  }
}

function closeLicenseModal() {
  if (licenseModal) licenseModal.hidden = true;
  stopAutoActivationPolling();
  const statusBox = document.getElementById('licenseAutoStatus');
  if (statusBox) statusBox.hidden = true;
}

async function handleActivate() {
  const serial = (licenseSerialInput?.value || '').trim();
  if (!serial) {
    showToast('Isi kode aktivasi terlebih dahulu.', 'warn');
    return;
  }
  btnActivateLicense.disabled = true;
  try {
    const res = await fetch('/api/license/activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serial })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Aktivasi gagal');
    licenseState = data.status || await (await fetch('/api/license/status')).json();
    if (licenseSerialInput) licenseSerialInput.value = '';
    renderLicense();
    showToast('Lisensi aktif. Semua fitur terbuka.', 'success');
  } catch (err) {
    if (licenseError) {
      licenseError.textContent = err.message;
      licenseError.hidden = false;
    } else {
      showToast(err.message, 'error');
    }
  } finally {
    btnActivateLicense.disabled = false;
  }
}

async function handleContinueTrial() {
  if (licenseModalMode === 'status') {
    closeLicenseModal(); // tombol berperan sebagai "Tutup" di mode status
    return;
  }
  try {
    const res = await fetch('/api/license/onboard', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
    if (res.ok) licenseState = await res.json().then(d => d.status).catch(() => licenseState);
    else await fetchLicenseStatus();
  } catch {
    await fetchLicenseStatus();
  }
  renderLicense();
  showToast(`Mode trial aktif — ${licenseState?.daysLeft ?? 7} hari tersisa.`, 'success');
}

function setupLicenseUI() {
  const btnQuickReff = document.getElementById('btnVerifyQuickReff');
  if (btnQuickReff) btnQuickReff.addEventListener('click', handleQuickReffActivation);
  const inputQuick = document.getElementById('inputQuickReff');
  if (inputQuick) inputQuick.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleQuickReffActivation();
  });

  if (btnActivateLicense) btnActivateLicense.addEventListener('click', handleActivate);
  if (licenseSerialInput) licenseSerialInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleActivate();
  });
  if (btnContinueTrial) btnContinueTrial.addEventListener('click', handleContinueTrial);
  if (btnDeactivateLicense) btnDeactivateLicense.addEventListener('click', async () => {
    if (!confirm('Nonaktifkan lisensi di perangkat ini? Kode yang sama bisa dipakai aktivasi ulang / di perangkat lain.')) return;
    try {
      const res = await fetch('/api/license/deactivate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Gagal menonaktifkan');
      licenseState = data.status || null;
      renderLicense();
      showToast('Lisensi perangkat dinonaktifkan.', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  });
  if (licensePill) licensePill.addEventListener('click', () => {
    if (licenseState?.blocked) {
      openLicenseModal('expired');
    } else if (licenseState?.onboarded) {
      openLicenseModal('status'); // klik pill = lihat sisa hari / status lisensi
    } else {
      openLicenseModal('onboard');
    }
  });
  const btnCopyId = document.getElementById('btnCopyInstallId');
  if (btnCopyId) btnCopyId.addEventListener('click', () => {
    if (licenseState?.installId) copyToClipboard(licenseState.installId, 'ID instalasi disalin!');
  });

  // Cegat unduhan "Semua ..." saat diblokir (link GET langsung)
  document.querySelectorAll('#dropdownMenu a[download]').forEach(a => {
    a.addEventListener('click', (e) => {
      if (licenseState?.blocked) {
        e.preventDefault();
        showToast('Masa trial habis — aktivasi untuk mengunduh data.', 'warn');
        openLicenseModal('expired');
      }
    });
  });

  // Electron frameless: tampilkan titlebar kustom + kontrol window
  if (window.electronAPI) {
    document.body.classList.add('electron');
    const tb = document.getElementById('appTitlebar');
    if (tb) tb.hidden = false;
    const bind = (id, fn) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', fn);
    };
    bind('winMinimize', () => window.electronAPI.windowControl('minimize'));
    bind('winMaximize', () => window.electronAPI.windowControl('maximize'));
    bind('winClose', () => window.electronAPI.windowControl('close'));
  }
}

function licenseAllowsAction() {
  if (licenseState?.blocked) {
    showToast(licenseStopMessage(), 'warn');
    openLicenseModal('expired');
    return false;
  }
  return true;
}

// Pesan humanis untuk semua penghentian scraping terkait lisensi/serial.
function licenseStopMessage() {
  return 'Scraping berhenti: Tidak ada nomor serial aktif di mesin ini. Harap perpanjang lisensi Anda di menu Pengaturan → Lisensi.';
}

function isLicenseError(msg) {
  return /lisensi|trial|serial|aktivasi|LICENSE_REQUIRED|ENGINE_AUTH|ENGINE_REVOKED|ENGINE_NOT_LISTED|ENGINE_RATE_LIMIT|ENGINE_DISABLED|VPS engine/i.test(String(msg || ''));
}

function setupSettingsMenu() {
  const btnSettings = document.getElementById('btnSettingsMenu');
  const settingsMenu = document.getElementById('settingsMenu');
  const faqModal = document.getElementById('faqModal');
  const aboutModal = document.getElementById('aboutModal');

  if (btnSettings && settingsMenu) {
    btnSettings.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = settingsMenu.classList.toggle('show');
      btnSettings.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    settingsMenu.addEventListener('click', (e) => e.stopPropagation());
    document.addEventListener('click', () => {
      settingsMenu.classList.remove('show');
      btnSettings.setAttribute('aria-expanded', 'false');
    });
  }

  const openModal = (el) => { if (el) el.hidden = false; };
  const closeModal = (el) => { if (el) el.hidden = true; };

  const mLicense = document.getElementById('menuLicense');
  if (mLicense) mLicense.addEventListener('click', (e) => {
    e.preventDefault();
    if (licenseState?.blocked) openLicenseModal('expired');
    else if (licenseState?.onboarded) openLicenseModal('status');
    else openLicenseModal('onboard');
  });

  const mFaq = document.getElementById('menuFaq');
  if (mFaq) mFaq.addEventListener('click', (e) => { e.preventDefault(); openModal(faqModal); });
  const btnFaqClose = document.getElementById('btnFaqClose');
  if (btnFaqClose) btnFaqClose.addEventListener('click', () => closeModal(faqModal));
  if (faqModal) faqModal.addEventListener('click', (e) => { if (e.target === faqModal) closeModal(faqModal); });

  const mAbout = document.getElementById('menuAbout');
  if (mAbout) mAbout.addEventListener('click', (e) => {
    e.preventDefault();
    const aboutId = document.getElementById('aboutInstallId');
    const aboutLic = document.getElementById('aboutLicenseState');
    if (aboutId) aboutId.textContent = licenseState?.installId || '-';
    if (aboutLic) {
      aboutLic.textContent = !licenseState ? '-' :
        licenseState.activated ? `Aktif${licenseState.serialMasked ? ` (${licenseState.serialMasked})` : ''}` :
        licenseState.expired ? 'Trial habis' : `Trial ${licenseState.daysLeft} hari`;
    }
    openModal(aboutModal);
  });
  const btnAboutClose = document.getElementById('btnAboutClose');
  if (btnAboutClose) btnAboutClose.addEventListener('click', () => closeModal(aboutModal));
  if (aboutModal) aboutModal.addEventListener('click', (e) => { if (e.target === aboutModal) closeModal(aboutModal); });

  const mExit = document.getElementById('menuExit');
  if (mExit) mExit.addEventListener('click', (e) => {
    e.preventDefault();
    if (window.electronAPI) {
      window.electronAPI.windowControl('close');
    } else {
      showToast('Untuk keluar, cukup tutup tab atau jendela browser ini.', 'info');
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(faqModal);
      closeModal(aboutModal);
    }
  });
}

// Studio Form Elements
const studioForm = document.getElementById('studioForm');
const sectorContainer = document.getElementById('sectorContainer');
const clusterContainer = document.getElementById('clusterContainer');
const customKeywordInput = document.getElementById('customKeywordInput');
const customCitiesInput = document.getElementById('customCitiesInput');
const studioDepthSelect = document.getElementById('studioDepthSelect');
const studioProximityCheck = document.getElementById('studioProximityCheck');
const studioDeepMatrixCheck = document.getElementById('studioDeepMatrixCheck');
const btnRunScrape = document.getElementById('btnRunScrape');
const btnAbortScrape = document.getElementById('btnAbortScrape');
const scraperStateBadge = document.getElementById('scraperStateBadge');
const liveProgressBar = document.getElementById('liveProgressBar');
const liveProgressCounter = document.getElementById('liveProgressCounter');
const consoleLiveBox = document.getElementById('consoleLiveBox');
const btnSelectAllCities = document.getElementById('btnSelectAllCities');
const btnResetCities = document.getElementById('btnResetCities');
const scrapeVisual = document.getElementById('scrapeVisual');
const scrapeStatusLine = document.getElementById('scrapeStatusLine');
const scrapeSubLine = document.getElementById('scrapeSubLine');
const scrapePct = document.getElementById('scrapePct');
const liveProgressWrap = document.getElementById('liveProgressWrap');

// Drawer Elements
const drawerBackdrop = document.getElementById('drawerBackdrop');
const detailDrawer = document.getElementById('detailDrawer');
const btnDrawerClose = document.getElementById('btnDrawerClose');
const drawerCategory = document.getElementById('drawerCategory');
const drawerName = document.getElementById('drawerName');
const drawerCity = document.getElementById('drawerCity');
const drawerPhone = document.getElementById('drawerPhone');
const btnCopyPhone = document.getElementById('btnCopyPhone');
const btnOpenWA = document.getElementById('btnOpenWA');
const drawerAddress = document.getElementById('drawerAddress');
const drawerCoords = document.getElementById('drawerCoords');
const btnCopyCoords = document.getElementById('btnCopyCoords');
const drawerCampus = document.getElementById('drawerCampus');
const drawerOffice = document.getElementById('drawerOffice');
const drawerRating = document.getElementById('drawerRating');
const drawerReviews = document.getElementById('drawerReviews');
const drawerMapsLink = document.getElementById('drawerMapsLink');
const drawerWebLink = document.getElementById('drawerWebLink');

// =========================================================================
// INITIALIZATION
// =========================================================================

document.addEventListener('DOMContentLoaded', () => {
  setupTabs();
  setupEventListeners();
  setupLicenseUI();
  setupSettingsMenu();
  loadCatalog();
  loadDataset();
  fetchLicenseStatus();
  loadPaymentPlans();
  connectSSE();
});

// TABS SWITCHER
function setupTabs() {
  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.tab;
      document.querySelectorAll('.nav-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
        if (targetId === 'tab-analytics') {
          renderAnalyticsCharts();
        }
      }
    });
  });
}

// =========================================================================
// CATALOG LOADING & STUDIO RENDERING
// =========================================================================

async function loadCatalog() {
  try {
    const res = await fetch('/api/catalog');
    if (!res.ok) return;
    catalogData = await res.json();
    syncKnownCities();
    renderStudioCatalog();
  } catch (err) {
    console.warn('Gagal memuat catalog:', err);
  }
}

function renderStudioCatalog() {
  // 1. Render Sectors & Category Pills
  if (sectorContainer && catalogData.sectors) {
    let sectorHtml = '';
    catalogData.sectors.forEach(sec => {
      sectorHtml += `
        <div>
          <div class="sector-group-label" style="display: flex; align-items: center; gap: 0.4rem;">
            ${getSectorSvg(sec.iconName)}
            <span>${escapeHtml(sec.name)}</span>
          </div>
          <div class="pill-container">
            ${sec.categories.map(cat => {
              const isSelected = cat.id === 'kost';
              return `<span class="category-pill ${isSelected ? 'selected' : ''}" data-cat-id="${cat.id}" data-keywords="${escapeHtml(cat.keywords.join(', '))}">${escapeHtml(cat.label)}</span>`;
            }).join('')}
          </div>
        </div>
      `;
    });
    sectorContainer.innerHTML = sectorHtml;

    // Click Category Pill
    sectorContainer.querySelectorAll('.category-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        sectorContainer.querySelectorAll('.category-pill').forEach(p => p.classList.remove('selected'));
        pill.classList.add('selected');
        const allKw = pill.dataset.keywords.split(',').map(s => s.trim()).filter(Boolean);
        selectedCategoryKeywords = allKw[0] || 'kost';
        selectedCategoryVariants = allKw.slice(0, 4);
        customKeywordInput.value = selectedCategoryKeywords;
        updateScopeHint();
      });
    });
  }

  // 2. Render Region Clusters & City Pills
  if (clusterContainer && catalogData.regions) {
    let regionHtml = '';
    catalogData.regions.forEach(cluster => {
      regionHtml += `
        <div>
          <div style="font-size: 0.7rem; font-weight: 700; color: var(--ink-muted); text-transform: uppercase; margin-bottom: 0.3rem;">${escapeHtml(cluster.region)}</div>
          <div class="pill-container">
            ${cluster.cities.map(c => {
              const isSelected = selectedCitiesSet.has(c.name);
              return `<span class="city-pill ${isSelected ? 'selected' : ''}" data-city-name="${escapeHtml(c.name)}">${escapeHtml(c.name)}</span>`;
            }).join('')}
          </div>
        </div>
      `;
    });
    clusterContainer.innerHTML = regionHtml;

    // Click City Pill
    clusterContainer.querySelectorAll('.city-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const cName = pill.dataset.cityName;
        if (selectedCitiesSet.has(cName)) {
          selectedCitiesSet.delete(cName);
          pill.classList.remove('selected');
        } else {
          selectedCitiesSet.add(cName);
          pill.classList.add('selected');
        }
        updateScopeHint();
      });
    });
    updateScopeHint();
  }
}

// Estimate scrape scope client-side (mirrors server layering roughly)
// so users see coverage before running a deep job.
function updateScopeHint() {
  const hint = document.getElementById('scopeHint');
  if (!hint) return;
  const knownSelected = Array.from(selectedCitiesSet).filter(n => knownCityNames.size === 0 || knownCityNames.has(n));
  const nCities = knownSelected.length;
  if (nCities === 0) {
    hint.textContent = 'Pilih minimal 1 kota target.';
    return;
  }
  let subsTotal = 0;
  if (catalogData.regions) {
    for (const cluster of catalogData.regions) {
      for (const c of cluster.cities) {
        if (selectedCitiesSet.has(c.name)) subsTotal += (c.subDistricts || []).length;
      }
    }
  }
  const deepMatrix = document.getElementById('studioDeepMatrixCheck')?.checked;
  const depth = parseInt(document.getElementById('studioDepthSelect')?.value, 10) || 2;
  // Rough per-city query estimate: 4 base + 2x subs + 3 qualifier + ~6 segment/proximity + variants
  let perCity = 4 + subsTotal / Math.max(1, nCities) * 2 + 9 + (selectedCategoryVariants.length - 1) * 4;
  if (deepMatrix) perCity += (subsTotal / Math.max(1, nCities)) * 3 + 10;
  perCity = Math.min(60, Math.round(perCity));
  const totalQ = perCity * nCities;
  const cityNames = knownSelected.slice(0, 3).join(', ') + (nCities > 3 ? ` +${nCities - 3} lainnya` : '');
  hint.textContent = `Kota: ${cityNames} — estimasi ±${totalQ.toLocaleString('id-ID')} query × ${depth} halaman (~${(totalQ * depth * 20).toLocaleString('id-ID')} slot listing, sebelum dedup).`;
}

// =========================================================================
// DATASET LOADING & KPI
// =========================================================================

async function loadDataset() {
  try {
    const res = await fetch('/api/data');
    if (!res.ok) throw new Error('Gagal memuat dataset');
    const data = await res.json();
    allRecords = data.records || [];

    updateKPIs();
    populateExplorerDropdowns();
    applyFilters();
    document.title = `Google Maps Intelligence (${allRecords.length.toLocaleString('id-ID')} Listing) | Direktori Bisnis Indonesia`;
  } catch (err) {
    console.error('loadDataset error:', err);
    tableBody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: var(--accent-rose); padding: 3rem;">Gagal memuat data: ${err.message}</td></tr>`;
  }
}

function updateKPIs() {
  const total = allRecords.length;
  const withPhone = allRecords.filter(r => Boolean(r.phone)).length;
  const phonePct = total > 0 ? ((withPhone / total) * 100).toFixed(1) : 0;

  const validRatings = allRecords.map(r => r.rating).filter(r => typeof r === 'number' && r > 0);
  const avgRating = validRatings.length > 0 ? (validRatings.reduce((a, b) => a + b, 0) / validRatings.length).toFixed(2) : '0.0';

  const uniqueCities = [...new Set(allRecords.map(r => r.city).filter(Boolean))];

  kpiTotal.innerText = Number(total).toLocaleString('id-ID');
  kpiPhone.innerText = Number(withPhone).toLocaleString('id-ID');
  kpiPhonePct.innerText = `${phonePct}% memiliki nomor kontak`;
  kpiRating.innerText = avgRating;
  kpiCities.innerText = uniqueCities.length;
  kpiCitiesList.innerText = uniqueCities.slice(0, 4).join(', ') + (uniqueCities.length > 4 ? ` +${uniqueCities.length - 4}` : '');
}

function populateExplorerDropdowns() {
  const curCity = filterCity.value;
  const curCat = filterCategory.value;

  const cities = [...new Set(allRecords.map(r => r.city).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'id'));
  const categories = [...new Set(allRecords.map(r => r.category).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'id'));

  filterCity.innerHTML = '<option value="">Semua Kota / Wilayah</option>';
  cities.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.innerText = c;
    if (c === curCity) opt.selected = true;
    filterCity.appendChild(opt);
  });

  filterCategory.innerHTML = '<option value="">Semua Jenis Usaha</option>';
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.innerText = cat;
    if (cat === curCat) opt.selected = true;
    filterCategory.appendChild(opt);
  });
}

// =========================================================================
// TABLE FILTERING, SORTING, & PAGINATION
// =========================================================================

function applyFilters({ resetPage = true } = {}) {
  const query = (filterSearch.value || '').toLowerCase().trim();
  const selectedCity = filterCity.value;
  const selectedCat = filterCategory.value;
  const phoneOnly = filterPhoneOnly.checked;
  const waOnly = filterWaOnly ? filterWaOnly.checked : false;
  const ratingOnly = filterRatingOnly.checked;

  filteredRecords = allRecords.filter(item => {
    if (selectedCity && item.city !== selectedCity) return false;
    if (selectedCat && item.category !== selectedCat) return false;
    if (phoneOnly && !item.phone) return false;
    if (waOnly) {
      if (!item.phone) return false;
      const num = item.phone.replace(/[^0-9]/g, '');
      const isWa = num.startsWith('08') || num.startsWith('628');
      if (!isWa) return false;
    }
    if (ratingOnly && (typeof item.rating !== 'number' || item.rating < 4.5)) return false;

    if (query) {
      const match =
        (item.name || '').toLowerCase().includes(query) ||
        (item.address || '').toLowerCase().includes(query) ||
        (item.phone || '').toLowerCase().includes(query) ||
        (item.nearestCampus || '').toLowerCase().includes(query) ||
        (item.nearestOffice || '').toLowerCase().includes(query) ||
        (item.category || '').toLowerCase().includes(query);
      if (!match) return false;
    }

    return true;
  });

  // Sorting
  if (currentSort.column) {
    filteredRecords.sort((a, b) => {
      let valA = a[currentSort.column];
      let valB = b[currentSort.column];

      if (typeof valA === 'number' && typeof valB === 'number') {
        return currentSort.asc ? valA - valB : valB - valA;
      }
      valA = String(valA || '').toLowerCase();
      valB = String(valB || '').toLowerCase();
      return currentSort.asc ? valA.localeCompare(valB, 'id') : valB.localeCompare(valA, 'id');
    });
  }

  if (resetPage) currentPage = 1;
  filterMatchCount.innerText = filteredRecords.length.toLocaleString('id-ID');
  if (btnExportFilteredLabel) {
    btnExportFilteredLabel.innerText = `Unduh ${filteredRecords.length.toLocaleString('id-ID')} Hasil (.xlsx)`;
  }
  if (filteredRecords.length < allRecords.length && allRecords.length > 0) {
    document.title = `(${filteredRecords.length.toLocaleString('id-ID')}) Hasil Filter | Google Maps Intelligence`;
  } else if (allRecords.length > 0) {
    document.title = `Google Maps Intelligence (${allRecords.length.toLocaleString('id-ID')} Listing) | Direktori Bisnis Indonesia`;
  }
  renderTable();
}

function renderTable() {
  if (filteredRecords.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 3rem; color: var(--ink-muted);">Tidak ada listing bisnis yang cocok dengan filter.</td></tr>`;
    paginationInfo.innerText = 'Menampilkan 0 dari 0 listing';
    pageCurrent.innerText = '0';
    btnPrevPage.disabled = true;
    btnNextPage.disabled = true;
    return;
  }

  const totalPages = Math.ceil(filteredRecords.length / pageSize);
  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, filteredRecords.length);
  const pageItems = filteredRecords.slice(startIdx, endIdx);

  let html = '';
  pageItems.forEach((r, idx) => {
    const globalIdx = startIdx + idx + 1;

    // Telepon & WA badge
    let phoneHtml = `<span style="color: var(--ink-faint); font-size: 0.775rem;">(tidak ada)</span>`;
    if (r.phone) {
      let waNumber = r.phone.replace(/[^0-9]/g, '');
      if (waNumber.startsWith('0')) waNumber = '62' + waNumber.slice(1);
      const isMobile = waNumber.startsWith('628');

      phoneHtml = `
        <div style="display: flex; align-items: center; gap: 0.4rem;">
          <span class="phone-badge">${escapeHtml(r.phone)}</span>
          ${isMobile ? `<a href="https://wa.me/${waNumber}" target="_blank" rel="noopener" onclick="event.stopPropagation()" title="Chat WhatsApp" style="color: var(--accent-emerald); font-weight: 800; font-size: 0.725rem; text-decoration: none;">WA</a>` : ''}
        </div>
      `;
    }

    // Rating badge
    let ratingHtml = `<span class="tag tag-subtle">-</span>`;
    if (r.rating) {
      ratingHtml = `<span class="tag tag-amber">Rating ${r.rating} (${r.reviewsCount || 0})</span>`;
    }

    // Action button (sanitized: only http/https allowed, prevents javascript: XSS)
    const safeMaps = safeHttpsUrl(r.mapsUrl);
    const mapsLink = safeMaps
      ? `<a href="${safeMaps}" target="_blank" rel="noopener" onclick="event.stopPropagation()" class="tag tag-blue" style="text-decoration: none;">Buka Maps</a>`
      : '-';

    html += `
      <tr data-index="${startIdx + idx}">
        <td style="color: var(--ink-faint); text-align: center; font-variant-numeric: tabular-nums;">${globalIdx}</td>
        <td>
          <div style="font-weight: 700; color: var(--ink-primary); line-height: 1.25;">${escapeHtml(r.name)}</div>
          <div style="font-size: 0.725rem; color: var(--ink-muted); margin-top: 0.15rem;">${escapeHtml(r.city || '')} (${escapeHtml(r.province || '')})</div>
        </td>
        <td><span class="tag tag-subtle">${escapeHtml(r.category || 'Bisnis')}</span></td>
        <td>${phoneHtml}</td>
        <td style="max-width: 250px; font-size: 0.75rem; color: var(--ink-secondary); line-height: 1.35;">
          ${escapeHtml(r.address || '-')}
        </td>
        <td style="font-size: 0.75rem; color: var(--accent-blue); font-weight: 500;">
          ${escapeHtml(r.nearestCampus || '-')}
        </td>
        <td style="font-size: 0.75rem; color: var(--accent-emerald); font-weight: 500;">
          ${escapeHtml(r.nearestOffice || '-')}
        </td>
        <td>${ratingHtml}</td>
        <td style="white-space: nowrap;">${mapsLink}</td>
      </tr>
    `;
  });

  tableBody.innerHTML = html;
  paginationInfo.innerText = `Menampilkan ${startIdx + 1} - ${endIdx} dari ${filteredRecords.length.toLocaleString('id-ID')} listing`;
  pageCurrent.innerText = currentPage;
  btnPrevPage.disabled = currentPage <= 1;
  btnNextPage.disabled = currentPage >= totalPages;

  // Row click opens Drawer
  tableBody.querySelectorAll('tr').forEach(row => {
    row.addEventListener('click', () => {
      const rowIdx = parseInt(row.dataset.index, 10);
      if (!isNaN(rowIdx) && filteredRecords[rowIdx]) {
        openDetailDrawer(filteredRecords[rowIdx]);
      }
    });
  });
}

// =========================================================================
// DETAIL SLIDE-OVER DRAWER
// =========================================================================

function openDetailDrawer(item) {
  drawerCategory.innerText = item.category || 'Direktori';
  drawerName.innerText = item.name || '-';
  drawerCity.innerText = `${item.city || ''}, ${item.province || ''}`;

  drawerPhone.innerText = item.phone || '(Tidak tersedia nomor telepon)';
  if (item.phone) {
    btnCopyPhone.style.display = 'inline-flex';
    btnCopyPhone.onclick = () => copyToClipboard(item.phone, 'Nomor telepon disalin!');

    let waNumber = item.phone.replace(/[^0-9]/g, '');
    if (waNumber.startsWith('0')) waNumber = '62' + waNumber.slice(1);
    if (waNumber.startsWith('628')) {
      btnOpenWA.style.display = 'inline-flex';
      btnOpenWA.href = `https://wa.me/${waNumber}`;
    } else {
      btnOpenWA.style.display = 'none';
    }
  } else {
    btnCopyPhone.style.display = 'none';
    btnOpenWA.style.display = 'none';
  }

  drawerAddress.innerText = item.address || '-';
  if (item.lat && item.lng) {
    const coordsStr = `${item.lat}, ${item.lng}`;
    drawerCoords.innerText = `Koordinat: ${coordsStr}`;
    btnCopyCoords.style.display = 'inline-flex';
    btnCopyCoords.onclick = () => copyToClipboard(coordsStr, 'Koordinat disalin!');
  } else {
    drawerCoords.innerText = 'Koordinat tidak tersedia';
    btnCopyCoords.style.display = 'none';
  }

  drawerCampus.innerText = item.nearestCampus || '-';
  drawerOffice.innerText = item.nearestOffice || '-';

  if (item.rating) {
    drawerRating.style.display = 'inline-flex';
    drawerRating.innerText = `Rating ${item.rating}`;
    drawerReviews.innerText = `${item.reviewsCount || 0} ulasan Google`;
  } else {
    drawerRating.style.display = 'none';
    drawerReviews.innerText = 'Belum ada ulasan';
  }

  if (item.mapsUrl) {
    const safeMaps = safeHttpsUrl(item.mapsUrl);
    if (safeMaps) {
      drawerMapsLink.href = safeMaps;
      drawerMapsLink.style.display = 'inline-flex';
    } else {
      drawerMapsLink.style.display = 'none';
    }
  } else {
    drawerMapsLink.style.display = 'none';
  }

  if (item.website) {
    const safeWeb = safeHttpsUrl(item.website);
    if (safeWeb) {
      drawerWebLink.href = safeWeb;
      drawerWebLink.style.display = 'inline-flex';
    } else {
      drawerWebLink.style.display = 'none';
    }
  } else {
    drawerWebLink.style.display = 'none';
  }

  drawerBackdrop.classList.add('active');
  detailDrawer.classList.add('open');
}

function closeDetailDrawer() {
  drawerBackdrop.classList.remove('active');
  detailDrawer.classList.remove('open');
}

// =========================================================================
// EVENT LISTENERS & SHORTCUTS
// =========================================================================

function setupEventListeners() {
  filterSearch.addEventListener('input', debounce(applyFilters, 250));
  filterCity.addEventListener('change', applyFilters);
  filterCategory.addEventListener('change', applyFilters);
  filterPhoneOnly.addEventListener('change', applyFilters);
  if (filterWaOnly) filterWaOnly.addEventListener('change', applyFilters);
  filterRatingOnly.addEventListener('change', applyFilters);

  btnPrevPage.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderTable();
    }
  });

  btnNextPage.addEventListener('click', () => {
    const totalPages = Math.ceil(filteredRecords.length / pageSize);
    if (currentPage < totalPages) {
      currentPage++;
      renderTable();
    }
  });

  btnReloadDataset.addEventListener('click', loadDataset);

  // Export Filtered / Searched Data to Excel / CSV / JSON
  async function handleExportFiltered(format = 'xlsx') {
    if (!licenseAllowsAction()) return;
    if (filteredRecords.length === 0) {
      showToast('Tidak ada data hasil filter untuk diekspor.', 'warn');
      return;
    }
    if (filteredRecords.length > 50000) {
      showToast('Hasil filter melebihi 50.000 baris. Persempit filter dulu.', 'warn');
      return;
    }

    const btn = btnExportFiltered;
    const originalHtml = btn ? btn.innerHTML : '';
    if (btn) {
      btn.innerHTML = '<span class="btn-spinner" aria-hidden="true"></span><span>Menyiapkan file...</span>';
      btn.disabled = true;
    }

    try {
      const cityVal = filterCity.value || '';
      const catVal = filterCategory.value || '';
      const qVal = (filterSearch.value || '').trim();
      const labelParts = [cityVal, catVal, qVal].filter(Boolean).join('_').replace(/[^a-zA-Z0-9_-]/g, '') || 'Filter';

      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          format,
          records: filteredRecords,
          label: labelParts
        })
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new Error(txt || `Gagal mengekspor (${res.status})`);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const ext = format === 'csv' ? 'csv' : (format === 'json' ? 'json' : 'xlsx');
      a.download = `Hasil_Filter_${labelParts}_${filteredRecords.length}_Listing.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      showToast(`${filteredRecords.length.toLocaleString('id-ID')} baris berhasil diunduh (.${ext}).`, 'success');
    } catch (err) {
      showToast(`Gagal mengekspor: ${err.message}`, 'error');
      fetchLicenseStatus();
    } finally {
      if (btn) {
        btn.innerHTML = originalHtml;
        btn.disabled = false;
      }
    }
  }

  if (btnExportFiltered) {
    btnExportFiltered.addEventListener('click', () => handleExportFiltered('xlsx'));
  }
  const bindMenuExport = (id, fmt) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', (e) => { e.preventDefault(); handleExportFiltered(fmt); });
  };
  bindMenuExport('menuExportFiltered', 'xlsx');
  bindMenuExport('menuExportFilteredCsv', 'csv');
  bindMenuExport('menuExportFilteredJson', 'json');

  // Dropdown toggle untuk Unduh Data
  if (btnExportMenu && dropdownMenu) {
    btnExportMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = dropdownMenu.classList.toggle('show');
      btnExportMenu.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    dropdownMenu.addEventListener('click', (e) => {
      e.stopPropagation();
    });
    document.addEventListener('click', () => {
      dropdownMenu.classList.remove('show');
      btnExportMenu.setAttribute('aria-expanded', 'false');
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') dropdownMenu.classList.remove('show');
    });
  }

  // Table Column Sort Click
  document.querySelectorAll('.explorer-table th[data-sort]').forEach(th => {
    th.addEventListener('click', () => {
      const col = th.dataset.sort;
      if (currentSort.column === col) {
        currentSort.asc = !currentSort.asc;
      } else {
        currentSort.column = col;
        currentSort.asc = true;
      }
      applyFilters();
    });
  });

  // Drawer Close Actions
  btnDrawerClose.addEventListener('click', closeDetailDrawer);
  drawerBackdrop.addEventListener('click', closeDetailDrawer);

  // Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDetailDrawer();
      // Modal status boleh ditutup via Esc; onboarding/expired bersifat memblokir
      if (licenseModal && !licenseModal.hidden && licenseModalMode === 'status') {
        closeLicenseModal();
      }
    }
    if (e.key === '/' && document.activeElement !== filterSearch && document.activeElement !== customKeywordInput) {
      e.preventDefault();
      const tabExplorer = document.querySelector('.nav-tab-btn[data-tab="tab-explorer"]');
      if (tabExplorer) tabExplorer.click();
      filterSearch.focus();
    }
  });

  // Studio City Select All & Reset
  btnSelectAllCities.addEventListener('click', () => {
    clusterContainer.querySelectorAll('.city-pill').forEach(pill => {
      pill.classList.add('selected');
      selectedCitiesSet.add(pill.dataset.cityName);
    });
    updateScopeHint();
  });

  btnResetCities.addEventListener('click', () => {
    clusterContainer.querySelectorAll('.city-pill').forEach(pill => {
      pill.classList.remove('selected');
    });
    selectedCitiesSet.clear();
    updateScopeHint();
  });

  if (studioDepthSelect) studioDepthSelect.addEventListener('change', updateScopeHint);
  if (studioDeepMatrixCheck) studioDeepMatrixCheck.addEventListener('change', updateScopeHint);
  if (customKeywordInput) customKeywordInput.addEventListener('input', () => {
    const v = customKeywordInput.value.trim();
    if (v.length >= 2) { selectedCategoryKeywords = v; }
  });

  // Studio Scrape Form Submit
  studioForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (isScraping) return;
    if (!licenseAllowsAction()) return;

    let keyword = (customKeywordInput.value || '').trim() || selectedCategoryKeywords || 'kost';
    if (keyword.length < 2) {
      showToast('Kata kunci minimal 2 karakter.', 'warn');
      return;
    }
    
    // Gabungkan selected cities + custom cities (hanya nama yang ada di katalog)
    const citiesList = Array.from(selectedCitiesSet).filter(n => knownCityNames.size === 0 || knownCityNames.has(n));
    const customCities = (customCitiesInput.value || '').split(',').map(s => s.trim()).filter(Boolean);
    const finalCities = [...new Set([...citiesList, ...customCities])];

    if (finalCities.length === 0) {
      showToast('Pilih setidaknya satu target kota.', 'warn');
      return;
    }

    const depth = parseInt(studioDepthSelect.value, 10) || 2;
    const proximity = studioProximityCheck.checked;
    const deepMatrix = studioDeepMatrixCheck ? studioDeepMatrixCheck.checked : false;
    // Synonym variants from the selected catalog category (exclude primary)
    const keywordVariants = selectedCategoryVariants
      .filter(v => v && v.toLowerCase() !== keyword.toLowerCase())
      .slice(0, 3);

    try {
      setScrapingState(true);
      logConsole(`Memulai scraping mendalam: "${keyword}" untuk ${finalCities.length} kota target${deepMatrix ? ' (mode matriks)' : ''}...`);

      const res = await fetch('/api/scrape/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, keywordVariants, cities: finalCities, depth, proximity, deepMatrix })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Gagal memulai scraping');
      }

      const started = await res.json().catch(() => null);
      if (started?.scope) {
        const s = started.scope;
        logConsole(`Cakupan terkonfirmasi: ${s.totalQueries} query × ${s.depth} halaman untuk ${s.cities} kota.`);
        if (scrapeSubLine) scrapeSubLine.textContent = `${s.totalQueries} query • ${s.cities} kota • depth ${s.depth}`;
      }
      logConsole('Permintaan diterima oleh server. Memproses live stream...');
      showToast(`Scraping "${keyword}" dimulai untuk ${finalCities.length} kota.`, 'success');
    } catch (err) {
      if (isLicenseError(err.message)) {
        showToast(licenseStopMessage(), 'warn');
        logConsole(`Detail teknis: ${err.message}`);
        openLicenseModal(licenseState?.activated ? 'status' : 'expired');
      } else {
        showToast(`Gagal memulai: ${err.message}`, 'error');
      }
      fetchLicenseStatus();
      setScrapingState(false);
    }
  });

  // Studio Scrape Stop Action
  btnAbortScrape.addEventListener('click', async () => {
    if (!confirm('Hentikan proses scraping yang sedang berjalan?')) return;
    try {
      await fetch('/api/scrape/stop', { method: 'POST' });
      logConsole('Perintah stop dikirim ke server.');
    } catch (err) {
      console.error(err);
    }
  });
}

// =========================================================================
// SSE (SERVER-SENT EVENTS) LIVE TELEMETRY
// =========================================================================

function connectSSE() {
  if (eventSource) eventSource.close();
  eventSource = new EventSource('/api/scrape/stream');

  eventSource.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);
      handleSSEMessage(msg);
    } catch (e) {
      console.error('SSE JSON error:', e);
    }
  };

  eventSource.onerror = () => {
    console.warn('SSE disconnected. Reconnecting...');
  };
}

function handleSSEMessage(msg) {
  if (msg.type === 'log') {
    logConsole(msg.text);
    if (scrapeSubLine && typeof msg.text === 'string' && msg.text.trim()) {
      const short = msg.text.trim().slice(0, 90);
      scrapeSubLine.textContent = short;
    }
  } else if (msg.type === 'progress') {
    const pct = Math.min(100, Math.max(0, msg.percent || 0));
    liveProgressBar.style.width = `${pct}%`;
    if (liveProgressWrap) liveProgressWrap.setAttribute('aria-valuenow', String(pct));
    if (scrapePct) scrapePct.textContent = `${pct}%`;
    if (scrapeStatusLine && msg.statusText) scrapeStatusLine.textContent = `Memindai ${msg.statusText}`;
    liveProgressCounter.innerText = `${Number(msg.totalRecords || 0).toLocaleString('id-ID')} listing unik`;
  } else if (msg.type === 'new_batch') {
    if (Array.isArray(msg.items) && msg.items.length > 0) {
      allRecords.unshift(...msg.items);
      updateKPIs();
      populateExplorerDropdowns();
      // Preserve pagination & sort during live stream; only re-render current view
      const keepPage = currentPage;
      applyFilters({ resetPage: false });
      currentPage = keepPage;
      renderTable();
    }
  } else if (msg.type === 'status') {
    if (msg.running) {
      setScrapingState(true);
    } else {
      setScrapingState(false);
      if (msg.finished) {
        logConsole('=== TUGAS SCRAPING SELESAI ===');
        showToast('Scraping selesai. Dataset diperbarui.', 'success');
        playCompletionSound();
        loadDataset();
      }
      if (msg.error) {
        if (isLicenseError(msg.error)) {
          showToast(licenseStopMessage(), 'warn');
          logConsole(`Detail teknis: ${msg.error}`);
          openLicenseModal('expired');
          fetchLicenseStatus();
        } else {
          showToast(`Scraping berhenti: ${msg.error}`, 'error');
        }
      }
    }
  }
}

function setScrapingState(scraping) {
  isScraping = scraping;
  if (scrapeVisual) scrapeVisual.classList.toggle('scanning', scraping);
  if (scraping) {
    btnRunScrape.style.display = 'none';
    btnAbortScrape.style.display = 'inline-flex';
    scraperStateBadge.innerText = 'Scraping Berjalan';
    scraperStateBadge.className = 'tag tag-amber';
    if (scrapeStatusLine) scrapeStatusLine.textContent = 'Memindai Google Maps — live…';
  } else {
    btnRunScrape.style.display = 'inline-flex';
    btnAbortScrape.style.display = 'none';
    scraperStateBadge.innerText = 'Idle';
    scraperStateBadge.className = 'tag tag-emerald';
    if (scrapeStatusLine) scrapeStatusLine.textContent = 'Siaga — siap memindai Google Maps';
    if (scrapeSubLine) scrapeSubLine.textContent = 'Pilih kategori & kota, lalu jalankan scraping';
  }
}

function logConsole(text) {
  if (!consoleLiveBox) return;
  const time = new Date().toLocaleTimeString('id-ID');
  consoleLiveBox.textContent += `[${time}] ${text}\n`;
  consoleLiveBox.scrollTop = consoleLiveBox.scrollHeight;
}

// =========================================================================
// ANALYTICS & INSIGHTS CHARTS (CLEAN LIGHT THEME)
// =========================================================================

function renderAnalyticsCharts() {
  const chartCities = document.getElementById('chartCities');
  const chartCategories = document.getElementById('chartCategories');
  const chartContacts = document.getElementById('chartContacts');
  const chartRatings = document.getElementById('chartRatings');

  if (!chartCities || allRecords.length === 0) return;

  // 1. TOP CITIES
  const cityCounts = {};
  allRecords.forEach(r => {
    const c = r.city || 'Lainnya';
    cityCounts[c] = (cityCounts[c] || 0) + 1;
  });
  const sortedCities = Object.entries(cityCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const maxCityVal = sortedCities[0]?.[1] || 1;

  chartCities.innerHTML = sortedCities.map(([city, count]) => {
    const pct = ((count / maxCityVal) * 100).toFixed(1);
    return `
      <div class="bar-row">
        <span class="bar-label" title="${escapeHtml(city)}">${escapeHtml(city)}</span>
        <div class="bar-track">
          <div class="bar-fill" style="width: ${pct}%;"></div>
        </div>
        <span class="bar-value">${count.toLocaleString('id-ID')}</span>
      </div>
    `;
  }).join('');

  // 2. TOP CATEGORIES
  const catCounts = {};
  allRecords.forEach(r => {
    const c = r.category || 'Umum';
    catCounts[c] = (catCounts[c] || 0) + 1;
  });
  const sortedCats = Object.entries(catCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const maxCatVal = sortedCats[0]?.[1] || 1;

  chartCategories.innerHTML = sortedCats.map(([cat, count]) => {
    const pct = ((count / maxCatVal) * 100).toFixed(1);
    return `
      <div class="bar-row">
        <span class="bar-label" title="${escapeHtml(cat)}">${escapeHtml(cat)}</span>
        <div class="bar-track">
          <div class="bar-fill" style="width: ${pct}%; background-color: var(--accent-blue);"></div>
        </div>
        <span class="bar-value">${count.toLocaleString('id-ID')}</span>
      </div>
    `;
  }).join('');

  // 3. CONTACT BREAKDOWN
  const withPhone = allRecords.filter(r => Boolean(r.phone)).length;
  const withoutPhone = allRecords.length - withPhone;
  const maxContactVal = allRecords.length;

  chartContacts.innerHTML = `
    <div class="bar-row">
      <span class="bar-label">Ada Nomor Telepon</span>
      <div class="bar-track">
        <div class="bar-fill" style="width: ${((withPhone / maxContactVal) * 100).toFixed(1)}%; background-color: var(--accent-emerald);"></div>
      </div>
      <span class="bar-value">${withPhone.toLocaleString('id-ID')}</span>
    </div>
    <div class="bar-row">
      <span class="bar-label">Tanpa Kontak Terdaftar</span>
      <div class="bar-track">
        <div class="bar-fill" style="width: ${((withoutPhone / maxContactVal) * 100).toFixed(1)}%; background-color: var(--border-medium);"></div>
      </div>
      <span class="bar-value">${withoutPhone.toLocaleString('id-ID')}</span>
    </div>
  `;

  // 4. RATING BREAKDOWN
  let r5 = 0, r45 = 0, r40 = 0, rBelow = 0, rNone = 0;
  allRecords.forEach(r => {
    if (typeof r.rating !== 'number' || r.rating <= 0) rNone++;
    else if (r.rating >= 4.8) r5++;
    else if (r.rating >= 4.5) r45++;
    else if (r.rating >= 4.0) r40++;
    else rBelow++;
  });

  const ratingGroups = [
    { label: 'Sangat Baik (4.8 - 5.0)', count: r5, color: '#059669' },
    { label: 'Pilihan (4.5 - 4.7)', count: r45, color: '#2563eb' },
    { label: 'Bagus (4.0 - 4.4)', count: r40, color: '#d97706' },
    { label: 'Standar (< 4.0)', count: rBelow, color: '#64748b' }
  ];
  const maxRVal = Math.max(...ratingGroups.map(g => g.count), 1);

  chartRatings.innerHTML = ratingGroups.map(g => `
    <div class="bar-row">
      <span class="bar-label">${g.label}</span>
      <div class="bar-track">
        <div class="bar-fill" style="width: ${((g.count / maxRVal) * 100).toFixed(1)}%; background-color: ${g.color};"></div>
      </div>
      <span class="bar-value">${g.count.toLocaleString('id-ID')}</span>
    </div>
  `).join('');
}

// =========================================================================
// UTILITIES
// =========================================================================

function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function copyToClipboard(text, alertMsg) {
  const done = () => showToast(alertMsg || 'Disalin ke clipboard!', 'success');
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(() => {
      try { prompt('Salin teks manual:', text); } catch { /* ignore */ }
    });
  } else {
    try { prompt('Salin teks manual:', text); } catch { /* ignore */ }
  }
}
