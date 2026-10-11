/**
 * POI (Point of Interest) Database: Kampus / Universitas & Kawasan Perkantoran
 * Mendukung kalkulasi jarak terdekat (Haversine formula) & pencocokan teks alamat.
 */

export const POI_DATABASE = {
  'Jakarta': {
    campuses: [
      { name: 'Universitas Indonesia (Salemba/Kramat)', lat: -6.1945, lng: 106.8488, keywords: ['salemba', 'kramat', 'senen', 'ui salemba', 'kenari'] },
      { name: 'Universitas Indonesia (Depok/Jagakarsa)', lat: -6.3630, lng: 106.8288, keywords: ['depok', 'jagakarsa', 'lenteng agung', 'kukusan', 'pondok cina'] },
      { name: 'BINUS University (Kemanggisan/Palmerah)', lat: -6.2012, lng: 106.7818, keywords: ['binus', 'kemanggisan', 'palmerah', 'rawabelong', 'syahdan', 'anggrek'] },
      { name: 'Universitas Trisakti & UNTAR (Grogol)', lat: -6.1678, lng: 106.7905, keywords: ['trisakti', 'untar', 'grogol', 'tanjung duren', 'tomang', 'kyai tapa'] },
      { name: 'Universitas Katolik Atma Jaya (Semanggi)', lat: -6.2185, lng: 106.8159, keywords: ['atma jaya', 'semanggi', 'karet semanggi', 'setiabudi'] },
      { name: 'Universitas Negeri Jakarta (UNJ Rawamangun)', lat: -6.1950, lng: 106.8810, keywords: ['unj', 'rawamangun', 'pemuda', 'pulogadung'] },
      { name: 'UPN Veteran Jakarta (Fatmawati/Pondok Labu)', lat: -6.3148, lng: 106.7972, keywords: ['upn', 'pondok labu', 'fatmawati', 'cilandak', 'cinere'] },
      { name: 'Universitas Pancasila (Lenteng Agung)', lat: -6.3392, lng: 106.8336, keywords: ['pancasila', 'srengseng sawah', 'lenteng agung'] },
      { name: 'Universitas Mercu Buana (Meruya/Kembangan)', lat: -6.2090, lng: 106.7380, keywords: ['mercu buana', 'meruya', 'kembangan', 'joglo'] },
      { name: 'Universitas Esa Unggul & Ukrida (Kebon Jeruk)', lat: -6.1905, lng: 106.7810, keywords: ['esa unggul', 'ukrida', 'arjuna utara', 'duri kepa'] },
      { name: 'Universitas Kristen Indonesia / UKI (Cawang)', lat: -6.2570, lng: 106.8710, keywords: ['uki', 'cawang', 'mayjen sutoyo', 'kramat jati'] },
      { name: 'Universitas Bakrie (Rasuna Said Kuningan)', lat: -6.2190, lng: 106.8330, keywords: ['bakrie', 'rasuna epicentrum', 'kuningan'] },
      { name: 'Universitas Trilogi (Kalibata/Pancoran)', lat: -6.2570, lng: 106.8520, keywords: ['trilogi', 'kalibata', 'duren tiga', 'stasiun kalibata'] },
      { name: 'Universitas Paramadina (Mampang Prapatan)', lat: -6.2415, lng: 106.8320, keywords: ['paramadina', 'mampang prapatan', 'tendean'] }
    ],
    offices: [
      { name: 'Kawasan SCBD & Senayan (CBD)', lat: -6.2255, lng: 106.8090, keywords: ['scbd', 'senayan', 'sudirman', 'tulodong', 'senopati', 'kebayoran baru'] },
      { name: 'Koridor Sudirman - MH Thamrin (Pusat Bisnis)', lat: -6.2088, lng: 106.8227, keywords: ['thamrin', 'bundaran hi', 'karet', 'tanah abang', 'dukuh atas'] },
      { name: 'Kawasan Mega Kuningan & Kuningan Barat', lat: -6.2350, lng: 106.8240, keywords: ['kuningan barat', 'mega kuningan', 'rasuna said', 'kuningan timur', 'patra kuningan'] },
      { name: 'Kawasan Perkantoran Mampang Prapatan & Tendean', lat: -6.2410, lng: 106.8310, keywords: ['mampang prapatan', 'mampang', 'tendean', 'buncit', 'warung buncit'] },
      { name: 'Kawasan Perkantoran Tebet & Casablanca', lat: -6.2260, lng: 106.8480, keywords: ['tebet', 'casablanca', 'kota kasablanka', 'tebet raya', 'dr saharjo', 'bukit duri'] },
      { name: 'Kawasan Bisnis Kalibata & Duren Tiga Hub', lat: -6.2580, lng: 106.8530, keywords: ['kalibata', 'kalibata city', 'duren tiga', 'pengadegan', 'rawajati'] },
      { name: 'Kawasan Komersial Grogol & Tanjung Duren Hub', lat: -6.1710, lng: 106.7890, keywords: ['grogol', 'tanjung duren', 'kyai tapa', 'dr susilo', 'muwardi'] },
      { name: 'Koridor TB Simatupang & Cilandak', lat: -6.2934, lng: 106.8080, keywords: ['tb simatupang', 'simatupang', 'cilandak', 'tanjung barat', 'ragunan', 'ampera'] },
      { name: 'Kawasan Gatot Subroto & MT Haryono', lat: -6.2389, lng: 106.8331, keywords: ['gatot subroto', 'mt haryono', 'pancoran', 'mampang prapatan', 'tebet'] },
      { name: 'Kawasan Bisnis Kelapa Gading & Sunter', lat: -6.1550, lng: 106.9020, keywords: ['kelapa gading', 'sunter', 'boulevard', 'danau sunter'] },
      { name: 'Kawasan Puri Indah & Kebon Jeruk', lat: -6.1870, lng: 106.7400, keywords: ['puri indah', 'puri', 'kebon jeruk', 'pesanggrahan', 'kembangan'] }
    ]
  },

  'Depok': {
    campuses: [
      { name: 'Universitas Indonesia (Kampus Utama Depok)', lat: -6.3630, lng: 106.8288, keywords: ['ui depok', 'margonda', 'kukusan', 'pondok cina', 'kutek', 'kober'] },
      { name: 'Universitas Gunadarma (Margonda/Kelapa Dua)', lat: -6.3685, lng: 106.8330, keywords: ['gunadarma', 'gundar', 'kelapa dua', 'akses ui'] },
      { name: 'Politeknik Negeri Jakarta / PNJ (Depok)', lat: -6.3710, lng: 106.8260, keywords: ['pnj', 'politeknik ui', 'beji'] },
      { name: 'Polimedia Kreatif (Srengseng Sawah/Depok)', lat: -6.3450, lng: 106.8270, keywords: ['polimedia', 'kukusan teknik'] },
      { name: 'UIII - Univ Islam Internasional Indonesia (Cisalak)', lat: -6.3900, lng: 106.8620, keywords: ['uiii', 'cisalak', 'raya bogor'] }
    ],
    offices: [
      { name: 'Koridor Bisnis & Perkantoran Margonda Raya', lat: -6.3780, lng: 106.8310, keywords: ['margonda', 'pesona square', 'margo city', 'detos', 'kemiri muka'] },
      { name: 'Kawasan Perkantoran GDC (Grand Depok City)', lat: -6.4250, lng: 106.8320, keywords: ['gdc', 'grand depok city', 'kalimulya', 'sukmajaya'] },
      { name: 'Kawasan Bisnis Cinere & Gandul Hub', lat: -6.3250, lng: 106.7820, keywords: ['cinere', 'gandul', 'cinere raya', 'pangkalan jati'] },
      { name: 'Kawasan TB Simatupang Selatan Corridor', lat: -6.3050, lng: 106.8300, keywords: ['simatupang', 'pasar minggu selatan'] }
    ]
  },

  'Bintaro': {
    campuses: [
      { name: 'Politeknik Keuangan Negara STAN (Bintaro Sektor 5)', lat: -6.2730, lng: 106.7280, keywords: ['stan', 'pkn stan', 'sektor 5', 'sarmili', 'kalimaya', 'ceger'] },
      { name: 'UIN Syarif Hidayatullah (Ciputat)', lat: -6.3075, lng: 106.7570, keywords: ['uin', 'ciputat', 'kertamukti', 'tarumanegara', 'pesanggrahan'] },
      { name: 'Universitas Pembangunan Jaya / UPJ (Bintaro Sektor 7)', lat: -6.2910, lng: 106.7160, keywords: ['upj', 'cendrawasih bintaro', 'sawah baru'] },
      { name: 'Universitas Pamulang / UNPAM (Pamulang)', lat: -6.3450, lng: 106.7380, keywords: ['unpam', 'pamulang', 'surya kencana', 'siliwangi'] }
    ],
    offices: [
      { name: 'Kawasan CBD Bintaro Jaya (Sektor 7 & 9)', lat: -6.2840, lng: 106.7220, keywords: ['cbd bintaro', 'bintaro sektor 7', 'bintaro sektor 9', 'bintaro xchange', 'titan center'] },
      { name: 'Kawasan Bisnis Bintaro Sektor 1-3 & Pondok Ranji', lat: -6.2700, lng: 106.7450, keywords: ['bintaro plaza', 'pondok ranji', 'sektor 3', 'sektor 1', 'rempoa'] },
      { name: 'Kawasan Bisnis BSD City & Serpong Corridor', lat: -6.2950, lng: 106.6780, keywords: ['bsd', 'bsd city', 'serpong', 'green office park'] },
      { name: 'Kawasan Komersial Ciputat Raya & Pamulang Hub', lat: -6.3200, lng: 106.7480, keywords: ['ciputat raya', 'gaplek', 'pamulang square'] }
    ]
  },

  'Bekasi': {
    campuses: [
      { name: 'President University (Jababeka Cikarang)', lat: -6.2885, lng: 107.1690, keywords: ['president university', 'jababeka', 'simatupang cikarang', 'mekarmukti'] },
      { name: 'Universitas Islam 45 / UNISMA (Bekasi Timur)', lat: -6.2520, lng: 107.0140, keywords: ['unisma', 'cut muthia', 'margahayu bekasi'] },
      { name: 'Universitas Gunadarma Kampus J & Kalimalang', lat: -6.2480, lng: 106.9740, keywords: ['gunadarma bekasi', 'kalimalang', 'jakasampurna'] },
      { name: 'BINUS University Summarecon Bekasi', lat: -6.2240, lng: 107.0010, keywords: ['binus bekasi', 'summarecon bekasi'] },
      { name: 'Universitas Bhayangkara Jakarta Raya (Bekasi Utara)', lat: -6.2230, lng: 107.0040, keywords: ['ubhara', 'perjuangan bekasi', 'marga mulya'] }
    ],
    offices: [
      { name: 'Kawasan CBD Summarecon Bekasi & Ahmad Yani', lat: -6.2330, lng: 106.9980, keywords: ['summarecon bekasi', 'ahmad yani bekasi', 'mega bekasi', 'pekayon'] },
      { name: 'Koridor Bisnis KH Noer Ali (Kalimalang Bekasi)', lat: -6.2490, lng: 106.9750, keywords: ['kalimalang', 'kh noer ali', 'grand metropolitan', 'bekasi barat'] },
      { name: 'Kawasan Industri Jababeka & Cikarang Techno Park', lat: -6.2950, lng: 107.1550, keywords: ['jababeka', 'ejip', 'hyundai cikarang', 'lippo cikarang', 'mm2100'] },
      { name: 'Kawasan Komersial Harapan Indah Bekasi', lat: -6.1820, lng: 106.9850, keywords: ['harapan indah', 'medan satria', 'pejuang'] }
    ]
  },

  'Bogor': {
    campuses: [
      { name: 'Institut Pertanian Bogor / IPB (Dramaga)', lat: -6.5590, lng: 106.7260, keywords: ['ipb dramaga', 'dramaga', 'babakan dramaga', 'balumbang jaya', 'cibanteng'] },
      { name: 'IPB University (Kampus Baranangsiang Kota)', lat: -6.6010, lng: 106.8070, keywords: ['ipb baranangsiang', 'pajajaran', 'botani square', 'tegalega'] },
      { name: 'Universitas Pakuan (Tegallega Bogor Timur)', lat: -6.5980, lng: 106.8120, keywords: ['pakuan', 'unpak', 'ciheuleut', 'tegalega'] },
      { name: 'Universitas Ibn Khaldun / UIKA (Tanah Sareal)', lat: -6.5610, lng: 106.7880, keywords: ['uika', 'ibn khaldun', 'sholeh iskandar', 'kedung badak'] },
      { name: 'Universitas Djuanda (Ciawi Bogor)', lat: -6.6570, lng: 106.8520, keywords: ['unida', 'djuanda', 'ciawi', 'toll jagorawi'] }
    ],
    offices: [
      { name: 'Koridor Pajajaran & Baranangsiang (CBD Kota Bogor)', lat: -6.6020, lng: 106.8080, keywords: ['pajajaran', 'baranangsiang', 'bangbarung', 'bantarjati'] },
      { name: 'Kawasan Bisnis Jl. Juanda & Sudirman Bogor', lat: -6.5920, lng: 106.7950, keywords: ['juanda bogor', 'sudirman bogor', 'surken', 'suryakencana'] },
      { name: 'Kawasan Komersial Sholeh Iskandar & Yasmin', lat: -6.5550, lng: 106.7780, keywords: ['sholeh iskandar', 'taman yasmin', 'bubulak'] },
      { name: 'Kawasan Pusat Pemerintahan & Bisnis Cibinong Pemda', lat: -6.4830, lng: 106.8380, keywords: ['cibinong', 'pemda bogor', 'tegar beriman', 'sentul city'] }
    ]
  },

  'Bandung': {
    campuses: [
      { name: 'Institut Teknologi Bandung / ITB (Ganesha)', lat: -6.8915, lng: 107.6107, keywords: ['itb', 'ganesha', 'tamansari', 'dago bawah', 'tubagus ismail', 'cisitu'] },
      { name: 'Universitas Padjadjaran / UNPAD (Dipatiukur)', lat: -6.8928, lng: 107.6178, keywords: ['unpad', 'dipatiukur', 'sekeloa', 'lebakgede', 'du'] },
      { name: 'Universitas Padjadjaran / UNPAD & IPDN (Jatinangor)', lat: -6.9270, lng: 107.7740, keywords: ['jatinangor', 'unpad jatinangor', 'ipdn', 'hegarmanah jatinangor', 'cikeruh'] },
      { name: 'Universitas Pendidikan Indonesia / UPI (Setiabudi)', lat: -6.8608, lng: 107.5942, keywords: ['upi', 'setiabudi', 'gegerkalong', 'ciwaruga', 'sukasari'] },
      { name: 'Telkom University (Dayeuhkolot/Buahbatu)', lat: -6.9740, lng: 107.6303, keywords: ['telkom', 'telkom university', 'dayeuhkolot', 'sukapura', 'terusan buahbatu', 'bojongsoang'] },
      { name: 'Universitas Kristen Maranatha (Surya Sumantri)', lat: -6.8879, lng: 107.5812, keywords: ['maranatha', 'surya sumantri', 'pasteur', 'sukajadi', 'sukagalih'] },
      { name: 'Universitas Katolik Parahyangan / UNPAR (Ciumbuleuit)', lat: -6.8744, lng: 107.6047, keywords: ['unpar', 'ciumbuleuit', 'hegarmanah', 'rancabentang'] },
      { name: 'UNISBA & UNPAS (Tamansari)', lat: -6.9022, lng: 107.6083, keywords: ['unisba', 'unpas', 'tamansari', 'balubur', 'wastukencana'] },
      { name: 'Politeknik Negeri Bandung / POLBAN (Sariwangi/Ciwaruga)', lat: -6.8710, lng: 107.5750, keywords: ['polban', 'ciwaruga', 'sariwangi', 'gegerkalong hilir'] },
      { name: 'Universitas Jenderal Achmad Yani / UNJANI (Cimahi)', lat: -6.8850, lng: 107.5350, keywords: ['unjani', 'cimahi', 'terusan jenderal sudirman', 'baros'] },
      { name: 'ITENAS & Universitas Widyatama (Cikutra)', lat: -6.8970, lng: 107.6360, keywords: ['itenas', 'widyatama', 'cikutra', 'phh mustofa', 'padasuka'] }
    ],
    offices: [
      { name: 'Kawasan Asia Afrika & Naripan (CBD Kota)', lat: -6.9214, lng: 107.6074, keywords: ['asia afrika', 'naripan', 'braga', 'alun-alun', 'lengkong', 'tamblong'] },
      { name: 'Koridor Riau (LLRE Martadinata) & Dago', lat: -6.9080, lng: 107.6180, keywords: ['riau', 'martadinata', 'dago', 'merdeka', 'bandung wetan'] },
      { name: 'Kawasan Bisnis Pasteur & Pasirkaliki', lat: -6.8965, lng: 107.5960, keywords: ['pasteur', 'pasirkaliki', 'ciroyom', 'sukajadi bawah', 'dr ottem'] },
      { name: 'Kawasan Bisnis Soekarno-Hatta & Buahbatu', lat: -6.9450, lng: 107.6320, keywords: ['soekarno hatta', 'buahbatu', 'batununggal', 'kordon', 'margacinta'] },
      { name: 'Kawasan Perkantoran Gedung Sate & Supratman', lat: -6.9025, lng: 107.6200, keywords: ['gedung sate', 'supratman', 'citarum', 'cibeunying', 'diponegoro'] },
      { name: 'Kawasan Niaga & Industri Cimahi - Baros', lat: -6.8900, lng: 107.5400, keywords: ['cimahi', 'baros', 'leuwigajah', 'cibeber'] },
      { name: 'Kawasan Komersial Jatinangor Town Square Hub', lat: -6.9310, lng: 107.7710, keywords: ['jatos', 'jatinangor', 'sayang jatinangor'] }
    ]
  },

  'Yogyakarta': {
    campuses: [
      { name: 'Universitas Gadjah Mada / UGM (Bulaksumur)', lat: -7.7713, lng: 110.3775, keywords: ['ugm', 'bulaksumur', 'pogung', 'blimbingsari', 'sagan', 'kaliurang bawah', 'sekip'] },
      { name: 'Universitas Negeri Yogyakarta / UNY (Karangmalang)', lat: -7.7745, lng: 110.3872, keywords: ['uny', 'karangmalang', 'colombo', 'samirono', 'gejayan barat'] },
      { name: 'Universitas Islam Indonesia / UII (Condongcatur/Kaliurang)', lat: -7.6876, lng: 110.4144, keywords: ['uii', 'kaliurang km', 'ngemplak', 'besi', 'jakal'] },
      { name: 'UPN Veteran Yogyakarta (Seturan/Babarsari)', lat: -7.7695, lng: 110.4085, keywords: ['upn', 'seturan', 'perumnas', 'kledokan', 'depok sleman'] },
      { name: 'Universitas Atma Jaya Yogyakarta (Babarsari)', lat: -7.7794, lng: 110.4158, keywords: ['atma jaya jogja', 'babarsari', 'tambakbayan', 'janti'] },
      { name: 'Universitas Muhammadiyah Yogyakarta / UMY (Kasihan)', lat: -7.8105, lng: 110.3225, keywords: ['umy', 'ringroad barat', 'kasihan', 'tamantirto', 'bantul utara'] },
      { name: 'Institut Seni Indonesia / ISI (Sewon Bantul)', lat: -7.8540, lng: 110.3580, keywords: ['isi', 'sewon', 'parangtritis', 'panggungharjo'] },
      { name: 'Universitas Sanata Dharma (Mrican/Paingan)', lat: -7.7760, lng: 110.3920, keywords: ['sadhar', 'sanata dharma', 'mrican', 'paingan'] },
      { name: 'Universitas Amikom Yogyakarta (Condongcatur)', lat: -7.7590, lng: 110.4080, keywords: ['amikom', 'ringroad utara depok'] }
    ],
    offices: [
      { name: 'Kawasan Bisnis Sudirman & Malioboro CBD', lat: -7.7828, lng: 110.3670, keywords: ['sudirman jogja', 'malioboro', 'mangkubumi', 'kotabaru', 'tugu jogja'] },
      { name: 'Koridor Bisnis Gejayan & Moses Gatotkaca', lat: -7.7750, lng: 110.3900, keywords: ['gejayan', 'moses gatotkaca', 'affandi', 'condongcatur'] },
      { name: 'Kawasan Komersial Seturan & Babarsari Hub', lat: -7.7750, lng: 110.4100, keywords: ['seturan', 'babarsari', 'kledokan', 'caturtunggal'] },
      { name: 'Koridor Ringroad Utara & Jl. Kaliurang', lat: -7.7550, lng: 110.3800, keywords: ['ringroad utara', 'kaliurang', 'kentungan', 'jakal km 5', 'jakal km 6'] },
      { name: 'Kawasan Jl. Magelang & Jombor Trade Center', lat: -7.7470, lng: 110.3620, keywords: ['jl magelang', 'jombor', 'sinduadi', 'mlati'] }
    ]
  },

  'Solo': {
    campuses: [
      { name: 'Universitas Sebelas Maret / UNS (Kentingan Jebres)', lat: -7.5585, lng: 110.8562, keywords: ['uns', 'kentingan', 'jebres', 'ngoho', 'pucangsawit', 'kolonel sutarto'] },
      { name: 'Universitas Muhammadiyah Surakarta / UMS (Pabelan)', lat: -7.5562, lng: 110.7725, keywords: ['ums', 'pabelan', 'kartasura', 'gonilan', 'mangunjiwan'] },
      { name: 'ISI Surakarta Kampus 2 (Ringroad Mojosongo)', lat: -7.5385, lng: 110.8490, keywords: ['isi 2', 'isi ii', 'isi mojosongo', 'kampus 2 isi', 'ringroad mojosongo', 'mojosongo jebres'] },
      { name: 'ISI Surakarta Kampus 1 (Kentingan Jebres)', lat: -7.5550, lng: 110.8540, keywords: ['isi solo', 'isi 1', 'isi kentingan', 'kentingan'] },
      { name: 'Universitas Slamet Riyadi / Unisri (Kadipiro)', lat: -7.5380, lng: 110.8170, keywords: ['unisri', 'kadipiro', 'banjarsari utara'] },
      { name: 'Universitas Duta Bangsa / UDB (Banjarsari)', lat: -7.5580, lng: 110.8130, keywords: ['udb', 'kerten', 'manahan', 'timuran'] },
      { name: 'Politeknik ATMI Surakarta (Jajar/Laweyan)', lat: -7.5485, lng: 110.7910, keywords: ['atmi', 'karangasem solo', 'jajar', 'adi sucipto'] },
      { name: 'Universitas Sahid Surakarta (Jajar/Laweyan)', lat: -7.5480, lng: 110.7890, keywords: ['sahid solo', 'jajar', 'adi sucipto'] }
    ],
    offices: [
      { name: 'Kawasan CBD Jl. Slamet Riyadi (Pusat Kota)', lat: -7.5670, lng: 110.8150, keywords: ['slamet riyadi', 'ngapeman', 'nonongan', 'purwosari', 'sriwedari'] },
      { name: 'Kawasan Bisnis Solo Baru (Soba Hub)', lat: -7.5990, lng: 110.8180, keywords: ['solo baru', 'soba', 'madegondo', 'grogol sukoharjo', 'the park'] },
      { name: 'Kawasan Komersial Manahan & Adi Sucipto', lat: -7.5520, lng: 110.8030, keywords: ['manahan', 'adi sucipto', 'kerten', 'jajar', 'colomadu'] },
      { name: 'Kawasan Niaga Pasar Gede & Urip Sumoharjo', lat: -7.5680, lng: 110.8320, keywords: ['pasar gede', 'urip sumoharjo', 'sudiroprajan', 'warung pelem'] }
    ]
  },

  'Surabaya': {
    campuses: [
      { name: 'Institut Teknologi Sepuluh Nopember / ITS (Sukolilo)', lat: -7.2824, lng: 112.7949, keywords: ['its', 'sukolilo', 'gebang', 'keputih', 'mulyosari'] },
      { name: 'Universitas Airlangga / UNAIR (Kampus A/B Gubeng)', lat: -7.2660, lng: 112.7565, keywords: ['unair gubeng', 'kampus a', 'kampus b', 'dharmawangsa', 'karangmenjangan', 'prof dr moestopo'] },
      { name: 'Universitas Airlangga / UNAIR (Kampus C Mulyorejo)', lat: -7.2715, lng: 112.7840, keywords: ['unair kampus c', 'mulyorejo', 'sutorejo', 'kalijudan'] },
      { name: 'Universitas Negeri Surabaya / UNESA (Lidah Wetan)', lat: -7.3015, lng: 112.6730, keywords: ['unesa', 'lidah wetan', 'lakarsantri', 'babatan', 'wiyung'] },
      { name: 'Universitas Kristen Petra (Siwalankerto)', lat: -7.3380, lng: 112.7350, keywords: ['petra', 'siwalankerto', 'kutisari', 'jemursari selatan'] },
      { name: 'Universitas Surabaya / UBAYA (Tenggilis)', lat: -7.3200, lng: 112.7670, keywords: ['ubaya', 'tenggilis mejoyo', 'panjang jiwo', 'kendangsari'] },
      { name: 'UPN Veteran Jawa Timur (Rungkut Madya)', lat: -7.3330, lng: 112.7885, keywords: ['upn jatim', 'rungkut madya', 'gunung anyar', 'medokan ayu'] },
      { name: 'UIN Sunan Ampel / UINSA (Wonocolo)', lat: -7.3210, lng: 112.7380, keywords: ['uinsa', 'ahmad yani', 'wonocolo'] },
      { name: 'Universitas Wijaya Kusuma Surabaya (Dukuh Kupang)', lat: -7.2910, lng: 112.7120, keywords: ['uwks', 'dukuh kupang', 'mayjen sungkono'] }
    ],
    offices: [
      { name: 'Kawasan Pusat Bisnis Basuki Rahmat & Tunjungan (CBD)', lat: -7.2625, lng: 112.7410, keywords: ['basuki rahmat', 'tunjungan', 'embong malang', 'panglima sudirman', 'pemuda'] },
      { name: 'Kawasan HR Muhammad & Mayjen Sungkono (Surabaya Barat)', lat: -7.2880, lng: 112.6950, keywords: ['hr muhammad', 'mayjen sungkono', 'darmo permai', 'bukit darmo', 'sukomanunggal'] },
      { name: 'Koridor Perkantoran Kertajaya & Manyar', lat: -7.2820, lng: 112.7650, keywords: ['kertajaya', 'manyar', 'ngagel', 'gubeng', 'dharmahusada'] },
      { name: 'Kawasan Industri & Bisnis Rungkut (SIER)', lat: -7.3310, lng: 112.7580, keywords: ['rungkut industri', 'sier', 'kendangsari', 'berbek'] },
      { name: 'Kawasan Komersial Jemursari & Margorejo', lat: -7.3200, lng: 112.7420, keywords: ['jemursari', 'margorejo', 'ahmad yani surabaya', 'wonocolo'] }
    ]
  },

  'Semarang': {
    campuses: [
      { name: 'Universitas Diponegoro / UNDIP (Tembalang)', lat: -7.0505, lng: 110.4395, keywords: ['undip', 'tembalang', 'prof soedarto', 'banjarsari semarang', 'bulusan', 'kramas'] },
      { name: 'Universitas Diponegoro / UNDIP (Pleburan/Pusat)', lat: -6.9940, lng: 110.4245, keywords: ['undip pleburan', 'pleburan', 'imam barjo', 'singosari', 'wonodri'] },
      { name: 'Universitas Negeri Semarang / UNNES (Sekaran)', lat: -7.0490, lng: 110.3830, keywords: ['unnes', 'sekaran', 'gunungpati', 'ngadirgo', 'sukorejo semarang'] },
      { name: 'Universitas Dian Nuswantoro / UDINUS (Imam Bonjol)', lat: -6.9825, lng: 110.4095, keywords: ['udinus', 'imam bonjol', 'pendrikan kidul', 'nakula', 'sadewa'] },
      { name: 'Universitas Islam Sultan Agung / UNISSULA (Kaligawe)', lat: -6.9580, lng: 110.4590, keywords: ['unissula', 'kaligawe', 'genuk', 'terboyo'] },
      { name: 'Universitas Katolik Soegijapranata (Bendan Dhuwur)', lat: -7.0220, lng: 110.4070, keywords: ['unika', 'soegijapranata', 'bendan dhuwur', 'gajahmungkur', 'pawiyatan luhur'] },
      { name: 'Politeknik Negeri Semarang / POLINES (Tembalang)', lat: -7.0540, lng: 110.4350, keywords: ['polines', 'sipodang', 'tembalang selatan'] },
      { name: 'Universitas Semarang / USM (Tlogosari/Pedurungan)', lat: -6.9830, lng: 110.4580, keywords: ['usm', 'tlogosari', 'arteri soekarno hatta', 'pedurungan'] }
    ],
    offices: [
      { name: 'Kawasan Simpang Lima & Jl. Pandanaran (CBD)', lat: -6.9905, lng: 110.4230, keywords: ['simpang lima', 'pandanaran', 'pahlawan semarang', 'pekojan', 'mugassari'] },
      { name: 'Kawasan Bisnis Jl. Pemuda & Gajah Mada', lat: -6.9770, lng: 110.4180, keywords: ['jl pemuda', 'gajah mada', 'kembangsari', 'kranggan', 'thamrin semarang'] },
      { name: 'Kawasan Komersial Ahmad Yani & MT Haryono', lat: -6.9920, lng: 110.4350, keywords: ['ahmad yani semarang', 'mt haryono semarang', 'mataram semarang', 'karangkidul'] },
      { name: 'Kawasan Industri Wijayakusuma & Tugu', lat: -6.9800, lng: 110.3350, keywords: ['wijayakusuma', 'tugu semarang', 'ngaliyan', 'krapyak'] },
      { name: 'Kawasan Komersial Setiabudi & Banyumanik', lat: -7.0650, lng: 110.4150, keywords: ['setiabudi semarang', 'banyumanik', 'sukun', 'pudakpayung'] }
    ]
  },

  'Medan': {
    campuses: [
      { name: 'Universitas Sumatera Utara / USU (Padang Bulan)', lat: -3.5650, lng: 98.6575, keywords: ['usu', 'padang bulan', 'dr mansyur', 'pintu 1 usu', 'pintu 2 usu', 'pintu 4 usu', 'beringin'] },
      { name: 'Universitas Negeri Medan / UNIMED (Tembung)', lat: -3.6120, lng: 98.7150, keywords: ['unimed', 'willem iskandar', 'pasar v tembung', 'medan tembung', 'sidorejo'] },
      { name: 'Universitas Muhammadiyah Sumatera Utara / UMSU (Glugur)', lat: -3.6110, lng: 98.6790, keywords: ['umsu', 'mukhtar basri', 'glugur darat', 'krakatau'] },
      { name: 'Universitas Prima Indonesia / UNPRI (Sampul/Ayahanda)', lat: -3.5930, lng: 98.6540, keywords: ['unpri', 'ayahanda', 'sampul', 'sei putih', 'darussalam'] },
      { name: 'UIN Sumatera Utara (Sutomo/Tuntungan)', lat: -3.5050, lng: 98.5720, keywords: ['uin su', 'uinsu', 'tuntungan', 'sutomo medan'] },
      { name: 'Politeknik Negeri Medan / POLMED (Padang Bulan)', lat: -3.5620, lng: 98.6550, keywords: ['polmed', 'almamater', 'kampus usu'] },
      { name: 'Universitas HKBP Nommensen (Perintis Kemerdekaan)', lat: -3.5970, lng: 98.6850, keywords: ['nommensen', 'perintis kemerdekaan', 'perintis'] },
      { name: 'Universitas Panca Budi (Gatot Subroto Medan)', lat: -3.5850, lng: 98.6360, keywords: ['panca budi', 'gatot subroto medan barat', 'sei sikambing'] }
    ],
    offices: [
      { name: 'Kawasan Perkantoran Balai Kota & Kesawan CBD', lat: -3.5910, lng: 98.6770, keywords: ['balai kota medan', 'kesawan', 'pemuda medan', 'raden saleh', 'bukit barisan'] },
      { name: 'Koridor Gatot Subroto & Medan Fair (CBD Barat)', lat: -3.5900, lng: 98.6590, keywords: ['gatot subroto medan', 'medan fair', 'sekip', 'petisah', 'iskandar muda'] },
      { name: 'Kawasan Bisnis Zainul Arifin & Cambridge Hub', lat: -3.5830, lng: 98.6700, keywords: ['zainul arifin', 'cambridge', 'diponegoro medan', 'imam bonjol medan', 'madras hulu'] },
      { name: 'Kawasan Komersial Adam Malik & Glugur', lat: -3.6050, lng: 98.6730, keywords: ['adam malik', 'glugur kota', 'yos sudarso medan', 'silalas'] },
      { name: 'Kawasan Komersial Ring Road & Gagak Hitam', lat: -3.5700, lng: 98.6250, keywords: ['ring road medan', 'gagak hitam', 'sunggal', 'tanjung sari'] }
    ]
  },

  'Malang': {
    campuses: [
      { name: 'Universitas Brawijaya / UB (Ketawanggede/Suhat)', lat: -7.9525, lng: 112.6145, keywords: ['brawijaya', 'ub', 'suhat', 'soekarno hatta malang', 'ketawanggede', 'watugong'] },
      { name: 'Universitas Negeri Malang / UM (Semarang/Klojen)', lat: -7.9620, lng: 112.6185, keywords: ['um malang', 'surabaya malang', 'semarang malang', 'klojen'] },
      { name: 'Universitas Muhammadiyah Malang / UMM (Tlogomas)', lat: -7.9210, lng: 112.5970, keywords: ['umm', 'tlogomas', 'landungsari', 'raya tegalgondo'] },
      { name: 'Politeknik Negeri Malang / POLINEMA (Suhat)', lat: -7.9465, lng: 112.6155, keywords: ['polinema', 'jpm', 'soekarno hatta'] },
      { name: 'Universitas Islam Malang / UNISMA (Dinoyo)', lat: -7.9380, lng: 112.6070, keywords: ['unisma malang', 'dinoyo', 'mt haryono malang'] }
    ],
    offices: [
      { name: 'Kawasan Bisnis Soekarno Hatta (Suhat Hub)', lat: -7.9450, lng: 112.6170, keywords: ['suhat', 'soekarno hatta malang', 'borobudur malang'] },
      { name: 'Kawasan Pusat Bisnis Klojen & Alun-Alun Malang', lat: -7.9810, lng: 112.6310, keywords: ['alun alun malang', 'klojen', 'kayutangan', 'basuki rahmat malang'] },
      { name: 'Koridor Bisnis Ijen & Semeru Commercial Area', lat: -7.9740, lng: 112.6230, keywords: ['ijen', 'semeru', 'oro oro dowo', 'kawi malang'] }
    ]
  },

  'Bali': {
    campuses: [
      { name: 'Universitas Udayana / UNUD (Jimbaran/Kuta Selatan)', lat: -8.7985, lng: 115.1740, keywords: ['unud jimbaran', 'kampus unud', 'bukit jimbaran'] },
      { name: 'Universitas Udayana (Kampus Sudirman Denpasar)', lat: -8.6740, lng: 115.2180, keywords: ['unud sudirman', 'sudirman denpasar', 'panjer'] },
      { name: 'Universitas Warmadewa (Tanjung Bungkak Denpasar)', lat: -8.6700, lng: 115.2390, keywords: ['warmadewa', 'tanjung bungkak', 'hayam wuruk'] }
    ],
    offices: [
      { name: 'Kawasan Komersial Sunset Road & Kuta Central', lat: -8.7050, lng: 115.1850, keywords: ['sunset road', 'kuta', 'dewi sri', 'nakula'] },
      { name: 'Kawasan Pusat Pemerintahan & Bisnis Renon', lat: -8.6750, lng: 115.2340, keywords: ['renon', 'puputan renon', 'raya puputan', 'bajra sandhi'] },
      { name: 'Kawasan Bisnis Seminyak & Canggu Hub', lat: -8.6850, lng: 115.1550, keywords: ['seminyak', 'canggu', 'batubolong', 'berawa'] }
    ]
  },

  'Makassar': {
    campuses: [
      { name: 'Universitas Hasanuddin / UNHAS (Tamalanrea)', lat: -5.1350, lng: 119.4920, keywords: ['unhas', 'tamalanrea', 'perintis kemerdekaan makassar', 'pintu 1 unhas'] },
      { name: 'Universitas Negeri Makassar / UNM (Gunung Sari)', lat: -5.1690, lng: 119.4340, keywords: ['unm', 'gunung sari', 'ap pettarani', 'tidung'] },
      { name: 'Universitas Muslim Indonesia / UMI (Urip Sumoharjo)', lat: -5.1390, lng: 119.4490, keywords: ['umi makassar', 'urip sumoharjo makassar', 'panaikang'] }
    ],
    offices: [
      { name: 'Kawasan CBD Panakkukang & Boulevard', lat: -5.1560, lng: 119.4460, keywords: ['panakkukang', 'boulevard makassar', 'pengayoman', 'adhe hyaksa'] },
      { name: 'Koridor Bisnis AP Pettarani & Sultan Alauddin', lat: -5.1650, lng: 119.4380, keywords: ['ap pettarani', 'pettarani', 'alauddin'] },
      { name: 'Kawasan Komersial Pantai Losari & Somba Opu', lat: -5.1440, lng: 119.4070, keywords: ['losari', 'somba opu', 'penghibur', 'jendral sudirman makassar'] }
    ]
  },

  'Purwokerto': {
    campuses: [
      { name: 'Universitas Jenderal Soedirman / UNSOED (Grendeng)', lat: -7.4045, lng: 109.2485, keywords: ['unsoed', 'grendeng', 'hr boenyamin', 'prof dr soeharso'] },
      { name: 'Universitas Muhammadiyah Purwokerto / UMP (Dukuhwaluh)', lat: -7.4170, lng: 109.2740, keywords: ['ump purwokerto', 'dukuhwaluh', 'raden patah'] }
    ],
    offices: [
      { name: 'Koridor Bisnis Jl. Jenderal Soedirman Purwokerto', lat: -7.4240, lng: 109.2390, keywords: ['jenderal soedirman purwokerto', 'alun-alun purwokerto', 'ritacy supermall'] }
    ]
  },

  'Banyuwangi': {
    campuses: [
      { name: 'Politeknik Negeri Banyuwangi / POLIWANGI (Labanasem)', lat: -8.2940, lng: 114.3090, keywords: ['poliwangi', 'labanasem', 'kabun banyuwangi'] },
      { name: 'Universitas 17 Agustus 1945 / UNTAG Banyuwangi', lat: -8.2250, lng: 114.3640, keywords: ['untag banyuwangi', 'taman banyuwangi'] }
    ],
    offices: [
      { name: 'Kawasan Pusat Kota & Taman Sritanjung Banyuwangi', lat: -8.2160, lng: 114.3680, keywords: ['taman sritanjung', 'ahmad yani banyuwangi', 'rogojampi'] }
    ]
  },

  'Tegal': {
    campuses: [
      { name: 'Universitas Pancasakti / UPS Tegal', lat: -6.8710, lng: 109.1390, keywords: ['ups tegal', 'pancasakti', 'halmahera tegal'] },
      { name: 'Politeknik Harapan Bersama / PHB Tegal', lat: -6.8780, lng: 109.1160, keywords: ['harber', 'mataram tegal', 'pesurungan'] }
    ],
    offices: [
      { name: 'Kawasan Bisnis Alun-Alun & Pasific Mall Tegal', lat: -6.8670, lng: 109.1350, keywords: ['alun-alun tegal', 'pasific mall', 'kolonel sugiono tegal'] }
    ]
  },

  'Banjarnegara': {
    campuses: [
      { name: 'Politeknik Banjarnegara', lat: -7.4080, lng: 109.6890, keywords: ['politeknik banjarnegara', 'bawang banjarnegara'] }
    ],
    offices: [
      { name: 'Kawasan Pusat Kota & Alun-Alun Banjarnegara', lat: -7.3970, lng: 109.6960, keywords: ['alun alun banjarnegara', 'dipayuda', 'pemuda banjarnegara'] }
    ]
  },

  'Tasikmalaya': {
    campuses: [
      { name: 'Universitas Siliwangi / UNSIL (Kahuripan)', lat: -7.3490, lng: 108.2230, keywords: ['unsil', 'siliwangi tasik', 'kahuripan', 'tamanharja'] }
    ],
    offices: [
      { name: 'Kawasan Bisnis HZ Mustofa & Alun-Alun Tasikmalaya', lat: -7.3270, lng: 108.2210, keywords: ['hz mustofa', 'alun alun tasik', 'cihideung'] }
    ]
  },

  'Cilegon': {
    campuses: [
      { name: 'Universitas Sultan Ageng Tirtayasa / UNTIRTA FT (Cilegon)', lat: -6.0070, lng: 106.0350, keywords: ['untirta cilegon', 'jenderal sudirman cilegon'] }
    ],
    offices: [
      { name: 'Kawasan Industri Krakatau Steel & Cilegon City Center', lat: -6.0150, lng: 106.0500, keywords: ['krakatau steel', 'cilegon central', 'ciwandan'] }
    ]
  },

  'Serang': {
    campuses: [
      { name: 'Universitas Sultan Ageng Tirtayasa / UNTIRTA (Pakupatan)', lat: -6.1190, lng: 106.1830, keywords: ['untirta serang', 'pakupatan', 'raya jakarta serang'] },
      { name: 'UIN Sultan Maulana Hasanuddin Banten (Ciceri)', lat: -6.1260, lng: 106.1680, keywords: ['uin banten', 'ciceri', 'jenderal sudirman serang'] }
    ],
    offices: [
      { name: 'Kawasan Komersial Ciceri & Alun-Alun Kota Serang', lat: -6.1180, lng: 106.1520, keywords: ['alun alun serang', 'ciceri', 'veteran serang'] }
    ]
  },

  'Palu': {
    campuses: [
      { name: 'Universitas Tadulako / UNTAD (Tondo/Mantikulore)', lat: -0.8420, lng: 119.8970, keywords: ['untad', 'tondo', 'soekarno hatta palu'] }
    ],
    offices: [
      { name: 'Kawasan Bisnis Sam Ratulangi & Palu City Center', lat: -0.8950, lng: 119.8730, keywords: ['sam ratulangi palu', 'hasanuddin palu', 'palu plaza'] }
    ]
  },

  'Gowa': {
    campuses: [
      { name: 'UIN Alauddin Makassar (Kampus 2 Samata Gowa)', lat: -5.2040, lng: 119.4930, keywords: ['uin samata', 'sultan alauddin gowa', 'romangpolong'] }
    ],
    offices: [
      { name: 'Kawasan Pusat Bisnis Sungguminasa (Somba Opu Gowa)', lat: -5.2020, lng: 119.4520, keywords: ['sungguminasa', 'somba opu gowa', 'wahid hasyim gowa'] }
    ]
  },

  'Tomohon': {
    campuses: [
      { name: 'Universitas Kristen Indonesia Tomohon / UKIT', lat: 1.3280, lng: 124.8390, keywords: ['ukit', 'kakaskasen', 'matani tomohon'] }
    ],
    offices: [
      { name: 'Kawasan Pusat Kota & Pasar Beriman Tomohon', lat: 1.3210, lng: 124.8420, keywords: ['kolongan tomohon', 'pusat kota tomohon'] }
    ]
  },

  'Pontianak': {
    campuses: [
      { name: 'Universitas Tanjungpura / UNTAN (Bansir Laut)', lat: -0.0610, lng: 109.3460, keywords: ['untan', 'ahmad yani pontianak', 'dayang daeng'] }
    ],
    offices: [
      { name: 'Kawasan CBD Gajah Mada & Ayani Mega Mall Pontianak', lat: -0.0430, lng: 109.3400, keywords: ['gajah mada pontianak', 'ayani mega mall', 'tanjungpura pontianak'] }
    ]
  },

  'Banjarbaru': {
    campuses: [
      { name: 'Universitas Lambung Mangkurat / ULM (Banjarbaru)', lat: -3.4440, lng: 114.8380, keywords: ['ulm banjarbaru', 'unlam banjarbaru', 'ahmad yani banjarbaru'] }
    ],
    offices: [
      { name: 'Kawasan Simpang Empat & Pusat Kota Banjarbaru - Martapura', lat: -3.4410, lng: 114.8450, keywords: ['simpang empat banjarbaru', 'martapura cbd', 'panglima batur'] }
    ]
  },

  'Singkawang': {
    campuses: [
      { name: 'STKIP Singkawang', lat: 0.9020, lng: 108.9760, keywords: ['stkip singkawang', 'pasiran singkawang'] }
    ],
    offices: [
      { name: 'Kawasan Pusat Niaga & Alun-Alun Singkawang', lat: 0.9070, lng: 108.9830, keywords: ['singkawang grand mall', 'diponegoro singkawang'] }
    ]
  },

  'Jambi': {
    campuses: [
      { name: 'Universitas Jambi / UNJA (Mendalo/Telanaipura)', lat: -1.6190, lng: 103.5280, keywords: ['unja', 'mendalo', 'telanaipura jambi'] },
      { name: 'UIN Sulthan Thaha Saifuddin Jambi', lat: -1.6320, lng: 103.5780, keywords: ['uin jambi', 'simpang sungai duren'] }
    ],
    offices: [
      { name: 'Kawasan Pusat Bisnis Telanaipura & WTC Batanghari', lat: -1.5940, lng: 103.6150, keywords: ['telanaipura', 'wtc batanghari', 'pasar jambi', 'sultan thaha'] }
    ]
  },

  'Lampung': {
    campuses: [
      { name: 'Universitas Lampung / UNILA (Gedong Meneng)', lat: -5.3650, lng: 105.2440, keywords: ['unila', 'gedong meneng', 'prof dr soemantri'] },
      { name: 'Institut Teknologi Sumatera / ITERA (Jati Agung)', lat: -5.3580, lng: 105.3120, keywords: ['itera', 'terusan ryacudu'] }
    ],
    offices: [
      { name: 'Kawasan CBD Tanjung Karang & Jl. Kartini Bandar Lampung', lat: -5.4120, lng: 105.2570, keywords: ['tanjung karang', 'kartini lampung', 'raden intan', 'mall boemi kedaton'] }
    ]
  },

  'Aceh': {
    campuses: [
      { name: 'Universitas Syiah Kuala / USK (Darussalam)', lat: 5.5700, lng: 95.3700, keywords: ['usk', 'syiah kuala', 'darussalam banda aceh', 'teuku nyak arief'] },
      { name: 'UIN Ar-Raniry (Darussalam)', lat: 5.5740, lng: 95.3680, keywords: ['ar-raniry', 'uin ar raniry', 'darussalam aceh'] }
    ],
    offices: [
      { name: 'Kawasan Simpang Lima & Baiturrahman Banda Aceh', lat: 5.5530, lng: 95.3210, keywords: ['simpang lima aceh', 'baiturrahman', 'teuku umar aceh'] }
    ]
  }
};

