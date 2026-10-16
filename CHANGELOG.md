# Changelog — GMST Scraper

## 2026-10-16
- **Resolusi wilayah** baru (`lib/region.js`): kecamatan/desa dipetakan ke kota + provinsi induk; provinsi/kota/kecamatan tiap hasil mengikuti **alamat Google Maps**; hasil lintas wilayah disaring (termasuk inferensi dari mayoritas alamat bila input tak dikenal).
- Query di-anchor ke kota + provinsi; query arah ("… selatan") dihilangkan untuk input non-kota.
- Endpoint **`GET /api/region/resolve`** (+ proxy ke VPS saat mode client) untuk pratinjau UI.
- UI: pratinjau "Terbaca: …" pada input wilayah tambahan.
- Katalog: query memperkaya cakupan kecamatan untuk kota besar.
- Hardening engine: webhook `auto-activate` wajib `reff`, handler request dibungkus try/catch + guard `decodeURIComponent`, handler `unhandledRejection`/`uncaughtException`, tulis JSON atomik (temp+rename+fsync), reuse-aktivasi memakai `activatedAt`, escape halaman `/success`.
- Versi desktop **0.1.3**.
