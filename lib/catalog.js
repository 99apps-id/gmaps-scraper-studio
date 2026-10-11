/**
 * Katalog Komprehensif: Kategori Jenis Usaha & Wilayah / Kota Indonesia
 */

export const CATEGORY_SECTORS = [
  {
    id: 'komputer_gadget',
    name: 'Komputer, Gadget & Elektronik',
    iconName: 'laptop',
    categories: [
      { id: 'toko_komputer', label: 'Toko Komputer', keywords: ['toko komputer', 'pusat komputer', 'laptop store', 'toko laptop'] },
      { id: 'servis_sparepart_komputer', label: 'Toko Sparepart dan Perbaikan Komputer', keywords: ['sparepart komputer', 'servis komputer', 'perbaikan laptop', 'service center komputer'] },
      { id: 'toko_handphone', label: 'Toko Handphone', keywords: ['toko handphone', 'toko hp', 'gadget store', 'counter hp'] },
      { id: 'servis_handphone', label: 'Toko Perbaikan Handphone', keywords: ['servis handphone', 'service hp', 'perbaikan hp', 'ganti lcd hp'] },
      { id: 'sparepart_handphone', label: 'Toko Sparepart Handphone', keywords: ['sparepart handphone', 'sparepart hp', 'distributor sparepart hp', 'lcd touchscreen hp'] }
    ]
  },
  {
    id: 'ritel_sembako',
    name: 'Kebutuhan Pokok, Ritel & Sembako',
    iconName: 'shopping-cart',
    categories: [
      { id: 'groceries', label: 'Groceries', keywords: ['groceries', 'pasar modern', 'supermarket buah sayur', 'toko bahan makanan'] },
      { id: 'toko_sembako', label: 'Toko Sembako', keywords: ['toko sembako', 'agen sembako', 'grosir sembako', 'sembako murah'] },
      { id: 'supplier_daging', label: 'Supplier Daging', keywords: ['supplier daging', 'distributor daging sapi', 'meat shop', 'daging beku supplier'] },
      { id: 'toko_perabotan', label: 'Toko Perabotan', keywords: ['toko perabotan', 'toko perabot rumah tangga', 'toko mebel', 'perabotan rumah'] },
      { id: 'toko_mainan', label: 'Toko Mainan', keywords: ['toko mainan', 'toko mainan anak', 'toy store', 'grosir mainan'] },
      { id: 'laundry', label: 'Laundry', keywords: ['laundry kiloan', 'laundry koin', 'laundry satuan', 'dry clean'] },
      { id: 'butik', label: 'Butik', keywords: ['butik', 'butik pakaian', 'fashion boutique', 'toko butik busana'] },
      { id: 'minimarket', label: 'Minimarket & Supermarket', keywords: ['minimarket', 'toko kelontong modern', 'supermarket'] }
    ]
  },
  {
    id: 'material_industri',
    name: 'Bahan Bangunan, Perkakas & Supplier B2B',
    iconName: 'hammer',
    categories: [
      { id: 'toko_baja', label: 'Toko Baja', keywords: ['toko baja', 'distributor besi baja', 'toko besi baja', 'supplier baja wf h beam'] },
      { id: 'distributor_stainless', label: 'Distributor Stainless Steel', keywords: ['distributor stainless steel', 'stainless steel supplier', 'plat stainless steel', 'pipa stainless'] },
      { id: 'toko_bangunan', label: 'Toko Bangunan', keywords: ['toko bangunan', 'toko bahan bangunan', 'depo bangunan'] },
      { id: 'toko_material', label: 'Toko Material', keywords: ['toko material', 'material bangunan', 'semen pasir bata'] },
      { id: 'toko_perkakas', label: 'Toko Perkakas', keywords: ['toko perkakas', 'hardware store', 'alat teknik', 'perkakas mesin'] },
      { id: 'supplier_atk', label: 'Supplier ATK', keywords: ['supplier atk', 'distributor alat tulis kantor', 'grosir atk', 'toko atk'] }
    ]
  },
  {
    id: 'wisata_rekreasi',
    name: 'Pariwisata, Rekreasi & Olahraga',
    iconName: 'map-pin',
    categories: [
      { id: 'tempat_wisata', label: 'Tempat Wisata', keywords: ['tempat wisata', 'destinasi wisata', 'wisata rekreasi', 'objek wisata'] },
      { id: 'bilyar', label: 'Bilyar / Billiard', keywords: ['bilyar', 'billiard', 'meja bilyar', 'pool lounge', 'arena bilyar'] },
      { id: 'gym', label: 'Gym, Fitness & Studio Yoga', keywords: ['gym fitness', 'tempat fitness', 'studio senam'] }
    ]
  },
  {
    id: 'properti',
    name: 'Properti & Akomodasi',
    iconName: 'building',
    categories: [
      { id: 'kost_putra', label: 'Kost Putra', keywords: ['kost putra', 'kosan putra', 'kost cowok', 'kost pria'] },
      { id: 'kost_putri', label: 'Kost Putri', keywords: ['kost putri', 'kosan putri', 'kost cewek', 'kost wanita'] },
      { id: 'kost_pasutri', label: 'Kost Pasutri', keywords: ['kost pasutri', 'kost suami istri', 'kost keluarga'] },
      { id: 'kost_umum', label: 'Kost Umum', keywords: ['kost umum', 'kost campur umum', 'kosan umum'] },
      { id: 'kost_bebas', label: 'Kost Bebas', keywords: ['kost bebas', 'kost bebas 24 jam', 'kost akses 24 jam bebas'] },
      { id: 'kost', label: 'Kost / Rumah Kost', keywords: ['kost', 'kosan', 'rumah pondokan', 'kost eksklusif'] },
      { id: 'kontrakan', label: 'Rumah Kontrakan & Sewa', keywords: ['rumah kontrakan', 'kontrakan', 'sewa rumah'] },
      { id: 'apartemen', label: 'Apartemen Sewa (Harian/Bulanan)', keywords: ['sewa apartemen', 'apartemen harian', 'apartemen bulanan'] },
      { id: 'hotel', label: 'Hotel & Penginapan', keywords: ['hotel', 'penginapan', 'hotel melati', 'hotel budget'] },
      { id: 'guesthouse', label: 'Guest House & Homestay', keywords: ['guest house', 'homestay', 'villa'] }
    ]
  },
  {
    id: 'kuliner',
    name: 'Kuliner & F&B',
    iconName: 'coffee',
    categories: [
      { id: 'kafe', label: 'Kafe & Coffee Shop', keywords: ['kafe', 'coffee shop', 'tempat ngopi', 'warkop modern'] },
      { id: 'resto_padang', label: 'Restoran Padang', keywords: ['restoran padang', 'rumah makan padang', 'nasi kapau'] },
      { id: 'warteg', label: 'Warteg & Rumah Makan', keywords: ['warteg', 'rumah makan', 'warung nasi'] },
      { id: 'bakery', label: 'Bakery & Toko Roti / Kue', keywords: ['bakery', 'toko roti', 'toko kue', 'pastry'] },
      { id: 'seafood', label: 'Restoran Seafood', keywords: ['seafood', 'ikan bakar', 'restoran seafood'] },
      { id: 'catering', label: 'Katering & Nasi Kotak', keywords: ['katering', 'catering', 'nasi box'] }
    ]
  },
  {
    id: 'kesehatan',
    name: 'Kesehatan & Medis',
    iconName: 'activity',
    categories: [
      { id: 'apotek', label: 'Apotek & Farmasi (24 Jam)', keywords: ['apotek', 'apotik', 'apotek 24 jam', 'farmasi'] },
      { id: 'klinik_gigi', label: 'Klinik Gigi & Dental Care', keywords: ['klinik gigi', 'dokter gigi', 'dental clinic'] },
      { id: 'klinik_umum', label: 'Klinik Pratama & Umum', keywords: ['klinik pratama', 'klinik umum', 'klinik 24 jam'] },
      { id: 'laboratorium', label: 'Laboratorium Medis & Klinik', keywords: ['laboratorium medis', 'lab klinik', 'prodia'] },
      { id: 'optik', label: 'Optik Kacamata', keywords: ['optik kacamata', 'toko optik'] },
      { id: 'fisioterapi', label: 'Fisioterapi & Rehabilitasi', keywords: ['fisioterapi', 'klinik fisioterapi'] }
    ]
  },
  {
    id: 'otomotif',
    name: 'Otomotif & Servis',
    iconName: 'truck',
    categories: [
      { id: 'bengkel_mobil', label: 'Bengkel Mobil & Servis', keywords: ['bengkel mobil', 'servis mobil', 'tune up mobil'] },
      { id: 'bengkel_motor', label: 'Bengkel Motor', keywords: ['bengkel motor', 'servis motor', 'ahass'] },
      { id: 'cuci_mobil', label: 'Cuci Mobil & Motor (Car Wash)', keywords: ['cuci mobil', 'car wash', 'steam mobil motor'] },
      { id: 'toko_ban', label: 'Toko Ban & Velg', keywords: ['toko ban mobil', 'spooring balancing', 'velg mobil'] },
      { id: 'body_repair', label: 'Body Repair & Cat Mobil', keywords: ['body repair', 'cat mobil', 'ketok magic'] }
    ]
  },
  {
    id: 'bisnis',
    name: 'Bisnis, Kantor & Jasa',
    iconName: 'briefcase',
    categories: [
      { id: 'coworking', label: 'Coworking Space & Kantor Bersama', keywords: ['coworking space', 'sewa kantor', 'virtual office'] },
      { id: 'bimbel', label: 'Bimbingan Belajar (Bimbel)', keywords: ['bimbingan belajar', 'bimbel', 'les privat'] },
      { id: 'kursus_bahasa', label: 'Kursus Bahasa Inggris / Asing', keywords: ['kursus bahasa inggris', 'kursus bahasa', 'english course'] },
      { id: 'percetakan', label: 'Percetakan & Digital Printing', keywords: ['percetakan', 'digital printing', 'fotocopy center'] },
      { id: 'ekspedisi', label: 'Jasa Ekspedisi & Logistik', keywords: ['jnt', 'jne', 'sicepat', 'ekspedisi', 'kantor pos'] },
      { id: 'barbershop', label: 'Barbershop & Salon Rambut', keywords: ['barbershop', 'salon rambut', 'pangkas rambut'] },
      { id: 'petshop', label: 'Pet Shop & Dokter Hewan', keywords: ['pet shop', 'klinik hewan', 'dokter hewan'] }
    ]
  },
  {
    id: 'legal_keuangan',
    name: 'Legal, Pajak & Konsultan B2B',
    iconName: 'file-text',
    categories: [
      { id: 'notaris_ppat', label: 'Notaris & PPAT', keywords: ['notaris ppat', 'kantor notaris', 'notaris', 'ppat'] },
      { id: 'konsultan_pajak', label: 'Konsultan Pajak & Akuntan Publik', keywords: ['konsultan pajak', 'kantor akuntan publik', 'tax consultant', 'jasa pembukuan akuntansi'] },
      { id: 'kantor_hukum', label: 'Kantor Hukum & Pengacara', keywords: ['kantor hukum', 'advokat', 'pengacara', 'law firm', 'konsultan hukum'] }
    ]
  },
  {
    id: 'kecantikan_estetika',
    name: 'Kecantikan, Estetika & Spa',
    iconName: 'smile',
    categories: [
      { id: 'klinik_kecantikan', label: 'Klinik Kecantikan & Estetika', keywords: ['klinik kecantikan', 'beauty clinic', 'aesthetic clinic', 'klinik estetika wajah'] },
      { id: 'salon_spa', label: 'Salon Kecantikan & Spa Reflexology', keywords: ['salon kecantikan', 'spa reflexology', 'tempat spa', 'refleksi keluarga'] }
    ]
  },
  {
    id: 'event_wedding',
    name: 'Wedding, Event & Fotografi',
    iconName: 'camera',
    categories: [
      { id: 'wedding_organizer', label: 'Wedding & Event Organizer', keywords: ['wedding organizer', 'event organizer', 'eo gathering', 'paket pernikahan'] },
      { id: 'studio_foto', label: 'Studio Foto & Fotografi', keywords: ['studio foto', 'photo studio', 'fotografer pernikahan', 'fotografer produk'] }
    ]
  }
];

