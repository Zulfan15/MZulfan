import { CHARIZARD_IMAGE_SRC } from './charizardSprite';
import { TYRANITAR_IMAGE_SRC } from './tyranitarSprite';
import { GARCHOMP_IMAGE_SRC } from './garchompSprite';
import { URSHIFU_IMAGE_SRC } from './urshifuSprite';
import { RAYQUAZA_IMAGE_SRC } from './rayquazaSprite';
import { DIALGA_IMAGE_SRC } from './dialgaSprite';
import { PALKIA_IMAGE_SRC } from './palkiaSprite';

export const MEWTWO_IMAGE_SRC =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHAAAABwBAMAAAA0zul4AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAIVBMVEUAAAD4+Pjg4PC4sMi4iMCYiJh4gHiIWJBQWFBAQEAAAABuf+WbAAAAAXRSTlMAQObYZgAAAWxJREFUeNrt2DGtJDEQRdGi8Ck8Co+CKRSFT8EUmkJRuChX7vGMg81Wqk52bmjpSC+wHDi+ffv27dsz8TTEPAvxhvAgXASJp+CvBEg+MIBGqNWvfCCMMWmC6G/HWDVBtHvB4ybRDfWGzDGA6IHoZLPhntkNbXNcI7S82OUDiUYY3LCuHx9YdMJAyoufn+1u2QpJSYzlKs8F6ISSvILMa8sx6IOB064igkziyDYYVJXzNfXAQQ88Y6WrktjRDiVd3u5s7YJkZUp52WfqHLMNkllSpsHmuNEEwS5LEhFY3GdzLtcCKVd5zqkXUQHzrgdil1RjjCUJpJpv1wFxvtySKVEfSPTA5TYsSSq9JEQPDD6wrC1rsx4Y3NvGmKU3NBGNMJBdc25YSmUzDMisDV2iD54+0jZOoh9WJuDlAqIbcruIKNtFRDcklzsvJf3wdjvsfhhAPAtPID0KKaX0KJRSxIMwQI/BQ+Nf4f/7/fYHGujw6q4E2bwAAAAASUVORK5CYII=';

export const ARCEUS_IMAGE_SRC =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAAMFBMVEX///+EhIyEcwDexTq9pRkA5gAAnAD/71rFADp7hJQ6QlJaWmNaY3O1tb3m5u8QEBBxRTodAAAAAXRSTlMAQObYZgAAA4dJREFUeNrl1tuO4zgMRVGRotMdWdT5/78dUdQlU6lJ2W0/DND7JQgMLFCxIjt8jCjcGiludUkdRMH/EyStERGoADd5xaJSUHTfw0vaOueZ5p6BNTcd65dO3K3BKRYHXbCKd87UX+KcwQtcaa75xf2AR78MXEFTSln/pWEUDkTTyyi1qvV0cMs5NiAXCznDP1Itz5Jxp0H83raE5lYMreQcwrkIubb93h6+4pcVwgrnQ6o9Hjn7whEuB7UZt2Sge9fFlLYN1YPeBCLDPCXcdNQQGZdIbwFTSmipGriHO6JiGciRb+DM66KB17mZgVdFcmmQqKD3h152R9eIIrHFF0BPVQHZHiYCCBbznw+oukPEQNNA+ODto8tGKZR6ziGkLPCkmNY/mDxgGuEThc2AtlREcvDaipufwtIEcLohImpI2TAGECqL2DXhwa+L5TE/3msLA1z3IvtVjDce8BjYPEr1XEbGHHzwiwtNBC/u+w2J5BZkf2xajCHDgP4xsnpbWXnoAD9FW+ng8Ioz7GUTKOeXsjIueNpEr55l2wFvge5VyjYFD4F7H0Q+gNk4ABHDEEW7XCVJZsWWfjTtwQDhnqWZkE7unvlTLTBYuRFSIUemP3jr/DETpuQtENw30xo9I3punnasBKZXRGBQQE0WEF7jX1K9/JaHTUzJuzVsW2UDMO47ympML1M75dIvH+gKx0L0B6rOG1iu4q1UKpkZEqKkuEcwTdE+zc+EtOLi8GkhbZUyvw0PmKFDN2UCEbwKLKqZHpAAHwD31HLRgYG659xZEGErjnhXAD+khLs+bIBC+bxcx0PIRDGQW6IhZRKDdi/jE+YiC5QUDTRC8ctAByrqvn0csZYIWEExh6XYeA07s84g0vApum3EWLLucM9YmxAFQINOrIM/piRyETs/BH9YsiNJA9r/t9GpwUDuoCAfWvAdE9sMFMHB5NO8a9zP259BAF23VsYvoYDSQuT87D4EIfcT+LEd4FW2hHPsNORRC8BERXERYIuwKTnkevgd3m1CioW0FhDMij/23jjeqoL0tAO20pXIGfH/mgtrrwhb7SQw9AQa8gWxcBR8VtJ6++w+HLyDPt4XzoIcvX62+cYqB7l1o/vtcLPeA3Ef0KFwV2UBpIJuYL4LgJiKgiDh4XSQaz7O7QNwPWmxrRrgN9BERbhAHwneDkJhzuB7wenrcGv99YPhv7x9JGV04/CcT4gAAAABJRU5ErkJggg==';

