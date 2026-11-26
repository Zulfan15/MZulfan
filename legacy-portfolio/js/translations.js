/* ========================================
   MULTI-LANGUAGE TRANSLATIONS
   Portfolio Website - Language Support
   ======================================== */

const translations = {
    // English (Default)
    en: {
        // Navigation
        nav_home: "Home",
        nav_skills: "Skills",
        nav_about: "About",
        nav_portfolio: "Projects",
        nav_experience: "Experience",
        nav_contact: "Contact",
        
        // Hero Section
        greeting: "Hi, I'm",
        status_available: "Available for projects",
        hero_subtitle: "Informatics Graduate & Laboratory Assistant",
        hero_description: "Informatics graduate skilled in software development, database programming, and multimedia applications. Experienced in lab assistance and software R&D projects, with a passion for applying emerging technologies to real-world solutions.",
        btn_view_projects: "View My Projects",
        btn_download_cv: "Download CV",
        
        // Skills Section
        skills_title: "Quest Board",
        skills_subtitle: "Mastered skills and completed training missions",
        quest_legendary: "LEGENDARY QUEST",
        quest_epic: "EPIC QUEST",
        quest_rare: "RARE QUEST",
        quest_uncommon: "UNCOMMON QUEST",
        quest_mastered: "MASTERED",
        quest_certified: "CERTIFIED",
        quest_ml_title: "Machine Learning & Data Science",
        quest_ml_desc: "Master the arcane arts of artificial intelligence",
        quest_prog_title: "Programming & Development",
        quest_prog_desc: "Forge software artifacts and powerful applications",
        quest_db_title: "Database & Networking",
        quest_db_desc: "Conquer data realms and network territories",
        quest_viz_title: "Data Visualization & Testing",
        quest_viz_desc: "Unlock secrets hidden within data streams",
        quest_tools_title: "Dev Tools & OS",
        quest_tools_desc: "Equip powerful tools and master the environments",
        quest_total_xp: "TOTAL EXPERIENCE",
        quest_level: "LEVEL",
        
        // About Section
        about_title: "Hero Profile",
        about_subtitle: "Champion of the Digital Realm",
        hero_class: "DEVELOPER",
        hero_title_text: "The Code Architect",
        hero_attr_str: "STRENGTH",
        hero_attr_agi: "AGILITY",
        hero_attr_int: "INTELLIGENCE",
        hero_stat_projects: "PROJECTS",
        hero_stat_roles: "ROLES",
        hero_stat_cert: "CERT",
        hero_lore_label: "HERO LORE",
        hero_lore_1: 'Born in the digital age, <strong>Muhammad Zulfan Anggadhiputra</strong> emerged from the halls of <em>Institut Teknologi Nasional Bandung</em> as a promising warrior of code. His journey began with curiosity and evolved into mastery over multiple domains of technology.',
        hero_lore_2: 'As a <strong>5x Laboratory Assistant</strong>, he guides young apprentices through the treacherous paths of Database Programming, OOP, Network Security, IoT, and Robotics. His battlefield experience at <strong>PT Dwi Purwa Teknologi</strong> forged his skills in real-world software development.',
        hero_lore_3: 'Armed with the sacred <strong>HCIA-Security certification</strong> from Huawei, he stands as a guardian against digital threats. From IoT prototypes to deep learning models, no challenge is too great for this Code Architect.',
        hero_abilities_label: "SPECIAL ABILITIES",
        hero_ability_q: "Academic Excellence",
        hero_ability_q_type: "PASSIVE",
        hero_ability_q_desc: "Informatics graduate with GPA 3.49 and multiple laboratory positions",
        hero_ability_w: "Security Shield",
        hero_ability_w_type: "ACTIVE",
        hero_ability_w_desc: "HCIA-Security V4.0 certified, protecting digital realms",
        hero_ability_e: "Knowledge Transfer",
        hero_ability_e_type: "ACTIVE",
        hero_ability_e_desc: "Lab instructor empowering the next generation of developers",
        hero_ability_r: "Machine Learning Vision",
        hero_ability_r_type: "ULTIMATE",
        hero_ability_r_desc: "Deploy highly accurate AI models (99.56% Accuracy) to vanquish data challenges",
        hero_equip_label: "EQUIPPED ITEMS",
        hero_equip_lab: "5x Lab Instructor",
        hero_equip_intern: "Software Intern",
        hero_equip_more: "More to come...",
        
        // Experience Section
        experience_title: "Battle Campaign",
        experience_subtitle: "Chronicles of victories and conquered territories",
        campaign_ch1_type: "COMMANDER RANK",
        campaign_ch1_status: "ACHIEVED",
        campaign_ch1_title: "The Master Artificer",
        campaign_ch1_story: "Ascended to Coordinator rank, leading the laboratory assistant team and managing the robotics curriculum. Guided students through hardware-software integration, sensors, and microcontroller implementations.",
        campaign_ch2_type: "EPIC BATTLE",
        campaign_ch2_status: "VICTORY",
        campaign_ch2_title: "The Corporate Siege",
        campaign_ch2_story: "Joined forces with elite developers in the corporate battlefield. Contributed to R&D operations, forged new features in active software projects, and mastered the complete software development lifecycle.",
        campaign_ch3_type: "DUNGEON RAID",
        campaign_ch3_status: "CLEARED",
        campaign_ch3_title: "The Code Mentorship",
        campaign_ch3_story: "Served a dual role instructing recruits in both Java Object-Oriented Programming and Computer Network configurations (LAN, TCP/IP, router). Forged strong foundations for the next generation of developers.",
        campaign_ch4_title: "The Data Sanctum",
        campaign_ch4_story: "Guided young apprentices through the mysteries of database design and Delphi7 sorcery. Mentored countless students in their quest to master data manipulation.",
        campaign_ch5_type: "ORIGIN STORY",
        campaign_ch5_status: "GRADUATED",
        campaign_ch5_title: "The Academic Crusade",
        campaign_ch5_story: "Embarked on a journey through the halls of knowledge, mastering the arcane arts of Informatics. Graduated wielding a power level (GPA) of 3.49.",
        campaign_stat_battles: "Battles Won",
        campaign_stat_students: "Students Mentored",
        campaign_stat_years: "Years Active",
        campaign_stat_certs: "Certifications",
        
        // Portfolio Section
        portfolio_title: "Artifact Armory",
        portfolio_subtitle: "Legendary creations forged in the fires of code",
        armory_tab_all: "All Artifacts",
        armory_tab_web: "Web Relics",
        armory_tab_db: "Data Crystals",
        armory_tab_media: "Media Orbs",
        armory_tab_academic: "Scrolls",
        armory_tab_iot: "Tech Cores",
        armory_btn_inspect: "Inspect",
        armory_btn_view: "View",
        armory_btn_discover: "Discover More Artifacts",
        armory_btn_forge: "Visit The Forge",
        armory_p1_name: "Remote Control Tank",
        armory_p1_type: "IoT & Embedded Systems",
        armory_p1_desc: "Ancient war machine powered by ESP32 core, controlled through mystical Flutter interface across realms.",
        armory_p2_name: "Neural Vision Orb",
        armory_p2_type: "Machine Learning",
        armory_p2_desc: "Enchanted orb that sees and classifies images using InceptionV3 deep learning sorcery.",
        armory_p3_name: "FoodRescue Portal",
        armory_p3_type: "Web Application",
        armory_p3_desc: "Full-stack Laravel web app to combat food waste. IDEA FEST 3 Bronze Medalist and Finalist.",
        armory_p4_name: "OMR Grading Matrix",
        armory_p4_type: "Computer Vision & Web",
        armory_p4_desc: "Community Service Project: Automated OMR web system combining OpenCV with Next.js & FastAPI to significantly reduce grading workload.",
        armory_p5_name: "The Thesis Scroll",
        armory_p5_type: "Machine Learning & NLP",
        armory_p5_desc: "Detecting Online Gambling Spam on YouTube. Achieved 99.56% performance using Random Forest and TF-IDF hybrid features.",
        
        // Contact Section
        contact_title: "The Tavern",
        contact_subtitle: "Send a raven or visit the message board to begin your quest",
        tavern_form_title: "Write Your Message",
        tavern_form_name: "Hero Name",
        tavern_form_email: "Raven Address",
        tavern_form_quest: "Quest Type",
        tavern_form_message: "Your Message",
        tavern_form_submit: "Send Raven",
        tavern_quest_select: "Select your quest...",
        tavern_quest_alliance: "🤝 Alliance Request",
        tavern_quest_project: "⚔️ New Quest/Project",
        tavern_quest_hiring: "👑 Recruitment",
        tavern_quest_question: "❓ Seek Wisdom",
        tavern_quest_other: "📜 Other Matters",
        tavern_npc_status: "Available for Quests",
        tavern_npc_dialogue: '"Greetings, traveler! I am <strong>Zulfan</strong>, keeper of this tavern. How may I assist you on your journey?"',
        tavern_card_email: "Raven Mail",
        tavern_card_phone: "Crystal Ball",
        tavern_card_location: "Tavern Location",
        tavern_social_title: "Send a Raven",
        tavern_hours_title: "Tavern Hours",
        tavern_hours_closed: "Closed",
        tavern_hours_response: "Ravens typically return within 24 hours",
        
        // Footer
        footer_sigil_title: "Code Warrior & Digital Craftsman",
        footer_sigil_desc: "Informatics graduate from ITENAS Bandung, forging digital artifacts and defending the realm with HCIA-Security certification.",
        footer_nav_title: "Navigate",
        footer_expertise_title: "Expertise",
        footer_resources_title: "Resources",
        footer_nav_basecamp: "Base Camp",
        footer_nav_hero: "Hero Profile",
        footer_nav_quest: "Quest Board",
        footer_nav_battle: "Battle Campaign",
        footer_nav_armory: "Artifact Armory",
        footer_nav_tavern: "The Tavern",
        footer_exp_db: "Database Sorcery",
        footer_exp_software: "Software Forging",
        footer_exp_network: "Network Defense",
        footer_exp_iot: "IoT Engineering",
        footer_exp_lab: "Lab Mastery",
        footer_res_code: "Code Repository",
        footer_res_gallery: "Project Gallery",
        footer_res_sitemap: "Site Map",
        footer_forged: "⚔️ FORGED WITH PASSION ⚔️",
        footer_crafted: "Crafted with"
    },
    
    // Indonesian
    id: {
        nav_home: "Beranda",
        nav_skills: "Keahlian",
        nav_about: "Tentang",
        nav_portfolio: "Proyek",
        nav_experience: "Pengalaman",
        nav_contact: "Kontak",
        
        greeting: "Halo, Saya",
        status_available: "Tersedia untuk proyek",
        hero_subtitle: "Lulusan Informatika & Asisten Laboratorium",
        hero_description: "Lulusan Informatika terampil dalam pengembangan perangkat lunak, pemrograman database, dan aplikasi multimedia. Berpengalaman dalam asistensi lab dan proyek R&D perangkat lunak, dengan hasrat menerapkan teknologi terbaru untuk solusi dunia nyata.",
        btn_view_projects: "Lihat Proyek Saya",
        btn_download_cv: "Unduh CV",
        
        skills_title: "Papan Misi",
        skills_subtitle: "Keahlian yang dikuasai dan misi pelatihan yang diselesaikan",
        quest_legendary: "MISI LEGENDARIS",
        quest_epic: "MISI EPIK",
        quest_rare: "MISI LANGKA",
        quest_uncommon: "MISI TIDAK UMUM",
        quest_mastered: "DIKUASAI",
        quest_certified: "BERSERTIFIKAT",
        quest_ml_title: "Machine Learning & Data Science",
        quest_ml_desc: "Kuasai seni mistis kecerdasan buatan",
        quest_prog_title: "Pemrograman & Pengembangan",
        quest_prog_desc: "Tempa artefak perangkat lunak dan aplikasi dahsyat",
        quest_db_title: "Database & Jaringan",
        quest_db_desc: "Taklukkan dunia data dan wilayah jaringan",
        quest_viz_title: "Visualisasi Data & Pengujian",
        quest_viz_desc: "Buka rahasia yang tersembunyi dalam aliran data",
        quest_tools_title: "Peralatan Dev & OS",
        quest_tools_desc: "Lengkapi peralatan canggih dan kuasai lingkungan",
        quest_total_xp: "TOTAL PENGALAMAN",
        quest_level: "LEVEL",
        
        about_title: "Profil Pahlawan",
        about_subtitle: "Juara Dunia Digital",
        hero_class: "PENGEMBANG",
        hero_title_text: "Arsitek Kode",
        hero_attr_str: "KEKUATAN",
        hero_attr_agi: "KELINCAHAN",
        hero_attr_int: "KECERDASAN",
        hero_stat_projects: "PROYEK",
        hero_stat_roles: "PERAN",
        hero_stat_cert: "SERTIF",
        hero_lore_label: "KISAH PAHLAWAN",
        hero_lore_1: 'Lahir di era digital, <strong>Muhammad Zulfan Anggadhiputra</strong> muncul dari lorong-lorong <em>Institut Teknologi Nasional Bandung</em> sebagai pejuang kode yang menjanjikan. Perjalanannya dimulai dari rasa ingin tahu dan berkembang menjadi penguasaan atas berbagai domain teknologi.',
        hero_lore_2: 'Sebagai <strong>5x Asisten Laboratorium</strong>, ia membimbing para murid muda melewati jalur berbahaya Pemrograman Database, OOP, Keamanan Jaringan, IoT, dan Robotika. Pengalaman pertempurannya di <strong>PT Dwi Purwa Teknologi</strong> menempa keterampilannya dalam pengembangan perangkat lunak dunia nyata.',
        hero_lore_3: 'Bersenjatakan <strong>sertifikasi HCIA-Security</strong> suci dari Huawei, ia berdiri sebagai penjaga melawan ancaman digital. Dari prototipe IoT hingga model deep learning, tidak ada tantangan yang terlalu besar bagi Arsitek Kode ini.',
        hero_abilities_label: "KEMAMPUAN KHUSUS",
        hero_ability_q: "Keunggulan Akademis",
        hero_ability_q_type: "PASIF",
        hero_ability_q_desc: "Lulusan Informatika dengan IPK 3.49 dan berbagai posisi laboratorium",
        hero_ability_w: "Perisai Keamanan",
        hero_ability_w_type: "AKTIF",
        hero_ability_w_desc: "Bersertifikat HCIA-Security V4.0, melindungi dunia digital",
        hero_ability_e: "Transfer Pengetahuan",
        hero_ability_e_type: "AKTIF",
        hero_ability_e_desc: "Instruktur lab yang memberdayakan generasi pengembang berikutnya",
        hero_ability_r: "Penglihatan Machine Learning",
        hero_ability_r_type: "ULTIMATE",
        hero_ability_r_desc: "Kerahkan model AI dengan akurasi tinggi (99,56%) untuk mengalahkan tantangan data",
        hero_equip_label: "ITEM TERPASANG",
        hero_equip_lab: "5x Instruktur Lab",
        hero_equip_intern: "Magang Software",
        hero_equip_more: "Segera hadir...",
        
        experience_title: "Kampanye Pertempuran",
        experience_subtitle: "Catatan kemenangan dan wilayah yang ditaklukkan",
        campaign_ch1_type: "PANGKAT KOMANDAN",
        campaign_ch1_status: "TERCAPAI",
        campaign_ch1_title: "Sang Ahli Mesin",
        campaign_ch1_story: "Naik ke pangkat Koordinator, memimpin tim asisten laboratorium dan mengelola kurikulum robotika. Membimbing mahasiswa dalam integrasi perangkat keras-lunak, sensor, dan implementasi mikrokontroler.",
        campaign_ch2_type: "PERTEMPURAN EPIK",
        campaign_ch2_status: "KEMENANGAN",
        campaign_ch2_title: "Pengepungan Korporat",
        campaign_ch2_story: "Bergabung dengan pengembang elit di medan pertempuran korporat. Berkontribusi pada operasi R&D, mengembangkan fitur baru dalam proyek perangkat lunak aktif, dan menguasai siklus pengembangan perangkat lunak lengkap.",
        campaign_ch3_type: "SERANGAN DUNGEON",
        campaign_ch3_status: "DIKALAHKAN",
        campaign_ch3_title: "Bimbingan Kode",
        campaign_ch3_story: "Menjalani peran ganda mengajar rekrut dalam Pemrograman Berorientasi Objek Java dan konfigurasi Jaringan Komputer (LAN, TCP/IP, router). Membangun fondasi kuat untuk generasi pengembang berikutnya.",
        campaign_ch4_title: "Kuil Data",
        campaign_ch4_story: "Membimbing murid muda melalui misteri desain database dan sihir Delphi7. Mentoring banyak mahasiswa dalam pencarian mereka menguasai manipulasi data.",
        campaign_ch5_type: "KISAH ASAL",
        campaign_ch5_status: "LULUS",
        campaign_ch5_title: "Perang Salib Akademis",
        campaign_ch5_story: "Memulai perjalanan melalui lorong-lorong pengetahuan, menguasai seni mistis Informatika. Lulus dengan level kekuatan (IPK) 3,49.",
        campaign_stat_battles: "Pertempuran Dimenangkan",
        campaign_stat_students: "Mahasiswa Dibimbing",
        campaign_stat_years: "Tahun Aktif",
        campaign_stat_certs: "Sertifikasi",
        
        portfolio_title: "Gudang Artefak",
        portfolio_subtitle: "Kreasi legendaris yang ditempa dalam api kode",
        armory_tab_all: "Semua Artefak",
        armory_tab_web: "Relik Web",
        armory_tab_db: "Kristal Data",
        armory_tab_media: "Bola Media",
        armory_tab_academic: "Gulungan",
        armory_tab_iot: "Inti Teknologi",
        armory_btn_inspect: "Periksa",
        armory_btn_view: "Lihat",
        armory_btn_discover: "Temukan Artefak Lainnya",
        armory_btn_forge: "Kunjungi Bengkel",
        armory_p1_name: "Tank Kendali Jarak Jauh",
        armory_p1_type: "IoT & Sistem Tertanam",
        armory_p1_desc: "Mesin perang kuno ditenagai inti ESP32, dikendalikan melalui antarmuka Flutter mistis melintasi dunia.",
        armory_p2_name: "Bola Penglihatan Neural",
        armory_p2_type: "Machine Learning",
        armory_p2_desc: "Bola terpesona yang melihat dan mengklasifikasi gambar menggunakan sihir deep learning InceptionV3.",
        armory_p3_name: "Portal FoodRescue",
        armory_p3_type: "Aplikasi Web",
        armory_p3_desc: "Aplikasi web full-stack Laravel untuk melawan limbah makanan. Medali Perunggu dan Finalis IDEA FEST 3.",
        armory_p4_name: "Matriks Penilaian OMR",
        armory_p4_type: "Computer Vision & Web",
        armory_p4_desc: "Proyek Pengabdian Masyarakat: Sistem web OMR otomatis yang menggabungkan OpenCV dengan Next.js & FastAPI untuk mengurangi beban penilaian secara signifikan.",
        armory_p5_name: "Gulungan Skripsi",
        armory_p5_type: "Machine Learning & NLP",
        armory_p5_desc: "Mendeteksi Spam Judi Online di YouTube. Mencapai performa 99,56% menggunakan fitur hybrid Random Forest dan TF-IDF.",
        
        contact_title: "Kedai",
        contact_subtitle: "Kirim burung gagak atau kunjungi papan pesan untuk memulai petualanganmu",
        tavern_form_title: "Tulis Pesanmu",
        tavern_form_name: "Nama Pahlawan",
        tavern_form_email: "Alamat Gagak",
        tavern_form_quest: "Jenis Misi",
        tavern_form_message: "Pesanmu",
        tavern_form_submit: "Kirim Gagak",
        tavern_quest_select: "Pilih misimu...",
        tavern_quest_alliance: "🤝 Permintaan Aliansi",
        tavern_quest_project: "⚔️ Misi/Proyek Baru",
        tavern_quest_hiring: "👑 Rekrutmen",
        tavern_quest_question: "❓ Mencari Kebijaksanaan",
        tavern_quest_other: "📜 Hal Lainnya",
        tavern_npc_status: "Tersedia untuk Misi",
        tavern_npc_dialogue: '"Salam, petualang! Saya <strong>Zulfan</strong>, penjaga kedai ini. Bagaimana saya bisa membantu perjalananmu?"',
        tavern_card_email: "Surat Gagak",
        tavern_card_phone: "Bola Kristal",
        tavern_card_location: "Lokasi Kedai",
        tavern_social_title: "Kirim Burung Gagak",
        tavern_hours_title: "Jam Buka Kedai",
        tavern_hours_closed: "Tutup",
        tavern_hours_response: "Gagak biasanya kembali dalam 24 jam",
        
        footer_sigil_title: "Pejuang Kode & Pengrajin Digital",
        footer_sigil_desc: "Lulusan Informatika dari ITENAS Bandung, menempa artefak digital dan mempertahankan dunia dengan sertifikasi HCIA-Security.",
        footer_nav_title: "Navigasi",
        footer_expertise_title: "Keahlian",
        footer_resources_title: "Sumber Daya",
        footer_nav_basecamp: "Pangkalan",
        footer_nav_hero: "Profil Pahlawan",
        footer_nav_quest: "Papan Misi",
        footer_nav_battle: "Kampanye Pertempuran",
        footer_nav_armory: "Gudang Artefak",
        footer_nav_tavern: "Kedai",
        footer_exp_db: "Sihir Database",
        footer_exp_software: "Penempaan Software",
        footer_exp_network: "Pertahanan Jaringan",
        footer_exp_iot: "Teknik IoT",
        footer_exp_lab: "Penguasaan Lab",
        footer_res_code: "Repositori Kode",
        footer_res_gallery: "Galeri Proyek",
        footer_res_sitemap: "Peta Situs",
        footer_forged: "⚔️ DITEMPA DENGAN SEMANGAT ⚔️",
        footer_crafted: "Dibuat dengan"
    },
    
    // Japanese (日本語)
    ja: {
        nav_home: "ホーム",
        nav_skills: "スキル",
        nav_about: "紹介",
        nav_portfolio: "プロジェクト",
        nav_experience: "経験",
        nav_contact: "連絡先",
        
        greeting: "こんにちは、私は",
        status_available: "プロジェクト受付中",
        hero_subtitle: "情報学卒業生 & 研究室助手",
        hero_description: "ソフトウェア開発、データベースプログラミング、マルチメディアアプリケーションに精通した情報学の卒業生。ラボアシスタントとソフトウェアR&Dプロジェクトの経験を持ち、新興技術を実世界のソリューションに適用することに情熱を持っています。",
        btn_view_projects: "プロジェクトを見る",
        btn_download_cv: "履歴書をダウンロード",
        
        skills_title: "クエストボード",
        skills_subtitle: "習得したスキルと完了したトレーニングミッション",
        quest_legendary: "レジェンダリークエスト",
        quest_epic: "エピッククエスト",
        quest_rare: "レアクエスト",
        quest_uncommon: "アンコモンクエスト",
        quest_mastered: "マスター済み",
        quest_certified: "認定済み",
        quest_ml_title: "機械学習 & データサイエンス",
        quest_ml_desc: "人工知能の神秘的な技を習得せよ",
        quest_prog_title: "プログラミング & 開発",
        quest_prog_desc: "ソフトウェアの成果物と強力なアプリを鍛造せよ",
        quest_db_title: "データベース & ネットワーク",
        quest_db_desc: "データ領域とネットワーク地域を征服せよ",
        quest_viz_title: "データ可視化 & テスト",
        quest_viz_desc: "データストリームに隠された秘密を解き明かせ",
        quest_tools_title: "開発ツール & OS",
        quest_tools_desc: "強力なツールを装備し環境を習得せよ",
        quest_total_xp: "総経験値",
        quest_level: "レベル",
        
        about_title: "英雄プロフィール",
        about_subtitle: "デジタル領域のチャンピオン",
        hero_class: "開発者",
        hero_title_text: "コードアーキテクト",
        hero_attr_str: "ちから",
        hero_attr_agi: "すばやさ",
        hero_attr_int: "かしこさ",
        hero_stat_projects: "プロジェクト",
        hero_stat_roles: "役職",
        hero_stat_cert: "資格",
        hero_lore_label: "英雄の物語",
        hero_lore_1: 'デジタル時代に生まれた<strong>Muhammad Zulfan Anggadhiputra</strong>は、<em>バンドゥン国立工科大学</em>の学堂から有望なコード戦士として現れました。好奇心から始まった彼の旅は、テクノロジーの多領域にわたる熟達へと発展しました。',
        hero_lore_2: '<strong>5回の研究室助手</strong>として、データベースプログラミング、OOP、ネットワークセキュリティ、IoT、ロボティクスの危険な道を若い弟子たちを導いています。<strong>PT Dwi Purwa Teknologi</strong>での戦場経験が、実世界のソフトウェア開発スキルを鍛えました。',
        hero_lore_3: 'Huaweiの神聖な<strong>HCIA-Security認定</strong>で武装し、デジタル脅威に対する守護者として立っています。IoTプロトタイプからディープラーニングモデルまで、このコードアーキテクトにとって大きすぎる挑戦はありません。',
        hero_abilities_label: "特殊能力",
        hero_ability_q: "学術的卓越",
        hero_ability_q_type: "パッシブ",
        hero_ability_q_desc: "GPA 3.49の情報学卒業生、複数の研究室ポジション",
        hero_ability_w: "セキュリティシールド",
        hero_ability_w_type: "アクティブ",
        hero_ability_w_desc: "HCIA-Security V4.0認定、デジタル領域を保護",
        hero_ability_e: "知識伝達",
        hero_ability_e_type: "アクティブ",
        hero_ability_e_desc: "次世代の開発者を育成する研究室インストラクター",
        hero_ability_r: "機械学習ビジョン",
        hero_ability_r_type: "アルティメット",
        hero_ability_r_desc: "高精度AIモデル（99.56%の精度）を展開しデータの課題を克服",
        hero_equip_label: "装備アイテム",
        hero_equip_lab: "5x ラボインストラクター",
        hero_equip_intern: "ソフトウェアインターン",
        hero_equip_more: "続々追加予定...",
        
        experience_title: "戦闘キャンペーン",
        experience_subtitle: "勝利と征服した領土の記録",
        campaign_ch1_type: "指揮官ランク",
        campaign_ch1_status: "達成",
        campaign_ch1_title: "マスターアーティファー",
        campaign_ch1_story: "コーディネーターランクに昇格し、研究室助手チームを率いてロボティクスカリキュラムを管理。ハードウェア・ソフトウェア統合、センサー、マイコン実装を学生に指導。",
        campaign_ch2_type: "エピックバトル",
        campaign_ch2_status: "勝利",
        campaign_ch2_title: "企業攻城戦",
        campaign_ch2_story: "企業の戦場でエリート開発者と合流。R&D運営に貢献し、アクティブなソフトウェアプロジェクトで新機能を開発し、完全なソフトウェア開発ライフサイクルを習得。",
        campaign_ch3_type: "ダンジョンレイド",
        campaign_ch3_status: "クリア",
        campaign_ch3_title: "コードメンターシップ",
        campaign_ch3_story: "Java OOPとコンピュータネットワーク構成（LAN、TCP/IP、ルーター）の両方で新人を指導する二重の役割を果たした。次世代開発者のための強固な基盤を築いた。",
        campaign_ch4_title: "データの聖域",
        campaign_ch4_story: "データベース設計とDelphi7の魔術の謎を若い弟子たちに導いた。データ操作を習得する探求で多くの学生を指導。",
        campaign_ch5_type: "オリジンストーリー",
        campaign_ch5_status: "卒業",
        campaign_ch5_title: "学術的十字軍",
        campaign_ch5_story: "知識の殿堂を旅し、情報学の神秘的な技を習得。パワーレベル（GPA）3.49で卒業。",
        campaign_stat_battles: "勝利した戦闘",
        campaign_stat_students: "指導した学生",
        campaign_stat_years: "活動年数",
        campaign_stat_certs: "資格認定",
        
        portfolio_title: "アーティファクト武器庫",
        portfolio_subtitle: "コードの炎で鍛えられた伝説的な創作物",
        armory_tab_all: "全アーティファクト",
        armory_tab_web: "ウェブレリック",
        armory_tab_db: "データクリスタル",
        armory_tab_media: "メディアオーブ",
        armory_tab_academic: "スクロール",
        armory_tab_iot: "テックコア",
        armory_btn_inspect: "調べる",
        armory_btn_view: "見る",
        armory_btn_discover: "さらにアーティファクトを発見",
        armory_btn_forge: "鍛冶場を訪問",
        armory_p1_name: "リモコン戦車",
        armory_p1_type: "IoT & 組み込みシステム",
        armory_p1_desc: "ESP32コアで駆動する古代の戦争機械、神秘的なFlutterインターフェースで領域を越えて制御。",
        armory_p2_name: "ニューラルビジョンオーブ",
        armory_p2_type: "機械学習",
        armory_p2_desc: "InceptionV3ディープラーニングの魔術を使って画像を認識・分類する魔法のオーブ。",
        armory_p3_name: "フードレスキューポータル",
        armory_p3_type: "ウェブアプリケーション",
        armory_p3_desc: "食品ロスと戦うフルスタックLaravelウェブアプリ。IDEA FEST 3銅メダリスト。",
        armory_p4_name: "OMR採点マトリックス",
        armory_p4_type: "コンピュータビジョン & ウェブ",
        armory_p4_desc: "地域奉仕プロジェクト：OpenCVとNext.js・FastAPIを組み合わせた自動OMRウェブシステム。",
        armory_p5_name: "論文スクロール",
        armory_p5_type: "機械学習 & NLP",
        armory_p5_desc: "YouTubeでのオンラインギャンブルスパム検出。ランダムフォレストとTF-IDFのハイブリッド特徴量で99.56%の性能を達成。",
        
        contact_title: "酒場",
        contact_subtitle: "鴉を送るか、掲示板を訪れてクエストを始めましょう",
        tavern_form_title: "メッセージを書く",
        tavern_form_name: "英雄の名前",
        tavern_form_email: "鴉のアドレス",
        tavern_form_quest: "クエストタイプ",
        tavern_form_message: "あなたのメッセージ",
        tavern_form_submit: "鴉を送る",
        tavern_quest_select: "クエストを選択...",
        tavern_quest_alliance: "🤝 同盟リクエスト",
        tavern_quest_project: "⚔️ 新しいクエスト/プロジェクト",
        tavern_quest_hiring: "👑 採用",
        tavern_quest_question: "❓ 知恵を求む",
        tavern_quest_other: "📜 その他",
        tavern_npc_status: "クエスト受付中",
        tavern_npc_dialogue: '「ようこそ、旅人よ！私は<strong>Zulfan</strong>、この酒場の主です。旅の途中、お手伝いできることはありますか？」',
        tavern_card_email: "鴉メール",
        tavern_card_phone: "水晶玉",
        tavern_card_location: "酒場の場所",
        tavern_social_title: "鴉を送る",
        tavern_hours_title: "酒場の営業時間",
        tavern_hours_closed: "休業",
        tavern_hours_response: "鴉は通常24時間以内に戻ります",
        
        footer_sigil_title: "コード戦士 & デジタル職人",
        footer_sigil_desc: "ITENASバンドゥンの情報学卒業生、デジタルアーティファクトを鍛造しHCIA-Security認定で領域を守護。",
        footer_nav_title: "ナビゲート",
        footer_expertise_title: "専門技術",
        footer_resources_title: "リソース",
        footer_nav_basecamp: "ベースキャンプ",
        footer_nav_hero: "英雄プロフィール",
        footer_nav_quest: "クエストボード",
        footer_nav_battle: "戦闘キャンペーン",
        footer_nav_armory: "武器庫",
        footer_nav_tavern: "酒場",
        footer_exp_db: "データベース魔術",
        footer_exp_software: "ソフトウェア鍛造",
        footer_exp_network: "ネットワーク防御",
        footer_exp_iot: "IoTエンジニアリング",
        footer_exp_lab: "ラボマスタリー",
        footer_res_code: "コードリポジトリ",
        footer_res_gallery: "プロジェクトギャラリー",
        footer_res_sitemap: "サイトマップ",
        footer_forged: "⚔️ 情熱で鍛造 ⚔️",
        footer_crafted: "心を込めて制作"
    },
    
    // Chinese (中文)
    zh: {
        nav_home: "首页", nav_skills: "技能", nav_about: "关于", nav_portfolio: "项目", nav_experience: "经验", nav_contact: "联系",
        greeting: "你好，我是", status_available: "可接受项目", hero_subtitle: "信息学毕业生 & 实验室助理",
        hero_description: "精通软件开发、数据库编程和多媒体应用的信息学毕业生。具有实验室助理和软件研发项目经验，热衷于将新兴技术应用于实际解决方案。",
        btn_view_projects: "查看我的项目", btn_download_cv: "下载简历",
        skills_title: "任务面板", skills_subtitle: "掌握的技能和完成的训练任务",
        quest_legendary: "传说级任务", quest_epic: "史诗级任务", quest_rare: "稀有任务", quest_uncommon: "罕见任务",
        quest_mastered: "已精通", quest_certified: "已认证",
        quest_ml_title: "机器学习 & 数据科学", quest_ml_desc: "掌握人工智能的神秘技艺",
        quest_prog_title: "编程 & 开发", quest_prog_desc: "锻造软件神器和强大应用",
        quest_db_title: "数据库 & 网络", quest_db_desc: "征服数据领域和网络疆域",
        quest_viz_title: "数据可视化 & 测试", quest_viz_desc: "解锁数据流中隐藏的秘密",
        quest_tools_title: "开发工具 & 操作系统", quest_tools_desc: "装备强大工具并掌握环境",
        quest_total_xp: "总经验值", quest_level: "等级",
        about_title: "英雄档案", about_subtitle: "数字领域的冠军",
        hero_class: "开发者", hero_title_text: "代码建筑师",
        hero_attr_str: "力量", hero_attr_agi: "敏捷", hero_attr_int: "智力",
        hero_stat_projects: "项目", hero_stat_roles: "角色", hero_stat_cert: "证书",
        hero_lore_label: "英雄传说",
        hero_lore_1: '生于数字时代，<strong>Muhammad Zulfan Anggadhiputra</strong>从<em>万隆国立技术学院</em>的学堂中崛起，成为一名前途光明的代码战士。他的旅程始于好奇心，并发展为对多个技术领域的精通。',
        hero_lore_2: '作为<strong>5次实验室助理</strong>，他引导年轻学徒穿越数据库编程、面向对象、网络安全、物联网和机器人的险路。在<strong>PT Dwi Purwa Teknologi</strong>的战场经验锻造了他的实战软件开发技能。',
        hero_lore_3: '手持华为神圣的<strong>HCIA-Security认证</strong>，他屹立为抵御数字威胁的守护者。从物联网原型到深度学习模型，没有什么挑战对这位代码建筑师来说是太大的。',
        hero_abilities_label: "特殊能力",
        hero_ability_q: "学术卓越", hero_ability_q_type: "被动", hero_ability_q_desc: "GPA 3.49的信息学毕业生，担任多个实验室职位",
        hero_ability_w: "安全护盾", hero_ability_w_type: "主动", hero_ability_w_desc: "HCIA-Security V4.0认证，保护数字领域",
        hero_ability_e: "知识传承", hero_ability_e_type: "主动", hero_ability_e_desc: "培养下一代开发者的实验室导师",
        hero_ability_r: "机器学习视觉", hero_ability_r_type: "终极", hero_ability_r_desc: "部署高精度AI模型（99.56%准确率）征服数据挑战",
        hero_equip_label: "已装备物品", hero_equip_lab: "5x 实验室导师", hero_equip_intern: "软件实习生", hero_equip_more: "更多即将推出...",
        experience_title: "战役日志", experience_subtitle: "胜利与征服领土的编年史",
        campaign_ch1_type: "指挥官军衔", campaign_ch1_status: "达成", campaign_ch1_title: "大工匠", campaign_ch1_story: "晋升为协调员，领导实验室助理团队并管理机器人课程。指导学生进行软硬件集成、传感器和微控制器实现。",
        campaign_ch2_type: "史诗战斗", campaign_ch2_status: "胜利", campaign_ch2_title: "企业围攻", campaign_ch2_story: "在企业战场上与精英开发者并肩作战。为研发运营做出贡献，在活跃的软件项目中开发新功能，掌握完整的软件开发生命周期。",
        campaign_ch3_type: "地下城突袭", campaign_ch3_status: "通关", campaign_ch3_title: "代码导师", campaign_ch3_story: "担任双重角色，同时在Java面向对象编程和计算机网络配置（LAN、TCP/IP、路由器）方面指导新人。为下一代开发者打下坚实基础。",
        campaign_ch4_title: "数据圣殿", campaign_ch4_story: "引导年轻学徒了解数据库设计和Delphi7魔法的奥秘。指导无数学生掌握数据操作。",
        campaign_ch5_type: "起源故事", campaign_ch5_status: "毕业", campaign_ch5_title: "学术圣战", campaign_ch5_story: "踏上知识殿堂之旅，掌握信息学的神秘技艺。以战力等级（GPA）3.49毕业。",
        campaign_stat_battles: "赢得的战斗", campaign_stat_students: "指导的学生", campaign_stat_years: "活跃年数", campaign_stat_certs: "资格认证",
        portfolio_title: "神器库", portfolio_subtitle: "在代码之火中铸造的传奇创作",
        armory_tab_all: "全部神器", armory_tab_web: "网络圣物", armory_tab_db: "数据水晶", armory_tab_media: "媒体宝珠", armory_tab_academic: "卷轴", armory_tab_iot: "科技核心",
        armory_btn_inspect: "检查", armory_btn_view: "查看", armory_btn_discover: "发现更多神器", armory_btn_forge: "访问锻造炉",
        armory_p1_name: "遥控坦克", armory_p1_type: "物联网 & 嵌入式系统", armory_p1_desc: "由ESP32核心驱动的古代战争机器，通过神秘的Flutter界面跨领域控制。",
        armory_p2_name: "神经视觉宝珠", armory_p2_type: "机器学习", armory_p2_desc: "使用InceptionV3深度学习魔法来识别和分类图像的魔法宝珠。",
        armory_p3_name: "食物拯救门户", armory_p3_type: "网络应用", armory_p3_desc: "全栈Laravel网络应用，用于对抗食物浪费。IDEA FEST 3铜牌获得者。",
        armory_p4_name: "OMR评分矩阵", armory_p4_type: "计算机视觉 & 网络", armory_p4_desc: "社区服务项目：结合OpenCV与Next.js和FastAPI的自动化OMR网络系统。",
        armory_p5_name: "论文卷轴", armory_p5_type: "机器学习 & NLP", armory_p5_desc: "检测YouTube上的在线赌博垃圾信息。使用随机森林和TF-IDF混合特征达到99.56%的性能。",
        contact_title: "酒馆", contact_subtitle: "发送信鸦或访问留言板开始你的任务",
        tavern_form_title: "写下你的消息", tavern_form_name: "英雄名称", tavern_form_email: "信鸦地址", tavern_form_quest: "任务类型", tavern_form_message: "你的消息", tavern_form_submit: "发送信鸦",
        tavern_quest_select: "选择你的任务...", tavern_quest_alliance: "🤝 联盟请求", tavern_quest_project: "⚔️ 新任务/项目", tavern_quest_hiring: "👑 招聘", tavern_quest_question: "❓ 寻求智慧", tavern_quest_other: "📜 其他事务",
        tavern_npc_status: "可接受任务", tavern_npc_dialogue: '"你好，旅行者！我是<strong>Zulfan</strong>，这家酒馆的守护者。我能如何帮助你的旅程？"',
        tavern_card_email: "信鸦邮件", tavern_card_phone: "水晶球", tavern_card_location: "酒馆位置",
        tavern_social_title: "发送信鸦", tavern_hours_title: "酒馆营业时间", tavern_hours_closed: "休息", tavern_hours_response: "信鸦通常在24小时内返回",
        footer_sigil_title: "代码战士 & 数字工匠", footer_sigil_desc: "ITENAS万隆的信息学毕业生，锻造数字神器并以HCIA-Security认证守卫领域。",
        footer_nav_title: "导航", footer_expertise_title: "专长", footer_resources_title: "资源",
        footer_nav_basecamp: "大本营", footer_nav_hero: "英雄档案", footer_nav_quest: "任务面板", footer_nav_battle: "战役日志", footer_nav_armory: "神器库", footer_nav_tavern: "酒馆",
        footer_exp_db: "数据库魔法", footer_exp_software: "软件锻造", footer_exp_network: "网络防御", footer_exp_iot: "物联网工程", footer_exp_lab: "实验室精通",
        footer_res_code: "代码仓库", footer_res_gallery: "项目画廊", footer_res_sitemap: "网站地图",
        footer_forged: "⚔️ 以热情铸造 ⚔️", footer_crafted: "用心制作"
    },
    
    // Korean (한국어)
    ko: {
        nav_home: "홈", nav_skills: "스킬", nav_about: "소개", nav_portfolio: "프로젝트", nav_experience: "경험", nav_contact: "연락처",
        greeting: "안녕하세요, 저는", status_available: "프로젝트 가능", hero_subtitle: "정보학과 졸업생 & 연구실 조교",
        hero_description: "소프트웨어 개발, 데이터베이스 프로그래밍, 멀티미디어 응용 프로그램에 숙련된 정보학과 졸업생입니다. 연구실 조교 및 소프트웨어 R&D 프로젝트 경험이 있으며, 신기술을 실제 솔루션에 적용하는 것에 열정을 가지고 있습니다.",
        btn_view_projects: "프로젝트 보기", btn_download_cv: "이력서 다운로드",
        skills_title: "퀘스트 보드", skills_subtitle: "마스터한 스킬과 완료한 훈련 미션",
        quest_legendary: "전설 퀘스트", quest_epic: "에픽 퀘스트", quest_rare: "레어 퀘스트", quest_uncommon: "언커먼 퀘스트",
        quest_mastered: "마스터", quest_certified: "인증됨",
        quest_ml_title: "머신러닝 & 데이터 사이언스", quest_ml_desc: "인공지능의 신비로운 기술을 마스터하라",
        quest_prog_title: "프로그래밍 & 개발", quest_prog_desc: "소프트웨어 아티팩트와 강력한 앱을 단조하라",
        quest_db_title: "데이터베이스 & 네트워킹", quest_db_desc: "데이터 영역과 네트워크 지역을 정복하라",
        quest_viz_title: "데이터 시각화 & 테스팅", quest_viz_desc: "데이터 스트림에 숨겨진 비밀을 풀어라",
        quest_tools_title: "개발 도구 & OS", quest_tools_desc: "강력한 도구를 장착하고 환경을 마스터하라",
        quest_total_xp: "총 경험치", quest_level: "레벨",
        about_title: "영웅 프로필", about_subtitle: "디지털 영역의 챔피언",
        hero_class: "개발자", hero_title_text: "코드 아키텍트",
        hero_attr_str: "힘", hero_attr_agi: "민첩", hero_attr_int: "지능",
        hero_stat_projects: "프로젝트", hero_stat_roles: "역할", hero_stat_cert: "자격증",
        hero_lore_label: "영웅 전설",
        hero_lore_1: '디지털 시대에 태어난 <strong>Muhammad Zulfan Anggadhiputra</strong>는 <em>반둥 국립공과대학교</em>에서 유망한 코드 전사로 등장했습니다. 호기심에서 시작된 여정은 기술의 다양한 영역에 대한 숙달로 발전했습니다.',
        hero_lore_2: '<strong>5회 연구실 조교</strong>로서 데이터베이스 프로그래밍, OOP, 네트워크 보안, IoT, 로보틱스의 위험한 길을 젊은 수습생들에게 안내합니다. <strong>PT Dwi Purwa Teknologi</strong>에서의 전투 경험이 실전 소프트웨어 개발 스킬을 단련했습니다.',
        hero_lore_3: '화웨이의 신성한 <strong>HCIA-Security 인증</strong>으로 무장하여 디지털 위협에 대한 수호자로 서 있습니다. IoT 프로토타입부터 딥러닝 모델까지, 이 코드 아키텍트에게 너무 큰 도전은 없습니다.',
        hero_abilities_label: "특수 능력",
        hero_ability_q: "학업 우수성", hero_ability_q_type: "패시브", hero_ability_q_desc: "GPA 3.49의 정보학 졸업생, 다수의 연구실 직위",
        hero_ability_w: "보안 방패", hero_ability_w_type: "액티브", hero_ability_w_desc: "HCIA-Security V4.0 인증, 디지털 영역 보호",
        hero_ability_e: "지식 전달", hero_ability_e_type: "액티브", hero_ability_e_desc: "차세대 개발자를 양성하는 연구실 강사",
        hero_ability_r: "머신러닝 비전", hero_ability_r_type: "궁극기", hero_ability_r_desc: "고정밀 AI 모델(99.56% 정확도)을 배치하여 데이터 도전 극복",
        hero_equip_label: "장착 아이템", hero_equip_lab: "5x 랩 강사", hero_equip_intern: "소프트웨어 인턴", hero_equip_more: "곧 추가 예정...",
        experience_title: "전투 캠페인", experience_subtitle: "승리와 정복한 영토의 연대기",
        campaign_ch1_type: "사령관 등급", campaign_ch1_status: "달성", campaign_ch1_title: "마스터 아티피서", campaign_ch1_story: "코디네이터 등급으로 승격하여 연구실 조교 팀을 이끌고 로보틱스 커리큘럼을 관리. 학생들에게 하드웨어-소프트웨어 통합, 센서, 마이크로컨트롤러 구현을 지도.",
        campaign_ch2_type: "에픽 배틀", campaign_ch2_status: "승리", campaign_ch2_title: "기업 공성전", campaign_ch2_story: "기업 전장에서 엘리트 개발자들과 합류. R&D 운영에 기여하고 활성 소프트웨어 프로젝트에서 새로운 기능을 개발하며 완전한 소프트웨어 개발 라이프사이클을 마스터.",
        campaign_ch3_type: "던전 레이드", campaign_ch3_status: "클리어", campaign_ch3_title: "코드 멘토십", campaign_ch3_story: "Java OOP와 컴퓨터 네트워크 구성(LAN, TCP/IP, 라우터) 모두에서 신입을 지도하는 이중 역할 수행. 차세대 개발자를 위한 강력한 기반 구축.",
        campaign_ch4_title: "데이터 성역", campaign_ch4_story: "데이터베이스 설계와 Delphi7 마법의 미스터리를 젊은 수습생에게 안내. 수많은 학생들의 데이터 조작 마스터를 멘토링.",
        campaign_ch5_type: "오리진 스토리", campaign_ch5_status: "졸업", campaign_ch5_title: "학술 십자군", campaign_ch5_story: "지식의 전당을 여행하며 정보학의 신비로운 기술을 마스터. 전투력(GPA) 3.49로 졸업.",
        campaign_stat_battles: "승리한 전투", campaign_stat_students: "지도한 학생", campaign_stat_years: "활동 연수", campaign_stat_certs: "자격 인증",
        portfolio_title: "아티팩트 무기고", portfolio_subtitle: "코드의 불꽃으로 단조된 전설적인 창작물",
        armory_tab_all: "전체 아티팩트", armory_tab_web: "웹 유물", armory_tab_db: "데이터 크리스탈", armory_tab_media: "미디어 오브", armory_tab_academic: "스크롤", armory_tab_iot: "테크 코어",
        armory_btn_inspect: "검사", armory_btn_view: "보기", armory_btn_discover: "더 많은 아티팩트 발견", armory_btn_forge: "대장간 방문",
        armory_p1_name: "원격 조종 탱크", armory_p1_type: "IoT & 임베디드 시스템", armory_p1_desc: "ESP32 코어로 구동되는 고대 전쟁 기계, 신비로운 Flutter 인터페이스로 제어.",
        armory_p2_name: "뉴럴 비전 오브", armory_p2_type: "머신러닝", armory_p2_desc: "InceptionV3 딥러닝 마법으로 이미지를 인식하고 분류하는 마법의 오브.",
        armory_p3_name: "푸드레스큐 포털", armory_p3_type: "웹 애플리케이션", armory_p3_desc: "음식물 쓰레기와 싸우는 풀스택 Laravel 웹 앱. IDEA FEST 3 동메달리스트.",
        armory_p4_name: "OMR 채점 매트릭스", armory_p4_type: "컴퓨터 비전 & 웹", armory_p4_desc: "사회봉사 프로젝트: OpenCV와 Next.js, FastAPI를 결합한 자동화 OMR 웹 시스템.",
        armory_p5_name: "논문 스크롤", armory_p5_type: "머신러닝 & NLP", armory_p5_desc: "YouTube 온라인 도박 스팸 감지. 랜덤 포레스트와 TF-IDF 하이브리드 특성으로 99.56% 성능 달성.",
        contact_title: "선술집", contact_subtitle: "까마귀를 보내거나 게시판을 방문하여 퀘스트를 시작하세요",
        tavern_form_title: "메시지 작성", tavern_form_name: "영웅 이름", tavern_form_email: "까마귀 주소", tavern_form_quest: "퀘스트 유형", tavern_form_message: "메시지", tavern_form_submit: "까마귀 보내기",
        tavern_quest_select: "퀘스트 선택...", tavern_quest_alliance: "🤝 동맹 요청", tavern_quest_project: "⚔️ 새 퀘스트/프로젝트", tavern_quest_hiring: "👑 채용", tavern_quest_question: "❓ 지혜 구하기", tavern_quest_other: "📜 기타",
        tavern_npc_status: "퀘스트 수락 가능", tavern_npc_dialogue: '"환영합니다, 여행자여! 저는 <strong>Zulfan</strong>, 이 선술집의 주인입니다. 여행에 어떤 도움이 필요하신가요?"',
        tavern_card_email: "까마귀 메일", tavern_card_phone: "수정구슬", tavern_card_location: "선술집 위치",
        tavern_social_title: "까마귀 보내기", tavern_hours_title: "선술집 영업시간", tavern_hours_closed: "휴무", tavern_hours_response: "까마귀는 보통 24시간 내에 돌아옵니다",
        footer_sigil_title: "코드 전사 & 디지털 장인", footer_sigil_desc: "ITENAS 반둥의 정보학 졸업생, 디지털 아티팩트를 단조하고 HCIA-Security 인증으로 영역을 수호.",
        footer_nav_title: "탐색", footer_expertise_title: "전문 분야", footer_resources_title: "리소스",
        footer_nav_basecamp: "베이스캠프", footer_nav_hero: "영웅 프로필", footer_nav_quest: "퀘스트 보드", footer_nav_battle: "전투 캠페인", footer_nav_armory: "아티팩트 무기고", footer_nav_tavern: "선술집",
        footer_exp_db: "데이터베이스 마법", footer_exp_software: "소프트웨어 단조", footer_exp_network: "네트워크 방어", footer_exp_iot: "IoT 엔지니어링", footer_exp_lab: "랩 마스터리",
        footer_res_code: "코드 저장소", footer_res_gallery: "프로젝트 갤러리", footer_res_sitemap: "사이트맵",
        footer_forged: "⚔️ 열정으로 단조 ⚔️", footer_crafted: "정성을 담아 제작"
    },
    
    // German (Deutsch)
    de: {
        nav_home: "Startseite", nav_skills: "Fähigkeiten", nav_about: "Über mich", nav_portfolio: "Projekte", nav_experience: "Erfahrung", nav_contact: "Kontakt",
        greeting: "Hallo, ich bin", status_available: "Verfügbar für Projekte", hero_subtitle: "Informatikabsolvent & Laborassistent",
        hero_description: "Informatik-Absolvent mit Kenntnissen in Softwareentwicklung, Datenbankprogrammierung und Multimedia-Anwendungen. Erfahren in Laborassistenz und Software-F&E-Projekten, mit der Leidenschaft, neue Technologien für reale Lösungen anzuwenden.",
        btn_view_projects: "Projekte ansehen", btn_download_cv: "Lebenslauf herunterladen",
        skills_title: "Questtafel", skills_subtitle: "Gemeisterte Fähigkeiten und abgeschlossene Trainingsmissionen",
        quest_legendary: "LEGENDÄRE QUEST", quest_epic: "EPISCHE QUEST", quest_rare: "SELTENE QUEST", quest_uncommon: "UNGEWÖHNLICHE QUEST",
        quest_mastered: "GEMEISTERT", quest_certified: "ZERTIFIZIERT",
        quest_ml_title: "Maschinelles Lernen & Data Science", quest_ml_desc: "Meistere die arkanen Künste der künstlichen Intelligenz",
        quest_prog_title: "Programmierung & Entwicklung", quest_prog_desc: "Schmiede Software-Artefakte und mächtige Anwendungen",
        quest_db_title: "Datenbank & Netzwerk", quest_db_desc: "Erobere Datenreiche und Netzwerkgebiete",
        quest_viz_title: "Datenvisualisierung & Testing", quest_viz_desc: "Enthülle Geheimnisse in Datenströmen",
        quest_tools_title: "Entwicklertools & Betriebssysteme", quest_tools_desc: "Rüste mächtige Werkzeuge aus und meistere die Umgebungen",
        quest_total_xp: "GESAMTERFAHRUNG", quest_level: "STUFE",
        about_title: "Heldenprofil", about_subtitle: "Champion des digitalen Reichs",
        hero_class: "ENTWICKLER", hero_title_text: "Der Code-Architekt",
        hero_attr_str: "STÄRKE", hero_attr_agi: "AGILITÄT", hero_attr_int: "INTELLIGENZ",
        hero_stat_projects: "PROJEKTE", hero_stat_roles: "ROLLEN", hero_stat_cert: "ZERT",
        hero_lore_label: "HELDENGESCHICHTE",
        hero_lore_1: 'Im digitalen Zeitalter geboren, trat <strong>Muhammad Zulfan Anggadhiputra</strong> aus den Hallen des <em>Institut Teknologi Nasional Bandung</em> als vielversprechender Code-Krieger hervor. Seine Reise begann mit Neugier und entwickelte sich zur Meisterschaft über mehrere Technologiedomänen.',
        hero_lore_2: 'Als <strong>5-facher Laborassistent</strong> führt er junge Lehrlinge durch die gefährlichen Pfade der Datenbankprogrammierung, OOP, Netzwerksicherheit, IoT und Robotik. Seine Kampferfahrung bei <strong>PT Dwi Purwa Teknologi</strong> schmiedete seine Fähigkeiten in realer Softwareentwicklung.',
        hero_lore_3: 'Bewaffnet mit der heiligen <strong>HCIA-Security-Zertifizierung</strong> von Huawei steht er als Wächter gegen digitale Bedrohungen. Von IoT-Prototypen bis zu Deep-Learning-Modellen ist keine Herausforderung zu groß für diesen Code-Architekten.',
        hero_abilities_label: "SPEZIALFÄHIGKEITEN",
        hero_ability_q: "Akademische Exzellenz", hero_ability_q_type: "PASSIV", hero_ability_q_desc: "Informatikabsolvent mit GPA 3,49 und mehreren Laborpositionen",
        hero_ability_w: "Sicherheitsschild", hero_ability_w_type: "AKTIV", hero_ability_w_desc: "HCIA-Security V4.0 zertifiziert, schützt digitale Reiche",
        hero_ability_e: "Wissenstransfer", hero_ability_e_type: "AKTIV", hero_ability_e_desc: "Laborlehrer, der die nächste Generation von Entwicklern stärkt",
        hero_ability_r: "Machine Learning Vision", hero_ability_r_type: "ULTIMATIV", hero_ability_r_desc: "Hochpräzise KI-Modelle (99,56% Genauigkeit) einsetzen",
        hero_equip_label: "AUSGERÜSTETE ITEMS", hero_equip_lab: "5x Laborlehrer", hero_equip_intern: "Software-Praktikant", hero_equip_more: "Mehr kommt bald...",
        experience_title: "Schlachtkampagne", experience_subtitle: "Chroniken von Siegen und eroberten Gebieten",
        campaign_ch1_type: "KOMMANDANTENRANG", campaign_ch1_status: "ERREICHT", campaign_ch1_title: "Der Meisterhandwerker", campaign_ch1_story: "Zum Koordinator aufgestiegen, das Laborassistententeam geführt und den Robotik-Lehrplan verwaltet. Studenten in Hardware-Software-Integration, Sensoren und Mikrocontroller-Implementierung angeleitet.",
        campaign_ch2_type: "EPISCHE SCHLACHT", campaign_ch2_status: "SIEG", campaign_ch2_title: "Die Firmenbelagerung", campaign_ch2_story: "Mit Elite-Entwicklern auf dem Unternehmensschlachtfeld zusammengeschlossen. Beiträge zu F&E-Operationen, neue Features in aktiven Softwareprojekten entwickelt.",
        campaign_ch3_type: "DUNGEON-RAID", campaign_ch3_status: "GERÄUMT", campaign_ch3_title: "Das Code-Mentoring", campaign_ch3_story: "Doppelrolle bei der Ausbildung von Rekruten in Java OOP und Computernetzwerk-Konfiguration (LAN, TCP/IP, Router).",
        campaign_ch4_title: "Das Datenheiligtum", campaign_ch4_story: "Junge Lehrlinge durch die Geheimnisse des Datenbankdesigns und der Delphi7-Zauberei geführt.",
        campaign_ch5_type: "URSPRUNGSGESCHICHTE", campaign_ch5_status: "ABSCHLUSS", campaign_ch5_title: "Der Akademische Kreuzzug", campaign_ch5_story: "Eine Reise durch die Hallen des Wissens, die arkanen Künste der Informatik gemeistert. Mit Power Level (GPA) 3,49 abgeschlossen.",
        campaign_stat_battles: "Gewonnene Schlachten", campaign_stat_students: "Betreute Studenten", campaign_stat_years: "Aktive Jahre", campaign_stat_certs: "Zertifizierungen",
        portfolio_title: "Artefakt-Arsenal", portfolio_subtitle: "Legendäre Kreationen, geschmiedet im Feuer des Codes",
        armory_tab_all: "Alle Artefakte", armory_tab_web: "Web-Reliquien", armory_tab_db: "Datenkristalle", armory_tab_media: "Medienkugeln", armory_tab_academic: "Schriftrollen", armory_tab_iot: "Tech-Kerne",
        armory_btn_inspect: "Untersuchen", armory_btn_view: "Ansehen", armory_btn_discover: "Mehr Artefakte entdecken", armory_btn_forge: "Die Schmiede besuchen",
        armory_p1_name: "Ferngesteuerter Panzer", armory_p1_type: "IoT & Eingebettete Systeme", armory_p1_desc: "Uralte Kriegsmaschine mit ESP32-Kern, gesteuert über mystische Flutter-Oberfläche.",
        armory_p2_name: "Neurale Visionskugel", armory_p2_type: "Maschinelles Lernen", armory_p2_desc: "Verzauberte Kugel, die mit InceptionV3 Deep-Learning-Magie Bilder erkennt und klassifiziert.",
        armory_p3_name: "FoodRescue-Portal", armory_p3_type: "Webanwendung", armory_p3_desc: "Full-Stack Laravel Web-App gegen Lebensmittelverschwendung. IDEA FEST 3 Bronzemedaillengewinner.",
        armory_p4_name: "OMR-Bewertungsmatrix", armory_p4_type: "Computer Vision & Web", armory_p4_desc: "Gemeindedienst-Projekt: Automatisiertes OMR-Websystem mit OpenCV, Next.js & FastAPI.",
        armory_p5_name: "Die Thesis-Schriftrolle", armory_p5_type: "ML & NLP", armory_p5_desc: "Erkennung von Online-Glücksspiel-Spam auf YouTube. 99,56% Leistung mit Random Forest und TF-IDF.",
        contact_title: "Die Taverne", contact_subtitle: "Sende einen Raben oder besuche das Nachrichtenbrett",
        tavern_form_title: "Nachricht schreiben", tavern_form_name: "Heldenname", tavern_form_email: "Rabenadresse", tavern_form_quest: "Questtyp", tavern_form_message: "Deine Nachricht", tavern_form_submit: "Raben senden",
        tavern_quest_select: "Quest wählen...", tavern_quest_alliance: "🤝 Allianzanfrage", tavern_quest_project: "⚔️ Neue Quest/Projekt", tavern_quest_hiring: "👑 Rekrutierung", tavern_quest_question: "❓ Weisheit suchen", tavern_quest_other: "📜 Sonstiges",
        tavern_npc_status: "Verfügbar für Quests", tavern_npc_dialogue: '"Grüße, Reisender! Ich bin <strong>Zulfan</strong>, Hüter dieser Taverne. Wie kann ich dir auf deiner Reise helfen?"',
        tavern_card_email: "Rabenpost", tavern_card_phone: "Kristallkugel", tavern_card_location: "Tavernenstandort",
        tavern_social_title: "Einen Raben senden", tavern_hours_title: "Öffnungszeiten", tavern_hours_closed: "Geschlossen", tavern_hours_response: "Raben kehren normalerweise innerhalb von 24 Stunden zurück",
        footer_sigil_title: "Code-Krieger & Digitaler Handwerker", footer_sigil_desc: "Informatikabsolvent der ITENAS Bandung, schmiedet digitale Artefakte und verteidigt das Reich mit HCIA-Security-Zertifizierung.",
        footer_nav_title: "Navigation", footer_expertise_title: "Expertise", footer_resources_title: "Ressourcen",
        footer_nav_basecamp: "Basislager", footer_nav_hero: "Heldenprofil", footer_nav_quest: "Questtafel", footer_nav_battle: "Schlachtkampagne", footer_nav_armory: "Artefakt-Arsenal", footer_nav_tavern: "Die Taverne",
        footer_exp_db: "Datenbank-Magie", footer_exp_software: "Software-Schmiede", footer_exp_network: "Netzwerkverteidigung", footer_exp_iot: "IoT-Technik", footer_exp_lab: "Labor-Meisterschaft",
        footer_res_code: "Code-Repository", footer_res_gallery: "Projektgalerie", footer_res_sitemap: "Seitenübersicht",
        footer_forged: "⚔️ MIT LEIDENSCHAFT GESCHMIEDET ⚔️", footer_crafted: "Hergestellt mit"
    },
    
    // Russian (Русский)
    ru: {
        nav_home: "Главная", nav_skills: "Навыки", nav_about: "Обо мне", nav_portfolio: "Проекты", nav_experience: "Опыт", nav_contact: "Контакты",
        greeting: "Привет, я", status_available: "Доступен для проектов", hero_subtitle: "Выпускник информатики и лаборант",
        hero_description: "Выпускник информатики, специализирующийся на разработке программного обеспечения, программировании баз данных и мультимедийных приложениях. Имею опыт работы лаборантом и в проектах R&D, с страстью применять новые технологии для реальных решений.",
        btn_view_projects: "Посмотреть проекты", btn_download_cv: "Скачать резюме",
        skills_title: "Доска квестов", skills_subtitle: "Освоенные навыки и выполненные тренировочные миссии",
        quest_legendary: "ЛЕГЕНДАРНЫЙ КВЕСТ", quest_epic: "ЭПИЧЕСКИЙ КВЕСТ", quest_rare: "РЕДКИЙ КВЕСТ", quest_uncommon: "НЕОБЫЧНЫЙ КВЕСТ",
        quest_mastered: "ОСВОЕНО", quest_certified: "СЕРТИФИЦИРОВАНО",
        quest_ml_title: "Машинное обучение и Data Science", quest_ml_desc: "Овладей тайными искусствами ИИ",
        quest_prog_title: "Программирование и разработка", quest_prog_desc: "Выкуй программные артефакты и мощные приложения",
        quest_db_title: "Базы данных и сети", quest_db_desc: "Покори области данных и сетевые территории",
        quest_viz_title: "Визуализация данных и тестирование", quest_viz_desc: "Раскрой секреты, скрытые в потоках данных",
        quest_tools_title: "Инструменты разработки и ОС", quest_tools_desc: "Снарядись мощными инструментами и освой окружения",
        quest_total_xp: "ОБЩИЙ ОПЫТ", quest_level: "УРОВЕНЬ",
        about_title: "Профиль героя", about_subtitle: "Чемпион цифрового мира",
        hero_class: "РАЗРАБОТЧИК", hero_title_text: "Архитектор кода",
        hero_attr_str: "СИЛА", hero_attr_agi: "ЛОВКОСТЬ", hero_attr_int: "ИНТЕЛЛЕКТ",
        hero_stat_projects: "ПРОЕКТЫ", hero_stat_roles: "РОЛИ", hero_stat_cert: "СЕРТ",
        hero_lore_label: "ИСТОРИЯ ГЕРОЯ",
        hero_lore_1: 'Рождённый в цифровую эпоху, <strong>Мухаммад Зульфан Анггадипутра</strong> вышел из стен <em>Национального технологического института Бандунга</em> как перспективный воин кода. Его путь начался с любопытства и превратился в мастерство над несколькими технологическими доменами.',
        hero_lore_2: 'Как <strong>5-кратный лаборант</strong>, он ведёт молодых учеников по опасным тропам программирования баз данных, ООП, сетевой безопасности, IoT и робототехники. Боевой опыт в <strong>PT Dwi Purwa Teknologi</strong> закалил его навыки в реальной разработке ПО.',
        hero_lore_3: 'Вооружённый священным <strong>сертификатом HCIA-Security</strong> от Huawei, он стоит как страж против цифровых угроз. От IoT-прототипов до моделей глубокого обучения — нет задачи, которая была бы не по силам этому Архитектору кода.',
        hero_abilities_label: "ОСОБЫЕ СПОСОБНОСТИ",
        hero_ability_q: "Академическое совершенство", hero_ability_q_type: "ПАССИВНАЯ", hero_ability_q_desc: "Выпускник информатики с GPA 3.49 и несколькими лабораторными позициями",
        hero_ability_w: "Щит безопасности", hero_ability_w_type: "АКТИВНАЯ", hero_ability_w_desc: "Сертифицирован HCIA-Security V4.0, защищает цифровые миры",
        hero_ability_e: "Передача знаний", hero_ability_e_type: "АКТИВНАЯ", hero_ability_e_desc: "Лабораторный инструктор, взращивающий новое поколение разработчиков",
        hero_ability_r: "Машинное зрение", hero_ability_r_type: "УЛЬТИМЕЙТ", hero_ability_r_desc: "Развёртывание высокоточных ИИ-моделей (99,56% точности) для решения задач данных",
        hero_equip_label: "ЭКИПИРОВАННЫЕ ПРЕДМЕТЫ", hero_equip_lab: "5x Лабораторный инструктор", hero_equip_intern: "Стажёр-программист", hero_equip_more: "Скоро будет больше...",
        experience_title: "Боевая кампания", experience_subtitle: "Хроники побед и завоёванных территорий",
        campaign_ch1_type: "РАНГ КОМАНДИРА", campaign_ch1_status: "ДОСТИГНУТО", campaign_ch1_title: "Мастер-ремесленник", campaign_ch1_story: "Повышен до координатора, возглавил команду лаборантов и управлял учебной программой по робототехнике.",
        campaign_ch2_type: "ЭПИЧЕСКАЯ БИТВА", campaign_ch2_status: "ПОБЕДА", campaign_ch2_title: "Корпоративная осада", campaign_ch2_story: "Присоединился к элитным разработчикам на корпоративном поле боя. Внёс вклад в операции R&D и освоил полный цикл разработки ПО.",
        campaign_ch3_type: "РЕЙД В ПОДЗЕМЕЛЬЕ", campaign_ch3_status: "ЗАЧИЩЕНО", campaign_ch3_title: "Наставничество кода", campaign_ch3_story: "Выполнял двойную роль по обучению новичков Java OOP и конфигурации компьютерных сетей (LAN, TCP/IP, маршрутизатор).",
        campaign_ch4_title: "Святилище данных", campaign_ch4_story: "Вёл молодых учеников через тайны проектирования баз данных и магию Delphi7.",
        campaign_ch5_type: "ИСТОРИЯ ПРОИСХОЖДЕНИЯ", campaign_ch5_status: "ВЫПУСКНИК", campaign_ch5_title: "Академический крестовый поход", campaign_ch5_story: "Отправился в путешествие по залам знаний, освоив тайные искусства информатики. Выпустился с уровнем силы (GPA) 3,49.",
        campaign_stat_battles: "Выигранных сражений", campaign_stat_students: "Наставляемых студентов", campaign_stat_years: "Лет активности", campaign_stat_certs: "Сертификаций",
        portfolio_title: "Арсенал артефактов", portfolio_subtitle: "Легендарные творения, выкованные в огне кода",
        armory_tab_all: "Все артефакты", armory_tab_web: "Веб-реликвии", armory_tab_db: "Кристаллы данных", armory_tab_media: "Медиа-сферы", armory_tab_academic: "Свитки", armory_tab_iot: "Техно-ядра",
        armory_btn_inspect: "Осмотреть", armory_btn_view: "Смотреть", armory_btn_discover: "Найти больше артефактов", armory_btn_forge: "Посетить кузницу",
        armory_p1_name: "Радиоуправляемый танк", armory_p1_type: "IoT и встраиваемые системы", armory_p1_desc: "Древняя боевая машина на ядре ESP32, управляемая через мистический интерфейс Flutter.",
        armory_p2_name: "Нейронная сфера зрения", armory_p2_type: "Машинное обучение", armory_p2_desc: "Зачарованная сфера, распознающая и классифицирующая изображения с помощью магии глубокого обучения InceptionV3.",
        armory_p3_name: "Портал FoodRescue", armory_p3_type: "Веб-приложение", armory_p3_desc: "Full-stack Laravel веб-приложение для борьбы с пищевыми отходами. Бронзовый медалист IDEA FEST 3.",
        armory_p4_name: "Матрица оценки OMR", armory_p4_type: "Компьютерное зрение и веб", armory_p4_desc: "Проект общественной службы: Автоматизированная веб-система OMR с OpenCV, Next.js и FastAPI.",
        armory_p5_name: "Свиток дипломной работы", armory_p5_type: "МО и NLP", armory_p5_desc: "Обнаружение спама онлайн-казино на YouTube. Достигнута производительность 99,56% с Random Forest и TF-IDF.",
        contact_title: "Таверна", contact_subtitle: "Отправьте ворона или посетите доску объявлений",
        tavern_form_title: "Написать сообщение", tavern_form_name: "Имя героя", tavern_form_email: "Адрес ворона", tavern_form_quest: "Тип квеста", tavern_form_message: "Ваше сообщение", tavern_form_submit: "Отправить ворона",
        tavern_quest_select: "Выберите квест...", tavern_quest_alliance: "🤝 Запрос на союз", tavern_quest_project: "⚔️ Новый квест/проект", tavern_quest_hiring: "👑 Набор", tavern_quest_question: "❓ В поисках мудрости", tavern_quest_other: "📜 Другое",
        tavern_npc_status: "Доступен для квестов", tavern_npc_dialogue: '«Приветствую, путник! Я <strong>Зульфан</strong>, хранитель этой таверны. Чем могу помочь в твоём путешествии?»',
        tavern_card_email: "Вороновая почта", tavern_card_phone: "Хрустальный шар", tavern_card_location: "Расположение таверны",
        tavern_social_title: "Отправить ворона", tavern_hours_title: "Часы работы таверны", tavern_hours_closed: "Закрыто", tavern_hours_response: "Вороны обычно возвращаются в течение 24 часов",
        footer_sigil_title: "Воин кода и цифровой мастер", footer_sigil_desc: "Выпускник информатики ITENAS Бандунг, кующий цифровые артефакты и защищающий мир сертификацией HCIA-Security.",
        footer_nav_title: "Навигация", footer_expertise_title: "Экспертиза", footer_resources_title: "Ресурсы",
        footer_nav_basecamp: "Базовый лагерь", footer_nav_hero: "Профиль героя", footer_nav_quest: "Доска квестов", footer_nav_battle: "Боевая кампания", footer_nav_armory: "Арсенал", footer_nav_tavern: "Таверна",
        footer_exp_db: "Магия БД", footer_exp_software: "Ковка ПО", footer_exp_network: "Сетевая оборона", footer_exp_iot: "IoT-инженерия", footer_exp_lab: "Мастерство лаборатории",
        footer_res_code: "Репозиторий кода", footer_res_gallery: "Галерея проектов", footer_res_sitemap: "Карта сайта",
        footer_forged: "⚔️ ВЫКОВАНО СО СТРАСТЬЮ ⚔️", footer_crafted: "Создано с"
    },
    
    // Portuguese (Português)
    pt: {
        nav_home: "Início", nav_skills: "Habilidades", nav_about: "Sobre", nav_portfolio: "Projetos", nav_experience: "Experiência", nav_contact: "Contato",
        greeting: "Olá, eu sou", status_available: "Disponível para projetos", hero_subtitle: "Graduado em Informática & Assistente de Laboratório",
        hero_description: "Graduado em Informática com habilidades em desenvolvimento de software, programação de banco de dados e aplicações multimídia. Experiente em assistência de laboratório e projetos de P&D de software.",
        btn_view_projects: "Ver Projetos", btn_download_cv: "Baixar CV",
        skills_title: "Quadro de Missões", skills_subtitle: "Habilidades dominadas e missões de treinamento concluídas",
        quest_legendary: "MISSÃO LENDÁRIA", quest_epic: "MISSÃO ÉPICA", quest_rare: "MISSÃO RARA", quest_uncommon: "MISSÃO INCOMUM",
        quest_mastered: "DOMINADO", quest_certified: "CERTIFICADO",
        quest_ml_title: "Machine Learning & Ciência de Dados", quest_ml_desc: "Domine as artes arcanas da inteligência artificial",
        quest_prog_title: "Programação & Desenvolvimento", quest_prog_desc: "Forje artefatos de software e aplicações poderosas",
        quest_db_title: "Banco de Dados & Redes", quest_db_desc: "Conquiste reinos de dados e territórios de rede",
        quest_viz_title: "Visualização de Dados & Testes", quest_viz_desc: "Desbloqueie segredos ocultos nos fluxos de dados",
        quest_tools_title: "Ferramentas de Dev & SO", quest_tools_desc: "Equipe ferramentas poderosas e domine os ambientes",
        quest_total_xp: "EXPERIÊNCIA TOTAL", quest_level: "NÍVEL",
        about_title: "Perfil do Herói", about_subtitle: "Campeão do Reino Digital",
        hero_class: "DESENVOLVEDOR", hero_title_text: "O Arquiteto de Código",
        hero_attr_str: "FORÇA", hero_attr_agi: "AGILIDADE", hero_attr_int: "INTELIGÊNCIA",
        hero_stat_projects: "PROJETOS", hero_stat_roles: "FUNÇÕES", hero_stat_cert: "CERT",
        hero_lore_label: "LORE DO HERÓI",
        hero_lore_1: 'Nascido na era digital, <strong>Muhammad Zulfan Anggadhiputra</strong> emergiu dos salões do <em>Institut Teknologi Nasional Bandung</em> como um promissor guerreiro de código. Sua jornada começou com curiosidade e evoluiu para maestria sobre múltiplos domínios da tecnologia.',
        hero_lore_2: 'Como <strong>5x Assistente de Laboratório</strong>, ele guia jovens aprendizes pelos caminhos perigosos de Programação de Banco de Dados, POO, Segurança de Rede, IoT e Robótica. Sua experiência em campo na <strong>PT Dwi Purwa Teknologi</strong> forjou suas habilidades em desenvolvimento de software real.',
        hero_lore_3: 'Armado com a sagrada <strong>certificação HCIA-Security</strong> da Huawei, ele se ergue como guardião contra ameaças digitais. De protótipos IoT a modelos de deep learning, nenhum desafio é grande demais para este Arquiteto de Código.',
        hero_abilities_label: "HABILIDADES ESPECIAIS",
        hero_ability_q: "Excelência Acadêmica", hero_ability_q_type: "PASSIVA", hero_ability_q_desc: "Graduado em Informática com GPA 3,49 e múltiplas posições de laboratório",
        hero_ability_w: "Escudo de Segurança", hero_ability_w_type: "ATIVA", hero_ability_w_desc: "Certificado HCIA-Security V4.0, protegendo reinos digitais",
        hero_ability_e: "Transferência de Conhecimento", hero_ability_e_type: "ATIVA", hero_ability_e_desc: "Instrutor de lab capacitando a próxima geração de desenvolvedores",
        hero_ability_r: "Visão de Machine Learning", hero_ability_r_type: "ULTIMATE", hero_ability_r_desc: "Implantar modelos de IA altamente precisos (99,56% de precisão) para vencer desafios de dados",
        hero_equip_label: "ITENS EQUIPADOS", hero_equip_lab: "5x Instrutor de Lab", hero_equip_intern: "Estagiário de Software", hero_equip_more: "Mais em breve...",
        experience_title: "Campanha de Batalha", experience_subtitle: "Crônicas de vitórias e territórios conquistados",
        campaign_ch1_type: "POSTO DE COMANDANTE", campaign_ch1_status: "ALCANÇADO", campaign_ch1_title: "O Mestre Artífice", campaign_ch1_story: "Ascendeu ao posto de Coordenador, liderando a equipe de assistentes de laboratório e gerenciando o currículo de robótica.",
        campaign_ch2_type: "BATALHA ÉPICA", campaign_ch2_status: "VITÓRIA", campaign_ch2_title: "O Cerco Corporativo", campaign_ch2_story: "Juntou-se a desenvolvedores de elite no campo de batalha corporativo. Contribuiu para operações de P&D e dominou o ciclo completo de desenvolvimento.",
        campaign_ch3_type: "ATAQUE AO CALABOUÇO", campaign_ch3_status: "LIMPO", campaign_ch3_title: "A Mentoria de Código", campaign_ch3_story: "Desempenhou dupla função instruindo recrutas em Java OOP e configuração de Redes de Computadores.",
        campaign_ch4_title: "O Santuário de Dados", campaign_ch4_story: "Guiou jovens aprendizes pelos mistérios do design de banco de dados e da feitiçaria Delphi7.",
        campaign_ch5_type: "HISTÓRIA DE ORIGEM", campaign_ch5_status: "FORMADO", campaign_ch5_title: "A Cruzada Acadêmica", campaign_ch5_story: "Embarcou em uma jornada pelos salões do conhecimento, dominando as artes arcanas da Informática. Graduou-se com nível de poder (GPA) 3,49.",
        campaign_stat_battles: "Batalhas Vencidas", campaign_stat_students: "Alunos Orientados", campaign_stat_years: "Anos Ativos", campaign_stat_certs: "Certificações",
        portfolio_title: "Arsenal de Artefatos", portfolio_subtitle: "Criações lendárias forjadas no fogo do código",
        armory_tab_all: "Todos os Artefatos", armory_tab_web: "Relíquias Web", armory_tab_db: "Cristais de Dados", armory_tab_media: "Orbes de Mídia", armory_tab_academic: "Pergaminhos", armory_tab_iot: "Núcleos Tech",
        armory_btn_inspect: "Inspecionar", armory_btn_view: "Ver", armory_btn_discover: "Descobrir Mais Artefatos", armory_btn_forge: "Visitar a Forja",
        armory_p1_name: "Tanque de Controle Remoto", armory_p1_type: "IoT & Sistemas Embarcados", armory_p1_desc: "Máquina de guerra antiga movida por núcleo ESP32, controlada através de interface Flutter mística.",
        armory_p2_name: "Orbe de Visão Neural", armory_p2_type: "Machine Learning", armory_p2_desc: "Orbe encantado que vê e classifica imagens usando feitiçaria de deep learning InceptionV3.",
        armory_p3_name: "Portal FoodRescue", armory_p3_type: "Aplicação Web", armory_p3_desc: "App web full-stack Laravel para combater o desperdício de alimentos. Medalhista de Bronze IDEA FEST 3.",
        armory_p4_name: "Matriz de Avaliação OMR", armory_p4_type: "Visão Computacional & Web", armory_p4_desc: "Projeto de Serviço Comunitário: Sistema web OMR automatizado com OpenCV, Next.js e FastAPI.",
        armory_p5_name: "O Pergaminho da Tese", armory_p5_type: "ML & NLP", armory_p5_desc: "Detecção de Spam de Jogos de Azar Online no YouTube. 99,56% de desempenho com Random Forest e TF-IDF.",
        contact_title: "A Taverna", contact_subtitle: "Envie um corvo ou visite o quadro de mensagens",
        tavern_form_title: "Escreva sua Mensagem", tavern_form_name: "Nome do Herói", tavern_form_email: "Endereço do Corvo", tavern_form_quest: "Tipo de Missão", tavern_form_message: "Sua Mensagem", tavern_form_submit: "Enviar Corvo",
        tavern_quest_select: "Selecione sua missão...", tavern_quest_alliance: "🤝 Pedido de Aliança", tavern_quest_project: "⚔️ Nova Missão/Projeto", tavern_quest_hiring: "👑 Recrutamento", tavern_quest_question: "❓ Buscar Sabedoria", tavern_quest_other: "📜 Outros Assuntos",
        tavern_npc_status: "Disponível para Missões", tavern_npc_dialogue: '"Saudações, viajante! Eu sou <strong>Zulfan</strong>, guardião desta taverna. Como posso ajudá-lo em sua jornada?"',
        tavern_card_email: "Correio do Corvo", tavern_card_phone: "Bola de Cristal", tavern_card_location: "Local da Taverna",
        tavern_social_title: "Enviar um Corvo", tavern_hours_title: "Horário da Taverna", tavern_hours_closed: "Fechado", tavern_hours_response: "Corvos geralmente retornam em 24 horas",
        footer_sigil_title: "Guerreiro de Código & Artesão Digital", footer_sigil_desc: "Graduado em Informática pela ITENAS Bandung, forjando artefatos digitais e defendendo o reino com certificação HCIA-Security.",
        footer_nav_title: "Navegar", footer_expertise_title: "Especialidades", footer_resources_title: "Recursos",
        footer_nav_basecamp: "Acampamento Base", footer_nav_hero: "Perfil do Herói", footer_nav_quest: "Quadro de Missões", footer_nav_battle: "Campanha de Batalha", footer_nav_armory: "Arsenal de Artefatos", footer_nav_tavern: "A Taverna",
        footer_exp_db: "Feitiçaria de BD", footer_exp_software: "Forja de Software", footer_exp_network: "Defesa de Rede", footer_exp_iot: "Engenharia IoT", footer_exp_lab: "Maestria de Lab",
        footer_res_code: "Repositório de Código", footer_res_gallery: "Galeria de Projetos", footer_res_sitemap: "Mapa do Site",
        footer_forged: "⚔️ FORJADO COM PAIXÃO ⚔️", footer_crafted: "Criado com"
    },
    
    // French (Français)
    fr: {
        nav_home: "Accueil", nav_skills: "Compétences", nav_about: "À propos", nav_portfolio: "Projets", nav_experience: "Expérience", nav_contact: "Contact",
        greeting: "Bonjour, je suis", status_available: "Disponible pour des projets", hero_subtitle: "Diplômé en Informatique & Assistant de Laboratoire",
        hero_description: "Diplômé en informatique qualifié en développement logiciel, programmation de bases de données et applications multimédias. Expérimenté dans l'assistance en laboratoire et les projets R&D logiciels.",
        btn_view_projects: "Voir Mes Projets", btn_download_cv: "Télécharger CV",
        skills_title: "Tableau des Quêtes", skills_subtitle: "Compétences maîtrisées et missions d'entraînement accomplies",
        quest_legendary: "QUÊTE LÉGENDAIRE", quest_epic: "QUÊTE ÉPIQUE", quest_rare: "QUÊTE RARE", quest_uncommon: "QUÊTE INHABITUELLE",
        quest_mastered: "MAÎTRISÉ", quest_certified: "CERTIFIÉ",
        quest_ml_title: "Machine Learning & Data Science", quest_ml_desc: "Maîtrise les arts arcanes de l'intelligence artificielle",
        quest_prog_title: "Programmation & Développement", quest_prog_desc: "Forge des artefacts logiciels et des applications puissantes",
        quest_db_title: "Base de Données & Réseau", quest_db_desc: "Conquiers les royaumes de données et les territoires réseau",
        quest_viz_title: "Visualisation de Données & Tests", quest_viz_desc: "Déverrouille les secrets cachés dans les flux de données",
        quest_tools_title: "Outils de Dev & OS", quest_tools_desc: "Équipe-toi d'outils puissants et maîtrise les environnements",
        quest_total_xp: "EXPÉRIENCE TOTALE", quest_level: "NIVEAU",
        about_title: "Profil du Héros", about_subtitle: "Champion du Royaume Numérique",
        hero_class: "DÉVELOPPEUR", hero_title_text: "L'Architecte du Code",
        hero_attr_str: "FORCE", hero_attr_agi: "AGILITÉ", hero_attr_int: "INTELLIGENCE",
        hero_stat_projects: "PROJETS", hero_stat_roles: "RÔLES", hero_stat_cert: "CERT",
        hero_lore_label: "HISTOIRE DU HÉROS",
        hero_lore_1: "Né à l'ère numérique, <strong>Muhammad Zulfan Anggadhiputra</strong> est sorti des salles de l'<em>Institut Teknologi Nasional Bandung</em> comme un guerrier du code prometteur. Son voyage a commencé par la curiosité et a évolué vers la maîtrise de multiples domaines technologiques.",
        hero_lore_2: "En tant que <strong>5x Assistant de Laboratoire</strong>, il guide les jeunes apprentis à travers les chemins périlleux de la Programmation de Bases de Données, POO, Sécurité Réseau, IoT et Robotique. Son expérience de combat chez <strong>PT Dwi Purwa Teknologi</strong> a forgé ses compétences en développement logiciel réel.",
        hero_lore_3: "Armé du sacré <strong>certificat HCIA-Security</strong> de Huawei, il se dresse en gardien contre les menaces numériques. Des prototypes IoT aux modèles de deep learning, aucun défi n'est trop grand pour cet Architecte du Code.",
        hero_abilities_label: "CAPACITÉS SPÉCIALES",
        hero_ability_q: "Excellence Académique", hero_ability_q_type: "PASSIF", hero_ability_q_desc: "Diplômé en Informatique avec GPA 3,49 et plusieurs postes de laboratoire",
        hero_ability_w: "Bouclier de Sécurité", hero_ability_w_type: "ACTIF", hero_ability_w_desc: "Certifié HCIA-Security V4.0, protégeant les royaumes numériques",
        hero_ability_e: "Transfert de Connaissances", hero_ability_e_type: "ACTIF", hero_ability_e_desc: "Instructeur de lab formant la prochaine génération de développeurs",
        hero_ability_r: "Vision Machine Learning", hero_ability_r_type: "ULTIME", hero_ability_r_desc: "Déployer des modèles IA haute précision (99,56%) pour vaincre les défis de données",
        hero_equip_label: "OBJETS ÉQUIPÉS", hero_equip_lab: "5x Instructeur de Lab", hero_equip_intern: "Stagiaire Logiciel", hero_equip_more: "Plus à venir...",
        experience_title: "Campagne de Bataille", experience_subtitle: "Chroniques des victoires et des territoires conquis",
        campaign_ch1_type: "RANG DE COMMANDANT", campaign_ch1_status: "ATTEINT", campaign_ch1_title: "Le Maître Artisan", campaign_ch1_story: "Promu au rang de Coordinateur, dirigeant l'équipe d'assistants de laboratoire et gérant le programme de robotique.",
        campaign_ch2_type: "BATAILLE ÉPIQUE", campaign_ch2_status: "VICTOIRE", campaign_ch2_title: "Le Siège Corporatif", campaign_ch2_story: "A rejoint les développeurs d'élite sur le champ de bataille corporatif. Contributions aux opérations R&D et maîtrise du cycle de développement logiciel complet.",
        campaign_ch3_type: "RAID DE DONJON", campaign_ch3_status: "NETTOYÉ", campaign_ch3_title: "Le Mentorat du Code", campaign_ch3_story: "Double rôle d'instruction en POO Java et configuration de réseaux informatiques (LAN, TCP/IP, routeur).",
        campaign_ch4_title: "Le Sanctuaire des Données", campaign_ch4_story: "A guidé les jeunes apprentis à travers les mystères de la conception de bases de données et de la sorcellerie Delphi7.",
        campaign_ch5_type: "HISTOIRE D'ORIGINE", campaign_ch5_status: "DIPLÔMÉ", campaign_ch5_title: "La Croisade Académique", campaign_ch5_story: "S'est lancé dans un voyage à travers les salles du savoir, maîtrisant les arts arcanes de l'Informatique. Diplômé avec un niveau de puissance (GPA) de 3,49.",
        campaign_stat_battles: "Batailles Gagnées", campaign_stat_students: "Étudiants Mentorisés", campaign_stat_years: "Années Actives", campaign_stat_certs: "Certifications",
        portfolio_title: "Arsenal d'Artefacts", portfolio_subtitle: "Créations légendaires forgées dans le feu du code",
        armory_tab_all: "Tous les Artefacts", armory_tab_web: "Reliques Web", armory_tab_db: "Cristaux de Données", armory_tab_media: "Orbes Média", armory_tab_academic: "Parchemins", armory_tab_iot: "Noyaux Tech",
        armory_btn_inspect: "Inspecter", armory_btn_view: "Voir", armory_btn_discover: "Découvrir Plus d'Artefacts", armory_btn_forge: "Visiter la Forge",
        armory_p1_name: "Char Télécommandé", armory_p1_type: "IoT & Systèmes Embarqués", armory_p1_desc: "Machine de guerre ancienne alimentée par un cœur ESP32, contrôlée via une interface Flutter mystique.",
        armory_p2_name: "Orbe de Vision Neurale", armory_p2_type: "Machine Learning", armory_p2_desc: "Orbe enchanté qui voit et classifie les images grâce à la sorcellerie deep learning InceptionV3.",
        armory_p3_name: "Portail FoodRescue", armory_p3_type: "Application Web", armory_p3_desc: "App web full-stack Laravel pour combattre le gaspillage alimentaire. Médaille de Bronze IDEA FEST 3.",
        armory_p4_name: "Matrice de Notation OMR", armory_p4_type: "Vision par Ordinateur & Web", armory_p4_desc: "Projet de service communautaire : Système web OMR automatisé combinant OpenCV avec Next.js & FastAPI.",
        armory_p5_name: "Le Parchemin de Thèse", armory_p5_type: "ML & NLP", armory_p5_desc: "Détection de spam de jeux d'argent en ligne sur YouTube. 99,56% de performance avec Random Forest et TF-IDF.",
        contact_title: "La Taverne", contact_subtitle: "Envoyez un corbeau ou visitez le tableau des messages",
        tavern_form_title: "Écrivez votre Message", tavern_form_name: "Nom du Héros", tavern_form_email: "Adresse du Corbeau", tavern_form_quest: "Type de Quête", tavern_form_message: "Votre Message", tavern_form_submit: "Envoyer le Corbeau",
        tavern_quest_select: "Choisissez votre quête...", tavern_quest_alliance: "🤝 Demande d'Alliance", tavern_quest_project: "⚔️ Nouvelle Quête/Projet", tavern_quest_hiring: "👑 Recrutement", tavern_quest_question: "❓ Chercher la Sagesse", tavern_quest_other: "📜 Autres Affaires",
        tavern_npc_status: "Disponible pour Quêtes", tavern_npc_dialogue: '"Salutations, voyageur ! Je suis <strong>Zulfan</strong>, gardien de cette taverne. Comment puis-je vous aider dans votre voyage ?"',
        tavern_card_email: "Courrier du Corbeau", tavern_card_phone: "Boule de Cristal", tavern_card_location: "Emplacement de la Taverne",
        tavern_social_title: "Envoyer un Corbeau", tavern_hours_title: "Heures de la Taverne", tavern_hours_closed: "Fermé", tavern_hours_response: "Les corbeaux reviennent généralement dans les 24 heures",
        footer_sigil_title: "Guerrier du Code & Artisan Numérique", footer_sigil_desc: "Diplômé en Informatique de l'ITENAS Bandung, forgeant des artefacts numériques et défendant le royaume avec la certification HCIA-Security.",
        footer_nav_title: "Naviguer", footer_expertise_title: "Expertise", footer_resources_title: "Ressources",
        footer_nav_basecamp: "Camp de Base", footer_nav_hero: "Profil du Héros", footer_nav_quest: "Tableau des Quêtes", footer_nav_battle: "Campagne de Bataille", footer_nav_armory: "Arsenal d'Artefacts", footer_nav_tavern: "La Taverne",
        footer_exp_db: "Sorcellerie de BD", footer_exp_software: "Forge Logicielle", footer_exp_network: "Défense Réseau", footer_exp_iot: "Ingénierie IoT", footer_exp_lab: "Maîtrise du Lab",
        footer_res_code: "Dépôt de Code", footer_res_gallery: "Galerie de Projets", footer_res_sitemap: "Plan du Site",
        footer_forged: "⚔️ FORGÉ AVEC PASSION ⚔️", footer_crafted: "Créé avec"
    },
    
    // Arabic (العربية)
    ar: {
        nav_home: "الرئيسية", nav_skills: "المهارات", nav_about: "عني", nav_portfolio: "المشاريع", nav_experience: "الخبرة", nav_contact: "اتصل",
        greeting: "مرحباً، أنا", status_available: "متاح للمشاريع", hero_subtitle: "خريج معلوماتية ومساعد مختبر",
        hero_description: "خريج معلوماتية ماهر في تطوير البرمجيات وبرمجة قواعد البيانات وتطبيقات الوسائط المتعددة. لديه خبرة في مساعدة المختبر ومشاريع البحث والتطوير البرمجية.",
        btn_view_projects: "عرض مشاريعي", btn_download_cv: "تحميل السيرة الذاتية",
        skills_title: "لوحة المهام", skills_subtitle: "المهارات المتقنة ومهمات التدريب المكتملة",
        quest_legendary: "مهمة أسطورية", quest_epic: "مهمة ملحمية", quest_rare: "مهمة نادرة", quest_uncommon: "مهمة غير شائعة",
        quest_mastered: "متقن", quest_certified: "معتمد",
        quest_ml_title: "التعلم الآلي وعلم البيانات", quest_ml_desc: "أتقن الفنون السرية للذكاء الاصطناعي",
        quest_prog_title: "البرمجة والتطوير", quest_prog_desc: "اصنع قطع برمجية وتطبيقات قوية",
        quest_db_title: "قواعد البيانات والشبكات", quest_db_desc: "اغزُ ممالك البيانات وأراضي الشبكات",
        quest_viz_title: "تصور البيانات والاختبار", quest_viz_desc: "اكشف الأسرار المخفية في تدفقات البيانات",
        quest_tools_title: "أدوات التطوير ونظم التشغيل", quest_tools_desc: "تجهّز بأدوات قوية وأتقن البيئات",
        quest_total_xp: "الخبرة الإجمالية", quest_level: "المستوى",
        about_title: "ملف البطل", about_subtitle: "بطل العالم الرقمي",
        hero_class: "مطوّر", hero_title_text: "مهندس الكود",
        hero_attr_str: "القوة", hero_attr_agi: "الرشاقة", hero_attr_int: "الذكاء",
        hero_stat_projects: "مشاريع", hero_stat_roles: "أدوار", hero_stat_cert: "شهادة",
        hero_lore_label: "قصة البطل",
        hero_lore_1: 'وُلد في العصر الرقمي، خرج <strong>محمد ذو الفقار أنغادبوترا</strong> من قاعات <em>معهد باندونغ الوطني للتكنولوجيا</em> كمحارب كود واعد. بدأت رحلته بالفضول وتطورت إلى إتقان مجالات تقنية متعددة.',
        hero_lore_2: 'بصفته <strong>مساعد مختبر 5 مرات</strong>، يقود المتدربين الشباب عبر مسارات برمجة قواعد البيانات وOOP وأمن الشبكات وIoT والروبوتات. خبرته في <strong>PT Dwi Purwa Teknologi</strong> صقلت مهاراته في تطوير البرمجيات الحقيقي.',
        hero_lore_3: 'مسلحاً بشهادة <strong>HCIA-Security</strong> المقدسة من هواوي، يقف حارساً ضد التهديدات الرقمية. من نماذج IoT إلى نماذج التعلم العميق، لا تحدٍّ أكبر من هذا المهندس.',
        hero_abilities_label: "قدرات خاصة",
        hero_ability_q: "التميز الأكاديمي", hero_ability_q_type: "سلبية", hero_ability_q_desc: "خريج معلوماتية بمعدل 3.49 ومناصب مختبرية متعددة",
        hero_ability_w: "درع الأمان", hero_ability_w_type: "نشطة", hero_ability_w_desc: "حاصل على HCIA-Security V4.0، يحمي العوالم الرقمية",
        hero_ability_e: "نقل المعرفة", hero_ability_e_type: "نشطة", hero_ability_e_desc: "مدرب مختبر يمكّن الجيل القادم من المطورين",
        hero_ability_r: "رؤية التعلم الآلي", hero_ability_r_type: "نهائية", hero_ability_r_desc: "نشر نماذج ذكاء اصطناعي عالية الدقة (99.56%) لقهر تحديات البيانات",
        hero_equip_label: "العناصر المجهزة", hero_equip_lab: "5x مدرب مختبر", hero_equip_intern: "متدرب برمجيات", hero_equip_more: "المزيد قادم...",
        experience_title: "حملة المعركة", experience_subtitle: "سجلات الانتصارات والأراضي المحتلة",
        campaign_ch1_type: "رتبة قائد", campaign_ch1_status: "تحقق", campaign_ch1_title: "الحرفي الأعظم", campaign_ch1_story: "ارتقى إلى رتبة المنسق، قاد فريق مساعدي المختبر وأدار منهج الروبوتات.",
        campaign_ch2_type: "معركة ملحمية", campaign_ch2_status: "انتصار", campaign_ch2_title: "الحصار المؤسسي", campaign_ch2_story: "انضم إلى مطورين نخبة في ساحة المعركة المؤسسية. ساهم في عمليات البحث والتطوير وأتقن دورة تطوير البرمجيات الكاملة.",
        campaign_ch3_type: "غارة الزنزانة", campaign_ch3_status: "تم التطهير", campaign_ch3_title: "إرشاد الكود", campaign_ch3_story: "أدى دوراً مزدوجاً في تدريس Java OOP وتكوين شبكات الحاسوب (LAN, TCP/IP, راوتر).",
        campaign_ch4_title: "محراب البيانات", campaign_ch4_story: "أرشد المتدربين الشباب عبر أسرار تصميم قواعد البيانات وسحر Delphi7.",
        campaign_ch5_type: "قصة الأصل", campaign_ch5_status: "تخرج", campaign_ch5_title: "الحملة الأكاديمية", campaign_ch5_story: "انطلق في رحلة عبر قاعات المعرفة، متقناً الفنون السرية للمعلوماتية. تخرج بمستوى قوة (GPA) 3.49.",
        campaign_stat_battles: "المعارك المنتصرة", campaign_stat_students: "الطلاب الموجهون", campaign_stat_years: "سنوات النشاط", campaign_stat_certs: "الشهادات",
        portfolio_title: "مخزن الآثار", portfolio_subtitle: "إبداعات أسطورية صُيغت في نار الكود",
        armory_tab_all: "جميع الآثار", armory_tab_web: "آثار الويب", armory_tab_db: "بلورات البيانات", armory_tab_media: "كرات الوسائط", armory_tab_academic: "المخطوطات", armory_tab_iot: "نوى التقنية",
        armory_btn_inspect: "فحص", armory_btn_view: "عرض", armory_btn_discover: "اكتشف المزيد من الآثار", armory_btn_forge: "زيارة المصنع",
        armory_p1_name: "دبابة التحكم عن بعد", armory_p1_type: "إنترنت الأشياء والأنظمة المدمجة", armory_p1_desc: "آلة حرب قديمة تعمل بنواة ESP32، يتم التحكم فيها عبر واجهة Flutter السحرية.",
        armory_p2_name: "كرة الرؤية العصبية", armory_p2_type: "التعلم الآلي", armory_p2_desc: "كرة مسحورة ترى وتصنف الصور باستخدام سحر التعلم العميق InceptionV3.",
        armory_p3_name: "بوابة إنقاذ الطعام", armory_p3_type: "تطبيق ويب", armory_p3_desc: "تطبيق ويب Laravel كامل لمكافحة هدر الطعام. الميدالية البرونزية IDEA FEST 3.",
        armory_p4_name: "مصفوفة تصحيح OMR", armory_p4_type: "رؤية حاسوبية وويب", armory_p4_desc: "مشروع خدمة مجتمعية: نظام OMR آلي يجمع بين OpenCV وNext.js وFastAPI.",
        armory_p5_name: "مخطوطة الرسالة", armory_p5_type: "تعلم آلي ومعالجة لغات", armory_p5_desc: "كشف الرسائل المزعجة للمقامرة عبر الإنترنت على يوتيوب. أداء 99.56% باستخدام Random Forest وTF-IDF.",
        contact_title: "الحانة", contact_subtitle: "أرسل غراباً أو قم بزيارة لوحة الرسائل لبدء مهمتك",
        tavern_form_title: "اكتب رسالتك", tavern_form_name: "اسم البطل", tavern_form_email: "عنوان الغراب", tavern_form_quest: "نوع المهمة", tavern_form_message: "رسالتك", tavern_form_submit: "أرسل الغراب",
        tavern_quest_select: "اختر مهمتك...", tavern_quest_alliance: "🤝 طلب تحالف", tavern_quest_project: "⚔️ مهمة/مشروع جديد", tavern_quest_hiring: "👑 توظيف", tavern_quest_question: "❓ البحث عن الحكمة", tavern_quest_other: "📜 أمور أخرى",
        tavern_npc_status: "متاح للمهام", tavern_npc_dialogue: '"تحياتي، أيها المسافر! أنا <strong>ذو الفقار</strong>، حارس هذه الحانة. كيف يمكنني مساعدتك في رحلتك؟"',
        tavern_card_email: "بريد الغراب", tavern_card_phone: "الكرة البلورية", tavern_card_location: "موقع الحانة",
        tavern_social_title: "أرسل غراباً", tavern_hours_title: "ساعات عمل الحانة", tavern_hours_closed: "مغلق", tavern_hours_response: "الغربان عادة ما تعود خلال 24 ساعة",
        footer_sigil_title: "محارب الكود والحرفي الرقمي", footer_sigil_desc: "خريج معلوماتية من ITENAS باندونغ، يصوغ آثاراً رقمية ويدافع عن المملكة بشهادة HCIA-Security.",
        footer_nav_title: "التنقل", footer_expertise_title: "الخبرات", footer_resources_title: "الموارد",
        footer_nav_basecamp: "المعسكر الأساسي", footer_nav_hero: "ملف البطل", footer_nav_quest: "لوحة المهام", footer_nav_battle: "حملة المعركة", footer_nav_armory: "مخزن الآثار", footer_nav_tavern: "الحانة",
        footer_exp_db: "سحر قواعد البيانات", footer_exp_software: "صياغة البرمجيات", footer_exp_network: "الدفاع الشبكي", footer_exp_iot: "هندسة IoT", footer_exp_lab: "إتقان المختبر",
        footer_res_code: "مستودع الكود", footer_res_gallery: "معرض المشاريع", footer_res_sitemap: "خريطة الموقع",
        footer_forged: "⚔️ صُيغ بشغف ⚔️", footer_crafted: "صُنع بـ"
    }
};

