# 🏗️ Pokémon Town UI Redesign Plan — Idea 2.0

> **Project**: `2D_Porto` — Pokémon Gen 4/5 (Sinnoh/Unova) style town portfolio
> **Author**: AI Assistant
> **Date**: 2026-10-28
> **Status**: ✅ COMPLETED (All Phases 1–5 executed and verified)

---

## 📊 Current State Analysis

### Map Dimensions
- **Grid**: `MAP_W = 45` × `MAP_H = 64` tiles
- **Tile Size**: `TILE_SIZE = 16px`
- **Canvas**: 720px × 1024px (pixel-art coordinate space)

### Current Forest Boundary Zones (PROBLEM AREAS)

| Section | Location | Current Trees | Issue |
|---------|----------|---------------|-------|
| **A. East Forest Wall** | X: 39..46, Y: -1..63 | ~6 kolom tebal (39–46) | **Terlalu tebal**, 6+ kolom pohon menghabiskan ruang timur |
| **B. NE Cliff Plateau** | X: 24..38, Y: -1..6 | ~8 baris pohon | **Terlalu tebal**, menelan seluruh area utara-timur |
| **C. North Ridge** | X: 0..22, Y: -1..2 | ~2 baris pohon | **OK, sudah 1 baris** |
| **D. West Boundary** | X: 0..1, Y: 33..60 | 1 kolom pohon | ✅ Sudah benar |
| **E. South Border** | Y: 62..63 | 1 baris pohon | ✅ Sudah benar |

### Current Building Placement

| # | Building | Position (tile) | Size | Door |
|---|----------|----------------|------|------|
| 1 | Dev Center | x:9, y:2 | 12×11 | (15,12) |
| 2 | Research Lab | x:25, y:9 | 8×7 | (29,15) |
| 3 | Observatory Annex | x:33, y:10 | 4×5 | (35,14) |
| 4 | Home Manor | x:10, y:20 | 10×7 | (15,26) |
| 5 | Poké Center | x:13, y:29 | 7×6 | (17,35) |
| 6 | Poké Mart | x:14, y:37 | 6×6 | (17,42) |
| 7 | Studio Villa | x:32, y:21 | 6×5 | (34,25) |
| 8 | Arcade | x:31, y:36 | 8×7 | (34,42)(35,42) |
| 9 | Tech Tower | x:3, y:44 | 6×8 | (6,51) |

### Current Points of Interest

| Item | Position | Type |
|------|----------|------|
| Fountain | (30, 33) | Interactive Prop |
| Statue/Basin | (15, 16) | Decoration |
| Digital Twin NPC | (24, 25) | NPC |
| Charizard NPC | (26, 35) | NPC |
| LinkedIn Sign | (26, 49) | Sign |
| Résumé Sign | (31, 49) | Sign |
| GitHub Sign | (26, 53) | Sign |
| Email Sign | (31, 53) | Sign |

---

## 🔍 Identified Issues (from screenshot analysis)

### 1. 🌲 Hutan Timur Terlalu Tebal (CRITICAL)
- **Masalah**: Hutan di sebelah kanan peta membentang dari X: 39 hingga X: 46+ — menempati **7+ kolom pohon** rapat. Ini menghasilkan dinding hijau massif yang terlihat tidak proporsional dan membuang space yang bisa dimanfaatkan.
- **Solusi**: Pangkas menjadi **1 kolom pohon** boundary saja di X: 43..44 (paling kanan), membebaskan area X: 39..42 (~4 kolom = 64px) untuk konten baru.

### 2. 🌲 Hutan Atas (Utara-Timur) Terlalu Tebal (CRITICAL)
- **Masalah**: Di area kanan atas (NE Cliff Plateau), terdapat **4 baris pohon** (Y: -1 sampai 6) yang membentang dari X: 24 hingga X: 38, menelan seluruh sudut kanan atas peta.
- **Solusi**: Pangkas menjadi **1 baris pohon** boundary saja di Y: 0..1, dan manfaatkan sisa lahan Y: 2..7 di X: 24..38 untuk konten kreatif baru.

