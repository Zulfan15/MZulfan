import type { APIRoute } from 'astro';
import { profile, skills, missions } from '../../lib/profile';
import { PLACES_LIST } from '../../lib/placesRegistry';
import { COMPANIONS } from '../../engine/pokemonCompanions';

export interface PaletteItem {
  id: string;
  title: string;
  category: 'action' | 'skill' | 'project' | 'place' | 'pokemon';
  categoryLabel: string;
  icon: string;
  desc: string;
  keywords: string;
  actionType:
    | 'navigate'
    | 'download'
    | 'copy'
    | 'fly'
    | 'modal'
    | 'toggle-bike'
    | 'toggle-minimap'
    | 'set-atmosphere'
    | 'set-weather'
    | 'toggle-bgm'
    | 'toggle-editor'
    | 'start-tour'
    | 'toggle-pokesnap'
    | 'trigger-resonance'
    | 'set-follower'
    | 'open-guestbook'
    | 'toggle-ghosts'
    | 'open-jukebox';
  target?: string;
  flyCoords?: { x: number; y: number };
}

const coreActions: PaletteItem[] = [
  {
    id: 'act-jukebox',
    title: '8-Bit Chiptune Jukebox (6 Track + Visualizer)',
    category: 'action',
    categoryLabel: 'Aksi Cepat',
    icon: '🎹',
    desc: 'Pilih 6 lagu chiptune Web Audio & lihat 16-bar Pixel Spectrum Visualizer.',
    keywords: 'jukebox music musik 8-bit chiptune visualizer equalizer lagu bgm cafe',
    actionType: 'open-jukebox',
  },
  {
    id: 'act-guestbook',
    title: 'Trainer Guestbook (Papan Pesan & Buku Tamu Kota)',
    category: 'action',
    categoryLabel: 'Aksi Cepat',
    icon: '📖',
    desc: 'Baca pesan pengunjung & tinggalkan catatan Anda sebagai Ghost Trainer di Fountain Plaza.',
    keywords: 'guestbook buku tamu komentar pesan recruiter ghost trainer social board',
    actionType: 'open-guestbook',
  },
  {
    id: 'act-ghosts',
    title: 'Toggle Ghost Trainers di Fountain Plaza (ON / OFF)',
    category: 'action',
    categoryLabel: 'Aksi Cepat',
    icon: '👻',
    desc: 'Tampilkan atau sembunyikan NPC pengunjung terakhir yang berjalan santai di Town Square.',
    keywords: 'ghost trainer npc pengunjung plaza hide show toggle',
    actionType: 'toggle-ghosts',
  },
  {
    id: 'act-pokesnap',
    title: 'PokéSnap Studio (Photo Mode & Postcard PNG)',
    category: 'action',
    categoryLabel: 'Aksi Cepat',
    icon: '📸',
    desc: 'Abadikan tangkapan layar peta dengan filter retro & bingkai kartu pos PNG (Tekan O).',
    keywords: 'pokesnap photo foto gambar screenshot postcard png filter gameboy crt retro',
    actionType: 'toggle-pokesnap',
  },
  {
    id: 'act-resonance',
    title: 'Legendary Resonance Burst (Kombo Partner)',
    category: 'action',
    categoryLabel: 'Aksi Cepat',
    icon: '🌟',
    desc: 'Aktifkan jurus kombo saat partner Pokémon berdekatan dengan pasangannya di peta (Tekan G).',
    keywords: 'resonance combo kombo burst skill legendary tao trio paradox key g',
    actionType: 'trigger-resonance',
  },
  {
    id: 'act-jobfit',
    title: 'AI Recruiter Co-Pilot: Job-Fit Analyzer',
    category: 'action',
    categoryLabel: 'Aksi Cepat',
    icon: '🎯',
    desc: 'Cocokkan Job Description atau preset role HR dengan profil & proyek Zulfan secara instan.',
    keywords: 'job fit hr recruiter match jd kecocokan skill brief markdown',
    actionType: 'modal',
    target: 'jobfit',
  },
  {
    id: 'act-autotour',
    title: 'Guided Auto-Tour Kota 2D (60 Detik)',
    category: 'action',
    categoryLabel: 'Aksi Cepat',
    icon: '🎬',
    desc: 'Jelajahi 5 landmark utama kota secara otomatis di atas Poké Ride dengan ringkasan portofolio.',
    keywords: 'tour auto tur otomatis drone landmark preview showcase',
    actionType: 'start-tour',
  },
  {
    id: 'act-town-editor',
    title: 'Town Editor 3.0 (Kustomisasi Tata Letak Kota)',
    category: 'action',
    categoryLabel: 'Aksi Cepat',
    icon: '🛠️',
    desc: 'Buka palet editor visual untuk memindahkan gedung, dekorasi, NPC & ubin kota (Tekan E).',
    keywords: 'editor builder town desain peta gedung kustomisasi custom layout petak hotkey e ubah bangun',
    actionType: 'toggle-editor',
  },
  {
    id: 'act-cv',
    title: 'Unduh CV / Résumé Zulfan (PDF)',
    category: 'action',
    categoryLabel: 'Aksi Cepat',
    icon: '📄',
    desc: 'Buka dan unduh dokumen Curriculum Vitae lengkap terbaru.',
    keywords: 'cv resume pdf download unduh berkas lamaran biodata',
    actionType: 'download',
    target: profile.person.cv,
  },
  {
    id: 'act-email',
    title: `Salin Email (${profile.person.email})`,
    category: 'action',
    categoryLabel: 'Aksi Cepat',
    icon: '📋',
    desc: 'Salin alamat email langsung ke clipboard Anda.',
    keywords: 'email mail kontak contact pesan kirim hubungi',
    actionType: 'copy',
    target: profile.person.email,
  },
  {
    id: 'act-twin',
    title: 'Chat dengan Digital Twin AI',
    category: 'action',
    categoryLabel: 'Aksi Cepat',
    icon: '💬',
    desc: 'Tanya jawab interaktif dengan AI persona berbasis rekayasa Zulfan.',
    keywords: 'twin ai bot chatbot tanya chat clone digital',
    actionType: 'navigate',
    target: '/twin',
  },
  {
    id: 'act-map',
    title: 'Buka Town Map & Quick Travel (HM02 Fly)',
    category: 'action',
    categoryLabel: 'Aksi Cepat',
    icon: '🗺️',
    desc: 'Lihat denah lengkap kota dan lompat instan ke lokasi mana pun.',
    keywords: 'map peta fly hm02 jalan travel teleport lokasi denah',
    actionType: 'modal',
    target: 'map',
  },
  {
    id: 'act-passport',
    title: 'Buka Trainer Passport (Stamp Rally & VIP)',
    category: 'action',
    categoryLabel: 'Aksi Cepat',
    icon: '🎫',
    desc: 'Lihat progres 5 misi wisata penjelajahan & buka status VIP Recruiter.',
    keywords: 'passport paspor stempel stamp rally misi quest achievement tour wisata vip recruiter',
    actionType: 'modal',
    target: 'passport',
  },
  {
    id: 'act-dex',
    title: 'Buka Critterdex & Trainer Card',
    category: 'action',
    categoryLabel: 'Aksi Cepat',
    icon: '📖',
    desc: 'Lihat koleksi 12 Pokémon yang tertangkap dan unduh Trainer Card PNG.',
    keywords: 'dex critterdex pokemon monster tangkap kartu trainer card png',
    actionType: 'modal',
    target: 'dex',
  },
  {
    id: 'act-bike',
    title: 'Toggle Mach Bike (Kecepatan 2.2×)',
    category: 'action',
    categoryLabel: 'Aksi Cepat',
    icon: '🚲',
    desc: 'Aktifkan / matikan sepeda cepat dengan suara bel chiptune (Key: B).',
    keywords: 'bike sepeda mach bike bell lari cepat speed run',
    actionType: 'toggle-bike',
  },
  {
    id: 'act-radar',
    title: 'Toggle Radar Kota Mini-Map',
    category: 'action',
    categoryLabel: 'Aksi Cepat',
    icon: '🧭',
    desc: 'Buka / tutup radar mini-map di pojok kanan atas (Key: M).',
    keywords: 'radar minimap map peta kompas posisi live',
    actionType: 'toggle-minimap',
  },
  {
    id: 'act-bgm',
    title: 'Toggle Musik Latar 8-Bit (Lo-Fi BGM)',
    category: 'action',
    categoryLabel: 'Aksi Cepat',
    icon: '🎵',
    desc: 'Nyalakan / heningkan melodi procedural chiptune 0 KB berbasis Web Audio.',
    keywords: 'bgm musik music lofi lagu sound audio chiptune hening',
    actionType: 'toggle-bgm',
  },
  {
    id: 'act-time-day',
    title: 'Atur Waktu: Siang Hari (Day Mode)',
    category: 'action',
    categoryLabel: 'Aksi Cepat',
    icon: '☀️',
    desc: 'Ubah suasana pencahayaan kota ke mode Siang yang cerah dan hangat.',
    keywords: 'siang day waktu time matahari cerah terang',
    actionType: 'set-atmosphere',
    target: 'day',
  },
  {
    id: 'act-time-sunset',
    title: 'Atur Waktu: Senja Keemasan (Sunset Mode)',
    category: 'action',
    categoryLabel: 'Aksi Cepat',
    icon: '🌅',
    desc: 'Ubah suasana kota ke nuansa sore keemasan dengan lentera mulai berpendar.',
    keywords: 'senja sore sunset golden waktu time oranye merah',
    actionType: 'set-atmosphere',
    target: 'sunset',
  },
  {
    id: 'act-time-night',
    title: 'Atur Waktu: Malam Hari (Night Mode)',
    category: 'action',
    categoryLabel: 'Aksi Cepat',
    icon: '🌙',
    desc: 'Ubah kota ke mode Malam dengan lentera menyala, jendela hangat, dan kunang-kunang.',
    keywords: 'malam night gelap bintang kunang lampu jendela waktu time',
    actionType: 'set-atmosphere',
    target: 'night',
  },
  {
    id: 'act-weather-petals',
    title: 'Cuaca: Kelopak Sakura & Daun Berhembus',
    category: 'action',
    categoryLabel: 'Aksi Cepat',
    icon: '🌸',
    desc: 'Aktifkan partikel kelopak bunga sakura merah muda dan daun yang melayang santai.',
    keywords: 'cuaca weather sakura bunga kelopak daun petal spring semi cerah',
    actionType: 'set-weather',
    target: 'petals',
  },
  {
    id: 'act-weather-rain',
    title: 'Cuaca: Hujan Rintik Lo-Fi (Rain & Ripples)',
    category: 'action',
    categoryLabel: 'Aksi Cepat',
    icon: '🌧️',
    desc: 'Aktifkan efek hujan rintik diagonal dan cipratan riak air di atas kanvas.',
    keywords: 'cuaca weather hujan rain lofi rintik air basah kolam ripple',
    actionType: 'set-weather',
    target: 'rain',
  },
  {
    id: 'act-weather-stars',
    title: 'Cuaca: Hujan Meteor & Bintang Berkelip (Starfall)',
    category: 'action',
    categoryLabel: 'Aksi Cepat',
    icon: '✨',
    desc: 'Aktifkan taburan bintang berkelip dan lintasan meteor berkilau di langit.',
    keywords: 'cuaca weather bintang meteor starfall langit malam berkilau',
    actionType: 'set-weather',
    target: 'stars',
  },
];