export const REGION_CLUSTERS = [
  {
    region: 'Jabodetabek & Banten',
    cities: [
      { name: 'Jakarta Selatan', province: 'DKI Jakarta', subDistricts: ['Tebet', 'Setiabudi', 'Mampang Prapatan', 'Pancoran', 'Pasar Minggu', 'Cilandak', 'Kebayoran Baru', 'Kebayoran Lama', 'Jagakarsa', 'Pesanggrahan', 'Kalibata', 'Kuningan Barat'] },
      { name: 'Jakarta Pusat', province: 'DKI Jakarta', subDistricts: ['Menteng', 'Tanah Abang', 'Senen', 'Cempaka Putih', 'Johar Baru', 'Kemayoran', 'Sawah Besar', 'Gambir', 'Salemba'] },
      { name: 'Jakarta Barat', province: 'DKI Jakarta', subDistricts: ['Grogol', 'Tanjung Duren', 'Palmerah', 'Kebon Jeruk', 'Kembangan', 'Puri Indah', 'Cengkareng', 'Kalideres', 'Tomang'] },
      { name: 'Jakarta Timur', province: 'DKI Jakarta', subDistricts: ['Rawamangun', 'Matraman', 'Jatinegara', 'Duren Sawit', 'Kramat Jati', 'Pulo Gadung', 'Pasar Rebo', 'Ciracas', 'Cipayung'] },
      { name: 'Jakarta Utara', province: 'DKI Jakarta', subDistricts: ['Kelapa Gading', 'Sunter', 'Tanjung Priok', 'Pademangan', 'Pluit', 'Penjaringan', 'PIK', 'Koja'] },
      { name: 'Depok', province: 'Jawa Barat', subDistricts: ['Margonda', 'Beji', 'Kukusan', 'Pondok Cina', 'Kelapa Dua', 'Cinere', 'Sawangan', 'Cimanggis', 'Sukmajaya'] },
      { name: 'Bintaro', province: 'Banten', subDistricts: ['Bintaro Sektor 1-9', 'Pondok Aren', 'Ciputat', 'Pamulang', 'Pondok Ranji', 'Bintaro Jaya', 'Serpong BSD'] },
      { name: 'Bekasi', province: 'Jawa Barat', subDistricts: ['Bekasi Barat', 'Bekasi Timur', 'Bekasi Selatan', 'Bekasi Utara', 'Summarecon Bekasi', 'Tambun', 'Cikarang Jababeka', 'Kalimalang'] },
      { name: 'Kota Bogor', province: 'Jawa Barat', subDistricts: ['Bogor Tengah', 'Bogor Barat', 'Bogor Timur', 'Bogor Utara', 'Bogor Selatan', 'Tanah Sareal', 'Pajajaran', 'Baranangsiang'] },
      { name: 'Kabupaten Bogor', province: 'Jawa Barat', subDistricts: ['Dramaga', 'Cibinong', 'Bojonggede', 'Cileungsi', 'Gunung Putri', 'Ciawi', 'Sentul City'] },
      { name: 'Tangerang Kota', province: 'Banten', subDistricts: ['Ciledug', 'Karawaci', 'Cipondoh', 'Batuceper', 'Pinang', 'Tangerang Kota'] },
      { name: 'Cilegon', province: 'Banten', subDistricts: ['Cilegon Kota', 'Cibeber', 'Jombang', 'Citangkil', 'Ciwandan', 'Grogol Cilegon'] },
      { name: 'Serang', province: 'Banten', subDistricts: ['Serang Kota', 'Cipocok Jaya', 'Curug', 'Kasemen', 'Taktakan', 'Walantaka'] }
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
      { name: 'Karawang', province: 'Jawa Barat', subDistricts: ['Karawang Barat', 'Karawang Timur', 'Telukjambe', 'Klari'] }
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
      { name: 'Banjarnegara', province: 'Jawa Tengah', subDistricts: ['Banjarnegara Kota', 'Bawang', 'Purwanegara', 'Madukara', 'Wanadadi'] },
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
      { name: 'Gianyar (Ubud)', province: 'Bali', subDistricts: ['Ubud', 'Sukawati', 'Tegallalang', 'Gianyar Kota'] },
      { name: 'Mataram', province: 'Nusa Tenggara Barat', subDistricts: ['Mataram Kota', 'Ampenan', 'Cakranegara', 'Sekarbela'] }
    ]
  },
  {
    region: 'Sumatera',
    cities: [
      { name: 'Medan', province: 'Sumatera Utara', subDistricts: ['Medan Baru', 'Padang Bulan', 'Medan Selayang', 'Medan Petisah', 'Medan Kota', 'Medan Tembung', 'Medan Johor', 'Medan Sunggal'] },
      { name: 'Deli Serdang & Binjai', province: 'Sumatera Utara', subDistricts: ['Lubuk Pakam', 'Percut Sei Tuan', 'Sunggal', 'Binjai Kota'] },
      { name: 'Palembang', province: 'Sumatera Selatan', subDistricts: ['Ilir Barat', 'Ilir Timur', 'Seberang Ulu', 'Sukarami', 'Bukit Kecil'] },
      { name: 'Pekanbaru', province: 'Riau', subDistricts: ['Tampan', 'Marpoyan Damai', 'Bukit Raya', 'Sukajadi', 'Senapelan'] },
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
      { name: 'Banjarbaru & Martapura', province: 'Kalimantan Selatan', subDistricts: ['Banjarbaru Kota', 'Martapura', 'Landasan Ulin', 'Gambut', 'Kertak Hanyar'] },
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
  }
];