### 3. 🏗️ Penempatan Lab Compound Terlalu Mepet ke Pohon
- **Masalah**: Research Lab (X: 25, Y: 9) dan Observatory Annex (X: 33, Y: 10) diapit oleh dinding pohon tebal NE Plateau di utara (Y: 0..7) dan dinding pohon timur (X: 39+). Tidak ada ruang bernapas.
- **Solusi**: Dengan memangkas pohon, lab compound akan memiliki akses visual yang lebih lapang dan bisa diperluas atau ditambahkan area taman/landmark di sekelilingnya.

### 4. 🗺️ Area Timur Kosong (X: 31..38, Y: 22..34)
- **Masalah**: Antara Studio Villa (Y: 21..25) dan Arcade (Y: 36..42), terdapat area besar di timur yang hanya berisi rumput polos dengan sedikit elemen — terkesan kosong dan membosankan.
- **Solusi**: Isi dengan konten kreatif baru (lihat Fase 4).

### 5. ⚙️ Utilitas Ruang Barat Daya Minim
- **Masalah**: Area barat daya (X: 3..8, Y: 28..42) sebelum Tech Tower hanya berisi 1 pohon taman dan 1 bangku. Terlalu kosong.
- **Solusi**: Manfaatkan sebagai area tematik tambahan (lihat Fase 5).

---

## 🎯 Redesign Goals

1. **Pohon kanan → 1 kolom** — Membuat boundary timur ringkas (1 kolom pohon kanopi)
2. **Pohon atas → 1 baris** — Membuat boundary utara ringkas (1 baris pohon kanopi)
3. **Manfaatkan lahan kosong** — Mengisi ruang yang dibebaskan dengan konten kreatif bertema Pokémon yang menambah nilai portofolio
4. **Tata letak game-accurate** — Merapikan layout agar mirip game Pokémon asli (HeartGold/SoulSilver/Platinum)
5. **Zero errors** — Setiap fase harus lolos `npx astro check` tanpa error

---

## 📐 New Layout Map (After Redesign)

```
     0    5    10   15   20   25   30   35   40  44
   0 ┌─TREE─TREE─TREE─TREE─TREE─TREE─TREE─TREE─TREE─T┐
   1 │🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲│🌲
   2 │🌊🌊🌊🌊🌊🌊🌊🌊│ [  DEV CENTER  ] │[TRAINING]│🌲
   3 │🌊🌊🌊🌊🌊🌊🌊🌊│ [  12×11 tiles  ] │[ GROUND ]│🌲
   7 │🌊🌊🌊🌊🌊🌊🌊🌊│                   │[ AREA   ]│🌲
   8 │🌊🌊🌊🌊🌊🌊🌊🌊│   ────HEDGE────   │[BERRY   ]│🌲
   9 │🌊   OCEAN   🌊│   [RESEARCH LAB] │[GARDEN  ]│🌲
  13 │🌊🌊🌊🌊🌊🌊🌊🌊│ 🌳    ⚱    🌳   │  +ANNEX │🌲
  18 │🌊🌊🌊🌊🌊🌊🌊🌊│──HEDGE──┐  ──────│─────────│🌲
  20 │🌊 PROMENADE  │ [HOME MANOR]│[EAST GARDEN]    │🌲
  25 │🌊  8,20-26   │ 10×7 tiles  │[VILLA][🌿🌸🌿] │🌲
  27 │              │             │DIGITAL TWIN     │🌲
  29 │🏥 [POKE CTR] │ ════════════╪═══════════════  │🌲
  33 │              │ CENTRAL BLVD│⛲ FOUNTAIN PLAZA │🌲
  36 │              │             │🔥CHZ  [ARCADE]  │🌲
  37 │🏪 [POKE MART]│             │        8×7      │🌲
  43 │  ────FENCE───│             │                 │🌲
  44 │🏢[TECH TOWER]│ WEST PLAZA  │ CAFÉ TERRACE    │🌲
  48 │  6×8 tiles   │ FLOWER BED  │ 💼📄  SOCIALS   │🌲
  52 │              │             │ 🐙✉️             │🌲
  55 │──FENCE──FENCE│═════════════╪══════FENCE══════│🌲
  56 │  [WEST DEX   │  BOULEVARD  │  EAST DEX       │🌲
  61 │   MEADOW]    │             │  MEADOW]        │🌲
  62 │🌲TREE─TREE─TREE──TREE──TREE─TREE──TREE──TREE─│🌲
  63 └──────────────┴─────────────┴─────────────────┘
```