/**
 * Normalisasi kota input ke POI key yang sesuai
 */
function normalizeCityKey(city) {
  const c = (city || '').toLowerCase();
  if (c.includes('jakarta')) return 'Jakarta';
  if (c.includes('depok')) return 'Depok';
  if (c.includes('bintaro') || c.includes('tangerang selatan')) return 'Bintaro';
  if (c.includes('bekasi')) return 'Bekasi';
  if (c.includes('bogor')) return 'Bogor';
  if (c.includes('bandung')) return 'Bandung';
  if (c.includes('jogja') || c.includes('yogyakarta') || c.includes('sleman') || c.includes('bantul')) return 'Yogyakarta';
  if (c.includes('solo') || c.includes('surakarta') || c.includes('sukoharjo')) return 'Solo';
  if (c.includes('surabaya')) return 'Surabaya';
  if (c.includes('semarang')) return 'Semarang';
  if (c.includes('medan') || c.includes('sumatera utara') || c.includes('deli serdang')) return 'Medan';
  if (c.includes('malang') || c.includes('batu')) return 'Malang';
  if (c.includes('bali') || c.includes('denpasar') || c.includes('badung') || c.includes('ubud')) return 'Bali';
  if (c.includes('makassar')) return 'Makassar';
  if (c.includes('purwokerto') || c.includes('banyumas')) return 'Purwokerto';
  if (c.includes('banyuwangi')) return 'Banyuwangi';
  if (c.includes('tegal') || c.includes('slawi')) return 'Tegal';
  if (c.includes('banjarnegara')) return 'Banjarnegara';
  if (c.includes('tasikmalaya') || c.includes('tasik')) return 'Tasikmalaya';
  if (c.includes('cilegon')) return 'Cilegon';
  if (c.includes('serang')) return 'Serang';
  if (c.includes('palu')) return 'Palu';
  if (c.includes('gowa')) return 'Gowa';
  if (c.includes('tomohon')) return 'Tomohon';
  if (c.includes('pontianak')) return 'Pontianak';
  if (c.includes('banjarbaru') || c.includes('martapura')) return 'Banjarbaru';
  if (c.includes('singkawang')) return 'Singkawang';
  if (c.includes('jambi')) return 'Jambi';
  if (c.includes('lampung') || c.includes('bandar lampung')) return 'Lampung';
  if (c.includes('aceh') || c.includes('banda aceh')) return 'Aceh';
  if (c.includes('denpasar') || c.includes('badung') || c.includes('gianyar') || c.includes('ubud')) return 'Bali';
  return null; // unknown city: no geographic bias, keyword-only mode
}

