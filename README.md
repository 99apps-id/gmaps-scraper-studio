# Google Maps Business Intelligence & Leads Scraper Studio

Aplikasi Desktop (Windows/macOS/Linux) intelijen bisnis dan ekstraksi prospek (*leads scraper*) Google Maps Indonesia tingkat enterprise. Dilengkapi dengan antarmuka modern editorial, integrasi radius kampus/perkantoran terdekat, ekspor Excel otomatis, dan integrasi WhatsApp.

## Fitur Utama

- **Google Maps Leads Explorer**: Jelajahi dan kelola ribuan direktori bisnis lokal dengan filter wilayah, rating, dan kontak.
- **WhatsApp Direct Action**: Satu klik langsung membuka obrolan WhatsApp dengan prospek bisnis tanpa perlu menyimpan nomor kontak terlebih dahulu.
- **Filter Cepat WhatsApp (08xx)**: Memisahkan nomor telepon tetap (kantor) dengan nomor seluler WhatsApp aktif.
- **Proximity Analysis Engine**: Kalkulasi otomatis jarak kilometer ke kampus dan kawasan perkantoran terdekat.
- **Multi-Format Export**: Ekspor data hasil filter ke Excel (.xlsx multi-sheet terformat), CSV (UTF-8 BOM), dan JSON.
- **Multi-Platform Support**: Tersedia untuk Windows (Installer NSIS), macOS, dan Linux.

## Unduh Aplikasi Desktop

Unduh installer resmi terbaru untuk Windows melalui tautan berikut:
👉 **[Download GMST Scraper Setup (Windows)](https://github.com/99apps-id/gmaps-scraper-studio/releases/latest)**

## Menjalankan di Mode Development

```bash
# Clone repository
git clone https://github.com/99apps-id/gmaps-scraper-studio.git
cd gmaps-scraper-studio

# Install dependensi
npm install

# Jalankan dashboard web lokal
npm run dashboard

# Jalankan aplikasi Electron
npm run electron
```

## Membangun Installer (Build)

```bash
# Windows
npm run dist:win

# macOS
npm run dist:mac

# Linux
npm run dist:linux
```

## Lisensi & Dukungan

Aplikasi ini dilengkapi dengan masa percobaan gratis (Trial 3 Hari). Untuk informasi aktivasi lisensi, bantuan teknis, dan kemitraan, hubungi:
- **Email**: support@99apps.id
- **Website**: https://99apps.id
