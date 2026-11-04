/**
 * Centralized configuration & persistence for town buildings & custom tile overrides.
 * Powers the interactive in-browser Town Editor.
 */
import canonicalLayout from '../data/townLayout.json';

export interface BuildingLayout {
  id: string;
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  kind?: 'building' | 'object' | 'lamp' | 'tree' | 'bush' | 'bench' | 'flowerbed' | 'npc' | 'sign';
  subType?: string;
  orientation?: 'N' | 'E' | 'S' | 'W';
  labelX?: number;
  labelY?: number;
  doorX?: number;
  doorY?: number;
  locked?: boolean;
  zIndex?: number;
  dialogue?: string;
  link?: string;
  hidden?: boolean;
}

export interface SpawnableTemplate {
  id: string;
  name: string;
  icon: string;
  category: 'Foliage & Alam' | 'Perabot & Lampu' | 'Dunia Pokémon' | 'Tech & AI' | 'Fasilitas & Kota';
  w: number;
  h: number;
  kind: 'tree' | 'bush' | 'bench' | 'lamp' | 'flowerbed' | 'object' | 'npc' | 'sign';
  subType?: string;
  desc: string;
  defaultDialogue?: string;
}

export const SPAWNABLE_TEMPLATES: SpawnableTemplate[] = [
  // 🌳 1. Foliage & Alam (Nature & Flora)
  {
    id: 'tpl_tree_town',
    name: 'Pohon Hijau Kota',
    icon: '🌳',
    category: 'Foliage & Alam',
    w: 2,
    h: 2,
    kind: 'tree',
    subType: 'tree_town',
    desc: 'Pohon peneduh rindang khas kota Pokémon (2x2)',
    defaultDialogue: 'Pohon rindang kota yang rimbun dan asri. Memberikan keteduhan bagi pejalan kaki yang melintas.',
  },
  {
    id: 'tpl_tree_sakura',
    name: 'Pohon Sakura Pink',
    icon: '🌸',
    category: 'Foliage & Alam',
    w: 2,
    h: 2,
    kind: 'tree',
    subType: 'tree_sakura',
    desc: 'Pohon bunga sakura mekar nan anggun (2x2)',
    defaultDialogue: 'Pohon sakura yang mekar dengan kelopak merah muda lembut. Suasana terasa damai dan sejuk.',
  },
  {
    id: 'tpl_tree_pine',
    name: 'Pohon Pinus Sinnoh',
    icon: '🌲',
    category: 'Foliage & Alam',
    w: 2,
    h: 2,
    kind: 'tree',
    subType: 'tree_pine',
    desc: 'Pohon cemara jarum lebat khas dataran tinggi Sinnoh (2x2)',
    defaultDialogue: 'Pohon Pinus Sinnoh yang kokoh. Aroma khas getah pinus dan udara pegunungan terasa begitu menyegarkan.',
  },
  {
    id: 'tpl_tree_autumn',
    name: 'Pohon Maple Musim Gugur',
    icon: '🍁',
    category: 'Foliage & Alam',
    w: 2,
    h: 2,
    kind: 'tree',
    subType: 'tree_autumn',
    desc: 'Pohon kanopi hangat dengan gradasi jingga keemasan (2x2)',
    defaultDialogue: 'Pohon Maple Musim Gugur. Daun-daunnya memancarkan semburat jingga keemasan yang indah di bawah sinar mentari.',
  },
  {
    id: 'tpl_tree_berry',
    name: 'Pohon Buah Berry Lebat',
    icon: '🍒',
    category: 'Foliage & Alam',
    w: 2,
    h: 2,
    kind: 'tree',
    subType: 'tree_berry',
    desc: 'Pohon berbuah manis aneka Oran, Sitrus, & Pecha Berry (2x2)',
    defaultDialogue: 'Pohon buah Berry yang ranum dan manis! Terlihat buah Oran Berry dan Sitrus Berry bergantungan segar di dahannya.',
  },
  {
    id: 'tpl_bush',
    name: 'Semak Hias Boxwood',
    icon: '🌿',
    category: 'Foliage & Alam',
    w: 1,
    h: 1,
    kind: 'bush',
    subType: 'hedge',
    desc: 'Semak pangkas rapi pembatas taman (1x1)',
    defaultDialogue: 'Semak hias boxwood yang dipangkas rapi. Berfungsi sebagai partisi asri alami kota.',
  },
  {
    id: 'tpl_flowerbed_4x4',
    name: 'Taman Bunga Raya (4x4)',
    icon: '🌸',
    category: 'Foliage & Alam',
    w: 4,
    h: 4,
    kind: 'flowerbed',
    subType: 'flowerbed',
    desc: 'Petak taman bunga botani besar warna-warni (4x4)',
    defaultDialogue: 'Petak taman bunga botani yang luas dan asri. Berisi aneka ragam mawar merah, marigold emas, lavender ungu, dan aster putih mekar semerbak.',
  },
  {
    id: 'tpl_flowerbed_rect',
    name: 'Bedeng Bunga Panjang (4x2)',
    icon: '🌷',
    category: 'Foliage & Alam',
    w: 4,
    h: 2,
    kind: 'flowerbed',
    subType: 'flowerbed',
    desc: 'Bedeng bunga horizontal pembatas jalan & teras (4x2)',
    defaultDialogue: 'Bedeng bunga pembatas jalan beraroma harum dan segar.',
  },
  {
    id: 'tpl_flowerbed',
    name: 'Kotak Bunga Asri (2x2)',
    icon: '🌺',
    category: 'Foliage & Alam',
    w: 2,
    h: 2,
    kind: 'flowerbed',
    subType: 'flowerbed',
    desc: 'Taman bunga warna-warni yang asri (2x2)',
    defaultDialogue: 'Taman bunga warna-warni yang tertata apik. Menghadirkan wangi semerbak di sudut kota.',
  },
  {
    id: 'tpl_sunflower_bed',
    name: 'Petak Bunga Matahari',
    icon: '🌻',
    category: 'Foliage & Alam',
    w: 2,
    h: 2,
    kind: 'flowerbed',
    subType: 'sunflower_bed',
    desc: 'Petak bunga matahari kuning cerah menghadap selatan (2x2)',
    defaultDialogue: 'Petak bunga matahari mekar ceria menghadap ke arah cahaya. Memberikan energi positif bagi siapa saja yang lewat.',
  },
  {
    id: 'tpl_rock_boulder',
    name: 'Batu Strength / Boulder',
    icon: '🪨',
    category: 'Foliage & Alam',
    w: 1,
    h: 1,
    kind: 'object',
    subType: 'rock_boulder',
    desc: 'Batu cadas kokoh legendaris overworld Pokémon (1x1)',
    defaultDialogue: 'Batu cadas raksasa yang sangat kokoh. Tampaknya hanya Pokémon berkekuatan HM Strength yang bisa memindahkannya!',
  },
  {
    id: 'tpl_lily_pond',
    name: 'Kolam Teratai & Magikarp',
    icon: '🪷',
    category: 'Foliage & Alam',
    w: 2,
    h: 2,
    kind: 'object',
    subType: 'lily_pond',
    desc: 'Kolam batu mini dengan teratai dan siluet Magikarp (2x2)',
    defaultDialogue: 'Kolam teratai mini dengan air jernih berkilau. Jika diperhatikan seksama, ada siluet Magikarp yang berenang lincah di dasarnya!',
  },
  {
    id: 'tpl_berry_pot',
    name: 'Pot Berry Tanaman',
    icon: '🫐',
    category: 'Foliage & Alam',
    w: 1,
    h: 1,
    kind: 'object',
    subType: 'berry_pot',
    desc: 'Pot keramik buah berry langka (1x1)',
    defaultDialogue: 'Pot tanaman tanah liat berisi bibit berry berkualitas tinggi yang dirawat secara teliti.',
  },

  // 🪑 2. Perabot & Lampu Jalan (Streetscape & Furniture)
  {
    id: 'tpl_lamp',
    name: 'Lampu Jalan Klasik',
    icon: '💡',
    category: 'Perabot & Lampu',
    w: 1,
    h: 2,
    kind: 'lamp',
    subType: 'lamp',
    desc: 'Lampu jalan lentera hangat malam (1x2)',
    defaultDialogue: 'Lampu jalan tempa besi klasik. Menyinari langkah trainer saat malam tiba.',
  },
  {
    id: 'tpl_stone_lantern',
    name: 'Lentera Batu Tōrō',
    icon: '🏮',
    category: 'Perabot & Lampu',
    w: 1,
    h: 2,
    kind: 'lamp',
    subType: 'stone_lantern',
    desc: 'Lentera taman batu bergaya kuil Jepang tradisional (1x2)',
    defaultDialogue: 'Lentera batu Tōrō tradisional. Memancarkan cahaya temaram yang hangat dan damai saat senja tiba.',
  },
  {
    id: 'tpl_lamp_cyber',
    name: 'Lampu Taman LED Cyber',
    icon: '💠',
    category: 'Perabot & Lampu',
    w: 1,
    h: 2,
    kind: 'lamp',
    subType: 'lamp_cyber',
    desc: 'Pilar lampu neon cyan futuristik kawasan Lab & Tech (1x2)',
    defaultDialogue: 'Pilar lampu LED Cyber modern berteknologi hemat energi. Memancarkan pendaran neon cyan yang futuristik.',
  },
  {
    id: 'tpl_bench',
    name: 'Bangku Taman Kayu',
    icon: '🪑',
    category: 'Perabot & Lampu',
    w: 2,
    h: 1,
    kind: 'bench',
    subType: 'bench',
    desc: 'Bangku kayu santai warga kota (2x1)',
    defaultDialogue: 'Bangku taman kayu yang kokoh. Tempat yang nyaman untuk duduk melepas lelah.',
  },
  {
    id: 'tpl_cafe_table',
    name: 'Meja Payung Kafe Outdoor',
    icon: '⛱️',
    category: 'Perabot & Lampu',
    w: 2,
    h: 2,
    kind: 'object',
    subType: 'cafe_table',
    desc: 'Meja bistro bulat dengan payung bergaris & kursi santai (2x2)',
    defaultDialogue: 'Meja kafe terbuka dengan payung peneduh bergaris. Tempat sempurna untuk ngopi santai sambil coding dan diskusi arsitektur sistem.',
  },
  {
    id: 'tpl_picnic_set',
    name: 'Tikar & Keranjang Piknik',
    icon: '🧺',
    category: 'Perabot & Lampu',
    w: 2,
    h: 2,
    kind: 'object',
    subType: 'picnic_set',
    desc: 'Tikar kotak merah-putih dengan keranjang bekal piknik (2x2)',
    defaultDialogue: 'Set piknik santai di atas rumput. Keranjang rotan ini berisi roti lapis lezat dan teh herbal segar.',
  },
  {
    id: 'tpl_mailbox_red',
    name: 'Kotak Surat Pos Merah',
    icon: '📮',
    category: 'Perabot & Lampu',
    w: 1,
    h: 1,
    kind: 'object',
    subType: 'mailbox_red',
    desc: 'Kotak pos surat merah retro penghubung kontak (1x1)',
    defaultDialogue: 'Kotak surat pos klasik kota. Butuh kolaborasi atau penawaran proyek? Hubungi Zulfan via email di zulfan.ang@gmail.com!',
  },
  {
    id: 'tpl_trash_bin',
    name: 'Tempat Sampah & Daur Ulang',
    icon: '♻️',
    category: 'Perabot & Lampu',
    w: 1,
    h: 1,
    kind: 'object',
    subType: 'trash_bin',
    desc: 'Tempat sampah kota pemilah organik & anorganik (1x1)',
    defaultDialogue: 'Tempat pemilahan sampah organik dan anorganik. Menjaga kota tetap bersih, asri, dan ramah lingkungan.',
  },
  {
    id: 'tpl_kiosk',
    name: 'Kios Barista Café',
    icon: '☕',
    category: 'Perabot & Lampu',
    w: 5,
    h: 4,
    kind: 'object',
    subType: 'kiosk',
    desc: 'Kios barista kopi & es krim Castelia Cones (5x4)',
    defaultDialogue: 'Specialty roasts & Castelia Cones crafted fresh for devs & trainers! "Today\'s blend: Dark Roasted TypeScript with notes of React & zero runtime bugs!"',
  },
  {
    id: 'tpl_garden',
    name: 'Berry Garden & Sakura Grove',
    icon: '🌸',
    category: 'Foliage & Alam',
    w: 7,
    h: 9,
    kind: 'object',
    subType: 'garden',
    desc: 'Kebun botani buah berry organik & pohon sakura mekar (7x9)',
    defaultDialogue: 'Oran, Sitrus, dan Cheri berries tumbuh subur di kebun botani di bawah naungan pohon sakura. Tempat yang asri dan tenang untuk memulihkan stamina para trainer dan developer!',
  },

  // ⚡ 3. Dunia Pokémon & Trainer (Pokémon Overworld)
  {
    id: 'tpl_arceus',
    name: 'Arceus Sang Pencipta',
    icon: '🌟',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'npc',
    subType: 'arceus',
    desc: 'Pokémon Legendaris Alpha Sang Pencipta semesta (2x2)',
    defaultDialogue: "ARCEUS: 'Dooo-oooonnn...!' ✨ Pendaran cahaya keemasan memancar dari cincin kosmik Arceus. Sang Alpha Pokémon mengawasi semesta dengan aura kebijaksanaan abadi.",
  },
  {
    id: 'tpl_reshiram',
    name: 'Reshiram Sang Naga Kebenaran',
    icon: '🤍',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'npc',
    subType: 'reshiram',
    desc: 'Pokémon Legendaris Vast White Naga Api (2x2)',
    defaultDialogue: "RESHIRAM: 'Vaaa-zhooom...!' 🤍🔥 Ekor turbin Reshiram menyala terang dengan api kebenaran murni. Sang Vast White Pokémon mengamati lautan lepas Zulfan's Town dengan aura agung nan suci.",
  },
  {
    id: 'tpl_zekrom',
    name: 'Zekrom Sang Naga Idealisme',
    icon: '🖤',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'npc',
    subType: 'zekrom',
    desc: 'Pokémon Legendaris Deep Black Naga Listrik (2x2)',
    defaultDialogue: "ZEKROM: 'Bzzzz-Vrrrooom...!' 🖤⚡ Ekor generator Zekrom berputar kencang memancarkan kilatan petir bertegangan tinggi. Sang Deep Black Pokémon mengamati semesta dengan aura idealisme abadi.",
  },
  {
    id: 'tpl_giratina',
    name: 'Giratina Sang Naga Distorsi',
    icon: '👻',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'npc',
    subType: 'giratina',
    desc: 'Pokémon Legendaris Ghost/Dragon Penguasa Dunia Distorsi (2x2)',
    defaultDialogue: "GIRATINA: 'Gyaaa-shhhooo...!' 👻🌌 Kabut antimateri memancar dari sayap bayangan Giratina. Sang Penguasa Dunia Distorsi mengawasi keseimbangan alam semesta.",
  },
  {
    id: 'tpl_palkia',
    name: 'Palkia Sang Naga Ruang',
    icon: '🌌',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'npc',
    subType: 'palkia',
    desc: 'Pokémon Legendaris Water/Dragon Penguasa Dimensi Ruang (2x2)',
    defaultDialogue: "PALKIA: 'Gyaaa-ooohhn...!' 🌌💧 Riak distorsi ruang memancar dari mutiara pundak Palkia. Sang Penguasa Dimensi Ruang menjaga keutuhan struktur alam semesta.",
  },
  {
  id: 'tpl_dialga',
    name: 'Dialga Sang Naga Waktu',
    icon: '⏳',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'npc',
    subType: 'dialga',
    desc: 'Pokémon Legendaris Steel/Dragon Penguasa Dimensi Waktu (2x2)',
    defaultDialogue: "DIALGA: 'Gugyugubah...!' ⏳🔷 Denyut distorsi waktu memancar dari kristal dada Dialga. Sang Penguasa Dimensi Waktu menjaga kelancaran aliran masa lalu, kini, dan masa depan.",
  },
  {
    id: 'tpl_charizard',
    name: 'Charizard Sang Naga Api',
    icon: '🔥',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'npc',
    subType: 'charizard',
    desc: 'Pokémon Api/Terbang Flame Dragon yang tangguh dan setia (2x2)',
    defaultDialogue: "CHARIZARD: 'GRAAAWWWRRR...!' 🔥 Ekor api Charizard berkobar cerah penuh semangat petualang. Sayap megahnya membentang siap mengarungi langit bersama sang Pelatih.",
  },
  {
    id: 'tpl_tyranitar',
    name: 'Tyranitar Sang Pelindung Zirah',
    icon: '🪨',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'npc',
    subType: 'tyranitar',
    desc: 'Pokémon Armor Rock/Dark bertubuh zirah batu baja yang kokoh dan perkasa (2x2)',
    defaultDialogue: "TYRANITAR: 'Gwoooaaargh...!' 🪨 Badai pasir tipis berhembus di sekitar pijakan Tyranitar. Sang Armor Pokémon berdiri kokoh melindungi ketentraman Zulfan's Town.",
  },
  {
    id: 'tpl_garchomp',
    name: 'Garchomp Sang Predator Darat',
    icon: '🦈',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'npc',
    subType: 'garchomp',
    desc: 'Pokémon Naga/Tanah Mach Pokémon secepat jet tempur supersonik (2x2)',
    defaultDialogue: "GARCHOMP: 'Gyaaa-shhh...!' 🦈🌪️ Sayap sirip tajam Garchomp berdesir membelah angin. Sang Mach Pokémon berdiri sigap dengan kecepatan supersonik menjaga ketertiban Zulfan's Town.",
  },
  {
    id: 'tpl_urshifu',
    name: 'Urshifu G-Max Rapid Strike',
    icon: '🥋',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'npc',
    subType: 'urshifu',
    desc: 'Pokémon Wushu Petarung/Air Gigantamax dengan jurus Serbuan Beruntun tiada henti (2x2)',
    defaultDialogue: "URSHIFU: 'Hssshaaarrr-kwooo...!' 🥋🌊 Aliran deras jurus Rapid Strike bergemuruh di sekitar Urshifu Gigantamax. Sang Master Wushu berdiri tegak memancarkan energi petarung legendaris di Zulfan's Town.",
  },
  {
    id: 'tpl_rayquaza',
    name: 'Rayquaza Sang Naga Langit',
    icon: '🐉',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'npc',
    subType: 'rayquaza',
    desc: 'Pokémon Legendaris Dragon/Flying Penguasa Lapisan Ozon (2x2)',
    defaultDialogue: "RAYQUAZA: 'Kyyyaaaarrrr-shooo...!' 🐉⚡ Aura zamrud naga langit berputar megah di angkasa. Rayquaza melayang gagah menjaga keseimbangan atmosfer dan kedamaian Zulfan's Town.",
  },
  {
    id: 'tpl_groudon',
    name: 'Groudon Sang Penguasa Daratan',
    icon: '🌋',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'npc',
    subType: 'groudon',
    desc: 'Pokémon Legendaris Ground Penguasa Magma & Daratan Purba (2x2)',
    defaultDialogue: "GROUDON: 'Gwoooaaarrr-ghuuu...!' 🌋🔥 Kerak bumi bergetar saat sang Penguasa Magma melangkah. Groudon berdiri kokoh dengan aura kekeringan purba (Desolate Land), menjaga kestabilan benua dan kekuatan bumi di Zulfan's Town.",
  },
  {
    id: 'tpl_kyogre',
    name: 'Kyogre Sang Penguasa Samudra',
    icon: '🌊',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'npc',
    subType: 'kyogre',
    desc: 'Pokémon Legendaris Water Penguasa Palung Laut & Hujan Purba (2x2)',
    defaultDialogue: "KYOGRE: 'Gyaaa-oooh-shuuu...!' 🌊💧 Deru ombak raksasa dan hujan lebat membuncah dari aura samudra purba (Primordial Sea). Kyogre melayang anggun menjaga kedalaman lautan dan kemurnian air di Zulfan's Town.",
  },
  {
    id: 'tpl_latios',
    name: 'Latios Sang Penjelajah Angkasa',
    icon: '✈️',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'npc',
    subType: 'latios',
    desc: 'Pokémon Legendaris Dragon/Psychic Eon Berkecepatan Jet Supersonik (2x2)',
    defaultDialogue: "LATIOS: 'Shwiii-shooo...!' ✈️🔷 Latios melesat melebihi kecepatan suara dengan aerodinamika sayap jet kosmiknya. Sang Penjaga Jiwa dan Cahaya mengawasi Zulfan's Town dari ketinggian angkasa.",
  },
  {
    id: 'tpl_latias',
    name: 'Latias Sang Pelindung Hati',
    icon: '💖',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'npc',
    subType: 'latias',
    desc: 'Pokémon Legendaris Dragon/Psychic Eon Berhati Murni (2x2)',
    defaultDialogue: "LATIAS: 'Kyuuu-wiiin...!' 💖✨ Latias melayang lincah dengan bulu halus pembias cahaya (Refract Light) yang dapat membuatnya tak kasat mata. Sang Pelindung Jiwa menyebarkan kedamaian dan kehangatan di Zulfan's Town.",
  },
  {
    id: 'tpl_darkrai',
    name: 'Darkrai Sang Penguasa Mimpi Buruk',
    icon: '🌑',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'npc',
    subType: 'darkrai',
    desc: 'Pokémon Mistik Dark Pengendali Bayangan & Mimpi Buruk (2x2)',
    defaultDialogue: "DARKRAI: 'Zzzz-shhhwaaaddd...!' 🌑💤 Kabut bayangan hitam pekat berputar di bawah mantel Darkrai. Sang Penguasa Mimpi Buruk (Bad Dreams & Dark Void) mengawasi batas ilusi dan realitas demi melindungi Zulfan's Town dari balik kegelapan malam.",
  },
  {
    id: 'tpl_necrozma_dusk_mane',
    name: 'Necrozma (Dusk Mane)',
    icon: '🦁',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'npc',
    subType: 'necrozma',
    desc: 'Pokémon Legendaris Prism Psychic/Steel Pengendali Cahaya Surya (2x2)',
    defaultDialogue: "NECROZMA: 'Ggg-rraaa-shhh-kzzzt...!' 🦁☀️ Prisma kristal hitam beresonansi dengan surya terang Solgaleo. Necrozma Dusk Mane memancarkan kekuatan cahaya murni (Sunsteel Strike), menyerap dan menerangi seluruh Zulfan's Town dengan energi kosmik tanpa batas.",
  },
  {
    id: 'tpl_lunala',
    name: 'Lunala Sang Utusan Rembulan',
    icon: '🌙',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'npc',
    subType: 'lunala',
    desc: 'Pokémon Legendaris Moone Psychic/Ghost Penguasa Rembulan Malam (2x2)',
    defaultDialogue: "LUNALA: 'Mahaaalo-laaa...!' 🌙✨ Sayap bulan sabit membentang lebar menyerap cahaya malam. Lunala Sang Utusan Rembulan memasuki fase Full Moon (Moongeist Beam), menaburkan debu kosmik starlight yang melindungi kedamaian Zulfan's Town.",
  },
  {
    id: 'tpl_solgaleo',
    name: 'Solgaleo Sang Utusan Mentari',
    icon: '☀️',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'npc',
    subType: 'solgaleo',
    desc: 'Pokémon Legendaris Sunne Psychic/Steel Penguasa Cahaya Surya (2x2)',
    defaultDialogue: "SOLGALEO: 'Laaa-lionnn-shooo...!' ☀️🦁 Surai keemasan Solgaleo berkobar terang benderang. Sang Utusan Mentari memasuki fase Radiant Sun (Sunsteel Strike), menyinari seluruh Zulfan's Town dengan kehangatan dan energi kehidupan surya tanpa batas.",
  },
  {
    id: 'tpl_mewtwo',
    name: 'Mewtwo Sang Penantang',
    icon: '🔮',
    category: 'Dunia Pokémon',
    w: 1,
    h: 1,
    kind: 'npc',
    subType: 'mewtwo',
    desc: 'Pokémon Legendaris Psikis yang menguasai Battle Arena (1x1)',
    defaultDialogue: "MEWTWO: 'Saya tidak diciptakan untuk kalah. Pikiran manusia ini... menarik.' Buktikan ketajaman teknologimu di Battle Arena!",
  },
  {
    id: 'tpl_pokeball_item',
    name: 'Kapsul Item Poké Ball',
    icon: '🔴',
    category: 'Dunia Pokémon',
    w: 1,
    h: 1,
    kind: 'object',
    subType: 'pokeball_item',
    desc: 'Kapsul item legendaris yang tergeletak di tanah (1x1)',
    defaultDialogue: 'Sebuah Poké Ball tergeletak di tanah! Berisi catatan riset: "Gunakan arsitektur modular untuk skalabilitas aplikasi tingkat enterprise."',
  },
  {
    id: 'tpl_pokestop',
    name: 'Pilar Poké-Stop',
    icon: '📍',
    category: 'Dunia Pokémon',
    w: 1,
    h: 2,
    kind: 'object',
    subType: 'pokestop',
    desc: 'Pilar pemancar Poké-Stop dengan piringan berputar (1x2)',
    defaultDialogue: 'Poké-Stop Kota Zulfan! Memutar piringan foto untuk mengumpulkan item petualangan dan menyegarkan semangat eksplorasi.',
  },
  {
    id: 'tpl_snorlax',
    name: 'Snorlax Tidur Santai',
    icon: '😴',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'object',
    subType: 'snorlax',
    desc: 'Snorlax raksasa tidur mendengkur menghalangi jalan (2x2)',
    defaultDialogue: 'Snorlax tertidur pulas menghalangi jalan! Nafasnya teratur dan perutnya yang empuk naik-turun. Kamu butuh alunan nada Poké Flute untuk membangunkannya.',
  },
  {
    id: 'tpl_pikachu',
    name: 'Maskot Pikachu Ceria',
    icon: '⚡',
    category: 'Dunia Pokémon',
    w: 1,
    h: 1,
    kind: 'object',
    subType: 'pikachu',
    desc: 'Maskot Pikachu ramah dengan ekor kilat ceria (1x1)',
    defaultDialogue: 'Pikachu: "Pika-pika! Chaaarrr!" ⚡ Pikachu menyambutmu dengan lompatan gembira dan kilatan listrik kecil di pipi merahnya!',
  },
  {
    id: 'tpl_sub_doll',
    name: 'Boneka Substitute Latihan',
    icon: '🦖',
    category: 'Dunia Pokémon',
    w: 1,
    h: 1,
    kind: 'object',
    subType: 'sub_doll',
    desc: 'Boneka dinosaurus hijau decoy pengganti serangan (1x1)',
    defaultDialogue: 'Boneka Substitute (Migawari) untuk latihan battle! Siap menahan satu serangan telak demi menjaga fokus tim di arena.',
  },
  {
    id: 'tpl_egg_incubator',
    name: 'Inkubator Telur Pokémon',
    icon: '🥚',
    category: 'Dunia Pokémon',
    w: 1,
    h: 2,
    kind: 'object',
    subType: 'egg_incubator',
    desc: 'Kapsul laboratorium kaca penghangat telur Pokémon (1x2)',
    defaultDialogue: 'Inkubator Laboratorium Bio-Tech: Telur Pokémon misterius sedang dihangatkan. Detak jantung di dalamnya terdeteksi stabil dan sehat!',
  },
  {
    id: 'tpl_pc_terminal',
    name: 'Terminal PC Bill',
    icon: '💻',
    category: 'Dunia Pokémon',
    w: 1,
    h: 2,
    kind: 'object',
    subType: 'pc_terminal',
    desc: 'Terminal komputer cloud storage Pokémon luar ruangan (1x2)',
    defaultDialogue: 'Terminal PC Bill: "Someone\'s PC". Terhubung ke sistem cloud storage untuk mengelola daftar Pokémon dan artefak proyek.',
  },
  {
    id: 'tpl_poke_house',
    name: 'Rumah Mungil Pokémon',
    icon: '🏠',
    category: 'Dunia Pokémon',
    w: 2,
    h: 2,
    kind: 'object',
    subType: 'poke_house',
    desc: 'Pondok kayu mungil beratap genteng merah (2x2)',
    defaultDialogue: 'Rumah singgah mungil beratap merah untuk Pokémon pendamping. Sangat nyaman dan hangat setelah lelah berpetualang seharian.',
  },

  // 💻 4. Teknologi, AI & Engineering (Tech & Dev Props)
  {
    id: 'tpl_server_rack',
    name: 'Kabinet Edge AI Server',
    icon: '🖥️',
    category: 'Tech & AI',
    w: 1,
    h: 2,
    kind: 'object',
    subType: 'server_rack',
    desc: 'Server rack outdoor tahan cuaca dengan lampu LED aktif (1x2)',
    defaultDialogue: 'Kabinet Edge AI Server: Didukung akselerasi GPU TensorRT untuk inferensi model YOLOv11 dengan latensi super rendah (~1.8 ms/frame).',
  },
  {
    id: 'tpl_solar_panel',
    name: 'Panel Surya Smart Grid',
    icon: '☀️',
    category: 'Tech & AI',
    w: 2,
    h: 2,
    kind: 'object',
    subType: 'solar_panel',
    desc: 'Array modul photovoltaic biru penyuplai energi bersih (2x2)',
    defaultDialogue: 'Array Panel Surya Smart Grid: Menyuplai energi bersih terbarukan untuk seluruh perangkat komputasi kota secara mandiri.',
  },
  {
    id: 'tpl_drone_pad',
    name: 'Landasan & Drone AeroScan',
    icon: '🚁',
    category: 'Tech & AI',
    w: 2,
    h: 2,
    kind: 'object',
    subType: 'drone_pad',
    desc: 'Helipad mini H dengan drone quadcopter otonom AeroScan (2x2)',
    defaultDialogue: 'Landasan AeroScan Aerial AI: Drone otonom siap lepas landas untuk patroli pengawasan udara dan deteksi pesawat militer berbasis computer vision.',
  },
  {
    id: 'tpl_holo_projector',
    name: 'Proyektor Hologram 3D',
    icon: '🌐',
    category: 'Tech & AI',
    w: 1,
    h: 2,
    kind: 'object',
    subType: 'holo_projector',
    desc: 'Pedestal pemancar kisi kubus hologram interaktif cyan (1x2)',
    defaultDialogue: 'Proyektor Hologram 3D: Menampilkan topologi arsitektur sistem multi-agent cerdas dan visualisasi graf data secara real-time.',
  },
  {
    id: 'tpl_bike_rack',
    name: 'Parkir Sepeda Acro/Mach',
    icon: '🚲',
    category: 'Tech & AI',
    w: 2,
    h: 1,
    kind: 'object',
    subType: 'bike_rack',
    desc: 'Rak sepeda tempa besi dengan Mach & Acro Bike (2x1)',
    defaultDialogue: 'Area Parkir Sepeda Kota: Ada Mach Bike untuk kecepatan tinggi di jalan lurus dan Acro Bike untuk melompati rintangan curam!',
  },
  {
    id: 'tpl_sat_dish',
    name: 'Parabola Satelit Telemetry',
    icon: '📡',
    category: 'Tech & AI',
    w: 2,
    h: 2,
    kind: 'object',
    subType: 'sat_dish',
    desc: 'Antena parabola telemetry stasiun bumi pengamat angkasa (2x2)',
    defaultDialogue: 'Stasiun Parabola Telemetry Satelit: Mengunduh citra satelit dan data geospasial real-time untuk pemetaan kawasan dan analisis GIS.',
  },
  {
    id: 'tpl_rover_bot',
    name: 'Robot Kurir LiDAR',
    icon: '🤖',
    category: 'Tech & AI',
    w: 1,
    h: 1,
    kind: 'object',
    subType: 'rover_bot',
    desc: 'Robot otonom 6 roda dengan sensor LiDAR & navigasi SLAM (1x1)',
    defaultDialogue: 'Robot Kurir Otonom LiDAR: Menggunakan algoritma SLAM & navigasi berbasis sensor jarak untuk mengantarkan paket ke seluruh penjuru kota.',
  },

  // ⛲ 5. Fasilitas & Dekorasi Kota (Civic & Landmarks)
  {
    id: 'tpl_torii_gate',
    name: 'Gerbang Torii Taman',
    icon: '⛩️',
    category: 'Fasilitas & Kota',
    w: 3,
    h: 2,
    kind: 'object',
    subType: 'torii_gate',
    desc: 'Gerbang merah vermilion megah khas kuil Shinto (3x2)',
    defaultDialogue: 'Gerbang Torii Tradisional: Menandai batas sakral dan jalan setapak menuju keindahan alam taman kota yang harmonis.',
  },
  {
    id: 'tpl_jukebox',
    name: 'Jukebox Musik Retro',
    icon: '🎵',
    category: 'Fasilitas & Kota',
    w: 1,
    h: 2,
    kind: 'object',
    subType: 'jukebox',
    desc: 'Jukebox neon vintage pemutar instrumen nostalgia (1x2)',
    defaultDialogue: 'Jukebox Musik Retro: Memutar melodi 8-bit nostalgia kota Jubilife dan Canalave City. Suasananya begitu menenangkan!',
  },
  {
    id: 'tpl_notice_board',
    name: 'Papan Buletin Kota',
    icon: '🪧',
    category: 'Fasilitas & Kota',
    w: 2,
    h: 1,
    kind: 'object',
    subType: 'notice_board',
    desc: 'Papan kayu beratap dengan lembar pengumuman kota (2x1)',
    defaultDialogue: 'Papan Buletin Kota Zulfan: "Selamat datang, penjelajah! Silakan kunjungi Dev Center di utara untuk melihat showcase proyek lengkap."',
  },
  {
    id: 'tpl_vending',
    name: 'Mesin Minuman Vending',
    icon: '🥤',
    category: 'Fasilitas & Kota',
    w: 1,
    h: 2,
    kind: 'object',
    subType: 'vending',
    desc: 'Mesin minuman dingin otomatis (1x2)',
    defaultDialogue: 'Mesin penjual otomatis retro. Tersedia Fresh Water, Soda Pop, dan Lemonade dingin untuk memulihkan energi!',
  },
  {
    id: 'tpl_statue',
    name: 'Patung Pahlawan',
    icon: '🗿',
    category: 'Fasilitas & Kota',
    w: 1,
    h: 1,
    kind: 'object',
    subType: 'statue',
    desc: 'Monumen patung perunggu bersejarah (1x1)',
    defaultDialogue: 'Monumen patung pahlawan kota yang berdiri megah menghormati perintis teknologi masa lalu.',
  },
  {
    id: 'tpl_telescope',
    name: 'Teleskop Pengamat',
    icon: '🔭',
    category: 'Fasilitas & Kota',
    w: 2,
    h: 2,
    kind: 'object',
    subType: 'telescope',
    desc: 'Teleskop pengamat pemandangan laut (2x2)',
    defaultDialogue: 'Teleskop pengamat laut lepas. Kamu bisa melihat cakrawala samudra luas dan mercusuar di kejauhan.',
  },
  {
    id: 'tpl_campfire',
    name: 'Api Unggun Berkemah',
    icon: '🔥',
    category: 'Fasilitas & Kota',
    w: 2,
    h: 2,
    kind: 'object',
    subType: 'campfire',
    desc: 'Api unggun hangat lingkar batu (2x2)',
    defaultDialogue: 'Api unggun hangat yang menyala ceria di dalam lingkar batu. Suara kayunya berderak menenangkan.',
  },
  {
    id: 'tpl_tent',
    name: 'Tenda Pos Ranger',
    icon: '⛺',
    category: 'Fasilitas & Kota',
    w: 3,
    h: 3,
    kind: 'object',
    subType: 'tent',
    desc: 'Tenda kanvas pos ekspedisi ranger (3x3)',
    defaultDialogue: 'Tenda pos ekspedisi Pokémon Ranger. Berisi peta topografi, kompas, dan perlengkapan survival lapangan.',
  },
  {
    id: 'tpl_sign_board',
    name: 'Papan Petunjuk Jalan',
    icon: '🪧',
    category: 'Fasilitas & Kota',
    w: 1,
    h: 1,
    kind: 'sign',
    subType: 'sign',
    desc: 'Papan petunjuk arah & catatan kota (1x1)',
    defaultDialogue: 'Papan petunjuk jalan: Utara menuju Dev Center & Lab AI, Barat menuju Pelabuhan Samudra, Timur menuju Battle Arena.',
  },
  {
    id: 'tpl_npc_trainer',
    name: 'Karakter Warga Kota',
    icon: '🚶',
    category: 'Fasilitas & Kota',
    w: 1,
    h: 1,
    kind: 'npc',
    subType: 'npc',
    desc: 'Karakter warga/trainer interaktif (1x1)',
    defaultDialogue: 'Warga Kota Zulfan: "Halo trainer! Kota ini dibangun dengan kombinasi kecintaan pada Pokémon dan rekayasa kecerdasan buatan."',
  },
  {
    id: 'tpl_fence_water',
    name: 'Pagar Pembatas Tepi Air',
    icon: '⚓',
    category: 'Fasilitas & Kota',
    w: 1,
    h: 1,
    kind: 'object',
    subType: 'fence_water',
    desc: 'Pagar pembatas besi & bibir batu tepi laut / dermaga (1x1)',
    defaultDialogue: 'Pagar pembatas tepi air yang kokoh di tepi laut. Melindungi pejalan kaki dari deburan ombak teluk.',
  },
];