---

## 🚀 Implementation Plan (Bertahap)

---

### FASE 1: Pangkas Hutan Timur → 1 Kolom Pohon
**Files**: `map.ts`, `townBackground.ts`
**Risk**: Low — hanya mengubah rendering dan tile ground
**Estimated Changes**: ~15 lines

#### 1A. `map.ts` — Ubah Tile.TREE ground timur

**SEBELUM:**
```ts
rectGround(39, 0, 6, 64, Tile.TREE); // East woods
```

**SESUDAH:**
```ts
rectGround(43, 0, 2, 64, Tile.TREE); // East boundary single column (x: 43..44)
```

> Membebaskan X: 39..42 (4 kolom) dari status Tile.TREE ke default Tile.GRASS.

#### 1B. `townBackground.ts` → `renderLushBoundaryForest()` — Kurangi pohon timur

**SEBELUM** (Section A: Great Eastern Forest Wall):
```ts
for (let y = -1; y <= 63; y += 2) {
    const isAlt = Math.floor((y + 1) / 2) % 2 === 1;
    const xEdge = isAlt ? 40 : 39;
    // Interior deep forest trees
    for (let x = xEdge + 2; x <= 46; x += 2) {
      drawPokemonForestCanopyTree(...);
    }
    drawPokemonForestCanopyTree(ctx, xEdge * TILE_SIZE - 8, ...);
}
```

**SESUDAH:**
```ts
// A. Eastern Boundary — Single Column Forest Wall (X: 43..44, Y: -1..63)
for (let y = -1; y <= 63; y += 2) {
    drawPokemonForestCanopyTree(ctx, 43 * TILE_SIZE - 8, y * TILE_SIZE - 10, true);
}
```

> Dari 4–6 kolom pohon menjadi 1 kolom tunggal rapi.

#### 1C. Verifikasi
- [ ] `npx astro check` → 0 errors
- [ ] Refresh browser → pohon kanan hanya 1 kolom, ada lahan rumput kosong baru di X: 39..42

---

### FASE 2: Pangkas Hutan Atas (NE Plateau) → 1 Baris Pohon
**Files**: `map.ts`, `townBackground.ts`
**Risk**: Low
**Estimated Changes**: ~20 lines

#### 2A. `map.ts` — Ubah NE Plateau ground

**SEBELUM:**
```ts
rectGround(24, 0, 21, 8, Tile.TREE); // North-East plateau
```

**SESUDAH:**
```ts
rectGround(24, 0, 19, 2, Tile.TREE); // North-East boundary single row (y: 0..1, x: 24..42)
```

> Membebaskan Y: 2..7 di X: 24..42 dari Tile.TREE.

#### 2B. `map.ts` — Sesuaikan North Ridge agar kontinu

**SEBELUM:**
```ts
rectGround(0, 0, 24, 2, Tile.TREE);  // North ridge
```

**SESUDAH:**
```ts
rectGround(0, 0, 43, 2, Tile.TREE);  // Unified north boundary row (x: 0..42, y: 0..1)
```

> Menyatukan seluruh tepi utara menjadi 1 baris konsisten.

#### 2C. `townBackground.ts` → `renderLushBoundaryForest()` — Pangkas Section B & C

