/**
 * Konfigurasi Scraping Mendalam (Deep Scraper) Google Maps
 * Menjangkau seluruh wilayah, kecamatan, zona kampus/universitas, dan pusat perkantoran
 */

export const CONFIG = {
  businessType: 'Kost',

  targets: [
    // 1. SURAKARTA / SOLO (JAWA TENGAH)
    {
      city: 'Solo',
      province: 'Jawa Tengah',
      queries: [
        'kost surakarta solo',
        'kost banjarsari solo',
        'kost jebres solo',
        'kost laweyan solo',
        'kost pasar kliwon solo',
        'kost serengan solo',
        'kost dekat UNS kentingan jebres solo',
        'kost dekat UMS pabelan kartasura',
        'kost dekat ISI solo kentingan',
        'kost dekat ISI 2 surakarta',
        'kost dekat ISI II solo mojosongo',
        'kost dekat kampus 2 ISI surakarta',
        'kost mojosongo jebres solo',
        'kost ringroad utara solo',
        'kost dekat unisri kadipiro solo',
        'kost dekat atmi solo',
        'kost dekat sahid solo jajar',
        'kost dekat slamet riyadi solo',
        'kost dekat solo baru grogol',
        'kost colomadu solo',
        'kost kartasura solo',
        'kost palur solo'
      ],
      maxPagesPerQuery: 2
    },

    // 2. SEMARANG (JAWA TENGAH)
    {
      city: 'Semarang',
      province: 'Jawa Tengah',
      queries: [
        'kost semarang kota',
        'kost tembalang semarang',
        'kost banyumanik semarang',
        'kost gunungpati semarang',
        'kost pedurungan semarang',
        'kost ngaliyan semarang',
        'kost gajahmungkur semarang',
        'kost semarang barat',
        'kost semarang timur',
        'kost semarang selatan',
        'kost semarang utara',
        'kost semarang tengah',
        'kost dekat undip tembalang semarang',
        'kost dekat undip pleburan semarang',
        'kost dekat unnes sekaran semarang',
        'kost dekat udinus imam bonjol semarang',
        'kost dekat unissula kaligawe semarang',
        'kost dekat unika soegijapranata bendan dhuwur',
        'kost dekat polines tembalang semarang',
        'kost dekat usm tlogosari semarang',
        'kost dekat simpang lima pandanaran semarang',
        'kost dekat pemuda gajah mada semarang'
      ],
      maxPagesPerQuery: 2
    },

    // 3. JAKARTA SELATAN
    {
      city: 'Jakarta Selatan',
      province: 'DKI Jakarta',
      queries: [
        'kost tebet jakarta selatan',
        'kost tebet barat timur raya',
        'kost dekat stasiun tebet',
        'kost kalibata duren tiga',
        'kost dekat stasiun kalibata',
        'kost kuningan barat gatot subroto',
        'kost dekat kuningan barat tendean',
        'kost mampang prapatan warung buncit',
        'kost dekat mampang prapatan raya',
        'kost setiabudi jakarta selatan',
        'kost pancoran jakarta selatan',
        'kost pasar minggu jakarta selatan',
        'kost cilandak jakarta selatan',
        'kost kebayoran baru jakarta selatan',
        'kost kebayoran lama jakarta selatan',
        'kost jagakarsa jakarta selatan',
        'kost pesanggrahan jakarta selatan',
        'kost dekat SCBD sudirman jakarta',
        'kost dekat mega kuningan rasuna said',
        'kost dekat tb simatupang cilandak',
        'kost dekat gatot subroto pancoran',
        'kost dekat upn veteran pondok labu',
        'kost dekat universitas pancasila lenteng agung',
        'kost dekat atma jaya semanggi',
        'kost dekat bakrie kuningan'
      ],
      maxPagesPerQuery: 2
    },

    // 4. JAKARTA PUSAT
    {
      city: 'Jakarta Pusat',
      province: 'DKI Jakarta',
      queries: [
        'kost menteng jakarta pusat',
        'kost tanah abang jakarta pusat',
        'kost senen jakarta pusat',
        'kost cempaka putih jakarta pusat',
        'kost johar baru jakarta pusat',
        'kost kemayoran jakarta pusat',
        'kost sawah besar jakarta pusat',
        'kost gambir jakarta pusat',
        'kost dekat UI salemba kramat',
        'kost dekat thamrin sudirman jakarta pusat',
        'kost dekat bunderan HI karet'
      ],
      maxPagesPerQuery: 2
    },

    // 5. JAKARTA UTARA
    {
      city: 'Jakarta Utara',
      province: 'DKI Jakarta',
      queries: [
        'kost kelapa gading jakarta utara',
        'kost sunter jakarta utara',
        'kost tanjung priok jakarta utara',
        'kost pademangan jakarta utara',
        'kost penjaringan pluit jakarta utara',
        'kost koja jakarta utara',
        'kost cilincing jakarta utara',
        'kost dekat ancol pik jakarta utara'
      ],
      maxPagesPerQuery: 2
    },

    // 6. JAKARTA BARAT
    {
      city: 'Jakarta Barat',
      province: 'DKI Jakarta',
      queries: [
        'kost kawasan grogol jakarta barat',
        'kost grogol petamburan muwardi',
        'kost dekat stasiun grogol',
        'kost tanjung duren jakarta barat',
        'kost palmerah jakarta barat',
        'kost kebon jeruk jakarta barat',
        'kost kembangan puri indah jakarta barat',
        'kost cengkareng jakarta barat',
        'kost kalideres jakarta barat',
        'kost tomang jakarta barat',
        'kost dekat trisakti grogol untar',
        'kost dekat binus kemanggisan rawabelong',
        'kost dekat ukrida esa unggul',
        'kost dekat mercu buana meruya'
      ],
      maxPagesPerQuery: 2
    },

    // 7. JAKARTA TIMUR
    {
      city: 'Jakarta Timur',
      province: 'DKI Jakarta',
      queries: [
        'kost rawamangun jakarta timur',
        'kost matraman jakarta timur',
        'kost jatinegara jakarta timur',
        'kost duren sawit jakarta timur',
        'kost kramat jati jakarta timur',
        'kost pulo gadung jakarta timur',
        'kost pasar rebo jakarta timur',
        'kost ciracas jakarta timur',
        'kost cipayung jakarta timur',
        'kost dekat unj rawamangun',
        'kost dekat uki cawang jakarta timur'
      ],
      maxPagesPerQuery: 2
    },

    // 8. KOTA DEPOK
    {
      city: 'Depok',
      province: 'Jawa Barat',
      queries: [
        'kost margonda depok',
        'kost beji depok',
        'kost kukusan depok',
        'kost pondok cina depok',
        'kost kelapa dua depok',
        'kost cimanggis depok',
        'kost cinere depok',
        'kost sawangan depok',
        'kost sukmajaya depok',
        'kost dekat UI depok kutek kober',
        'kost dekat gunadarma margonda kelapa dua',
        'kost dekat pnj depok'
      ],
      maxPagesPerQuery: 2
    },

    // 9. BINTARO & TANGERANG SELATAN
    {
      city: 'Bintaro',
      province: 'Banten',
      queries: [
        'kost bintaro jaya',
        'kost bintaro sektor 1 2 3',
        'kost bintaro sektor 5 7 9',
        'kost pondok aren bintaro',
        'kost ciputat tangerang selatan',
        'kost pamulang tangerang selatan',
        'kost pondok ranji bintaro',
        'kost dekat STAN bintaro sektor 5 sarmili',
        'kost dekat UIN syarif hidayatullah ciputat',
        'kost dekat UPJ bintaro sektor 7',
        'kost dekat unpam pamulang',
        'kost dekat cbd bintaro xchange'
      ],
      maxPagesPerQuery: 2
    },

    // 10. BEKASI
    {
      city: 'Bekasi',
      province: 'Jawa Barat',
      queries: [
        'kost bekasi barat',
        'kost bekasi timur',
        'kost bekasi selatan',
        'kost bekasi utara',
        'kost tambun bekasi',
        'kost cikarang bekasi',
        'kost summarecon bekasi',
        'kost kalimalang bekasi',
        'kost harapan indah bekasi',
        'kost dekat president university jababeka cikarang',
        'kost dekat unisma bekasi timur',
        'kost dekat gunadarma kalimalang bekasi',
        'kost dekat binus summarecon bekasi',
        'kost dekat kawasan industri jababeka mm2100'
      ],
      maxPagesPerQuery: 2
    },

    // 11. KOTA BOGOR
    {
      city: 'Kota Bogor',
      province: 'Jawa Barat',
      queries: [
        'kost bogor tengah',
        'kost bogor barat',
        'kost bogor timur',
        'kost bogor utara',
        'kost bogor selatan',
        'kost tanah sareal bogor',
        'kost pajajaran bogor',
        'kost baranangsiang bogor',
        'kost bantarjati bangbarung bogor',
        'kost dekat ipb baranangsiang bogor',
        'kost dekat universitas pakuan ciheuleut bogor',
        'kost dekat uika sholeh iskandar bogor'
      ],
      maxPagesPerQuery: 2
    },

    // 12. KABUPATEN BOGOR
    {
      city: 'Kabupaten Bogor',
      province: 'Jawa Barat',
      queries: [
        'kost dramaga bogor',
        'kost cibinong bogor',
        'kost bojonggede bogor',
        'kost cileungsi bogor',
        'kost gunung putri bogor',
        'kost ciawi bogor',
        'kost sentul city bogor',
        'kost dekat ipb dramaga balumbang jaya',
        'kost dekat pemda cibinong bogor',
        'kost dekat universitas djuanda ciawi'
      ],
      maxPagesPerQuery: 2
    },

    // 13. BANDUNG (KOTA, KABUPATEN, CIMAHI)
    {
      city: 'Bandung',
      province: 'Jawa Barat',
      queries: [
        'kost coblong bandung',
        'kost sukajadi bandung',
        'kost buahbatu bandung',
        'kost bandung wetan riau',
        'kost cibeunying dago bandung',
        'kost lengkong asia afrika bandung',
        'kost regol bandung',
        'kost cicendo pasteur bandung',
        'kost kiaracondong bandung',
        'kost jatinangor unpad ipdn',
        'kost dayeuhkolot bojongsoang telkom',
        'kost kabupaten bandung',
        'kost cimahi utara tengah selatan',
        'kost dekat ITB ganesha tamansari cisitu',
        'kost dekat unpad dipatiukur sekeloa du',
        'kost dekat upi setiabudi gegerkalong',
        'kost dekat telkom university buahbatu sukapura',
        'kost dekat maranatha surya sumantri pasteur',
        'kost dekat unpar ciumbuleuit',
        'kost dekat unisba unpas tamansari',
        'kost dekat polban ciwaruga sariwangi',
        'kost dekat itenas widyatama cikutra',
        'kost dekat unjani cimahi'
      ],
      maxPagesPerQuery: 2
    },

    // 14. SURABAYA (JAWA TIMUR)
    {
      city: 'Surabaya',
      province: 'Jawa Timur',
      queries: [
        'kost surabaya pusat basuki rahmat tunjungan',
        'kost gubeng surabaya',
        'kost sukolilo surabaya',
        'kost mulyorejo surabaya',
        'kost rungkut surabaya',
        'kost tenggilis mejoyo surabaya',
        'kost wonokromo surabaya',
        'kost darmo mayjen sungkono surabaya barat',
        'kost hr muhammad surabaya barat',
        'kost wiyung surabaya',
        'kost jambangan gayungan surabaya',
        'kost kenjeran tambaksari surabaya',
        'kost dekat ITS sukolilo gebang keputih',
        'kost dekat unair gubeng dharmawangsa kampus b',
        'kost dekat unair kampus c mulyorejo',
        'kost dekat unesa lidah wetan ketintang',
        'kost dekat petra siwalankerto surabaya',
        'kost dekat ubaya tenggilis mejoyo',
        'kost dekat upn veteran rungkut madya',
        'kost dekat uinsa ahmad yani',
        'kost dekat sier rungkut industri surabaya'
      ],
      maxPagesPerQuery: 2
    },

    // 15. SUMATERA UTARA (MEDAN & DELI SERDANG)
    {
      city: 'Sumatera Utara',
      province: 'Sumatera Utara',
      queries: [
        'kost medan baru dr mansyur',
        'kost padang bulan medan',
        'kost medan selayang setia budi',
        'kost medan petisah sekip',
        'kost medan kota kesawan',
        'kost medan tembung willem iskandar',
        'kost medan johor',
        'kost medan sunggal gagak hitam ringroad',
        'kost medan barat glugur',
        'kost medan timur krakatau',
        'kost medan helvetia',
        'kost lubuk pakam deli serdang',
        'kost percut sei tuan deli serdang',
        'kost binjai sumut',
        'kost dekat USU padang bulan pintu 1 2 4',
        'kost dekat unimed tembung',
        'kost dekat umsu mukhtar basri glugur',
        'kost dekat unpri ayahanda sampul',
        'kost dekat polmed padang bulan',
        'kost dekat uinsu sutomo tuntungan',
        'kost dekat balai kota kesawan medan',
        'kost dekat gatot subroto medan fair',
        'kost dekat cambridge zainul arifin medan'
      ],
      maxPagesPerQuery: 2
    },

    // 16. D.I. YOGYAKARTA (SLEMAN, BANTUL, KOTA)
    {
      city: 'Yogyakarta',
      province: 'D.I. Yogyakarta',
      queries: [
        'kost yogyakarta kota malioboro',
        'kost depok sleman yogyakarta',
        'kost caturtunggal sleman',
        'kost condongcatur sleman',
        'kost pogung ugm kaliurang',
        'kost seturan babarsari sleman',
        'kost gejayan karangmalang',
        'kost bantul kasihan sewon',
        'kost dekat UGM bulaksumur pogung blimbingsari',
        'kost dekat UNY colombo karangmalang',
        'kost dekat UPN seturan jogja',
        'kost dekat UII kaliurang condongcatur',
        'kost dekat atma jaya babarsari janti',
        'kost dekat UMY ringroad barat kasihan',
        'kost dekat ISI sewon parangtritis',
        'kost dekat sadhar mrican paingan',
        'kost dekat amikom ringroad utara'
      ],
      maxPagesPerQuery: 2
    }
  ],

  // Jeda request adaptif (ms)
  minDelayMs: 350,
  maxDelayMs: 750,

  // Nama file output Excel
  outputFileName: 'Data_Bisnis_Google_Maps_Indonesia_Lengkap.xlsx'
};
