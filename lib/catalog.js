/**
 * Katalog Komprehensif: Kategori Jenis Usaha & Wilayah / Kota Indonesia
 */

export const CATEGORY_SECTORS = [
  {
    id: 'food_retail',
    name: 'Makanan, Warung & Ritel Harian',
    iconName: 'coffee',
    categories: [
      { id: 'warung', label: 'Warung Makan & Warteg', keywords: ['warung makan', 'warteg', 'warung nasi', 'rumah makan'] },
      { id: 'toko_kelontong', label: 'Toko Kelontong & Sembako', keywords: ['toko kelontong', 'toko sembako', 'warung sembako', 'grosir sembako'] },
      { id: 'minimarket', label: 'Minimarket & Supermarket', keywords: ['minimarket', 'supermarket', 'pasar modern'] },
      { id: 'kafe', label: 'Kafe & Tempat Ngopi', keywords: ['kafe', 'coffee shop', 'tempat ngopi', 'warkop modern'] },
      { id: 'restoran', label: 'Restoran & Rumah Makan', keywords: ['restoran', 'rumah makan', 'restoran keluarga'] },
      { id: 'bakery', label: 'Toko Roti & Kue', keywords: ['toko roti', 'toko kue', 'bakery', 'pastry'] },
      { id: 'katering', label: 'Katering & Nasi Kotak', keywords: ['katering', 'catering', 'nasi box', 'nasi kotak'] },
      { id: 'supplier_daging', label: 'Supplier Daging', keywords: ['supplier daging', 'distributor daging sapi', 'daging beku supplier', 'agen daging'] },
      { id: 'rumah_makan_padang', label: 'Rumah Makan Padang', keywords: ['rumah makan padang', 'restoran padang', 'masakan padang', 'nasi padang'] },
      { id: 'seafood', label: 'Seafood & Ikan Bakar', keywords: ['seafood', 'restoran seafood', 'ikan bakar', 'cumi saus padang'] },
      { id: 'mie_bakso', label: 'Mie Ayam & Bakso', keywords: ['mie ayam', 'bakso', 'mie bakso', 'bakso malang'] },
      { id: 'depot_air_minum', label: 'Depot Air Minum Isi Ulang', keywords: ['depot air minum', 'air isi ulang', 'galon isi ulang', 'depot air biru'] },
      { id: 'pangkalan_gas', label: 'Pangkalan Gas & LPG', keywords: ['pangkalan gas', 'agen lpg', 'gas melon', 'toko gas'] }
    ]
  },
  {
    id: 'professional_services',
    name: 'Konsultan, Hukum & Keuangan',
    iconName: 'briefcase',
    categories: [
      { id: 'konsultan_pajak', label: 'Konsultan Pajak', keywords: ['konsultan pajak', 'jasa pajak', 'tax consultant', 'kantor konsultan pajak'] },
      { id: 'akuntan', label: 'Akuntan & Pembukuan', keywords: ['kantor akuntan', 'jasa pembukuan', 'akuntan publik', 'jasa akuntansi'] },
      { id: 'kantor_hukum', label: 'Kantor Hukum & Pengacara', keywords: ['kantor hukum', 'pengacara', 'advokat', 'law firm', 'konsultan hukum'] },
      { id: 'notaris', label: 'Notaris & PPAT', keywords: ['notaris', 'kantor notaris', 'notaris ppat', 'ppat'] },
      { id: 'agen_asuransi', label: 'Agen Asuransi & Keuangan', keywords: ['agen asuransi', 'asuransi jiwa', 'konsultan keuangan'] },
      { id: 'leasing', label: 'Leasing & Multifinance', keywords: ['leasing', 'multifinance', 'leasing motor', 'leasing mobil', 'pembiayaan'] },
      { id: 'koperasi', label: 'Koperasi Simpan Pinjam', keywords: ['koperasi', 'koperasi simpan pinjam', 'ksp', 'pinjaman koperasi'] },
      { id: 'biro_jasa_pt', label: 'Biro Jasa Pendirian PT/CV', keywords: ['jasa pendirian pt', 'bikin pt', 'jasa cv', 'biro jasa perizinan'] }
    ]
  },
  {
    id: 'manufacturing',
    name: 'Pabrik, Gudang & Industri',
    iconName: 'hammer',
    categories: [
      { id: 'pabrik_makanan', label: 'Pabrik Makanan & Minuman', keywords: ['pabrik makanan', 'pabrik minuman', 'industri makanan'] },
      { id: 'pabrik_garmen', label: 'Pabrik Garmen & Tekstil', keywords: ['pabrik garmen', 'konveksi', 'pabrik tekstil', 'garment'] },
      { id: 'pabrik_plastik', label: 'Pabrik Plastik & Kemasan', keywords: ['pabrik plastik', 'pabrik kemasan', 'industri kemasan'] },
      { id: 'pabrik_furniture', label: 'Pabrik Furniture & Kayu', keywords: ['pabrik furniture', 'pabrik mebel', 'industri kayu'] },
      { id: 'pabrik_elektronik', label: 'Pabrik Elektronik & Komponen', keywords: ['pabrik elektronik', 'industri elektronik'] },
      { id: 'pabrik_otomotif', label: 'Pabrik Suku Cadang & Otomotif', keywords: ['pabrik sparepart', 'pabrik otomotif', 'industri otomotif'] },
      { id: 'gudang_logistik', label: 'Gudang & Distribusi', keywords: ['gudang', 'jasa gudang', 'distributor', 'gudang logistik'] },
      { id: 'supplier_bangunan', label: 'Toko Bangunan & Material', keywords: ['toko bangunan', 'toko material', 'depo bangunan'] },
      { id: 'toko_baja', label: 'Toko Baja & Besi', keywords: ['toko baja', 'distributor besi baja', 'toko besi baja', 'supplier baja wf h beam'] },
      { id: 'distributor_stainless', label: 'Distributor Stainless', keywords: ['distributor stainless steel', 'stainless steel supplier', 'plat stainless steel', 'pipa stainless'] },
      { id: 'toko_perkakas', label: 'Toko Perkakas & Teknik', keywords: ['toko perkakas', 'hardware store', 'alat teknik', 'perkakas mesin'] },
      { id: 'supplier_atk', label: 'Supplier ATK', keywords: ['supplier atk', 'distributor alat tulis kantor', 'grosir atk', 'toko atk'] }
    ]
  },
  {
    id: 'health_beauty',
    name: 'Kesehatan & Kecantikan',
    iconName: 'activity',
    categories: [
      { id: 'klinik_umum', label: 'Klinik & Praktik Dokter', keywords: ['klinik', 'praktik dokter', 'klinik umum', 'klinik 24 jam'] },
      { id: 'klinik_gigi', label: 'Klinik Gigi', keywords: ['klinik gigi', 'dokter gigi', 'dental clinic'] },
      { id: 'apotek', label: 'Apotek & Farmasi', keywords: ['apotek', 'apotik', 'apotek 24 jam', 'farmasi'] },
      { id: 'optik', label: 'Optik & Kacamata', keywords: ['optik', 'toko kacamata', 'optik melawai', 'periksa mata'] },
      { id: 'lab_medis', label: 'Laboratorium Medis', keywords: ['laboratorium', 'lab klinik', 'lab medis', 'cek darah', 'medical check up'] },
      { id: 'klinik_kecantikan', label: 'Klinik Kecantikan', keywords: ['klinik kecantikan', 'beauty clinic', 'klinik estetika'] },
      { id: 'salon_spa', label: 'Salon & Spa', keywords: ['salon', 'spa', 'barbershop', 'pangkas rambut'] },
      { id: 'barbershop', label: 'Barbershop & Cukur', keywords: ['barbershop', 'salon rambut', 'pangkas rambut', 'cukur rambut pria'] },
      { id: 'fisioterapi', label: 'Fisioterapi & Rehabilitasi', keywords: ['fisioterapi', 'klinik fisioterapi', 'terapi stroke', 'rehabilitasi medik'] },
      { id: 'pijat_refleksi', label: 'Pijat & Refleksi', keywords: ['pijat', 'refleksi', 'pijat refleksi', 'pijat panggilan', 'spa refleksi'] },
      { id: 'homecare', label: 'Homecare & Perawat Panggilan', keywords: ['homecare', 'perawat panggilan', 'jasa homecare', 'perawat lansia'] },
      { id: 'gym', label: 'Gym & Kebugaran', keywords: ['gym', 'fitness', 'tempat fitness', 'studio senam'] }
    ]
  },
  {
    id: 'automotive',
    name: 'Otomotif & Bengkel',
    iconName: 'truck',
    categories: [
      { id: 'bengkel_mobil', label: 'Bengkel Mobil', keywords: ['bengkel mobil', 'servis mobil', 'tune up mobil'] },
      { id: 'bengkel_motor', label: 'Bengkel Motor', keywords: ['bengkel motor', 'servis motor'] },
      { id: 'cuci_kendaraan', label: 'Cuci Mobil & Motor', keywords: ['cuci mobil', 'car wash', 'steam mobil motor'] },
      { id: 'toko_ban', label: 'Toko Ban & Velg', keywords: ['toko ban', 'spooring balancing', 'velg mobil'] },
      { id: 'body_repair', label: 'Body Repair & Cat Mobil', keywords: ['body repair', 'cat mobil', 'ketok magic', 'bengkel cat'] },
      { id: 'dealer', label: 'Dealer & Showroom', keywords: ['dealer mobil', 'dealer motor', 'showroom'] },
      { id: 'mobil_bekas', label: 'Jual Beli Mobil Bekas', keywords: ['mobil bekas', 'jual beli mobil bekas', 'showroom mobil bekas', 'mobil second'] },
      { id: 'derek_towing', label: 'Derek & Towing', keywords: ['derek mobil', 'jasa towing', 'towing mobil', 'derek 24 jam'] },
      { id: 'rental_mobil', label: 'Rental & Sewa Mobil', keywords: ['rental mobil', 'sewa mobil', 'rental hiace', 'sewa elf'] }
    ]
  },
  {
    id: 'property',
    name: 'Properti & Tempat Tinggal',
    iconName: 'building',
    categories: [
      { id: 'kost', label: 'Kost & Rumah Sewa', keywords: ['kost', 'kosan', 'kontrakan', 'sewa rumah'] },
      { id: 'apartemen', label: 'Apartemen Sewa', keywords: ['sewa apartemen', 'apartemen harian', 'apartemen bulanan'] },
      { id: 'hotel', label: 'Hotel & Penginapan', keywords: ['hotel', 'penginapan', 'homestay', 'guest house'] },
      { id: 'agen_properti', label: 'Agen Properti', keywords: ['agen properti', 'agen rumah', 'makelar rumah'] },
      { id: 'coworking', label: 'Coworking & Kantor Bersama', keywords: ['coworking space', 'sewa kantor', 'virtual office', 'ruang kerja bersama'] },
      { id: 'developer_perumahan', label: 'Developer Perumahan', keywords: ['developer perumahan', 'perumahan baru', 'developer properti', 'cluster perumahan'] },
      { id: 'jasa_interior', label: 'Jasa Interior & Renovasi', keywords: ['jasa interior', 'desain interior', 'renovasi rumah', 'kontraktor interior'] }
    ]
  },
  {
    id: 'education',
    name: 'Kursus & Pendidikan',
    iconName: 'book',
    categories: [
      { id: 'bimbel', label: 'Bimbingan Belajar', keywords: ['bimbingan belajar', 'bimbel', 'les privat'] },
      { id: 'kursus_bahasa', label: 'Kursus Bahasa', keywords: ['kursus bahasa inggris', 'kursus bahasa', 'english course'] },
      { id: 'kursus_skill', label: 'Kursus Keterampilan', keywords: ['kursus komputer', 'kursus menjahit', 'kursus masak', 'pelatihan kerja'] },
      { id: 'kursus_mengemudi', label: 'Kursus Mengemudi', keywords: ['kursus mengemudi', 'kursus stir mobil', 'belajar mobil', 'sim'] },
      { id: 'sekolah_umum', label: 'Sekolah Umum (SD/SMP/SMA)', keywords: ['sekolah', 'sd negeri', 'smp negeri', 'sma negeri', 'sekolah dasar', 'smu'] },
      { id: 'smk', label: 'SMK & Kejuruan', keywords: ['smk', 'sekolah menengah kejuruan', 'smk negeri', 'smk swasta'] },
      { id: 'pesantren', label: 'Pesantren & Pondok', keywords: ['pesantren', 'pondok pesantren', 'ponpes', 'pesantren modern'] },
      { id: 'universitas', label: 'Universitas & Kampus', keywords: ['universitas', 'kampus', 'perguruan tinggi', 'universitas swasta'] }
    ]
  },
  {
    id: 'fashion_aksesoris',
    name: 'Fashion & Aksesoris',
    iconName: 'shopping-cart',
    categories: [
      { id: 'toko_baju', label: 'Toko Baju & Distro', keywords: ['toko baju', 'distro', 'toko pakaian', 'butik'] },
      { id: 'toko_emas', label: 'Toko Emas & Perhiasan', keywords: ['toko emas', 'toko perhiasan', 'jual emas', 'emas antam'] },
      { id: 'tailor', label: 'Tukang Jahit & Vermak', keywords: ['tukang jahit', 'jahit baju', 'vermak', 'permaks'] },
      { id: 'fashion_custom', label: 'Fashion Custom & Branded', keywords: ['fashion custom', 'branded local', 'kaos custom', 'apparel custom'] }
    ]
  },
  {
    id: 'hiburan_rekreasi',
    name: 'Hiburan & Rekreasi',
    iconName: 'activity',
    categories: [
      { id: 'bilyar', label: 'Bilyar & Billiard', keywords: ['bilyar', 'billiard', 'meja bilyar', 'pool lounge', 'arena bilyar'] },
      { id: 'tempat_wisata', label: 'Tempat Wisata', keywords: ['tempat wisata', 'destinasi wisata', 'wisata rekreasi', 'objek wisata'] },
      { id: 'toko_mainan', label: 'Toko Mainan Anak', keywords: ['toko mainan', 'toko mainan anak', 'grosir mainan', 'toko boneka'] },
      { id: 'game_center', label: 'Game Center & Arcade', keywords: ['game center', 'family game', 'arcade', 'billiard', 'playstation rental'] },
      { id: 'live_music', label: 'Live Music & Cafenya', keywords: ['live music', 'cafe live music', 'acoustic', 'live band'] }
    ]
  },
  {
    id: 'digital_services',
    name: 'Jasa Digital & Kreatif',
    iconName: 'laptop',
    categories: [
      { id: 'percetakan', label: 'Percetakan & Sablon', keywords: ['percetakan', 'digital printing', 'sablon', 'fotocopy'] },
      { id: 'studio_foto', label: 'Studio Foto & Wedding', keywords: ['studio foto', 'fotografer', 'wedding organizer'] },
      { id: 'wedding_organizer', label: 'Wedding Organizer', keywords: ['wedding organizer', 'wo pernikahan', 'paket pernikahan', 'rias pengantin'] },
      { id: 'event_organizer', label: 'Event Organizer & EO', keywords: ['event organizer', 'jasa eo', 'eo acara', 'organizer event'] },
      { id: 'sewa_sound_lighting', label: 'Sewa Sound & Lighting', keywords: ['sewa sound', 'sewa lighting', 'sound system', 'sewa panggung'] },
      { id: 'dekorasi_event', label: 'Dekorasi Acara', keywords: ['dekorasi lamaran', 'dekorasi pernikahan', 'dekorasi acara', 'backdrop acara'] },
      { id: 'jasa_iklan', label: 'Jasa Iklan & Digital', keywords: ['jasa iklan', 'digital marketing', 'agensi iklan'] }
    ]
  },
  {
    id: 'home_services',
    name: 'Jasa & Kebutuhan Rumah Tangga',
    iconName: 'hammer',
    categories: [
      { id: 'laundry', label: 'Laundry', keywords: ['laundry', 'laundry kiloan', 'dry clean'] },
      { id: 'servis_ac', label: 'Servis AC & Elektronik', keywords: ['servis ac', 'servis elektronik', 'tukang ac'] },
      { id: 'tukang', label: 'Tukang & Renovasi', keywords: ['tukang bangunan', 'jasa renovasi', 'kontraktor'] },
      { id: 'ekspedisi', label: 'Ekspedisi & Logistik', keywords: ['ekspedisi', 'jasa kirim', 'logistik'] },
      { id: 'cleaning_service', label: 'Cleaning Service Panggilan', keywords: ['cleaning service', 'jasa bersih rumah', 'general cleaning', 'cuci sofa', 'cuci kasur'] },
      { id: 'sedot_wc', label: 'Sedot WC & Limbah', keywords: ['sedot wc', 'sedot tinja', 'sedot limbah', 'sedot wc murah'] },
      { id: 'pest_control', label: 'Jasa Anti Hama & Rayap', keywords: ['pest control', 'anti rayap', 'jasa fogging', 'pembasmi hama'] },
      { id: 'panel_surya', label: 'Panel Surya & PLTS', keywords: ['panel surya', 'plts atap', 'solar panel', 'pasang solar cell'] },
      { id: 'sumur_bor', label: 'Jasa Sumur Bor', keywords: ['sumur bor', 'bor sumur', 'jasa sumur bor', 'tukang sumur'] },
      { id: 'toko_perabotan', label: 'Toko Perabotan Rumah', keywords: ['toko perabotan', 'toko perabot rumah tangga', 'toko mebel', 'perabotan rumah'] }
    ]
  },
  {
    id: 'tech_gadget',
    name: 'Komputer, Gadget & Elektronik',
    iconName: 'laptop',
    categories: [
      { id: 'toko_komputer', label: 'Toko Komputer & Laptop', keywords: ['toko komputer', 'toko laptop', 'laptop store'] },
      { id: 'servis_komputer', label: 'Servis Komputer & HP', keywords: ['servis komputer', 'servis hp', 'service center'] },
      { id: 'sparepart_handphone', label: 'Sparepart HP', keywords: ['sparepart handphone', 'sparepart hp', 'distributor sparepart hp', 'lcd touchscreen hp'] },
      { id: 'toko_hp', label: 'Toko HP & Counter', keywords: ['toko hp', 'counter hp', 'toko handphone'] },
      { id: 'toko_elektronik', label: 'Toko Elektronik & Gadget', keywords: ['toko elektronik', 'toko gadget', 'elektronik rumah tangga'] }
    ]
  },
  {
    id: 'it_telecom',
    name: 'IT, Telekomunikasi & Keamanan',
    iconName: 'laptop',
    categories: [
      { id: 'software_house', label: 'Software House & Aplikasi', keywords: ['software house', 'perusahaan software', 'jasa pembuatan aplikasi', 'pengembang aplikasi'] },
      { id: 'web_developer', label: 'Web Developer & IT Konsultan', keywords: ['web developer', 'jasa pembuatan website', 'konsultan it', 'it consultant'] },
      { id: 'it_infrastructure', label: 'Infrastruktur IT & Jaringan', keywords: ['jasa jaringan komputer', 'instalasi server', 'it infrastructure', 'networking', 'data center'] },
      { id: 'internet_provider', label: 'Internet & Telekomunikasi', keywords: ['internet provider', 'isp', 'pasang wifi', 'telekomunikasi'] },
      { id: 'cctv_security_system', label: 'CCTV & Sistem Keamanan', keywords: ['pasang cctv', 'cctv', 'sistem keamanan', 'alarm keamanan'] },
      { id: 'digital_agency', label: 'Agensi Digital & SEO', keywords: ['digital agency', 'jasa seo', 'social media management'] }
    ]
  },
  {
    id: 'outsourcing_manpower',
    name: 'Outsourcing & Tenaga Kerja',
    iconName: 'briefcase',
    categories: [
      { id: 'outsourcing_kebersihan', label: 'Outsourcing Kebersihan & Office Boy', keywords: ['outsourcing kebersihan', 'jasa cleaning service', 'jasa office boy', 'cleaning service kantor'] },
      { id: 'outsourcing_keamanan', label: 'Outsourcing Keamanan & Satpam', keywords: ['outsourcing satpam', 'jasa keamanan', 'jasa satpam', 'security service'] },
      { id: 'outsourcing_pabrik', label: 'Outsourcing Pabrik & Operator', keywords: ['outsourcing pabrik', 'jasa tenaga kerja pabrik', 'outsourcing operator produksi'] },
      { id: 'outsourcing_migas', label: 'Outsourcing Oil & Gas / Tambang', keywords: ['outsourcing oil and gas', 'jasa man power migas', 'outsourcing tambang'] },
      { id: 'outsourcing_driver', label: 'Outsourcing Supir & Logistik', keywords: ['outsourcing supir', 'jasa supir', 'outsourcing driver'] },
      { id: 'yayasan_penyalur', label: 'Penyalur Tenaga Kerja & SPG', keywords: ['penyalur tenaga kerja', 'yayasan outsourcing', 'jasa spg', 'tenaga kerja kontrak'] }
    ]
  },
  {
    id: 'agro_marine',
    name: 'Perikanan, Pertanian & Perkebunan',
    iconName: 'leaf',
    categories: [
      { id: 'budidaya_perikanan', label: 'Budidaya Perikanan & Tambak', keywords: ['budidaya ikan', 'tambak ikan', 'kolam ikan', 'budidaya lele', 'budidaya udang', 'tambak udang'] },
      { id: 'kelautan', label: 'Kelautan & Hasil Laut', keywords: ['hasil laut', 'nelayan', 'pelelangan ikan', 'tpi ikan', 'supplier ikan', 'distributor seafood'] },
      { id: 'pertanian', label: 'Pertanian & Agribisnis', keywords: ['pertanian', 'agribisnis', 'hortikultura', 'lahan pertanian', 'gapoktan', 'usaha tani'] },
      { id: 'perkebunan', label: 'Perkebunan & Komoditas', keywords: ['perkebunan', 'kebun sawit', 'kebun karet', 'kebun kopi', 'kebun teh', 'komoditas perkebunan'] },
      { id: 'pakan_hewan', label: 'Toko Pakan Hewan & Ternak', keywords: ['toko pakan', 'pakan ternak', 'pakan ikan', 'pakan ayam', 'pakan hewan', 'toko pakan burung'] },
      { id: 'petshop', label: 'Petshop & Klinik Hewan', keywords: ['petshop', 'pet shop', 'klinik hewan', 'dokter hewan', 'grooming kucing'] },
      { id: 'toko_tani', label: 'Toko Saprotan & Pupuk', keywords: ['toko pertanian', 'toko pupuk', 'saprotan', 'toko benih', 'pupuk subsidi'] }
    ]
  },
  {
    id: 'sekolah_formal',
    name: 'Sekolah, Pesantren & Pendidikan',
    iconName: 'book',
    categories: [
      { id: 'sekolah_umum', label: 'Sekolah Umum (SD/SMP/SMA)', keywords: ['sekolah', 'sd negeri', 'smp negeri', 'sma negeri', 'sekolah dasar', 'smu'] },
      { id: 'sdit', label: 'SDIT', keywords: ['sdit', 'sd islam terpadu', 'sekolah dasar islam terpadu'] },
      { id: 'smpit', label: 'SMPIT', keywords: ['smpit', 'smp islam terpadu', 'sekolah menengah islam terpadu'] },
      { id: 'smait', label: 'SMAIT', keywords: ['smait', 'sma islam terpadu', 'sekolah atas islam terpadu'] },
      { id: 'smk', label: 'SMK & Kejuruan', keywords: ['smk', 'sekolah menengah kejuruan', 'smk negeri', 'smk swasta'] },
      { id: 'sekolah_sunnah', label: 'Sekolah Sunnah', keywords: ['sekolah sunnah', 'assunnah', 'as-sunnah', 'tahfidz quran', 'mahad tahfidz'] },
      { id: 'pesantren', label: 'Pesantren & Pondok', keywords: ['pesantren', 'pondok pesantren', 'ponpes', 'pesantren modern'] },
      { id: 'homeschooling', label: 'Homeschooling & PKBM', keywords: ['homeschooling', 'sekolah rumah', 'pkbm', 'homeschooling islam'] },
      { id: 'universitas', label: 'Universitas & Kampus', keywords: ['universitas', 'kampus', 'perguruan tinggi', 'universitas swasta'] }
    ]
  }
];