**SEBELUM (Section B):**
```ts
// B. North-East Cliff Plateau Forest (X: 24..38, Y: -1..6)
for (let y = -1; y <= 5; y += 2) { ... }
```

**SESUDAH (Section B & C unified):**
```ts
// B+C. Unified North Boundary Forest Row (X: 0..42, Y: -1..1, single row)
for (let y = -1; y <= 1; y += 2) {
    const isAlt = Math.floor((y + 1) / 2) % 2 === 1;
    const startX = isAlt ? 1 : 0;
    for (let x = startX; x <= 42; x += 2) {
        drawPokemonForestCanopyTree(ctx, x * TILE_SIZE - 8, y * TILE_SIZE - 10, y >= 0);
    }
}
```

> Dari 4 baris pohon menjadi 1 baris seragam di seluruh tepi utara.

#### 2D. `townBackground.ts` — Hapus `renderTerracedCliffs()` call atau sesuaikan
- Cliff terraces di Y: 7 tidak lagi diperlukan jika pohon NE Plateau sudah dipangkas. Cliff hanya menambah tembok visual — bisa dihapus atau disesuaikan posisi ke Y: 2 agar lebih dekat ke boundary.

#### 2E. Verifikasi
- [ ] `npx astro check` → 0 errors
- [ ] Refresh browser → pohon atas hanya 1 baris tipis, Lab Compound memiliki ruang kosong baru di utara
- [ ] Terraced cliff visual terlihat proporsional

---

### FASE 3: Perluas Walkable Area & Sesuaikan Collisions
**Files**: `map.ts`
**Risk**: Medium — mengubah collision map
**Estimated Changes**: ~30 lines

#### 3A. Buka lahan baru timur sebagai walkable area

```ts
// New East Garden Quarter (X: 39..42, Y: 8..46) — freed from thick forest
makeWalkableGrass(39, 8, 4, 39); // Open grass (not PATH, stays green)
```

#### 3B. Buka lahan baru utara-timur

```ts
// New North-East Quarter above Lab (X: 24..42, Y: 2..7) — freed from plateau
makeWalkableGrass(24, 2, 19, 6); // Open grass
```

#### 3C. Tambahkan pagar pembatas timur

```ts
// East boundary fence (X: 42, Y: 2..62 — replacing thick forest as barrier)
for (let y = 2; y <= 61; y++) { collision[idx(42, y)] = 1; }
```

#### 3D. Tambahkan pagar pembatas utara

```ts
// North boundary fence (X: 0..42, Y: 2 — replacing thick forest as barrier)
for (let x = 0; x <= 42; x++) { collision[idx(x, 1)] = 1; }
```

#### 3E. Sesuaikan Lab compound hedges
- Hedge utara lab di Y: 8 mungkin perlu digeser ke Y: 3 atau dihapus karena sudah ada boundary baru.
- Sesuaikan hedge timur lab dari X: 38 ke X: 42 agar memanjang ke area baru.

#### 3F. Verifikasi
- [ ] `npx astro check` → 0 errors
- [ ] Player bisa berjalan di area baru tanpa terjebak atau tembus boundary
- [ ] Pathfinding tetap berfungsi normal

---

### FASE 4: Isi Lahan Kosong Timur — "East Quarter" Content
**Files**: `map.ts`, `townBackground.ts`, `TownEngine.ts`, `TownCanvas.astro`
**Risk**: Medium-High — menambah konten baru
**Estimated Changes**: ~150 lines

#### Ide Kreatif untuk Area Timur yang Dibebaskan (X: 39..42, Y: 8..46):

##### 4A. 🏋️ **Training Ground / Battle Arena** (X: 39..42, Y: 8..18)
- Arena bertarung Pokémon pixel-art kecil dengan garis-garis lapangan (mirip field di Pokémon Stadium)
- Permukaan tanah coklat/pasir seperti training field di gym Pokémon
- 2 lampu sorot kecil di sudut
- Bisa jadi tempat NPC trainer berdiri yang memberi tantangan quiz tambahan
- **Implementasi**: Tambah tile rendering baru `renderTrainingField()` di townBackground.ts, tambah collision dan walkable area