export interface TownStateSnapshot {
  buildings: BuildingLayout[];
  tiles: [string, TileTypeKey][];
}

export type TileTypeKey =
  | 'grass'
  | 'cobble'
  | 'lab_paver'
  | 'dev_paver'
  | 'water'
  | 'hedge'
  | 'fence'
  | 'fence_water'
  | 'tall_grass'
  | 'solid_override'
  | 'walkable_override';

export const TILE_BRUSH_TYPES: { id: TileTypeKey; name: string; icon: string; desc: string }[] = [
  { id: 'cobble', name: 'Jalan Batu', icon: '🪨', desc: 'Cobblestone Street' },
  { id: 'lab_paver', name: 'Paving Lab', icon: '🏢', desc: 'High-Tech Modern Pavers' },
  { id: 'dev_paver', name: 'Lantai Megah', icon: '🏛️', desc: 'Palace Manor Pavers' },
  { id: 'grass', name: 'Rumput Hijau', icon: '🌿', desc: 'Lush Green Grass' },
  { id: 'tall_grass', name: 'Rumput Liar', icon: '🌾', desc: 'Tall Grass (Critterdex encounters)' },
  { id: 'hedge', name: 'Semak Hijau', icon: '🌳', desc: 'Boxwood Hedge' },
  { id: 'fence', name: 'Pagar Besi', icon: '🚧', desc: 'Wrought-Iron Fence' },
  { id: 'fence_water', name: 'Pagar Tepi Air', icon: '⚓', desc: 'Pagar Besi & Bibir Batu Tepi Air' },
  { id: 'water', name: 'Air / Laut', icon: '🌊', desc: 'Coastal Ocean / Water' },
  { id: 'solid_override', name: 'Tembok Tabrakan', icon: '🛑', desc: 'Batas Solid Kustom (Tidak bisa lewat)' },
  { id: 'walkable_override', name: 'Lantai Bebas', icon: '🟢', desc: 'Bebas Tabrakan (Bisa lewat)' },
];

