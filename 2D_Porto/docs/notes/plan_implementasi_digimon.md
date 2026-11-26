# Plan Implementasi Digimon & Peta Digi-Sanctuary — Zulfan's Town (v2.0)

**Tanggal Pembaruan**: 12 November 2026  
**Branch**: `web_animasi`  
**Status**: READY FOR IMPLEMENTATION — Terintegrasi dengan Arsitektur Town Editor 2.0 & Portal `(22, 60)`

---

## Daftar Isi
1. [Ringkasan Eksekutif & Perubahan Arsitektur](#1-ringkasan-eksekutif--perubahan-arsitektur)
2. [Inventaris Aset Digimon (41 File)](#2-inventaris-aset-digimon-41-file)
3. [Analisis Format Sprite & Studi Kasus WarGreymon](#3-analisis-format-sprite--studi-kasus-wargreymon)
4. [Perbandingan Sistem: Pokémon PMD vs Digimon World DS](#4-perbandingan-sistem-pokémon-pmd-vs-digimon-world-ds)
5. [Arsitektur Peta Baru (`/digimon`) & Penghubung Koordinat `(22, 60)`](#5-arsitektur-peta-baru-digimon--penghubung-koordinat-22-60)
6. [Integrasi Penuh dengan Town Editor 2.0](#6-integrasi-penuh-dengan-town-editor-20)
7. [Kelayakan (Feasibility) & Strategi Implementasi](#7-kelayakan-feasibility--strategi-implementasi)
8. [Daftar Prioritas Implementasi Digimon (Tier 1 - Tier 4)](#8-daftar-prioritas-implementasi-digimon-tier-1---tier-4)
9. [Spesifikasi Teknis, Pipeline Python, & Struktur File](#9-spesifikasi-teknis-pipeline-python--struktur-file)
10. [Estimasi Ukuran Bundle & Performa](#10-estimasi-ukuran-bundle--performa)
11. [Roadmap Eksekusi Bertahap & Acceptance Criteria](#11-roadmap-eksekusi-bertahap--acceptance-criteria)

---

## 1. Ringkasan Eksekutif & Perubahan Arsitektur

Dokumen ini menyempurnakan draf awal dengan memisahkan ekosistem Digimon ke dalam halaman peta khusus (`/digimon` — **Digi-Sanctuary Island**) agar tidak memenuhi tata letak kota utama (**Zulfan's Town**), sekaligus memanfaatkan **Town Editor** untuk penempatan karakter secara visual:

1. **Penghubung Dua Arah di Koordinat `(22, 60)`**: Menempatkan *Digital Warp Gate* di ujung selatan jalan utama Zulfan's Town `(22, 60)` yang membawa pemain ke `/digimon`, lengkap dengan titik kembali (*return spawn*) otomatis di `(22, 58)` saat keluar dari dunia Digimon.
2. **Penempatan Mandiri via Town Editor (Zero Hardcoded Digimon)**: Peta `/digimon` dibangun kosong tanpa Digimon yang di-*hardcode*. Seluruh Digimon didaftarkan ke dalam katalog **Tambah Objek (`#town-editor-spawn-modal`)** pada kategori **`Dunia Digimon`** sehingga pemilik web dapat melakukan *spawn*, *drag-and-drop*, dan menyimpan posisi langsung ke `src/data/digimonLayout.json` (`Ctrl+S`).
3. **Pemanfaatan Maksimal Seluruh Bagian Spritesheet**:
   - **Sprite Overworld Kecil (24-40px)**: Digunakan sebagai karakter Digimon di atas petak peta `/digimon`.
   - **Sprite Battle Besar (100-200px)**: Ditampilkan secara interaktif di dalam **Modal Showcase DigiDex** (animasi *idle* 3 *frame* + tombol *Trigger Signature Attack* 2 *frame*) saat pengunjung mengklik Digimon di peta.
   - **Ikon Kepala Mini**: Digunakan sebagai *thumbnail* di katalog Town Editor dan indikator *Mini-Map*.

---

## 2. Inventaris Aset Digimon (41 File)

- **Lokasi Folder Sumber**: `public/assets/Digimon/`
- **Total File**: 41 file PNG (40 Mega Digimon + 1 Ultimate Digimon)
- **Sumber Aset**: *Digimon World DS* (Nintendo DS/DSi) — *Spritesheet Rip*

### Tabel Inventaris Lengkap & Karakteristik Warna Latar
| No | Nama Digimon | Level | Dimensi ($\text{px}$) | Ukuran | Warna Latar Dominan | Rekomendasi Zona Habitat |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Azulongmon | Mega | $800 \times 476$ | 229 KB | Teal / Hijau | Cyber & Sky Sanctuary |
| 2 | Baihumon | Mega | $890 \times 422$ | 65 KB | Teal / Hijau | Cyber & Steel Dome |
| 3 | Barbamon | Mega | $913 \times 513$ | 68 KB | Teal / Hijau | Flame & Dark Canyon |
| 4 | Beelzemon | Mega | $649 \times 390$ | 37 KB | Teal (`#00A8A8`) | Flame & Dark Canyon |
| 5 | Belphemon | Mega | $867 \times 486$ | 109 KB | Teal / Hijau | Flame & Dark Canyon |
| 6 | BlackImperialdramon | Mega | $403 \times 357$ | 56 KB | Teal / Hijau | Flame & Dragon Canyon |
| 7 | BlackMegaGargomon | Mega | $530 \times 469$ | 83 KB | Teal / Hijau | Cyber & Steel Dome |
| 8 | BlackWarGreymon | Mega | $405 \times 462$ | 48 KB | Teal + Kotak Hijau | Flame & Dragon Canyon |
| 9 | Cannondramon | Mega | $558 \times 416$ | 77 KB | Teal / Hijau | Cyber & Steel Dome |
| 10 | ChaosGallantmon | Mega | $749 \times 172$ | 35 KB | Magenta (`#FF00FF`) | Flame & Dark Canyon |
| 11 | Chronomon DM | Mega | $850 \times 417$ | 98 KB | Teal / Hijau | Central Digi-Plaza |
| 12 | Crossmon | Mega | $647 \times 169$ | 32 KB | Magenta (`#FF00FF`) | Verdant & Holy Sanctuary |
| 13 | Darkdramon | Mega | $595 \times 238$ | 50 KB | Magenta (`#FF00FF`) | Cyber & Steel Dome |
| 14 | Dorugoramon | Mega | $558 \times 401$ | 80 KB | Teal / Hijau | Flame & Dragon Canyon |
| 15 | Gallantmon | Mega | $749 \times 172$ | 35 KB | Magenta (`#FF00FF`) | Verdant & Holy Sanctuary |
| 16 | Gallantmon Crimson Mode | Mega | $733 \times 186$ | 45 KB | Magenta (`#FF00FF`) | Verdant & Holy Sanctuary |
| 17 | Granlocomon | Mega | $892 \times 398$ | 48 KB | Teal / Hijau | Cyber & Steel Dome |
| 18 | GuardiAngemon | Mega | $610 \times 187$ | 33 KB | Magenta (`#FF00FF`) | Verdant & Holy Sanctuary |
| 19 | HerculesKabuterimon | Mega | $800 \times 210$ | 56 KB | Magenta (`#FF00FF`) | Verdant & Holy Sanctuary |
| 20 | Imperialdramon Dragon Mode | Mega | $418 \times 382$ | 60 KB | Teal / Hijau | Flame & Dragon Canyon |
| 21 | Imperialdramon Fighter Mode | Mega | $600 \times 471$ | 73 KB | Teal (`#00A8A8`) | Central Digi-Plaza |
| 22 | Imperialdramon Paladin Mode | Mega | $313 \times 466$ | 54 KB | Teal (`#00A8A8`) | Verdant & Holy Sanctuary |
| 23 | Kentaurosmon | Mega | $850 \times 243$ | 69 KB | Magenta (`#FF00FF`) | Verdant & Holy Sanctuary |
| 24 | Machinedramon | Mega | $601 \times 382$ | 39 KB | Teal + Kotak Hijau | Cyber & Steel Dome |
| 25 | MaloMyotismon | Mega | $707 \times 359$ | 42 KB | Teal / Hijau | Flame & Dark Canyon |
| 26 | MegaGargomon | Mega | $506 \times 474$ | 74 KB | Teal / Hijau | Cyber & Steel Dome |
| 27 | MetalSeadramon | Mega | $498 \times 518$ | 44 KB | Teal / Hijau | Aqua & Cryo Bay |
| 28 | Neptunemon | Mega | $647 \times 422$ | 57 KB | Teal / Hijau | Aqua & Cryo Bay |
| 29 | Omnimon | Mega | $656 \times 233$ | 38 KB | Magenta (`#FF00FF`) | Central Digi-Plaza |
| 30 | Phoenixmon | Mega | $513 \times 361$ | 57 KB | Teal / Hijau | Verdant & Holy Sanctuary |
| 31 | Plesiomon | Mega | $412 \times 375$ | 45 KB | Teal / Hijau | Aqua & Cryo Bay |
| 32 | Sakuyamon | Mega | $417 \times 384$ | 45 KB | Teal (`#00A8A8`) | Verdant & Holy Sanctuary |
| 33 | Seraphimon | Mega | $506 \times 334$ | 34 KB | Teal (`#00A8A8`) | Verdant & Holy Sanctuary |
| 34 | Valkyrimon | Mega | $510 \times 334$ | 26 KB | Teal / Hijau | Verdant & Holy Sanctuary |
| 35 | Varodurumon | Mega | $526 \times 358$ | 45 KB | Teal / Hijau | Verdant & Holy Sanctuary |
| 36 | VenomMyotismon | Mega | $398 \times 408$ | 68 KB | Teal / Hijau | Flame & Dark Canyon |
| 37 | Vikemon | Mega | $696 \times 422$ | 58 KB | Teal / Hijau | Aqua & Cryo Bay |
| 38 | WarGreymon | Mega | $408 \times 518$ | 32 KB | Teal (`#008080`) + Hijau (`#4CA048`) | Flame & Dragon Canyon |
| 39 | WarGreymon (1) *(Duplikat)* | Mega | $408 \times 518$ | 32 KB | Teal + Hijau | *(Hapus file duplikat ini)* |
| 40 | Zhuqiaomon | Mega | $1179 \times 521$ | 90 KB | Teal / Hijau | Flame & Dragon Canyon |
| 41 | RizeGreymon | Ultimate | $602 \times 462$ | 48 KB | Teal + Kotak Hijau | Flame & Dragon Canyon |

---

## 3. Analisis Format Sprite & Studi Kasus WarGreymon

Berdasarkan pembedahan visual terhadap `DS _ DSi - Digimon World DS - Mega Digimon - WarGreymon.png` ($408 \times 518\text{ px}$), lembaran sprite memiliki **4 kelompok komponen visual** di atas latar ganda (Teal luar `#008080` dan Kotak Hijau `#4CA048`):

```text
+-------------------------------------------------------------------+
| [Icon Kepala 28x28]                         (Latar Luar: #008080) |
|                                                                   |
|  +-------------------+ +-------------------+ +-----------------+  |
|  |   IDLE FRAME 1    | |   IDLE FRAME 2    | |  IDLE FRAME 3   |  |
|  |  (Battle Stance)  | |  (Breathing Mid)  | | (Breathing Low) |  |
|  |  Latar: #4CA048   | |  Latar: #4CA048   | |  Latar: #4CA048 |  |
|  +-------------------+ +-------------------+ +-----------------+  |
|                                                                   |
|  +-------------------+ +-------------------+                      |
|  |  ATTACK FRAME 1   | |  ATTACK FRAME 2   |                      |
|  | (Terra Force Up)  | | (Dramon Dive/Hit) |                      |
|  +-------------------+ +-------------------+                      |
|                                                                   |
|  +----+ +----+ +----+ +----+ +----+ +----+ +----+ +----+ +----+   |
|  |OW 1| |OW 2| |OW 3| |OW 4| |OW 5| |OW 6| |OW 7| |OW 8| |OW 9|   |
|  |Back| |Back| |Back| |Frnt| |Walk| |Walk| |Idle| |Atk1| |Atk2|   |
|  +----+ +----+ +----+ +----+ +----+ +----+ +----+ +----+ +----+   |
|  Ripped by A.J. Nitro & Dazz. Give credit if used.                |
+-------------------------------------------------------------------+
```

### Pemetaan Pemanfaatan ke Dalam Engine Portofolio
1. **Pojok Kiri Atas (Mini Mugshot Icon)**: Dipotong untuk *avatar* di daftar **DigiDex**, *Mini-Map pin*, dan kartu *spawner* di **Town Editor**.
2. **Baris 1 (3 Kotak Besar — Battle Idle)**: Diputar berulang (~6 FPS) pada kanvas pratinjau ketika pengunjung membuka **Modal Showcase DigiDex**.
3. **Baris 2 (2 Kotak Besar — Battle Attack)**: Diputar saat pengunjung menekan tombol **"Trigger Signature Attack"** di dalam Modal DigiDex.
4. **Baris Bawah (9 Kotak Kecil — Overworld)**: Digunakan untuk menggambar karakter Digimon di atas petak peta `/digimon` (ukuran proporsional ~32-42px setara ~2x2 petak).

---

## 4. Perbandingan Sistem: Pokémon PMD vs Digimon World DS

| Aspek Teknis | Pokémon (PMD Mystery Dungeon) | Digimon (Digimon World DS) |
| :--- | :--- | :--- |
| **Struktur Spritesheet** | Grid seragam 8 baris $\times$ $N$ kolom | Ukuran dan posisi kotak bervariasi per Digimon |
| **File Metadata** | Memiliki `AnimData.xml` (`frameWidth`, `durations`, `anchor`) | Tidak ada XML; membutuhkan definisi koordinat kotak (`boundingBox`) |
| **Arah Hadap Overworld** | 8 Arah penuh (termasuk diagonal) | 4 Arah dasar atau *Idle/Walk/Action* hadap depan-samping |
| **Warna Transparansi** | Transparan bawaan (PNG Alpha) | Latar warna solid (Teal `#008080`/`#00A8A8`, Magenta `#FF00FF`, Hijau `#4CA048`) |
| **Controller Engine** | `PokemonPMDAnimator` | `DigimonAnimator` + `digiSpriteLoader` (Auto Chroma-Key) |

---

## 5. Arsitektur Peta Baru (`/digimon`) & Penghubung Koordinat `(22, 60)`

Agar kota utama (`Zulfan's Town`) tetap rapi dengan estetika Pokémon Sinnoh/Unova, koleksi Digimon ditempatkan di rute halaman baru **`/digimon`** yang terhubung langsung dari koordinat **`(22, 60)`**.

### 5.1 Spesifikasi Gerbang Penghubung di Kota Utama (`/`)
- **Titik Koordinat Portal**: Petak **`(22, 60)`** (dengan lebar koridor jalan di `(21, 60)` hingga `(23, 60)`) tepat di ujung selatan *Central Boulevard*.
- **Visual Pixel-Art (`townBackground.ts` & `TownEngine.ts`)**:
  - Menggambar **Digital Warp Pad** berukuran $3 \times 2$ petak (`X: 21..23, Y: 59..60`) berupa pijakan heksagonal logam gelap dengan cincin matriks sian (`#00f0ff`) dan emas (`#fbbf24`) yang berdenyut, diapit 2 pilar siber di `(21, 60)` dan `(23, 60)`.
  - Memancarkan efek cahaya (*radial halo*) biru-sian saat mode *Sunset/Night* aktif.
- **Mekanika Transisi & Return Spawn**:
  - Menginjak petak `(21..23, 60)` atau mengklik tombol label mengambang **`👾 Digi-World`** di `(22, 60.2)` akan mengarahkan pemain ke `/digimon`.
  - Saat pemain kembali dari `/digimon` menuju `/?from=digimon`, karakter otomatis di-*spawn* di koordinat **`(22, 58)`** menghadap ke utara (`up`).

### 5.2 Tata Letak Peta Baru `/digimon` ("Digi-Sanctuary Island" — $40 \times 45$ Petak)
Peta berukuran $40 \times 45$ petak ($16\text{ px}$/petak = $640 \times 720\text{ px}$) dibagi menjadi **1 Plaza Pusat** dan **4 Zona Habitat Elemen** yang dihubungkan oleh jembatan siber (*Cyber Bridges*):

```text
          0         10        20        30        40
        0 +----------------------------------------+
          |   [HUTAN DATA & TEBING SIBER UTARA]    |
        3 |        +----------------------+        |
          |        |  RETURN GATE (20, 4) |        | -> Kembali ke Town (22, 58)
        6 |   +----+----------+-----------+----+   |
          |   | ZONA 1:       | ZONA 2:        |   |
       12 |   | FLAME &       | CYBER &        |   |
          |   | DRAGON CANYON | STEEL DOME     |   |
       17 |   +-------+-------+--------+-------+   |
       20 |           |  CENTRAL       |           |
          |   ========+  DIGI-PLAZA &  +========   |
       24 |           |  DIGIDEX HUB   |           |
       27 |   +-------+-------+--------+-------+   |
          |   | ZONA 3:       | ZONA 4:        |   |
       33 |   | AQUA &        | VERDANT &      |   |
          |   | CRYO BAY      | HOLY SANCTUARY |   |
       40 |   +---------------+----------------+   |
       44 +----------------------------------------+
```

1. **North Return Gate (`X: 19..21, Y: 3..5`)**: Portal kembali ke `/?from=digimon`. Titik *spawn* awal pemain di `/digimon` berada di `(20, 6)` menghadap selatan.
2. **Central Digi-Plaza (`X: 15..25, Y: 18..26`)**: Lantai heksagonal siber tempat terminal pusat **DigiDex Master Console** berada.
3. **Zona 1 — Flame & Dragon Canyon (`X: 4..16, Y: 7..17`)**: Bebatuan vulkanik merah-gelap, retakan magma, dan pedestal batu untuk Digimon bertipe *Dragon/Fire/Dark* (WarGreymon, BlackWarGreymon, Beelzemon, Zhuqiaomon).
4. **Zona 2 — Cyber & Steel Dome (`X: 24..36, Y: 7..17`)**: Lantai sirkuit logam biru-gelap dan garis grid neon untuk Digimon bertipe *Machine/Cyborg* (Machinedramon, MegaGargomon, Baihumon, Darkdramon).
5. **Zona 3 — Aqua & Cryo Bay (`X: 4..16, Y: 27..38`)**: Laguna air kristal dan dermaga es untuk Digimon elemen air/es (MetalSeadramon, Neptunemon, Plesiomon, Vikemon).
6. **Zona 4 — Verdant & Holy Sanctuary (`X: 24..36, Y: 27..38`)**: Taman rumput zamrud, pohon sakura digital, dan pilar marmer putih untuk Digimon tipe *Holy/Royal Knight/Nature* (Gallantmon, Seraphimon, Sakuyamon, Phoenixmon).

---

## 6. Integrasi Penuh dengan Town Editor 2.0

Sesuai keputusan desain, **tidak ada Digimon yang dipasang secara hardcode di dalam kode peta**. Seluruh penempatan dilakukan oleh pemilik web menggunakan **Town Editor 2.0**:

1. **Penyimpanan Disk Terpisah (`src/data/digimonLayout.json`)**:
   - Memperbarui endpoint middleware Vite di `astro.config.mjs` (`POST /api/dev/save-town`) agar menerima properti `target: 'town' | 'digimon'`.
   - Menekan **`💾 Simpan` (`Ctrl+S`)** saat berada di halaman `/digimon` akan menulis langsung ke `src/data/digimonLayout.json`.
2. **Kategori Grup Baru di Katalog Spawner (`townConfig.ts`)**:
   - Menambahkan grup `digimon: { id: 'digimon', label: 'Dunia Digimon', icon: '👾', defaultKind: 'digimon' }` ke dalam `EDITOR_CATEGORY_META` dan `SPAWNABLE_CATALOG_GROUPS`.
3. **Kuas Lantai Tema Digital World (`TileTypeKey`)**:
   - Menambahkan 4 kuas lantai baru di palet editor: `cyber_grid` (Lantai Siber), `lava_rock` (Batu Vulkanik), `cryo_ice` (Lantai Kristal Es), dan `holy_marble` (Marmer Suci).
4. **Dukungan Penuh Shortcut Town Editor 2.0 di `/digimon`**:
   - Tombol `E` (Toggle Editor), `1/2/3` (Ukuran Kuas), `L` (Line Tool), `R` (Rect Fill / Rotasi Arah Hadap Digimon), `B` (Flood Fill), `Ctrl+D` / `Alt+Drag` (Duplikasi), `Shift+Klik` (Multi-Select), `C` (Collision Inspector), dan `P` (Instant Playtest).

---

## 7. Kelayakan (Feasibility) & Strategi Implementasi

### Evaluasi Metode
| Fitur | Metode Teknis | Tingkat Usaha | Status Rekomendasi |
| :--- | :--- | :--- | :--- |
| **A. Auto Chroma-Key & Box Detector** | Deteksi kotak hijau/magenta & hapus latar di `digiSpriteLoader.ts` / Python | Rendah | **Direkomendasikan (Utama)** |
| **B. Overworld Idle/Walk di Peta `/digimon`** | Render *frame* kecil baris bawah (24-40px) di kanvas peta | Rendah - Sedang | **Direkomendasikan (Fase 1-2)** |
| **C. Interactive DigiDex Modal (Battle Pose)** | Render *frame* besar (100-180px) untuk animasi *Idle* & tombol *Attack* | Sedang | **Direkomendasikan (Fase 2)** |
| **D. Integrasi Spawner Town Editor 2.0** | Registrasi template `tpl_digi_*` ke `SPAWNABLE_CATALOG_GROUPS` | Rendah | **Direkomendasikan (Fase 1)** |
| **E. Animasi 8-Arah Otomatis ala PMD** | Membutuhkan 8 baris $\times$ $N$ kolom + `AnimData.xml` | Tidak Layak | **Ditolak (Aset hanya mendukung 4 arah/pose)** |

---

## 8. Daftar Prioritas Implementasi Digimon (Tier 1 - Tier 4)

### Tier 1 — 5 Digimon Ikonik Utama (Target MVP Awal)
| No | ID (`subType`) | Nama Digimon | Level | Atribut | Jurus Khas (*Signature Move*) | File Sumber |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `wargreymon` | **WarGreymon** | Mega | Vaccine | Terra Force & Great Tornado | `... - WarGreymon.png` |
| 2 | `omnimon` | **Omnimon** | Mega | Vaccine | Transcendent Sword & Garuru Cannon | `... - Omnimon.png` |
| 3 | `gallantmon` | **Gallantmon** | Mega | Virus | Lightning Joust & Shield of the Just | `... - Gallantmon.png` |
| 4 | `imp_fighter` | **Imperialdramon FM** | Mega | Free | Positron Laser & Giga Crusher | `... - Imperialdramon Fighter Mode.png` |
| 5 | `beelzemon` | **Beelzemon** | Mega | Virus | Double Impact & Darkness Claw | `... - Beelzemon.png` |

### Tier 2 — 5 Digimon Populer & Royal Knights / Crest Utama
| No | ID (`subType`) | Nama Digimon | Level | Atribut | Jurus Khas (*Signature Move*) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 6 | `blackwargreymon` | **BlackWarGreymon** | Mega | Virus | Terra Destroyer & Black Tornado |
| 7 | `seraphimon` | **Seraphimon** | Mega | Vaccine | Strike of the Seven Stars |
| 8 | `sakuyamon` | **Sakuyamon** | Mega | Data | Spirit Strike & Amethyst Mandala |
| 9 | `gallantmon_cm` | **Gallantmon Crimson Mode** | Mega | Virus | Quo Vadis & Invincible Sword |
| 10 | `machinedramon` | **Machinedramon** | Mega | Virus | Infinity Cannon |

### Tier 3 — 7 Digimon Adventure Partners & Dark Masters / Bosses
| No | ID (`subType`) | Nama Digimon | Kategori / Kelompok |
| :--- | :--- | :--- | :--- |
| 11 | `metalseadramon` | **MetalSeadramon** | Dark Masters (Aqua & Cryo Bay) |
| 12 | `phoenixmon` | **Phoenixmon** | Adventure Partner (Verdant & Holy Sanctuary) |
| 13 | `vikemon` | **Vikemon** | Adventure Partner (Aqua & Cryo Bay) |
| 14 | `herculeskabuterimon` | **HerculesKabuterimon** | Adventure Partner (Verdant & Holy Sanctuary) |
| 15 | `megagargomon` | **MegaGargomon** | Tamers Partner (Cyber & Steel Dome) |
| 16 | `malomyotismon` | **MaloMyotismon** | 02 Final Boss (Flame & Dark Canyon) |
| 17 | `venommyotismon` | **VenomMyotismon** | Adventure Boss (Flame & Dark Canyon) |

### Tier 4 — 23 Digimon Sovereign, Demon Lords, & Koleksi Pelengkap
| Kelompok | Daftar Digimon |
| :--- | :--- |
| **Digimon Sovereign (Deva/Holy Beasts)** | Azulongmon (Timur), Baihumon (Barat), Zhuqiaomon (Selatan) |
| **Imperialdramon Line** | Imperialdramon Dragon Mode, Imperialdramon Paladin Mode, BlackImperialdramon |
| **Seven Great Demon Lords** | Barbamon, Belphemon |
| **Royal Knights & Holy** | Kentaurosmon, GuardiAngemon, Valkyrimon, Varodurumon, Crossmon |
| **Machine, Dragon & Deep Savers** | ChaosGallantmon, Chronomon DM, Darkdramon, Dorugoramon, Cannondramon, Granlocomon, BlackMegaGargomon, Neptunemon, Plesiomon, RizeGreymon (Ultimate) |

---

## 9. Spesifikasi Teknis, Pipeline Python, & Struktur File

### 9.1 Peta File Baru & Modifikasi
```text
2D_Porto/
├── scripts/
│   └── process_digimon_sprites.py   <-- Skrip Pure Python (zlib+struct) pemotong & penghapus background
├── src/
│   ├── data/
│   │   ├── townLayout.json          <-- Data tata letak Zulfan's Town (existing)
│   │   └── digimonLayout.json       <-- Data tata letak baru khusus halaman /digimon
│   ├── engine/
│   │   ├── digiMap.ts               <-- Grid 40x45, collision, & 5 zona habitat /digimon
│   │   ├── digiBackground.ts        <-- Renderer prosedural pulau siber, jembatan, & 4 zona elemen
│   │   ├── DigiWorldEngine.ts       <-- Loop utama /digimon + integrasi TownEditor + modal DigiDex
│   │   ├── digiSpriteLoader.ts      <-- Loader spritesheet + auto chroma-key + frame slicer
│   │   └── digimonCatalog.ts        <-- Metadata lengkap Digimon (lore, stage, attribute, frame boxes)
│   └── pages/
│       └── digimon.astro            <-- Halaman interaktif /digimon lengkap dengan UI Town Editor 2.0
```

### 9.2 Kontrak Tipe Data (`src/engine/digimonCatalog.ts`)
```typescript
export interface SpriteBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface DigimonCatalogEntry {
  id: string;                  // contoh: 'wargreymon'
  name: string;                // contoh: 'WarGreymon'
  stage: 'Ultimate' | 'Mega' | 'Ultra';
  attribute: 'Vaccine' | 'Data' | 'Virus' | 'Free';
  elementZone: 'flame' | 'cyber' | 'aqua' | 'holy' | 'plaza';
  signatureMove: string;       // contoh: 'Terra Force & Dramon Killer'
  lore: string;                // Deskripsi singkat di modal DigiDex
  credit: string;              // contoh: 'Ripped by A.J. Nitro & Dazz'
  spriteSheetUrl: string;      // contoh: '/assets/Digimon/DS _ DSi - Digimon World DS - Mega Digimon - WarGreymon.png'
  // Koordinat hasil deteksi otomatis atau definisi presisi:
  iconBox?: SpriteBox;
  largeIdleBoxes?: SpriteBox[];
  largeAttackBoxes?: SpriteBox[];
  overworldBoxes?: SpriteBox[];
}
```

### 9.3 Pipeline Pemrosesan Sprite (Hybrid: Runtime Canvas + Pure Python Script)
Untuk menangani ketiga jenis latar belakang (`#008080`/`#00A8A8` Teal, `#4CA048`/`#00B800` Hijau, dan `#FF00FF` Magenta), digunakan algoritma **Multi-Key Chroma Transparency**:
1. **Runtime Offscreen Canvas (`digiSpriteLoader.ts`)**:
   - Memindai piksel latar di tepi gambar `(0, 0)` (warna latar luar) serta mendeteksi kotak-kotak berlatar hijau/magenta di dalamnya.
   - Mengubah piksel latar belakang menjadi `alpha = 0` secara otomatis di *memory canvas* dengan `imageSmoothingEnabled = false`.
2. **Pre-processing Script Opsional (`scripts/process_digimon_sprites.py`)**:
   - Menggunakan modul bawaan Python (`zlib` dan `struct`) untuk mengekstrak *frame overworld* dan *battle pose* ke dalam `public/assets/digimon-processed/` apabila diperlukan optimasi ukuran unduhan di masa mendatang.

---

## 10. Estimasi Ukuran Bundle & Performa

| Komponen | Ukuran per Item | Total (5 Digimon Tier 1) | Total (20 Digimon) | Dampak Performa |
| :--- | :--- | :--- | :--- | :--- |
| **Aset PNG di `public/assets/Digimon/`** | 32 - 73 KB | ~255 KB (Lazy-loaded) | ~1.1 MB (Lazy-loaded) | **Nol pada halaman utama `/`** (hanya dimuat saat membuka `/digimon`) |
| **Metadata `digimonCatalog.ts`** | ~0.5 KB | ~2.5 KB | ~10 KB | Sangat ringan |
| **Layout `src/data/digimonLayout.json`** | ~0.15 KB / objek | ~2 KB | ~6 KB | Instan |
| **Offscreen Background Cache (`digiBackground.ts`)** | $640 \times 720\text{ px}$ | 1 Canvas di RAM | 1 Canvas di RAM | 60 FPS stabil + fitur *sleep-when-idle* |

*Keunggulan pemisahan ke rute `/digimon`*: Beban *bundle* dan memori pada halaman utama Zulfan's Town (`/`) **tidak bertambah sama sekali** karena seluruh *spritesheet* Digimon hanya diunduh ketika pengunjung masuk ke gerbang `(22, 60)` menuju `/digimon`.

---

## 11. Roadmap Eksekusi Bertahap & Acceptance Criteria

### Fase 1: Gerbang `(22, 60)` + Peta Kosong `/digimon` + Integrasi Town Editor 2.0
- [ ] Buka akses jalan dan *warp trigger* di koordinat `(22, 60)` pada `src/engine/map.ts`.
- [ ] Gambar *Digital Warp Pad* di `(22, 60)` (`townBackground.ts`) beserta tombol label `👾 Digi-World` dan *return spawn* di `(22, 58)`.
- [ ] Bangun halaman `/digimon` (`40x45` petak) dengan *North Return Gate* `(20, 4)`, *Central Digi-Plaza*, dan 4 zona habitat elemen (kosong tanpa Digimon bawaan).
- [ ] Hubungkan **Town Editor 2.0** di `/digimon` dengan target penyimpanan `src/data/digimonLayout.json` (`Ctrl+S`).

### Fase 2: Katalog Spawner Tier 1 & Auto Sprite Slicer (`digiSpriteLoader.ts`)
- [ ] Buat `digiSpriteLoader.ts` yang otomatis mendeteksi kotak *frame* dan menghapus warna latar Teal/Hijau/Magenta.
- [ ] Daftarkan 5 Digimon **Tier 1** (*WarGreymon, Omnimon, Gallantmon, Imperialdramon FM, Beelzemon*) ke dalam kategori **`👾 Dunia Digimon`** pada modal **Tambah Objek** di Town Editor.
- [ ] Pengguna dapat memilih Digimon dari Town Editor, menaruhnya di zona mana pun pada peta `/digimon`, dan menyimpannya ke `digimonLayout.json`.

### Fase 3: Interactive DigiDex Showcase Modal (Battle Pose & Attack Animation)
- [ ] Saat pengunjung mengklik Digimon yang telah ditempatkan di peta `/digimon`, tampilkan **Modal DigiDex Showcase**.
- [ ] Putar animasi 3 *frame* pose besar (*Battle Idle*) dan sediakan tombol **"⚡ Trigger Signature Attack"** untuk memainkan 2 *frame* pose serangan besar.

### Fase 4: Ekspansi Tier 2 - Tier 4 & Animasi Patroli Overworld
- [ ] Tambahkan Digimon Tier 2 hingga Tier 4 ke dalam `digimonCatalog.ts`.
- [ ] Tambahkan opsi patroli/jalan 4 arah (`DigimonAnimator`) dan sistem *Digimon Companion* yang bisa mengikuti pemain berkeliling peta `/digimon`.