// Language Switcher Class
class LanguageSwitcher {
    constructor() {
        this.currentLang = localStorage.getItem('language') || 'en';
        this.switcher = document.getElementById('language-switcher');
        this.toggle = document.getElementById('lang-toggle');
        this.dropdown = document.getElementById('lang-dropdown');
        this.options = document.querySelectorAll('.lang-option');
        
        this.init();
    }
    
    init() {
        // Set initial language
        this.setLanguage(this.currentLang, false);
        
        // Toggle dropdown
        this.toggle?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.switcher.classList.toggle('active');
        });
        
        // Language options click
        this.options.forEach(option => {
            option.addEventListener('click', (e) => {
                const lang = option.dataset.lang;
                const flag = option.dataset.flag;
                this.setLanguage(lang);
                this.updateToggleDisplay(flag, lang.toUpperCase());
                this.switcher.classList.remove('active');
            });
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.switcher?.contains(e.target)) {
                this.switcher?.classList.remove('active');
            }
        });
        
        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.switcher?.classList.remove('active');
            }
        });
    }
    
    setLanguage(lang, animate = true) {
        this.currentLang = lang;
        localStorage.setItem('language', lang);
        
        // Update HTML lang attribute
        document.documentElement.lang = lang;
        
        // Handle RTL for Arabic
        if (lang === 'ar') {
            document.documentElement.dir = 'rtl';
        } else {
            document.documentElement.dir = 'ltr';
        }
        
        // Update active state in dropdown
        this.options.forEach(option => {
            option.classList.toggle('active', option.dataset.lang === lang);
        });
        
        // Update toggle display
        const activeOption = document.querySelector(`.lang-option[data-lang="${lang}"]`);
        if (activeOption) {
            this.updateToggleDisplay(activeOption.dataset.flag, lang.toUpperCase());
        }
        
        // Apply translations
        this.applyTranslations(lang, animate);
    }
    
    updateToggleDisplay(flag, code) {
        const flagEl = document.querySelector('.current-lang-flag');
        const codeEl = document.querySelector('.current-lang-code');
        
        if (flagEl) flagEl.textContent = flag;
        if (codeEl) codeEl.textContent = code;
    }
    
    applyTranslations(lang, animate = true) {
        const langData = translations[lang];
        if (!langData) return;
        
        // Get all elements with data-translate attribute
        const elements = document.querySelectorAll('[data-translate]');
        
        elements.forEach(el => {
            const key = el.dataset.translate;
            const translation = langData[key];
            
            if (translation) {
                if (animate) {
                    // Fade out
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(5px)';
                    
                    setTimeout(() => {
                        // Use innerHTML for keys that contain HTML tags
                        if (translation.includes('<strong>') || translation.includes('<em>') || translation.includes('<i ')) {
                            el.innerHTML = translation;
                        } else {
                            el.textContent = translation;
                        }
                        // Fade in
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                    }, 150);
                } else {
                    if (translation.includes('<strong>') || translation.includes('<em>') || translation.includes('<i ')) {
                        el.innerHTML = translation;
                    } else {
                        el.textContent = translation;
                    }
                }
            }
        });
        
        // Translate placeholder attributes
        const placeholderMap = {
            'name': 'tavern_form_name',
            'email': 'tavern_form_email',
            'message': 'tavern_form_message'
        };
        
        // Translate select options
        const selectOptions = {
            'tavern_quest_select': '',
            'tavern_quest_alliance': 'collaboration',
            'tavern_quest_project': 'project',
            'tavern_quest_hiring': 'hiring',
            'tavern_quest_question': 'question',
            'tavern_quest_other': 'other'
        };
        
        const questSelect = document.getElementById('quest-type');
        if (questSelect) {
            const options = questSelect.querySelectorAll('option');
            const optionKeys = ['tavern_quest_select', 'tavern_quest_alliance', 'tavern_quest_project', 'tavern_quest_hiring', 'tavern_quest_question', 'tavern_quest_other'];
            options.forEach((opt, index) => {
                if (optionKeys[index] && langData[optionKeys[index]]) {
                    opt.textContent = langData[optionKeys[index]];
                }
            });
        }
        
        // Add transition styles if not exists
        if (!document.getElementById('translate-styles')) {
            const style = document.createElement('style');
            style.id = 'translate-styles';
            style.textContent = `
                [data-translate] {
                    transition: opacity 0.15s ease, transform 0.15s ease;
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.languageSwitcher = new LanguageSwitcher();
});