export const DEFAULT_BUILDINGS: BuildingLayout[] = canonicalLayout.buildings as BuildingLayout[];

const STORAGE_KEY = 'zulfan_town_custom_layout_v1';

const PURGED_LEGACY_IDS = new Set([
  'lamp_cafe_1',
  'lamp_cafe_2',
  'lamp_cafe_3',
  'lamp_cafe_4',
  'lamp_cafe_5',
  'lamp_cafe_6',
  'lamp_cafe_east_n',
  'lamp_cafe_east_s',
  'lamp_blvd_e2',
  'lamp_home',
  'lamp_civic_n',
  'lamp_prom_1',
  'lamp_prom_2',
  'lamp_prom_3',
  'lamp_prom_4',
  'lamp_prom_5',
  'lamp_bw_1',
  'lamp_bw_2',
  'lamp_bw_3',
  'lamp_gazebo',
  'lamp_cy_nw',
  'lamp_cy_ne',
  'lamp_cy_sw',
  'lamp_cy_se',
]);

class TownConfigManager {
  private buildings: Map<string, BuildingLayout> = new Map();
  private tileOverrides: Map<string, TileTypeKey> = new Map();
  private listeners: (() => void)[] = [];
  private historyStack: TownStateSnapshot[] = [];
  private redoStack: TownStateSnapshot[] = [];
  private maxHistory = 60;