const partnerActions: PaletteItem[] = [
  ...COMPANIONS.map<PaletteItem>((c) => ({
    id: `partner-${c.id}`,
    title: `Partner: ${c.name} (${c.title})`,
    category: 'action',
    categoryLabel: 'Walking Partner',
    icon: c.icon,
    desc: c.lore,
    keywords: `partner follower pokemon jalan dampingi teman ${c.id} ${c.name} ${c.element} ${c.skillName}`,
    actionType: 'set-follower',
    target: c.id,
  })),
  {
    id: 'partner-dismiss',
    title: 'Istirahatkan Walking Partner',
    category: 'action',
    categoryLabel: 'Walking Partner',
    icon: '👟',
    desc: 'Kembalikan partner Pokémon ke posisinya dan berjalan solo.',
    keywords: 'partner follower solo lepas copot istirahat dismiss remove none',
    actionType: 'set-follower',
    target: 'dismiss',
  },
];

const townFlyCoords: Record<string, { x: number; y: number }> = {
  dev: { x: 16, y: 12 },
  lab: { x: 27, y: 9 },
  tower: { x: 38, y: 14 },
  arcade: { x: 28, y: 43 },
  mart: { x: 15, y: 42 },
  reception: { x: 15, y: 35 },
  arena: { x: 28, y: 24 },
};