##### 4B. 🌸 **Berry Garden / Flower Orchard** (X: 39..42, Y: 19..28)
- Taman bunga/berry garden bergaya Pokémon dengan 3 baris tanaman berry dalam pot
- Pagar kayu putih rendah mengelilinginya
- 1 pohon cherry blossom (sakura) di tengah
- Bench dan sign post dengan info "Visit the Berry Garden"
- **Implementasi**: Reuse `drawFlowerBed()` dan `drawFence()` existing, tambah fungsi baru `renderBerryGarden()`

##### 4C. 🎪 **Pokémon Contest Stage / Amphitheater** (X: 39..42, Y: 29..38)
- Mini amphitheater setengah lingkaran dengan stage pixel-art kecil
- Bangku penonton 3 baris bertingkat
- Stage dengan podium dan lampu warna-warni
- Referensi ke Pokémon Contest / Super Contest dari Sinnoh
- **Implementasi**: Fungsi baru `renderAmphitheater()` di townBackground.ts

##### 4D. 🏕️ **Rest Area / Pokémon Ranger Station** (X: 39..42, Y: 39..46)
- Pos ranger kecil (bangunan kayu 3×3) dengan bendera
- Area api unggun (campfire) dengan lingkaran batu
- 1 NPC ranger yang memberikan tips
- Papan pengumuman Dex Catching Tips
- **Implementasi**: Fungsi baru `renderRangerStation()`, tambah NPC baru

#### Ide Kreatif untuk Area Utara-Timur yang Dibebaskan (X: 24..42, Y: 2..7):

##### 4E. 🗻 **Scenic Lookout Point / Observatory Terrace** (X: 30..42, Y: 2..7)
- Platform observasi/lookout point dengan pagar besi
- Teropong teleskop (reuse `drawHarborTelescope()`)
- Pemandangan gunung/bukit di background (rendered sebagai backdrop mural)
- Beberapa bangku taman menghadap pemandangan
- 2 pohon cedar hias di sisi
- **Implementasi**: Fungsi baru `renderScenicLookout()`, extends `renderTerracedCliffs()`

#### 3. Koneksi Jalan Baru

##### 4F. East Promenade Path
- Jalan cobblestone baru menghubungkan Arcade area (X: 38, Y: 36..42) ke area timur baru
- Walkable path di X: 38..39, Y: 8..46

##### 4G. North Terrace Path
- Jalan menghubungkan Lab compound (Y: 16..18) ke Lookout Point (Y: 2..7)
- Walkable path di X: 24..30, Y: 7..8

#### 4H. Label Buttons & Interactivity
- Tambahkan label buttons baru di `TownCanvas.astro` untuk POI baru
- Tambahkan `labelDefs` di `TownEngine.ts` untuk posisi label baru
- Tambahkan `onLabelClick` cases untuk navigasi player ke POI baru

#### 4I. Verifikasi
- [ ] `npx astro check` → 0 errors
- [ ] Semua area baru dapat diakses oleh player
- [ ] Label tampil di posisi benar
- [ ] Tidak ada rendering overlap/glitch

---

### FASE 5: Polish & Detailing
**Files**: `townBackground.ts`, `map.ts`
**Risk**: Low
**Estimated Changes**: ~80 lines

#### 5A. Tambahkan Pagar & Dekorasi Boundary
- Pagar besi hitam (*wrought-iron fence*) mengikuti border timur di X: 42
- Pagar besi di tepi utara di Y: 2
- Menyesuaikan dengan style fence existing

#### 5B. Street Lamps untuk Area Baru
- Tambahkan lampu jalan di East Promenade path
- Tambahkan lampu di Training Ground dan Amphitheater
- Reuse drawing function `renderStreetLampsAndBenches()` existing