  constructor() {
    this.populateDefaults();
  }

  public populateDefaults() {
    this.buildings.clear();
    const sourceBuildings = canonicalLayout.buildings as BuildingLayout[];
    for (const b of sourceBuildings) {
      this.buildings.set(b.id, { ...b });
    }
    this.tileOverrides.clear();
    if (Array.isArray(canonicalLayout.tiles)) {
      for (const [k, v] of (canonicalLayout.tiles as [string, TileTypeKey][])) {
        this.tileOverrides.set(k, v);
      }
    }
  }

  public subscribe(cb: () => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  private notify() {
    for (const cb of this.listeners) {
      try { cb(); } catch (e) { console.error(e); }
    }
  }

  public getBuildings(includeHidden = false): BuildingLayout[] {
    const list = Array.from(this.buildings.values());
    if (includeHidden) return list;
    return list.filter((b) => !b.hidden);
  }

  public getBuilding(id: string): BuildingLayout | undefined {
    return this.buildings.get(id);
  }

  public deleteBuilding(id: string) {
    const b = this.buildings.get(id);
    if (!b || b.locked) return;
    this.pushSnapshot(this.captureSnapshot());
    b.hidden = true;
    this.saveToStorage();
    this.notify();
  }

  public purgeBuilding(id: string) {
    if (!this.buildings.has(id)) return;
    this.pushSnapshot(this.captureSnapshot());
    this.buildings.delete(id);
    this.saveToStorage();
    this.notify();
  }

  public purgeAllHiddenBuildings(): number {
    this.pushSnapshot(this.captureSnapshot());
    let count = 0;
    for (const [id, b] of this.buildings.entries()) {
      if (b.hidden) {
        this.buildings.delete(id);
        count++;
      }
    }
    if (count > 0) {
      this.saveToStorage();
      this.notify();
    }
    return count;
  }

  public deleteBuildings(ids: string[]) {
    const valid = ids.filter((id) => {
      const b = this.buildings.get(id);
      return b && !b.locked;
    });
    if (valid.length === 0) return;
    this.pushSnapshot(this.captureSnapshot());
    for (const id of valid) {
      const b = this.buildings.get(id);
      if (b) b.hidden = true;
    }
    this.saveToStorage();
    this.notify();
  }

  public toggleBuildingLock(id: string): boolean {
    const b = this.buildings.get(id);
    if (!b) return false;
    this.pushSnapshot(this.captureSnapshot());
    b.locked = !b.locked;
    this.saveToStorage();
    this.notify();
    return b.locked;
  }

  public setBuildingZIndex(id: string, delta: number): number {
    const b = this.buildings.get(id);
    if (!b) return 0;
    this.pushSnapshot(this.captureSnapshot());
    b.zIndex = (b.zIndex || 0) + delta;
    this.saveToStorage();
    this.notify();
    return b.zIndex;
  }

  public setBuildingDoorPos(id: string, x: number, y: number) {
    const b = this.buildings.get(id);
    if (!b) return;
    this.pushSnapshot(this.captureSnapshot());
    b.doorX = Math.round(x);
    b.doorY = Math.round(y);
    this.saveToStorage();
    this.notify();
  }

  public setBuildingLabelPos(id: string, x: number, y: number) {
    const b = this.buildings.get(id);
    if (!b) return;
    this.pushSnapshot(this.captureSnapshot());
    b.labelX = Number(x.toFixed(1));
    b.labelY = Number(y.toFixed(1));
    this.saveToStorage();
    this.notify();
  }

  public duplicateBuilding(id: string): BuildingLayout | null {
    const b = this.buildings.get(id);
    if (!b) return null;
    this.pushSnapshot(this.captureSnapshot());
    const prefix = b.subType || b.kind || 'obj';
    const count = Array.from(this.buildings.values()).filter((item) => item.id.startsWith(prefix)).length + 1;
    const newId = `${prefix}_copy_${Date.now().toString(36)}`;
    const newName = `${b.name} (Copy ${count})`;
    const clampedX = Math.max(0, Math.min(45 - b.w, b.x + 1));
    const clampedY = Math.max(0, Math.min(64 - b.h, b.y + 1));
    const clone: BuildingLayout = {
      ...b,
      id: newId,
      name: newName,
      x: clampedX,
      y: clampedY,
      doorX: b.doorX !== undefined ? b.doorX + 1 : undefined,
      doorY: b.doorY !== undefined ? b.doorY + 1 : undefined,
      labelX: b.labelX !== undefined ? b.labelX + 1 : undefined,
      labelY: b.labelY !== undefined ? b.labelY + 1 : undefined,
      locked: false,
    };
    this.buildings.set(newId, clone);
    this.saveToStorage();
    this.notify();
    return clone;
  }

  public duplicateBuildings(ids: string[]): BuildingLayout[] {
    if (ids.length === 0) return [];
    this.pushSnapshot(this.captureSnapshot());
    const cloned: BuildingLayout[] = [];
    for (const id of ids) {
      const b = this.buildings.get(id);
      if (!b) continue;
      const prefix = b.subType || b.kind || 'obj';
      const count = Array.from(this.buildings.values()).filter((item) => item.id.startsWith(prefix)).length + 1;
      const newId = `${prefix}_copy_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 5)}`;
      const newName = `${b.name} (Copy ${count})`;
      const clampedX = Math.max(0, Math.min(45 - b.w, b.x + 1));
      const clampedY = Math.max(0, Math.min(64 - b.h, b.y + 1));
      const clone: BuildingLayout = {
        ...b,
        id: newId,
        name: newName,
        x: clampedX,
        y: clampedY,
        doorX: b.doorX !== undefined ? b.doorX + 1 : undefined,
        doorY: b.doorY !== undefined ? b.doorY + 1 : undefined,
        labelX: b.labelX !== undefined ? b.labelX + 1 : undefined,
        labelY: b.labelY !== undefined ? b.labelY + 1 : undefined,
        locked: false,
      };
      this.buildings.set(newId, clone);
      cloned.push(clone);
    }
    this.saveToStorage();
    this.notify();
    return cloned;
  }

  public rotateBuilding(id: string): 'N' | 'E' | 'S' | 'W' {
    return this.rotateBuildingDirection(id, 'right');
  }

  public rotateBuildingDirection(id: string, dir: 'left' | 'right'): 'N' | 'E' | 'S' | 'W' {
    const b = this.buildings.get(id);
    if (!b) return 'N';
    const current = b.orientation || 'N';
    const nextMap: Record<'N' | 'E' | 'S' | 'W', 'N' | 'E' | 'S' | 'W'> =
      dir === 'right'
        ? { N: 'E', E: 'S', S: 'W', W: 'N' }
        : { N: 'W', W: 'S', S: 'E', E: 'N' };
    const next = nextMap[current];
    return this.setBuildingOrientation(id, next, true);
  }

  public setBuildingOrientation(
    id: string,
    orient: 'N' | 'E' | 'S' | 'W',
    pushSnap: boolean = true
  ): 'N' | 'E' | 'S' | 'W' {
    const b = this.buildings.get(id);
    if (!b) return 'N';
    if (pushSnap) {
      this.pushSnapshot(this.captureSnapshot());
    }
    const prevOrient = b.orientation || 'N';
    b.orientation = orient;

    // For benches, swap w and h when rotating between horizontal and vertical
    if (b.kind === 'bench') {
      const wasVertical = prevOrient === 'E' || prevOrient === 'W';
      const isVertical = orient === 'E' || orient === 'W';
      if (wasVertical !== isVertical) {
        const temp = b.w;
        b.w = b.h;
        b.h = temp;
        b.x = Math.max(0, Math.min(45 - b.w, b.x));
        b.y = Math.max(0, Math.min(64 - b.h, b.y));
      }
    }

    this.saveToStorage();
    this.notify();
    return orient;
  }

  public spawnObject(templateId: string, x: number, y: number): BuildingLayout | null {
    const tpl = SPAWNABLE_TEMPLATES.find((t) => t.id === templateId);
    if (!tpl) return null;

    this.pushSnapshot(this.captureSnapshot());

    const prefix = tpl.subType || tpl.kind;
    const count = Array.from(this.buildings.values()).filter((b) => b.id.startsWith(prefix)).length + 1;
    const id = `${prefix}_${Date.now().toString(36)}`;
    const name = `${tpl.name} #${count}`;

    const clampedX = Math.max(0, Math.min(45 - tpl.w, Math.round(x)));
    const clampedY = Math.max(0, Math.min(64 - tpl.h, Math.round(y)));

    const newObj: BuildingLayout = {
      id,
      name,
      x: clampedX,
      y: clampedY,
      w: tpl.w,
      h: tpl.h,
      kind: tpl.kind,
      subType: tpl.subType,
      orientation: 'N',
      dialogue: tpl.defaultDialogue,
    };

    this.buildings.set(id, newObj);
    this.saveToStorage();
    this.notify();
    return newObj;
  }

  public setBuildingDialogue(id: string, dialogue: string) {
    const b = this.buildings.get(id);
    if (!b) return;
    this.pushSnapshot(this.captureSnapshot());
    b.dialogue = dialogue;
    this.saveToStorage();
    this.notify();
  }

  public setBuildingPos(id: string, x: number, y: number) {
    const b = this.buildings.get(id);
    if (!b || b.locked) return;
    const nx = Math.round(x);
    const ny = Math.round(y);
    const dx = nx - b.x;
    const dy = ny - b.y;
    b.x = nx;
    b.y = ny;
    if (b.labelX !== undefined) b.labelX = Number((b.labelX + dx).toFixed(1));
    if (b.labelY !== undefined) b.labelY = Number((b.labelY + dy).toFixed(1));
    if (b.doorX !== undefined) {
      b.doorX += dx;
    } else if (b.kind === 'building') {
      b.doorX = b.x + Math.floor(b.w / 2);
    }
    if (b.doorY !== undefined) {
      b.doorY += dy;
    } else if (b.kind === 'building') {
      b.doorY = b.y + b.h - 1;
    }
    if (b.kind === 'building' && b.doorX !== undefined && b.doorY !== undefined) {
      if (b.doorX < b.x - 1 || b.doorX > b.x + b.w || b.doorY < b.y || b.doorY > b.y + b.h) {
        b.doorX = b.x + Math.floor(b.w / 2);
        b.doorY = b.y + b.h - 1;
      }
    }
    this.saveToStorage();
    this.notify();
  }

  public moveBuildingsBatch(
    moves: {
      id: string;
      x: number;
      y: number;
      doorX?: number;
      doorY?: number;
      labelX?: number;
      labelY?: number;
    }[]
  ) {
    for (const m of moves) {
      const b = this.buildings.get(m.id);
      if (!b || b.locked) continue;
      const nx = Math.max(0, Math.min(45 - b.w, Math.round(m.x)));
      const ny = Math.max(0, Math.min(64 - b.h, Math.round(m.y)));
      const dx = nx - b.x;
      const dy = ny - b.y;
      b.x = nx;
      b.y = ny;

      if (m.labelX !== undefined) {
        b.labelX = m.labelX;
      } else if (b.labelX !== undefined) {
        b.labelX = Number((b.labelX + dx).toFixed(1));
      }

      if (m.labelY !== undefined) {
        b.labelY = m.labelY;
      } else if (b.labelY !== undefined) {
        b.labelY = Number((b.labelY + dy).toFixed(1));
      }

      if (m.doorX !== undefined) {
        b.doorX = m.doorX;
      } else if (b.doorX !== undefined) {
        b.doorX += dx;
      } else if (b.kind === 'building') {
        b.doorX = b.x + Math.floor(b.w / 2);
      }

      if (m.doorY !== undefined) {
        b.doorY = m.doorY;
      } else if (b.doorY !== undefined) {
        b.doorY += dy;
      } else if (b.kind === 'building') {
        b.doorY = b.y + b.h - 1;
      }

      if (b.kind === 'building' && b.doorX !== undefined && b.doorY !== undefined) {
        if (b.doorX < b.x - 1 || b.doorX > b.x + b.w || b.doorY < b.y || b.doorY > b.y + b.h) {
          b.doorX = b.x + Math.floor(b.w / 2);
          b.doorY = b.y + b.h - 1;
        }
      }
    }
    this.saveToStorage();
    this.notify();
  }

  public getTileOverride(x: number, y: number): TileTypeKey | undefined {
    return this.tileOverrides.get(`${x},${y}`);
  }

  public setTileOverride(x: number, y: number, tile: TileTypeKey) {
    this.tileOverrides.set(`${x},${y}`, tile);
    this.saveToStorage();
    this.notify();
  }

  public setTileOverridesBatch(tiles: { x: number; y: number; tile: TileTypeKey }[]) {
    for (const t of tiles) {
      this.tileOverrides.set(`${t.x},${t.y}`, t.tile);
    }
    this.saveToStorage();
    this.notify();
  }

  public removeTileOverride(x: number, y: number) {
    this.tileOverrides.delete(`${x},${y}`);
    this.saveToStorage();
    this.notify();
  }

  public removeTileOverridesBatch(coords: { x: number; y: number }[]) {
    for (const c of coords) {
      this.tileOverrides.delete(`${c.x},${c.y}`);
    }
    this.saveToStorage();
    this.notify();
  }

  public getAllTileOverrides(): Map<string, TileTypeKey> {
    return this.tileOverrides;
  }

  public clearAllTileOverrides() {
    this.tileOverrides.clear();
    this.saveToStorage();
    this.notify();
  }

  public captureSnapshot(): TownStateSnapshot {
    return {
      buildings: Array.from(this.buildings.values()).map((b) => ({ ...b })),
      tiles: Array.from(this.tileOverrides.entries()),
    };
  }

  public pushSnapshot(snap: TownStateSnapshot) {
    this.historyStack.push(snap);
    if (this.historyStack.length > this.maxHistory) {
      this.historyStack.shift();
    }
    this.redoStack = [];
    this.notify();
  }

  public restoreSnapshot(snap: TownStateSnapshot) {
    this.buildings.clear();
    for (const b of snap.buildings) {
      this.buildings.set(b.id, { ...b });
    }
    this.tileOverrides.clear();
    for (const [k, v] of snap.tiles) {
      this.tileOverrides.set(k, v);
    }
    this.saveToStorage();
    this.notify();
  }

  public canUndo(): boolean {
    return this.historyStack.length > 0;
  }

  public canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  public undo(): boolean {
    if (this.historyStack.length === 0) return false;
    const prev = this.historyStack.pop()!;
    const current = this.captureSnapshot();
    this.redoStack.push(current);
    this.restoreSnapshot(prev);
    return true;
  }

  public redo(): boolean {
    if (this.redoStack.length === 0) return false;
    const next = this.redoStack.pop()!;
    const current = this.captureSnapshot();
    this.historyStack.push(current);
    this.restoreSnapshot(next);
    return true;
  }

  public resetToDefaults(notify = true) {
    this.pushSnapshot(this.captureSnapshot());
    this.populateDefaults();
    if (typeof window !== 'undefined') {
      try { localStorage.removeItem(STORAGE_KEY); } catch {}
    }
    if (notify) this.notify();
  }

  public async saveToDisk(): Promise<{ success: boolean; message: string }> {
    const data = {
      buildings: Array.from(this.buildings.values()).filter((b) => !b.hidden),
      tiles: Array.from(this.tileOverrides.entries()),
    };
    this.saveToStorage();
    try {
      const res = await fetch('/api/dev/save-town', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        return { success: true, message: 'Tersimpan permanen ke src/data/townLayout.json!' };
      }
      return { success: false, message: `Server error (${res.status}): Tersimpan di cadangan browser.` };
    } catch {
      return { success: false, message: 'Dev server endpoint tidak aktif. Tersimpan di cadangan browser.' };
    }
  }

  public saveToStorage() {
    if (typeof window === 'undefined') return;
    try {
      const data = {
        buildings: Array.from(this.buildings.values()),
        tiles: Array.from(this.tileOverrides.entries()),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save town config to localStorage', e);
    }
  }

  public loadFromStorage() {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      let purgedLegacyFound = false;
      if (Array.isArray(parsed.buildings)) {
        for (const b of parsed.buildings) {
          if (!b.id) continue;
          if (PURGED_LEGACY_IDS.has(b.id)) {
            purgedLegacyFound = true;
            this.buildings.delete(b.id);
            continue;
          }
          const existing = this.buildings.get(b.id);
            if (existing) {
              if (b.id === 'arceus' && (Math.abs(b.x - 39.5) < 0.5 || Math.abs(b.x - 39) < 0.5)) {
                existing.x = 17;
                existing.y = 14;
                existing.labelX = 18;
                existing.labelY = 13.4;
              } else {
                existing.x = b.x;
                existing.y = b.y;
              }
              if (b.id === 'ace') {
                existing.name = 'Mewtwo';
                existing.subType = 'mewtwo';
              }
              if (b.id === 'ranger' && (b.name === 'Blastoise' || b.name === 'Pokémon Ranger Alex' || !b.name)) {
                existing.name = 'Tyranitar';
                existing.subType = 'tyranitar';
                existing.dialogue = "TYRANITAR: 'Gwoooaaargh!' 🪨 Tubuh zirah batu baja Tyranitar kokoh tak tergoyahkan. Siap melindungi perbatasan Zulfan's Town!";
              }
              if (b.id === 'shop' || b.id === 'depop') {
                existing.id = 'shop';
                existing.name = 'Poké Mart';
                if (!existing.link) existing.link = '/mart';
              }
              if (b.id === 'office') {
                existing.id = 'office';
                existing.name = 'Tech Tower';
                if (!existing.link) existing.link = '/tower';
              }
              if (b.labelX !== undefined && !(b.id === 'arceus' && Math.abs(b.x - 39.5) < 0.5)) {
                // If labelX was set to the left corner b.x on a multi-tile building, discard legacy uncentered coordinate
                if ((existing.w || 1) > 1 && Math.abs(b.labelX - b.x) < 0.1) {
                  existing.labelX = undefined;
                  existing.labelY = undefined;
                } else {
                  existing.labelX = b.labelX;
                  existing.labelY = b.labelY;
                }
              }
              if (b.doorX !== undefined) existing.doorX = b.doorX;
              if (b.doorY !== undefined) existing.doorY = b.doorY;
              if (existing.kind === 'building' && existing.doorX !== undefined && existing.doorY !== undefined) {
                if (
                  existing.doorX < existing.x - 1 ||
                  existing.doorX > existing.x + existing.w ||
                  existing.doorY < existing.y ||
                  existing.doorY > existing.y + existing.h
                ) {
                  existing.doorX = existing.x + Math.floor(existing.w / 2);
                  existing.doorY = existing.y + existing.h - 1;
                }
              }
              if (b.link !== undefined) existing.link = b.link;
              if (b.locked !== undefined) existing.locked = !!b.locked;
              if (b.zIndex !== undefined) existing.zIndex = b.zIndex;
              if (b.dialogue !== undefined) existing.dialogue = b.dialogue;
              existing.hidden = !!b.hidden;
              if (b.kind) existing.kind = b.kind;
              if (b.subType) existing.subType = b.subType;
              if (b.orientation) existing.orientation = b.orientation;
              if (b.name) existing.name = b.name;
              if (b.w !== undefined) existing.w = b.w;
              if (b.h !== undefined) existing.h = b.h;
            } else {
              this.buildings.set(b.id, b);
            }
        }
      }
      if (Array.isArray(parsed.tiles)) {
        const contest = this.buildings.get('contest');
        for (const [k, v] of parsed.tiles) {
          const [xs, ys] = k.split(',');
          const x = parseInt(xs, 10);
          const y = parseInt(ys, 10);
          // Purge legacy corrupted grass/paver in South Civic Plaza & Cafe patio (X: 24..42, Y: 46..55)
          if (x >= 24 && x <= 42 && y >= 46 && y <= 55) {
            if (v === 'grass' || (x >= 34 && x <= 42 && y >= 48 && y <= 55)) {
              purgedLegacyFound = true;
              continue;
            }
          }
          // Purge legacy corrupted grass in East Dex Meadow tall grass reserve (X: 25..42, Y: 58..61)
          if (x >= 25 && x <= 42 && y >= 58 && y <= 61 && v === 'grass') {
            purgedLegacyFound = true;
            continue;
          }
          // Purge legacy corrupted paver in Contest Stage footprint
          if (contest && !contest.hidden && x >= contest.x && x < contest.x + contest.w && y >= contest.y && y < contest.y + contest.h) {
            purgedLegacyFound = true;
            continue;
          }
          this.tileOverrides.set(k, v);
        }
      }
      if (purgedLegacyFound) {
        this.saveToStorage();
      }
    } catch (e) {
      console.warn('Failed to load town config from localStorage', e);
    }
  }

  public exportCode(): string {
    const bList = Array.from(this.buildings.values());
    const lines = [
      '// === HASIL DESAIN TATA LETAK KOTA (TOWN EDITOR 3.0 EXPORT) ===',
      '// Salin data koordinat bangunan & POI berikut ke map.ts / townBackground.ts:',
      'const BUILDINGS_LAYOUT = {',
    ];
    for (const b of bList) {
      const props: string[] = [
        `x: ${b.x}`,
        `y: ${b.y}`,
        `w: ${b.w}`,
        `h: ${b.h}`,
        `kind: '${b.kind || 'building'}'`,
      ];
      if (b.subType) props.push(`subType: '${b.subType}'`);
      if (b.orientation) props.push(`orientation: '${b.orientation}'`);
      if (b.doorX !== undefined) props.push(`doorX: ${b.doorX}`);
      if (b.doorY !== undefined) props.push(`doorY: ${b.doorY}`);
      if (b.labelX !== undefined) props.push(`labelX: ${b.labelX}`);
      if (b.labelY !== undefined) props.push(`labelY: ${b.labelY}`);
      if (b.locked) props.push(`locked: true`);
      if (b.zIndex) props.push(`zIndex: ${b.zIndex}`);
      if (b.dialogue) props.push(`dialogue: ${JSON.stringify(b.dialogue)}`);
      if (b.link) props.push(`link: '${b.link}'`);
      if (b.hidden) props.push(`hidden: true`);
      lines.push(`  ${b.id}: { ${props.join(', ')} }, // ${b.name}`);
    }
    lines.push('};');

    if (this.tileOverrides.size > 0) {
      lines.push('');
      lines.push(`// Custom Tile Overrides (${this.tileOverrides.size} petak):`);
      lines.push('const CUSTOM_TILES = [');
      for (const [coord, tile] of this.tileOverrides.entries()) {
        const [x, y] = coord.split(',');
        lines.push(`  { x: ${x}, y: ${y}, tile: '${tile}' },`);
      }
      lines.push('];');
    }

    return lines.join('\n');
  }
}

export const townConfig = new TownConfigManager();