/**
 * Menghitung jarak Haversine antara dua koordinat (km)
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius bumi dalam km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Mencari Kampus Terdekat dan Kawasan Perkantoran Terdekat untuk suatu listing kost
 */
export function findNearestPOIs(city, lat, lng, addressText = '', queryAnchor = '') {
  const cityKey = normalizeCityKey(city);
  const hasCoords = typeof lat === 'number' && typeof lng === 'number' && isFinite(lat) && isFinite(lng);
  // Unknown city without POI database: never fake a Jakarta distance.
  // Cross-city keyword hints cause false positives (e.g. "merdeka" exists
  // in many cities), so return neutral '-' instead of misleading data.
  if (!cityKey) {
    return { nearestCampus: '-', nearestOffice: '-' };
  }
  const cityData = POI_DATABASE[cityKey] || POI_DATABASE['Jakarta'];

  const addrLower = (addressText + ' ' + queryAnchor).toLowerCase();

  // 1. KAMPUS TERDEKAT
  let nearestCampus = '';
  let minCampusDist = Infinity;

  if (hasCoords) {
    for (const c of cityData.campuses) {
      const dist = haversineDistance(lat, lng, c.lat, c.lng);
      if (dist < minCampusDist) {
        minCampusDist = dist;
        nearestCampus = `${c.name} (${dist.toFixed(1)} km)`;
      }
    }
  }

  // Jika tidak ada koordinat atau jarak > 10 km, gunakan pencocokan keyword teks alamat / query
  if (!nearestCampus || minCampusDist > 10) {
    let keywordHit = '';
    for (const c of cityData.campuses) {
      if (c.keywords.some(k => addrLower.includes(k))) {
        keywordHit = c.name;
        break;
      }
    }
    if (keywordHit) {
      nearestCampus = keywordHit;
    } else if (!hasCoords) {
      // No coordinate AND no keyword hit: don't fake a far-away campus.
      nearestCampus = '';
    }
  }
  if (!nearestCampus) {
    nearestCampus = hasCoords ? (cityData.campuses[0]?.name || '-') : '-';
  }

  // 2. KAWASAN PERKANTORAN TERDEKAT
  let nearestOffice = '';
  let minOfficeDist = Infinity;

  if (hasCoords) {
    for (const o of cityData.offices) {
      const dist = haversineDistance(lat, lng, o.lat, o.lng);
      if (dist < minOfficeDist) {
        minOfficeDist = dist;
        nearestOffice = `${o.name} (${dist.toFixed(1)} km)`;
      }
    }
  }

  // Fallback pencocokan keyword teks alamat / query
  if (!nearestOffice || minOfficeDist > 12) {
    let officeHit = '';
    for (const o of cityData.offices) {
      if (o.keywords.some(k => addrLower.includes(k))) {
        officeHit = o.name;
        break;
      }
    }
    if (officeHit) {
      nearestOffice = officeHit;
    } else if (!hasCoords) {
      nearestOffice = '';
    }
  }
  if (!nearestOffice) {
    nearestOffice = hasCoords ? (cityData.offices[0]?.name || '-') : '-';
  }

  return { nearestCampus, nearestOffice };
}