/**
 * Wilayah Indonesia.
 * Struktur: region -> cities[] dengan province + subDistricts.
 */
export const REGION_CLUSTERS = [
  {
    region: 'Jabodetabek & Banten',
    cities: [
      { name: 'Jakarta Selatan', province: 'DKI Jakarta', subDistricts: ['Tebet', 'Setiabudi', 'Mampang', 'Pancoran', 'Pasar Minggu', 'Cilandak', 'Kebayoran Baru', 'Jagakarsa'] },
      { name: 'Jakarta Pusat', province: 'DKI Jakarta', subDistricts: ['Menteng', 'Tanah Abang', 'Senen', 'Kemayoran', 'Gambir'] },
      { name: 'Jakarta Barat', province: 'DKI Jakarta', subDistricts: ['Grogol', 'Palmerah', 'Kebon Jeruk', 'Kembangan', 'Cengkareng'] },
      { name: 'Jakarta Timur', province: 'DKI Jakarta', subDistricts: ['Matraman', 'Jatinegara', 'Duren Sawit', 'Kramat Jati', 'Pulo Gadung'] },
      { name: 'Jakarta Utara', province: 'DKI Jakarta', subDistricts: ['Kelapa Gading', 'Sunter', 'Tanjung Priok', 'Pluit', 'Penjaringan'] },
      { name: 'Tangerang', province: 'Banten', subDistricts: ['BSD', 'Serpong', 'Alam Sutera', 'Cikupa', 'Balaraja'] },
      { name: 'Cilegon', province: 'Banten', subDistricts: ['Ciwandan', 'Citangkil', 'Pulomerak'] },
      { name: 'Serang', province: 'Banten', subDistricts: ['Kasemen', 'Curug', 'Cipocok Jaya'] },
      { name: 'Bandung', province: 'Jawa Barat', subDistricts: ['Coblong', 'Sukajadi', 'Dago', 'Lengkong', 'Cicendo', 'Pasteur', 'Cihampelas'] },
      { name: 'Bekasi', province: 'Jawa Barat', subDistricts: ['Bekasi Barat', 'Bekasi Timur', 'Bekasi Selatan', 'Bekasi Utara', 'Bantar Gebang'] },
      { name: 'Depok', province: 'Jawa Barat', subDistricts: ['Beji', 'Margonda', 'Cimanggis', 'Sawangan', 'Cinere'] },
      { name: 'Bogor', province: 'Jawa Barat', subDistricts: ['Bogor Barat', 'Bogor Timur', 'Tanah Sareal', 'Cibinong', 'Gunung Putri'] },
      { name: 'Cirebon', province: 'Jawa Barat', subDistricts: ['Kesambi', 'Kejaksan', 'Lemahwungkuk', 'Pekalipan'] }
    ]
  },
  {
    region: 'Jawa Barat',
    cities: [
      { name: 'Bandung', province: 'Jawa Barat', subDistricts: ['Coblong', 'Sukajadi', 'Buahbatu', 'Bandung Wetan', 'Dago', 'Lengkong', 'Asia Afrika', 'Cicendo', 'Pasteur', 'Jatinangor', 'Dayeuhkolot', 'Cimahi'] },
      { name: 'Cimahi', province: 'Jawa Barat', subDistricts: ['Cimahi Utara', 'Cimahi Tengah', 'Cimahi Selatan', 'Baros', 'Leuwigajah'] },
      { name: 'Tasikmalaya', province: 'Jawa Barat', subDistricts: ['Cihideung', 'Tawang', 'Cipedes', 'Indihiang', 'Mangkubumi', 'Kawalu'] },
      { name: 'Cirebon', province: 'Jawa Barat', subDistricts: ['Kesambi', 'Kejaksan', 'Lemahwungkuk', 'Harjamukti', 'Pekalipan'] },
      { name: 'Sukabumi', province: 'Jawa Barat', subDistricts: ['Cikole', 'Citamiang', 'Warudoyong', 'Baros', 'Lembursitu'] },
      { name: 'Karawang', province: 'Jawa Barat', subDistricts: ['Karawang Barat', 'Karawang Timur', 'Telukjambe', 'Klari'] },
      { name: 'Purwakarta', province: 'Jawa Barat', subDistricts: ['Purwakarta Kota', 'Campaka', 'Cipanas'] }
    ]
  },
  {
    region: 'Jawa Tengah & D.I. Yogyakarta',
    cities: [
      { name: 'Solo', province: 'Jawa Tengah', subDistricts: ['Banjarsari', 'Jebres', 'Laweyan', 'Pasar Kliwon', 'Serengan', 'Solo Baru', 'Kartasura', 'Colomadu', 'Mojosongo'] },
      { name: 'Semarang', province: 'Jawa Tengah', subDistricts: ['Tembalang', 'Banyumanik', 'Gunungpati', 'Pedurungan', 'Ngaliyan', 'Semarang Barat', 'Semarang Tengah', 'Semarang Selatan', 'Pleburan'] },
      { name: 'Yogyakarta', province: 'D.I. Yogyakarta', subDistricts: ['Yogyakarta Kota', 'Depok Sleman', 'Caturtunggal', 'Condongcatur', 'Pogung UGM', 'Seturan', 'Babarsari', 'Gejayan', 'Bantul Sewon'] },
      { name: 'Purwokerto', province: 'Jawa Tengah', subDistricts: ['Purwokerto Timur', 'Purwokerto Barat', 'Purwokerto Utara', 'Purwokerto Selatan', 'Banyumas', 'Baturraden'] },
      { name: 'Tegal', province: 'Jawa Tengah', subDistricts: ['Tegal Barat', 'Tegal Timur', 'Tegal Selatan', 'Margadana', 'Slawi'] },
      { name: 'Magelang', province: 'Jawa Tengah', subDistricts: ['Magelang Tengah', 'Magelang Utara', 'Magelang Selatan', 'Mertoyudan'] },
      { name: 'Salatiga', province: 'Jawa Tengah', subDistricts: ['Sidorejo', 'Tingkir', 'Argomulyo', 'Sidomukti'] }
    ]
  },
  {
    region: 'Jawa Timur',
    cities: [
      { name: 'Surabaya', province: 'Jawa Timur', subDistricts: ['Surabaya Pusat', 'Gubeng', 'Sukolilo', 'Mulyorejo', 'Rungkut', 'Tenggilis Mejoyo', 'Wonokromo', 'Darmo', 'HR Muhammad', 'Wiyung'] },
      { name: 'Malang', province: 'Jawa Timur', subDistricts: ['Klojen', 'Lowokwaru', 'Blimbing', 'Sukun', 'Kedungkandang', 'Suhat', 'Dinoyo', 'Batu Malang'] },
      { name: 'Banyuwangi', province: 'Jawa Timur', subDistricts: ['Banyuwangi Kota', 'Rogojampi', 'Genteng', 'Giri', 'Glagah', 'Kalipuro'] },
      { name: 'Sidoarjo', province: 'Jawa Timur', subDistricts: ['Sidoarjo Kota', 'Waru', 'Candi', 'Gedangan', 'Taman'] },
      { name: 'Jember', province: 'Jawa Timur', subDistricts: ['Sumbersari', 'Patrang', 'Kaliwates'] },
      { name: 'Kediri', province: 'Jawa Timur', subDistricts: ['Kota Kediri', 'Mojoroto', 'Pesantren'] }
    ]
  },
  {
    region: 'Bali & Nusa Tenggara',
    cities: [
      { name: 'Denpasar', province: 'Bali', subDistricts: ['Denpasar Selatan', 'Denpasar Barat', 'Denpasar Timur', 'Denpasar Utara', 'Sanur', 'Renon'] },
      { name: 'Badung', province: 'Bali', subDistricts: ['Kuta', 'Kuta Utara', 'Kuta Selatan', 'Seminyak', 'Canggu', 'Jimbaran', 'Nusa Dua'] },
      { name: 'Gianyar', province: 'Bali', subDistricts: ['Ubud', 'Sukawati', 'Tegallalang', 'Gianyar Kota'] },
      { name: 'Mataram', province: 'Nusa Tenggara Barat', subDistricts: ['Mataram Kota', 'Ampenan', 'Cakranegara', 'Sekarbela'] },
      { name: 'Kupang', province: 'Nusa Tenggara Timur', subDistricts: ['Kupang Barat', 'Kupang Timur', 'Oebobo', 'Kota Lama'] }
    ]
  },
  {
    region: 'Sumatera',
    cities: [
      { name: 'Medan', province: 'Sumatera Utara', subDistricts: ['Medan Baru', 'Padang Bulan', 'Medan Kota', 'Medan Johor', 'Polonia'] },
      { name: 'Deli Serdang & Binjai', province: 'Sumatera Utara', subDistricts: ['Lubuk Pakam', 'Percut Sei Tuan', 'Sunggal', 'Binjai Kota'] },
      { name: 'Palembang', province: 'Sumatera Selatan', subDistricts: ['Ilir Barat', 'Ilir Timur', 'Seberang Ulu', 'Sukarami', 'Bukit Kecil'] },
      { name: 'Pekanbaru', province: 'Riau', subDistricts: ['Rumbai', 'Tenayan Raya', 'Pekanbaru Kota', 'Marpoyan Damai'] },
      { name: 'Batam', province: 'Kepulauan Riau', subDistricts: ['Batam Kota', 'Lubuk Baja', 'Nagoya', 'Batu Aji', 'Sekupang'] },
      { name: 'Padang', province: 'Sumatera Barat', subDistricts: ['Padang Barat', 'Padang Timur', 'Padang Utara', 'Koto Tangah'] },
      { name: 'Bandar Lampung', province: 'Lampung', subDistricts: ['Tanjung Karang', 'Kedaton', 'Rajabasa', 'Teluk Betung', 'Sukarame'] },
      { name: 'Jambi', province: 'Jambi', subDistricts: ['Telanaipura', 'Jambi Selatan', 'Pasar Jambi', 'Jelutung', 'Danau Sipin', 'Kotabaru'] },
      { name: 'Banda Aceh', province: 'Aceh', subDistricts: ['Baiturrahman', 'Kuta Alam', 'Syiah Kuala', 'Lueng Bata', 'Ulee Kareng', 'Meuraxa'] }
    ]
  },
  {
    region: 'Kalimantan',
    cities: [
      { name: 'Balikpapan', province: 'Kalimantan Timur', subDistricts: ['Balikpapan Kota', 'Balikpapan Selatan', 'Balikpapan Tengah', 'Balikpapan Utara'] },
      { name: 'Samarinda', province: 'Kalimantan Timur', subDistricts: ['Samarinda Kota', 'Samarinda Ulu', 'Samarinda Ilir', 'Sungai Kunjang'] },
      { name: 'Banjarmasin', province: 'Kalimantan Selatan', subDistricts: ['Banjarmasin Tengah', 'Banjarmasin Barat', 'Banjarmasin Timur', 'Banjarmasin Utara'] },
      { name: 'Banjarbaru', province: 'Kalimantan Selatan', subDistricts: ['Banjarbaru Kota', 'Martapura', 'Landasan Ulin', 'Gambut', 'Kertak Hanyar'] },
      { name: 'Pontianak', province: 'Kalimantan Barat', subDistricts: ['Pontianak Kota', 'Pontianak Selatan', 'Pontianak Tenggara', 'Pontianak Barat', 'Pontianak Utara'] },
      { name: 'Singkawang', province: 'Kalimantan Barat', subDistricts: ['Singkawang Barat', 'Singkawang Tengah', 'Singkawang Selatan', 'Singkawang Utara'] }
    ]
  },
  {
    region: 'Sulawesi',
    cities: [
      { name: 'Makassar', province: 'Sulawesi Selatan', subDistricts: ['Panakkukang', 'Rappocini', 'Ujung Pandang', 'Tamalanrea', 'Biringkanaya', 'Mamajang'] },
      { name: 'Gowa', province: 'Sulawesi Selatan', subDistricts: ['Somba Opu', 'Pallangga', 'Bontomarannu', 'Barombong', 'Bajeng'] },
      { name: 'Manado', province: 'Sulawesi Utara', subDistricts: ['Wenang', 'Malalayang', 'Sario', 'Tikala'] },
      { name: 'Tomohon', province: 'Sulawesi Utara', subDistricts: ['Tomohon Tengah', 'Tomohon Utara', 'Tomohon Selatan', 'Tomohon Barat'] },
      { name: 'Palu', province: 'Sulawesi Tengah', subDistricts: ['Palu Barat', 'Palu Timur', 'Palu Selatan', 'Palu Utara', 'Mantikulore', 'Tatanga'] }
    ]
  },
  {
    region: 'Papua',
    cities: [
      { name: 'Jayapura', province: 'Papua', subDistricts: ['Jayapura Selatan', 'Jayapura Utara', 'Abepura', 'Sentani'] },
      { name: 'Sorong', province: 'Papua Barat', subDistricts: ['Sorong Barat', 'Sorong Timur', 'Sorong Kepulauan', 'Klayili'] }
    ]
  }
];

export function cityMeta(cityName) {
  const needle = String(cityName || '').toLowerCase();
  for (const region of REGION_CLUSTERS) {
    for (const city of region.cities) {
      if (city.name.toLowerCase() === needle) {
        return { region: region.region, city: city.name, province: city.province, subDistricts: city.subDistricts || [] };
      }
    }
  }
  return null;
}

export function keywordsForCategory(catId) {
  for (const sector of CATEGORY_SECTORS) {
    const hit = sector.categories.find((c) => c.id === catId);
    if (hit) return hit.keywords;
  }
  return [];
}

export function labelForCategory(catId) {
  for (const sector of CATEGORY_SECTORS) {
    const hit = sector.categories.find((c) => c.id === catId);
    if (hit) return hit.label;
  }
  return catId;
}