const placeItems: PaletteItem[] = [
  ...PLACES_LIST.filter((p) => p.id !== 'privacy').map<PaletteItem>((p) => {
    const fly = townFlyCoords[p.id];
    return {
      id: `place-${p.id}`,
      title: p.name,
      category: 'place',
      categoryLabel: p.id.includes('-') ? 'Interior' : 'Lokasi',
      icon: p.icon,
      desc: p.blurb,
      keywords: `lokasi gedung map ${p.id} ${p.name} ${p.blurb}`,
      actionType: fly ? 'fly' : 'navigate',
      target: p.route,
      flyCoords: fly,
    };
  }),
  {
    id: 'place-fountain',
    title: 'Fountain Plaza (Air Mancur Pusat Kota)',
    category: 'place',
    categoryLabel: 'Landmark',
    icon: '⛲',
    desc: 'Plaza melingkar air mancur pegunungan yang jernih.',
    keywords: 'fountain plaza air mancur tengah square santai',
    actionType: 'fly',
    flyCoords: { x: 28, y: 33 },
  },
];

const skillItems: PaletteItem[] = skills.slice(0, 20).map((s) => ({
  id: `skill-${s.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
  title: `Keahlian: ${s.name}`,
  category: 'skill',
  categoryLabel: s.category || 'Skill',
  icon: '⚡',
  desc: `Digunakan dalam ${s.count} proyek/misi portofolio (${s.ring.toUpperCase()}).`,
  keywords: `skill tech keahlian ${s.name} ${s.category || ''} stack coding`,
  actionType: 'navigate',
  target: '/dev#skills',
}));

const projectItems: PaletteItem[] = missions.map((m) => ({
  id: `proj-${m.id}`,
  title: m.title,
  category: 'project',
  categoryLabel: m.type === 'launch' ? 'Proyek Unggulan' : 'Penugasan Tim',
  icon: m.type === 'launch' ? '🚀' : '👥',
  desc: m.summary,
  keywords: `proyek project ${m.title} ${m.payload?.join(' ') || ''} ${m.org} ${m.summary}`,
  actionType: 'navigate',
  target: m.research ? '/lab' : '/dev',
}));

const pokemonItems: PaletteItem[] = [
  {
    id: 'pkmn-charizard',
    title: 'Charizard (Sang Naga Api & Problem Solver)',
    category: 'pokemon',
    categoryLabel: 'Pokémon',
    icon: '🔥',
    desc: 'Melambangkan keuletan problem solving full-stack engineering.',
    keywords: 'charizard naga api fire flying dragon pokemon',
    actionType: 'fly',
    flyCoords: { x: 26, y: 33 },
  },
  {
    id: 'pkmn-tyranitar',
    title: 'Tyranitar (Armor Rock & Backend Resilient)',
    category: 'pokemon',
    categoryLabel: 'Pokémon',
    icon: '🪨',
    desc: 'Ketahanan arsitektur backend andal tahan uji beban tinggi.',
    keywords: 'tyranitar batu rock dark pasir sandstorm blastoise',
    actionType: 'fly',
    flyCoords: { x: 37, y: 43 },
  },
  {
    id: 'pkmn-mewtwo',
    title: 'Mewtwo (Guardian of Battle Arena)',
    category: 'pokemon',
    categoryLabel: 'Pokémon',
    icon: '🔮',
    desc: 'Penguasa arena teknologi Sinnoh menantang kecerdasan Anda.',
    keywords: 'mewtwo psychic psikis arena kuis master',
    actionType: 'fly',
    flyCoords: { x: 28, y: 22 },
  },
  {
    id: 'pkmn-arceus',
    title: 'Arceus (The Alpha System Architect)',
    category: 'pokemon',
    categoryLabel: 'Pokémon',
    icon: '✨',
    desc: 'Simbol arsitektur sistem holistik end-to-end Zulfan.',
    keywords: 'arceus tuhan dewa alpha pelindung arsitek system',
    actionType: 'fly',
    flyCoords: { x: 16, y: 17 },
  },
];

export const GET: APIRoute = () => {
  const items: PaletteItem[] = [
    ...coreActions,
    ...partnerActions,
    ...placeItems,
    ...skillItems,
    ...projectItems,
    ...pokemonItems,
  ];
  return new Response(JSON.stringify(items), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
};
