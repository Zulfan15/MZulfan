# 🔷 Plan Implementasi Digimon — Zulfan's Town

> **Tanggal**: 12 November 2026
> **Branch**: `web_animasi`
> **Status**: 📋 DRAFT — Belum Diimplementasikan

---

## 📑 Daftar Isi

1. [Inventaris Aset Digimon](#1-inventaris-aset-digimon)
2. [Analisis Format Sprite](#2-analisis-format-sprite)
3. [Perbandingan dengan Sistem Pokémon PMD](#3-perbandingan-dengan-sistem-pokémon-pmd)
4. [Kelayakan Implementasi (Feasibility)](#4-kelayakan-implementasi-feasibility)
5. [Strategi Implementasi](#5-strategi-implementasi)
6. [Prioritas Digimon](#6-prioritas-digimon)
7. [Langkah Teknis & Arsitektur Kode](#7-langkah-teknis--arsitektur-kode)
8. [Estimasi Ukuran & Performa](#8-estimasi-ukuran--performa)
9. [Roadmap Fase](#9-roadmap-fase)

---

## 1. Inventaris Aset Digimon

Folder: `public/assets/Digimon/`
**Total**: 41 file PNG (40 Mega Digimon + 1 Ultimate Digimon)
**Sumber**: Digimon World DS (Nintendo DS/DSi) — sprite rip

### Daftar Lengkap

| No | Nama Digimon                  | Level    | Dimensi (px)  | Ukuran File |
|----|-------------------------------|----------|---------------|-------------|
| 1  | Azulongmon                    | Mega     | 800 × 476     | 229 KB      |
| 2  | Baihumon                      | Mega     | 890 × 422     | 65 KB       |
| 3  | Barbamon                      | Mega     | 913 × 513     | 68 KB       |
| 4  | Beelzemon                     | Mega     | 649 × 390     | 37 KB       |
| 5  | Belphemon                     | Mega     | 867 × 486     | 109 KB      |
| 6  | BlackImperialdramon           | Mega     | 403 × 357     | 56 KB       |
| 7  | BlackMegaGargomon             | Mega     | 530 × 469     | 83 KB       |
| 8  | BlackWarGreymon               | Mega     | 405 × 462     | 48 KB       |
| 9  | Cannondramon                  | Mega     | 558 × 416     | 77 KB       |
| 10 | ChaosGallantmon               | Mega     | 749 × 172     | 35 KB       |
| 11 | Chronomon DM                  | Mega     | 850 × 417     | 98 KB       |
| 12 | Crossmon                      | Mega     | 647 × 169     | 32 KB       |
| 13 | Darkdramon                    | Mega     | 595 × 238     | 50 KB       |
| 14 | Dorugoramon                   | Mega     | 558 × 401     | 80 KB       |
| 15 | Gallantmon                    | Mega     | 749 × 172     | 35 KB       |
| 16 | Gallantmon Crimson Mode       | Mega     | 733 × 186     | 45 KB       |
| 17 | Granlocomon                   | Mega     | 892 × 398     | 48 KB       |
| 18 | GuardiAngemon                 | Mega     | 610 × 187     | 33 KB       |
| 19 | HerculesKabuterimon           | Mega     | 800 × 210     | 56 KB       |
| 20 | Imperialdramon Dragon Mode    | Mega     | 418 × 382     | 60 KB       |
| 21 | Imperialdramon Fighter Mode   | Mega     | 600 × 471     | 73 KB       |
| 22 | Imperialdramon Paladin Mode   | Mega     | 313 × 466     | 54 KB       |
| 23 | Kentaurosmon                  | Mega     | 850 × 243     | 69 KB       |
| 24 | Machinedramon                 | Mega     | 601 × 382     | 39 KB       |
| 25 | MaloMyotismon                 | Mega     | 707 × 359     | 42 KB       |
| 26 | MegaGargomon                  | Mega     | 506 × 474     | 74 KB       |
| 27 | MetalSeadramon                | Mega     | 498 × 518     | 44 KB       |
| 28 | Neptunemon                    | Mega     | 647 × 422     | 57 KB       |
| 29 | Omnimon                       | Mega     | 656 × 233     | 38 KB       |
| 30 | Phoenixmon                    | Mega     | 513 × 361     | 57 KB       |
| 31 | Plesiomon                     | Mega     | 412 × 375     | 45 KB       |
| 32 | Sakuyamon                     | Mega     | 417 × 384     | 45 KB       |
| 33 | Seraphimon                    | Mega     | 506 × 334     | 34 KB       |
| 34 | Valkyrimon                    | Mega     | 510 × 334     | 26 KB       |
| 35 | Varodurumon                   | Mega     | 526 × 358     | 45 KB       |
| 36 | VenomMyotismon                | Mega     | 398 × 408     | 68 KB       |
| 37 | Vikemon                       | Mega     | 696 × 422     | 58 KB       |
| 38 | WarGreymon                    | Mega     | 408 × 518     | 32 KB       |
| 39 | WarGreymon (duplikat)         | Mega     | 408 × 518     | 32 KB       |
| 40 | Zhuqiaomon                    | Mega     | 1179 × 521    | 90 KB       |
| 41 | RizeGreymon                   | Ultimate | 602 × 462     | 48 KB       |

> **Catatan**: WarGreymon memiliki 2 file identik (duplikat). File `(1)` bisa dihapus.

---

## 2. Analisis Format Sprite

### Struktur Sprite Sheet Digimon World DS

Setelah analisis visual terhadap seluruh 41 sprite sheet, ditemukan **pola konsisten**:

```
┌─────────────────────────────────────────────────────────┐
│  AREA UTAMA: Sprite Battle Besar (100-200px per pose)   │
│                                                         │
│  ┌────────┐  ┌────────┐  ┌────────┐                     │
│  │ Pose 1 │  │ Pose 2 │  │ Pose 3 │  ← Idle/Stance     │
│  │ (Front)│  │ (Front)│  │ (Side) │                     │
│  └────────┘  └────────┘  └────────┘                     │
│  ┌────────┐  ┌────────┐  ┌────────┐                     │
│  │ Pose 4 │  │ Pose 5 │  │ Pose 6 │  ← Attack/Special  │
│  │ (Atk1) │  │ (Atk2) │  │ (Back) │                     │
│  └────────┘  └────────┘  └────────┘                     │
│                                                         │
│  ┌──────────────────────┐  ┌───────────────────────┐    │
│  │ AREA KECIL: Overworld│  │ Teks Atribusi/Credit  │    │
│  │ ┌──┐┌──┐┌──┐┌──┐    │  │ "Ripped by ..."       │    │
│  │ │↓ ││→ ││↑ ││← │    │  │ "Credit is not req."  │    │
│  │ └──┘└──┘└──┘└──┘    │  └───────────────────────┘    │
│  │ ~24-40px per frame   │                               │
│  └──────────────────────┘                               │
└─────────────────────────────────────────────────────────┘
```

### Karakteristik Utama

| Fitur                     | Detail                                                                    |
|---------------------------|---------------------------------------------------------------------------|
| **Layout**                | Tidak terstruktur/grid — pose-pose disusun manual oleh ripper             |
| **Background**            | Solid color: Teal (`#00A8A8`~), Magenta (`#FF00FF`), atau Hijau (`#00B800`~) |
| **Sprite Battle (Besar)** | 5-6 pose × 100-200px — idle, stance, attack, special, back view          |
| **Sprite Overworld (Kecil)** | 4-12 frame × ~24-40px — biasanya 4 arah (↓→↑←) + walk cycle frame    |
| **Teks Atribusi**         | Baked-in text overlay (bukan layer terpisah) — "Ripped by Dazz", etc.    |
| **Metadata**              | ❌ Tidak ada `AnimData.xml`, JSON, atau file metadata apapun              |
| **Dimensi**               | Bervariasi sangat lebar: 313×466 hingga 1179×521                         |

### Warna Background per Sprite

| Warna Background        | Digimon                                                                                    |
|--------------------------|-------------------------------------------------------------------------------------------|
| **Teal/Cyan** (`~#00A8A8`) | WarGreymon, BlackWarGreymon, Beelzemon, Seraphimon, Sakuyamon, Imperialdramon FM/PM, Machinedramon, RizeGreymon, dll. |
| **Magenta** (`#FF00FF`)    | Omnimon, Gallantmon, ChaosGallantmon, Gallantmon CM, Crossmon, Darkdramon, GuardiAngemon, HerculesKabuterimon, Kentaurosmon |
| **Hijau** (`~#00B800`)     | Machinedramon (area overworld), RizeGreymon (area overworld)                              |
| **Campuran**               | Beberapa sprite menggunakan teal untuk battle & hijau untuk overworld pada 1 sheet         |

---

## 3. Perbandingan dengan Sistem Pokémon PMD

### Pokémon (PMD — Mystery Dungeon Style) ✅

```
Idle-Anim.png / Walk-Anim.png:
┌────┬────┬────┬────┬────┬────┐
│ F1 │ F2 │ F3 │ F4 │ F5 │ F6 │  ← Row 0: Down (↓)
├────┼────┼────┼────┼────┼────┤
│ F1 │ F2 │ F3 │ F4 │ F5 │ F6 │  ← Row 1: Down-Right (↘)
├────┼────┼────┼────┼────┼────┤
│ F1 │ F2 │ F3 │ F4 │ F5 │ F6 │  ← Row 2: Right (→)
├────┼────┼────┼────┼────┼────┤
│    │    │    │    │    │    │  ← Row 3: Up-Right (↗)
├────┼────┼────┼────┼────┼────┤
│    │    │    │    │    │    │  ← Row 4: Up (↑)
├────┼────┼────┼────┼────┼────┤
│    │    │    │    │    │    │  ← Row 5: Up-Left (↖) [mirror)
├────┼────┼────┼────┼────┼────┤
│    │    │    │    │    │    │  ← Row 6: Left (←) [mirror]
├────┼────┼────┼────┼────┼────┤
│    │    │    │    │    │    │  ← Row 7: Down-Left (↙) [mirror]
└────┴────┴────┴────┴────┴────┘

+ AnimData.xml → frameWidth, frameHeight, durations[], anchorX, anchorY
```

**Keunggulan PMD**: Terstruktur sempurna, 8 arah, metadata lengkap, bisa diotomatisasi 100%.

### Digimon World DS ❌ (untuk animasi 8-arah)

```
Sprite sheet tidak terstruktur:
┌─────────────────────────────┐
│  [Pose Besar acak]  [Pose]  │  ← Tidak ada grid konsisten
│  [Pose]  [Pose Attack]      │
│  [Mini↓][Mini→][Mini↑][←]   │  ← Overworld kecil, posisi acak
│  [CREDIT TEXT OVERLAY]      │  ← Teks baked-in
└─────────────────────────────┘

- Tidak ada AnimData.xml
- Tidak ada metadata frame
- Layout beda-beda tiap Digimon
```

**Keterbatasan**: Harus di-crop manual per Digimon, tidak bisa diotomatisasi.

---

## 4. Kelayakan Implementasi (Feasibility)

### ❌ TIDAK Mungkin

| Fitur                                      | Alasan                                                         |
|--------------------------------------------|----------------------------------------------------------------|
| Animasi 8-arah PMD-style otomatis          | Tidak ada spritesheet terstruktur 8-row × N-column             |
| Otomasi batch untuk semua 41 Digimon       | Setiap sprite sheet punya layout berbeda, perlu crop manual    |
| Re-use `PokemonPMDAnimator` langsung       | Format data incompatible, tidak ada AnimData.xml               |

### ✅ BISA Dilakukan

| Fitur                                           | Metode                                                          | Effort       |
|--------------------------------------------------|-----------------------------------------------------------------|--------------|
| **A. NPC Statis (seperti Pikachu/Lucario)**      | Crop 1 frame overworld (~32px) → base64 embedded → `drawDigimon()` | ⭐ Rendah     |
| **B. NPC Statis dari Battle Pose**               | Crop 1 pose besar (~120-160px) → scale down → render di canvas  | ⭐ Rendah     |
| **C. Animasi 4-arah Sederhana (Overworld)**      | Crop manual 4-8 frame overworld kecil → `DigimonAnimator`       | ⭐⭐ Sedang    |
| **D. Animasi 4-arah dari Battle Sprite**         | Crop 3-5 battle pose → idle/walk anim manual → `DigimonAnimator`| ⭐⭐⭐ Tinggi  |
| **E. Galeri/Showcase Battle Pose**               | Tampilkan sprite besar sebagai dekorasi/galeri di halaman web   | ⭐ Rendah     |
| **F. Integrasi Town Editor (Companion System)**   | Buat `DigimonCompanion` entries + template di `townConfig.ts`   | ⭐⭐ Sedang    |

---

## 5. Strategi Implementasi

### Rekomendasi: Pendekatan Hybrid (Opsi A + C + F)

Mengingat keterbatasan format sprite, strategi terbaik adalah:

### 🔹 Fase 1 — NPC Statis + Town Editor (MVP)
> **Goal**: Digimon bisa ditempatkan di town sebagai NPC statis
> **Effort**: ~2-4 jam per Digimon

1. **Crop sprite overworld kecil** (~32-40px) dari area mini di sprite sheet
2. Hilangkan background (teal/magenta/hijau → transparan)
3. Encode ke base64 dan embed di `digimonSprite.ts`
4. Buat `drawDigimon[Nama]()` function
5. Tambahkan ke `townConfig.ts` sebagai template objek "Dunia Digimon"
6. Registrasi di `TownEngine.ts` untuk rendering

**Output**: Digimon muncul di menu "Tambah Objek ke Kota" → kategori "Digimon"

### 🔹 Fase 2 — Animasi 4-Arah Sederhana (Enhanced)
> **Goal**: Digimon prioritas bisa berjalan/idle dengan animasi 4 arah
> **Effort**: ~4-6 jam per Digimon

1. **Crop manual** frame overworld dari sprite sheet (biasanya 4 arah × 2-3 frame walk)
2. Susun ulang menjadi mini spritesheet terstruktur (4 rows × N columns)
3. Buat `DigimonAnimator` class (lebih sederhana dari `PokemonPMDAnimator`)
4. Hanya support 4 arah (↓ → ↑ ←) — tanpa diagonal
5. Support `idle` dan `walk` action

**Output**: Digimon ikonik bisa berjalan di town dengan animasi sederhana

### 🔹 Fase 3 — Battle Showcase & Companion System (Bonus)
> **Goal**: Panel Digimon Gallery + integrasi sebagai companion
> **Effort**: ~1-2 hari

1. Buat `DigimonCompanionInfo` interface (mirip `CompanionInfo` Pokemon)
2. Buat panel "Digimon Gallery" atau modal showcase
3. Tampilkan battle pose besar sebagai ilustrasi
4. Integrasikan dengan sistem companion (bisa di-pick sebagai partner)

---

## 6. Prioritas Digimon

### Tier 1 — Protagonist & Ikonik (Implementasi Pertama)
> Digimon yang paling dikenal dan sering diminta fans

| No | Digimon                       | Alasan Prioritas                                        |
|----|-------------------------------|--------------------------------------------------------|
| 1  | **WarGreymon**                | Protagonist utama Adventure, paling ikonik              |
| 2  | **Omnimon**                   | Fusi WarGreymon+MetalGarurumon, sangat populer          |
| 3  | **Gallantmon**                | Protagonis Tamers, Royal Knight                         |
| 4  | **Imperialdramon Fighter Mode** | Protagonis Adventure 02, DNA Evolution ikonik        |
| 5  | **Beelzemon**                 | Anti-hero Tamers, desain sangat keren                   |

### Tier 2 — Populer & Desain Kuat
> Digimon dengan fanbase besar dan visual yang menarik

| No | Digimon                       | Alasan                                                  |
|----|-------------------------------|--------------------------------------------------------|
| 6  | **BlackWarGreymon**           | Versi gelap WarGreymon, karakter tragis populer          |
| 7  | **Seraphimon**                | Angelic Digimon, desain megah                            |
| 8  | **Sakuyamon**                 | Partner Rika di Tamers, desain elegan                    |
| 9  | **Gallantmon Crimson Mode**   | Upgrade Gallantmon, desain spektakuler                   |
| 10 | **Machinedramon**             | Dark Master, desain mekanik intimidatif                  |

### Tier 3 — Legendaris & Dark Masters
> Digimon kuat dengan lore mendalam

| No | Digimon                       | Alasan                                                  |
|----|-------------------------------|--------------------------------------------------------|
| 11 | **MetalSeadramon**            | Dark Master elemen air                                   |
| 12 | **Phoenixmon**                | Mega Biyomon, desain flame bird megah                    |
| 13 | **Vikemon**                   | Mega Gomamon, desain viking berat                        |
| 14 | **MaloMyotismon**             | Villain utama Adventure 02                               |
| 15 | **VenomMyotismon**            | Villain ikonik Adventure                                 |

### Tier 4 — Sovereign & Lainnya
> Bisa diimplementasikan nanti jika ada waktu

| No | Digimon                       |
|----|-------------------------------|
| 16 | Azulongmon (Sovereign Timur)  |
| 17 | Baihumon (Sovereign Barat)    |
| 18 | Zhuqiaomon (Sovereign Selatan)|
| 19 | Imperialdramon Dragon Mode    |
| 20 | Imperialdramon Paladin Mode   |
| 21 | BlackImperialdramon           |
| 22 | Barbamon (Demon Lord)         |
| 23 | Belphemon (Demon Lord)        |
| 24 | RizeGreymon (Ultimate)        |
| 25-41 | Sisanya sesuai kebutuhan   |

---

## 7. Langkah Teknis & Arsitektur Kode

### 7.1 File Baru yang Perlu Dibuat

```
2D_Porto/src/engine/
├── digimonAnimator.ts          ← Controller animasi 4-arah untuk Digimon
├── digimonCompanions.ts        ← Data companion Digimon (nama, lore, skill)
├── digimonSprites/             ← Folder sprite data (base64 embedded)
│   ├── wargreymonSprite.ts
│   ├── omnimonSprite.ts
│   ├── gallantmonSprite.ts
│   ├── impFighterSprite.ts
│   └── beelzemonSprite.ts
└── ...

2D_Porto/public/assets/digimon-processed/  ← Sprite yang sudah di-crop & cleaned
├── wargreymon-overworld.png
├── omnimon-overworld.png
└── ...
```

### 7.2 File yang Perlu Dimodifikasi

| File                        | Perubahan                                                |
|-----------------------------|----------------------------------------------------------|
| `townConfig.ts`             | Tambah template objek Digimon di `OBJECT_TEMPLATES`      |
| `TownEngine.ts`             | Tambah rendering block `drawDigimon*()` di `drawObject()` |
| `pokemonCompanions.ts`      | *(Atau buat file baru)* Tambah Digimon companion entries  |

### 7.3 Interface `DigimonAnimator` (Draft)

```typescript
// digimonAnimator.ts — Simplified 4-Direction Animator

export type DigimonDirection = 'down' | 'right' | 'up' | 'left';
export type DigimonAction = 'idle' | 'walk';

export interface DigimonAnimConfig {
  id: string;
  name: string;
  scale: number;
  spritesheet: string;         // base64 atau path ke processed spritesheet
  frameWidth: number;          // Lebar per frame (biasanya 32-40px)
  frameHeight: number;         // Tinggi per frame (biasanya 32-40px)
  idleFrames: number;          // Jumlah frame idle (biasanya 1-2)
  walkFrames: number;          // Jumlah frame walk (biasanya 2-4)
  frameDuration: number;       // Duration per frame (ms), default ~150
  // Layout: 4 rows (down, right, up, left) × N columns
}

export interface DigimonPMDConfig {
  [id: string]: DigimonAnimConfig;
}
```

### 7.4 Interface `DigimonCompanionInfo` (Draft)

```typescript
// digimonCompanions.ts

export interface DigimonCompanionInfo {
  id: string;
  name: string;
  title: string;            // e.g., "Dragon Warrior"
  icon: string;             // Emoji
  attribute: string;        // Vaccine/Data/Virus
  level: string;            // Mega/Ultimate
  type: string;             // e.g., "Dragon Man"
  badgeClass: string;       // Tailwind classes
  skillName: string;
  skillDesc: string;
  lore: string;             // Tech Guardian lore
  imageSrc?: string;        // Base64 sprite
  tagline: string;
}
```

### 7.5 Proses Crop Sprite (Python Script)

Karena tidak ada `Pillow`/`canvas` module, gunakan **pure Python** dengan `zlib`+`struct` (teknik sama yang berhasil digunakan untuk crop Snorlax/Latias):

```python
# Script: crop_digimon_overworld.py
# Input: Raw sprite sheet dari Digimon World DS
# Output: Clean overworld sprite dengan background transparan

# Langkah:
# 1. Parse PNG header (IHDR) → dapatkan width, height, bit depth
# 2. Decompress IDAT chunks → raw pixel data
# 3. Apply PNG filter reconstruction (None/Sub/Up/Average/Paeth)
# 4. Identifikasi area overworld kecil (posisi manual per Digimon)
# 5. Crop region of interest
# 6. Replace background color (teal/magenta/green) → transparent (alpha=0)
# 7. Encode kembali ke PNG
# 8. Convert ke base64 untuk embedding di TypeScript
```

**Catatan penting**: Posisi crop harus ditentukan **manual per Digimon** karena layout tidak konsisten. Berikut estimasi posisi overworld berdasarkan analisis visual:

| Digimon          | Estimasi Area Overworld di Spritesheet            |
|------------------|--------------------------------------------------|
| WarGreymon       | Bottom-left, ~6 mini sprites, ~40px each          |
| Omnimon          | Bottom-left, ~4 mini sprites, ~32px each          |
| Gallantmon       | Bottom-left, ~3 mini sprites, ~32px each          |
| Beelzemon        | Right column, ~12 mini sprites, ~32px each        |
| Seraphimon       | Right column, ~8 mini sprites, ~32px each         |
| BlackWarGreymon  | Right column, ~8 mini sprites, ~40px each         |
| Machinedramon    | Right column, ~8 mini sprites, ~40px each         |
| RizeGreymon      | Right column, ~8 mini sprites, ~40px each         |
| Sakuyamon        | Bottom, ~7 mini sprites in a row, ~32px each      |
| Imp. Fighter Mode| Bottom row, ~6 mini sprites, ~32px each           |

---

## 8. Estimasi Ukuran & Performa

### Ukuran Aset

| Pendekatan                              | Estimasi per Digimon | Total 10 Digimon |
|-----------------------------------------|---------------------|------------------|
| Opsi A: 1 frame statis (base64)        | ~2-4 KB             | ~20-40 KB        |
| Opsi C: 4-arah spritesheet (base64)    | ~8-16 KB            | ~80-160 KB       |
| Referensi: Pokémon PMD spritesheet      | ~50-200 KB (file)   | ~500 KB - 2 MB   |

> **Kesimpulan**: Digimon overworld sprites jauh lebih ringan dari Pokémon PMD karena ukuran pixel asli lebih kecil (~32px vs ~48-120px PMD).

### Impact pada Build

- Menambahkan 10 Digimon statis: **+20-40 KB** ke bundle — negligible
- Menambahkan 10 Digimon animasi 4-arah: **+80-160 KB** — masih acceptable
- Tidak menambah network request jika menggunakan base64 embedded

---

## 9. Roadmap Fase

### Fase 1: MVP — 5 Digimon NPC Statis

```
📌 Target: WarGreymon, Omnimon, Gallantmon, Beelzemon, Imperialdramon FM
├── 1. Crop overworld sprite (1 frame depan) per Digimon
├── 2. Remove background → transparent
├── 3. Encode base64 → embed di *Sprite.ts
├── 4. Buat drawDigimon*() functions
├── 5. Tambah template "Dunia Digimon" di townConfig.ts
├── 6. Register render di TownEngine.ts
└── 7. Build & Test
```

**Deliverable**: Menu "Tambah Objek" → tab baru "Digimon (5)" dengan 5 Digimon statis

### Fase 2: Animasi — 5 Digimon Prioritas

```
📌 Target: Sama 5 Digimon + BlackWarGreymon, Seraphimon, Sakuyamon, dll.
├── 1. Crop 4 arah × 2-3 frame per Digimon (manual)
├── 2. Susun mini spritesheet terstruktur (4 rows × N cols)
├── 3. Buat DigimonAnimator.ts
├── 4. Buat DIGIMON_ANIM_CONFIGS
├── 5. Integrasikan ke TownEngine (idle + walk)
└── 6. Update townConfig.ts untuk support animated Digimon
```

**Deliverable**: 5+ Digimon bisa berjalan di town dengan animasi 4-arah

### Fase 3: Companion System + Gallery

```
📌 Target: Integrasi penuh dengan sistem companion
├── 1. Buat digimonCompanions.ts (lore, skill, element)
├── 2. Buat kategori "Dunia Digimon" di PartnerModal
├── 3. Buat Digimon Gallery panel (battle pose besar)
├── 4. Support companion system
└── 5. Polish & finalize
```

**Deliverable**: Digimon bisa dipilih sebagai companion, gallery showcase tersedia

### Fase 4: Ekspansi ⏱️

```
📌 Target: Tambah Digimon
└── Target akhir: semua Digimon di town
```

---

## 📝 Catatan Penting

### Background Removal
- **Teal** (`#00A8A8` atau `rgb(0,168,168)`) — warna paling umum
- **Magenta** (`#FF00FF` atau `rgb(255,0,255)`) — beberapa sprite Gallantmon-line
- **Hijau** (`#00B800` atau `rgb(0,184,0)`) — area overworld beberapa sprite
- Harus diganti ke transparent (`alpha = 0`) saat crop
- Hati-hati: beberapa sprite memiliki pixel edge yang color-blend dengan background

### Teks Atribusi
- Beberapa sprite sheet memiliki teks credit baked-in ("Ripped by Dazz", "Compiled by RadSpyro", etc.)
- Teks ini **tidak boleh muncul** di hasil crop → pastikan area crop menghindari region teks
- Credit tetap dihormati dan dicantumkan di kode/komentar

### Penamaan File
- Nama file sumber sangat panjang: `DS _ DSi - Digimon World DS - Mega Digimon - [Nama].png`
- Gunakan nama pendek di kode: `wargreymon`, `omnimon`, `gallantmon`, dll.

### Duplikasi
- `WarGreymon.png` dan `WarGreymon (1).png` identik — cukup gunakan satu

---

## ✅ Kesimpulan

**Ya, Digimon bisa diimplementasikan!** Namun dengan pendekatan yang **berbeda** dari Pokémon PMD:

| Aspek                | Pokémon (PMD)                    | Digimon (World DS)                |
|----------------------|----------------------------------|-----------------------------------|
| Format Sprite        | Terstruktur 8-arah               | Manual crop per Digimon           |
| Arah Gerakan         | 8 arah + diagonal                | 4 arah (↓→↑←)                    |
| Animasi              | Otomatis dari metadata           | Manual frame-by-frame             |
| Controller           | `PokemonPMDAnimator`             | `DigimonAnimator` (baru)          |
| Effort per Karakter  | ~30 menit (copy config)          | ~2-6 jam (crop + config manual)   |
| Kualitas Visual      | Sangat baik (48-120px)           | Baik (32-40px overworld)          |

**Rekomendasi**: Mulai dari **Fase 1** (5 Digimon NPC statis) → evaluasi → lanjut ke Fase 2 jika hasilnya memuaskan.

---

> *Dokumen ini akan diperbarui seiring progres implementasi.*