export interface CompanionInfo {
  id: string;
  name: string;
  title: string;
  icon: string;
  element: string;
  badgeClass: string;
  skillName: string;
  skillDesc: string;
  lore: string;
  imageSrc?: string;
  tagline: string;
}

export const COMPANIONS: CompanionInfo[] = [
  {
    id: 'lucario',
    name: 'Lucario',
    title: 'Aura Guardian',
    icon: '🌀',
    element: 'Baja / Petarung',
    badgeClass: 'bg-sky-100 text-sky-900 border-sky-300',
    skillName: 'Bola Aura (Aura Sphere)',
    skillDesc: 'Pancaran bola konsentrasi aura biru nila berpendar dengan gelombang kejut telekinetik.',
    lore: 'Tech Guardian: Intuitive UI/UX Design & Human-Centric Frontend. Merasakan kebutuhan pengguna secara empatik dan menghadirkan interaksi digital yang memikat.',
    tagline: 'Merasakan aura kebutuhan user & UI/UX empatik',
  },
  {
    id: 'charizard',
    name: 'Charizard',
    title: 'Flame Titan',
    icon: '🔥',
    element: 'Api / Terbang',
    badgeClass: 'bg-orange-100 text-orange-950 border-orange-400',
    skillName: 'Semburan Api (Flamethrower)',
    skillDesc: 'Semburan lidah api vertikal membakar ke atas dengan getaran kamera dan percikan bara api menyala.',
    lore: 'Tech Guardian: Full-Stack Web Engineering & Scalable Cloud Apps. Menghadirkan aplikasi web modern yang cepat, tangguh, dan membakar habis setiap bug!',
    imageSrc: CHARIZARD_IMAGE_SRC,
    tagline: 'Full-Stack Web performa kilat membakar latensi',
  },
  {
    id: 'tyranitar',
    name: 'Tyranitar',
    title: 'Armor Rock',
    icon: '🪨',
    element: 'Batu / Gelap',
    badgeClass: 'bg-amber-100 text-amber-950 border-amber-400',
    skillName: 'Badai Pasir (Sandstorm)',
    skillDesc: 'Pusaran badai pasir gurun berputar tebal cokelat keemasan mengguncang tanah.',
    lore: 'Tech Guardian: Bulletproof Security, Resilient Database & Infrastructure. Kokoh bertahan dari segala lonjakan traffic dan ancaman siber!',
    imageSrc: TYRANITAR_IMAGE_SRC,
    tagline: 'Keamanan tangguh & infrastruktur basis data kokoh',
  },
  {
    id: 'garchomp',
    name: 'Garchomp',
    title: 'Mach Dragon',
    icon: '🦈',
    element: 'Naga / Tanah',
    badgeClass: 'bg-cyan-100 text-cyan-950 border-cyan-400',
    skillName: 'Tebasan Naga (Dragon Claw)',
    skillDesc: 'Tebasan cakar naga cyan supersonik tajam berkecepatan tinggi membelah rintangan.',
    lore: 'Tech Guardian: High-Speed Algorithms, Optimization & Clean Code. Bergerak secepat jet tempur supersonik mengeksekusi logika komputasi rumit!',
    imageSrc: GARCHOMP_IMAGE_SRC,
    tagline: 'Algoritma kilat & optimasi secepat jet tempur',
  },
  {
    id: 'urshifu',
    name: 'Urshifu',
    title: 'Rapid Strike',
    icon: '🌊',
    element: 'Petarung / Air',
    badgeClass: 'bg-blue-100 text-blue-950 border-blue-400',
    skillName: 'Serbuan Beruntun (G-Max Rapid Flow)',
    skillDesc: 'Aliran deras semburan wushu air samudra biru bertubi-tubi tiada henti.',
    lore: 'Tech Guardian: Agile Execution, Rapid Prototyping & Flow State UI/UX. Menghadirkan solusi kilat yang kokoh dan tepat sasaran.',
    imageSrc: URSHIFU_IMAGE_SRC,
    tagline: 'Eksekusi agile cepat & prototyping presisi tinggi',
  },
  {
    id: 'mewtwo',
    name: 'Mewtwo',
    title: 'AI Overlord',
    icon: '🔮',
    element: 'Psikis',
    badgeClass: 'bg-purple-100 text-purple-950 border-purple-400',
    skillName: 'Gelombang Psikis (Psystrike)',
    skillDesc: 'Gelombang radiasi energi psikis ungu/magenta berdenyut dengan getaran telekinetik kuat.',
    lore: 'Tech Guardian: AI Agents, LLM Orchestration & Deep Learning. Menguasai penalaran multi-agent cerdas dan otomatisasi AI melampaui komputasi biasa.',
    imageSrc: MEWTWO_IMAGE_SRC,
    tagline: 'Agen AI otonom & orchestrasi model bahasa besar',
  },
  {
    id: 'arceus',
    name: 'Arceus',
    title: 'Alpha Architect',
    icon: '✨',
    element: 'Kosmik / Multitype',
    badgeClass: 'bg-yellow-100 text-yellow-950 border-yellow-400',
    skillName: 'Cahaya Kosmik (Judgment)',
    skillDesc: 'Hujan berkas cahaya kosmik keemasan jatuh dari langit memberkati seluruh medan petualangan.',
    lore: 'Tech Guardian: Enterprise System Architecture & End-to-End Product Vision. Merancang fondasi ekosistem software menyeluruh dari rancangan arsitektur hingga produksi global.',
    imageSrc: ARCEUS_IMAGE_SRC,
    tagline: 'Arsitektur sistem menyeluruh dari nol ke skala global',
  },
  {
    id: 'dialga',
    name: 'Dialga',
    title: 'Temporal Dragon',
    icon: '⏳',
    element: 'Baja / Naga',
    badgeClass: 'bg-sky-100 text-sky-950 border-sky-400',
    skillName: 'Dentang Waktu (Roar of Time)',
    skillDesc: 'Distorsi gelombang waktu biru kristal temporal melambatkan dan mengatur latensi sistem.',
    lore: 'Tech Guardian: Time-Critical Backend, Rust/WASM & Microservices. Mengatur latensi real-time rendah dan sinkronisasi data presisi.',
    imageSrc: DIALGA_IMAGE_SRC,
    tagline: 'Backend real-time Rust/WASM dengan latensi mikrodetik',
  },
  {
    id: 'palkia',
    name: 'Palkia',
    title: 'Spatial Dragon',
    icon: '🌌',
    element: 'Air / Naga',
    badgeClass: 'bg-rose-100 text-rose-950 border-rose-400',
    skillName: 'Riak Dimensi (Spacial Rend)',
    skillDesc: 'Riak pemecah ruang merah muda mutiara kosmik menghubungkan node arsitektur terdistribusi.',
    lore: 'Tech Guardian: Spatial Computing & Distributed Cloud Infrastructure. Menghubungkan setiap simpul arsitektur awan tanpa batas dimensi.',
    imageSrc: PALKIA_IMAGE_SRC,
    tagline: 'Komputasi spasial & infrastruktur cloud terdistribusi',
  },
  {
    id: 'rayquaza',
    name: 'Rayquaza',
    title: 'Sky High Dragon',
    icon: '🐉',
    element: 'Naga / Terbang',
    badgeClass: 'bg-emerald-100 text-emerald-950 border-emerald-400',
    skillName: 'Deru Badai (Delta Stream)',
    skillDesc: 'Pusaran badai hijau zamrud ozon berputar kencang membatalkan anomali cuaca.',
    lore: 'Tech Guardian: DevOps, CI/CD Cloud Pipelines & High-Availability. Mengarungi stratosfer awan menjaga stabilitas uptime sistem 99.99%!',
    imageSrc: RAYQUAZA_IMAGE_SRC,
    tagline: 'DevOps & pipeline CI/CD dengan ketersediaan 99.99%',
  },
  {
    id: 'pikachu',
    name: 'Pikachu',
    title: 'Electric Mascot',
    icon: '⚡',
    element: 'Listrik',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
    skillName: 'Sambaran Kilat (Thunderbolt)',
    skillDesc: 'Sambaran kilat kuning keemasan memercik ceria penuh energi listrik murni.',
    lore: 'Tech Guardian: Community Engagement & Interactive Web Experiences. Maskot setia penyemangat eksplorasi di Zulfan\'s Town.',
    tagline: 'Keseruan interaktif & maskot penjelajah ramah',
  },
];

export const COMPANIONS_MAP: Record<string, CompanionInfo> = Object.fromEntries(
  COMPANIONS.map((c) => [c.id, c])
);