#### 5C. Manicured Trees di Area Baru
- 2-3 pohon hias (reuse `drawPokemonTownTree()`) di Berry Garden dan Rest Area
- Cherry blossom tree khusus di Berry Garden (modifikasi warna dari `drawPokemonTownTree()` ke pink)

#### 5D. Visual Transition
- Tambahkan organic grass fringe di border antara area rumput baru dan path
- Sesuaikan `renderPathCurbsAndGrassFringe()` untuk include area baru

#### 5E. Verifikasi Final
- [ ] `npx astro check` → 0 errors
- [ ] Full walkthrough dari titik spawn ke semua POI baru
- [ ] Tidak ada z-index/rendering issue
- [ ] Semua boundary fence terlihat konsisten
- [ ] Player tidak bisa escape map bounds

---

## 📁 Files to Modify (Summary)

| File | Fase | Changes |
|------|------|---------|
| [`src/engine/map.ts`](file:///c:/Users/ACER/Downloads/Porto%20web/my-portfolio/2D_Porto/src/engine/map.ts) | 1, 2, 3 | Ground tiles, walkable areas, collisions, fences |
| [`src/engine/townBackground.ts`](file:///c:/Users/ACER/Downloads/Porto%20web/my-portfolio/2D_Porto/src/engine/townBackground.ts) | 1, 2, 4, 5 | Forest rendering, new area art, lamps, fences |
| [`src/engine/TownEngine.ts`](file:///c:/Users/ACER/Downloads/Porto%20web/my-portfolio/2D_Porto/src/engine/TownEngine.ts) | 4 | Label definitions, click handlers |
| [`src/components/TownCanvas.astro`](file:///c:/Users/ACER/Downloads/Porto%20web/my-portfolio/2D_Porto/src/components/TownCanvas.astro) | 4 | New label buttons for POIs |

---

## ⚠️ Risk Mitigation

1. **Fase-by-fase**: Setiap fase diverifikasi sebelum lanjut ke fase berikutnya
2. **Type checking**: `npx astro check` wajib 0 errors di setiap checkpoint
3. **Visual verification**: Screenshot browser setelah setiap fase
4. **Collision testing**: Pastikan player tidak terjebak di area baru
5. **Backward compatible**: Semua building, NPC, sign, dan door positions yang ada **TIDAK diubah**
6. **Cache busting**: `townBackgroundCanvas` cache di TownEngine.ts akan otomatis regenerate karena map data berubah

---

## 🎨 Visual Reference (Pokémon Game Comparison)

Desain terinspirasi dari:
- **Jubilife City** (Pokémon Platinum) — Wide avenues, organized districts, TV station
- **Hearthome City** (Pokémon Platinum) — Contest Hall, Amity Square, Church
- **Castelia City** (Pokémon B/W) — East-side promenade with lookout point
- **Nimbasa City** (Pokémon B/W) — Amusement area, sports facilities, musical theater

Setiap area baru dirancang agar:
1. Memiliki **tujuan tematik** yang jelas (bukan hanya dekorasi kosong)
2. **Dapat dijelajahi** oleh player (walkable + interactable)
3. **Konsisten** dengan estetika Pokémon Gen 4/5 pixel art yang sudah ada
4. **Scalable** — bisa ditambah konten interactive di masa depan (quiz, minigame, dll)

---

## ✅ Acceptance Criteria

- [ ] Hutan timur hanya **1 kolom** pohon boundary
- [ ] Hutan atas hanya **1 baris** pohon boundary
- [ ] Semua lahan kosong terisi konten kreatif yang tertata rapi
- [ ] Layout terlihat seperti kota dalam game Pokémon asli
- [ ] Semua area baru walkable dan accessible
- [ ] `npx astro check` → 0 errors
- [ ] Tidak ada visual glitch atau rendering overlap
- [ ] Semua existing features tetap berfungsi (buildings, NPCs, Dex, dll)

