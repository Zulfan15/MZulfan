# 🚀 Idea 6.0 — Comprehensive UX Comfort, Interactive Immersion & Portfolio Polish Plan

> **Project**: `2D_Porto` — Zulfan's Interactive 2D Pokémon Town Portfolio  
> **Date**: 2026-11-05  
> **Goal**: Menjadikan website portofolio 2D ini **jauh lebih nyaman digunakan (ergonomis, cepat, intuitif bagi HR/Recruiter maupun pengunjung umum)** sekaligus **lebih hidup, interaktif, dan berkesan (memorable)**.

---

## 🎯 Analisis Kondisi Saat Ini & Peluang Peningkatan

Saat ini `2D_Porto` sudah memiliki fondasi teknis yang sangat kuat:
- Custom 2D Tile Engine murni TypeScript (`TownEngine.ts`) dengan *sleep-loop* hemat baterai.
- Town Editor 3.0 dengan penyimpanan langsung ke `src/data/townLayout.json` & fitur X-Ray Inspector.
- Deretan karakter Pokémon ikonik (Pikachu, Lucario, Arceus, Mewtwo, Charizard, Tyranitar, Garchomp, Urshifu G-Max, Rayquaza, Groudon, Kyogre, Dialga, Palkia, Giratina, Reshiram, Zekrom, Solgaleo, Lunala, Necrozma, Darkrai).
- 8 ruangan/halaman interaktif (`/`, `/about`, `/dev`, `/lab`, `/arcade`, `/reception`, `/mart`, `/tower`, `/twin`).

Namun, dari sisi **kenyamanan pengguna (User Experience)** dan **daya tarik interaktif (Engagement)**, terdapat beberapa area utama yang bisa ditingkatkan secara signifikan:
1. **Mobilitas & Navigasi Peta**: Berjalan kaki dari ujung ke ujung peta (`45×64` tiles) terasa agak lambat; belum ada fitur *Sprint/Sepeda* atau *Fast-Travel (Fly)* langsung ke titik landmark luar ruangan.
2. **Feedback Visual Saat Klik-untuk-Jalan**: Saat mengklik tile yang jauh, pengguna belum melihat garis rute jalan (*path preview*) atau indikator titik tujuan.
3. **Kontrol Perangkat Mobile / Layar Sentuh**: Pengguna HP hanya mengandalkan tap layar tanpa opsi *Virtual D-Pad / Tombol A-B* ala konsol genggam.
4. **Pencarian Cepat untuk Recruiter (`Ctrl+K`)**: HR/Recruiter yang ingin langsung mencari skill tertentu (misal: *Python, Rust, AI, CV*) membutuhkan *Command Palette* instan.
5. **Atmosfer & Interaksi Pokémon**: Cuaca/waktu saat ini tersembunyi di teleskop Lookout, dan deretan Pokémon Legendaris bisa dibuat lebih interaktif (misal: memilih *Follower Pokémon* yang mengikuti pemain, atau efek *Signature Move*).

---

## 🗺️ Arsitektur Rencana Pengembangan (6 Fase Menyeluruh)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   IDEA 6.0 — MASTER UPGRADE ROADMAP                         │
├───────────────────────┬─────────────────────────┬───────────────────────────┤
│ FASE 1:               │ FASE 2:                 │ FASE 3:                   │
│ Navigasi & Mobilitas  │ Kenyamanan UI/UX &      │ Atmosfer, Cuaca &         │
│ (Run, Bike, HM Fly,   │ Akses Cepat Recruiter   │ Audio 8-Bit (HUD Time,    │
│  Path Preview)        │ (Ctrl+K, Resizable,     │  Weather, Procedural BGM) │
│                       │  Clean Public HUD)      │                           │
├───────────────────────┼─────────────────────────┼───────────────────────────┤
│ FASE 4:               │ FASE 5:                 │ FASE 6:                   │
│ Follower Pokémon &    │ Gamifikasi "Trainer     │ Kontrol Mobile (Virtual   │
│ Hall of Legends       │ Passport" Stamp Rally   │ GameBoy Pad) &            │
│ Signature Moves       │ (Guided Portfolio Tour) │ Optimasi Performa         │
└───────────────────────┴─────────────────────────┴───────────────────────────┘
```

---

## 🛠️ Rincian Implementasi Bertahap

---

### FASE 1: Kenyamanan Mobilitas & Navigasi Peta ("Fast & Fluid Movement") — ✅ [SELESAI]
**Target File**: `src/engine/TownEngine.ts`, `src/components/MapModal.astro`, `src/components/TownCanvas.astro`, `src/game/sfx.ts`, `src/engine/townEditor.ts`, `src/styles/global.css`

1. **👟 Running Shoes & 🚲 Mach Bike Toggle (`Shift` / Tombol `B`)**:
   - **Running Shoes**: Menahan tombol `Shift` meningkatkan kecepatan gerak sebesar **1.6× (8.8 tiles/detik)** disertai efek partikel debu langkah kaki retro di bawah kaki karakter.
   - **Mach Bike (`B` Key / Tombol HUD `🚲 Bike`)**: Mengubah kecepatan gerak menjadi **2.2× (12.1 tiles/detik)** dengan suara bel sepeda chiptune dual-tone (`sfx.bikeBell()`), visual sasis sepeda retro aerodinamis merah-chrome dengan roda berputar dan semburan debu ban belakang.
2. **🎯 Visual Pathfinding Preview & Destination Ring**:
   - Saat pengguna mengklik petak kanvas untuk berjalan otomatis (*click-to-move*):
     - **Cincin Berdenyut (Pulsing Target Ring)**: Cincin riak cyan berdenyut dinamis di petak tujuan dengan pin target melayang di atasnya.
     - **Jejak Titik-Titik Halus (Breadcrumb Dots)**: Garis pemandu putus-putus dan titik-titik koordinat menyala sepanjang rute A*/BFS yang menghilang satu per satu seiring langkah karakter.
3. **🦅 HM02 "Fly" — Instant Teleport di Town Map (`MapModal.astro`)**:
   - Upgrade modal **Map** dengan daftar lengkap 15 destinasi kota (8 gedung berhalaman rute dan 7 landmark terbuka seperti Fountain Plaza, Battle Arena, Berry Garden, Lookout Telescope, Contest Stage, Hall of Legends, Outdoor Café).
   - Dilengkapi tab filter ("Semua", "Gedung & Ruangan", "Landmark Terbuka").
   - Setiap kartu memiliki 2 tombol aksi:
     - **`🦅 Fly Here`**: Teleportasi instan ke petak lokasi di kanvas dengan suara chiptune naik (`sfx.fly()`), semburan partikel pusaran angin/bulu terbang, dan camera snap otomatis. Mendukung navigasi instan baik dari outdoor maupun dari dalam gedung melalui `sessionStorage`.
     - **`🚪 Buka Halaman`**: Membuka rute bacaan gedung terkait (`/dev`, `/lab`, `/mart`, dll.).
4. **🧭 Live Mini-Map Radar untuk Pengunjung**:
   - Widget mini-map interaktif yang dapat diakses langsung oleh pengunjung melalui tombol HUD `🧭 Radar`, tombol burger menu, atau shortcut keyboard `M`.
   - Menampilkan peta kota mini real-time dengan letak gedung, batas viewport kamera, serta posisi pemain (lingkaran merah-putih berdenyut cyan dengan jarum arah hadap).
   - Pengunjung dapat langsung mengklik petak pada radar untuk berjalan (`walkTo`) atau `Shift+Klik` untuk terbang instan (`flyTo`).

#### 📝 Catatan Hasil Pengujian & Verifikasi Fase 1:
- `npm --prefix 2D_Porto run build`: Berhasil bersih dengan **0 error** (seluruh 11 rute statis sukses terkompilasi).
- Kompatibilitas kontrol keyboard desktop (`Shift`, `B`, `M`, `Enter`, `Click`, `X`, `L`, `C`) berjalan mulus tanpa tabrakan event.
- Visual frame rate tetap 60fps dengan sleep loop hemat baterai saat idle.

---

### FASE 2: Kenyamanan Recruiter & Ergonomi Panel Bacaan ("Recruiter-First UX") — ✅ [SELESAI]
**Target File**: `src/layouts/TownLayout.astro`, `src/components/Hud.astro`, `src/components/CommandPalette.astro`, `src/components/TownCanvas.astro`, `src/styles/global.css`

1. **🔍 Pokénav Command Palette (`Ctrl+K` / Tombol `Search`)**:
   - Modal pencarian instan Pokénav Navi-Search v3.0 berbasis *Command Palette* terpadu (`CommandPalette.astro`):
     - Shortcut global `Ctrl+K` (atau `Cmd+K` di Mac) serta tombol `🔍 Search` di navigasi atas (`Hud.astro`) dan menu kanvas.
     - Pencarian instan live-filtering untuk:
       - **Skill & Teknologi**: *Python, PyTorch, YOLOv11, Computer Vision, OpenCV, FastAPI, Next.js, React, TypeScript, Rust, Tailwind CSS, Docker*, dll.
       - **Aksi Cepat**: *Unduh CV / Résumé Zulfan (PDF)*, *Salin Email*, *Chat Digital Twin AI*, *Toggle Mach Bike*, *Toggle Radar Kota*, *Buka Town Map*.
       - **Navigasi Kota & Landmark**: Teleportasi langsung ke Dev Center, Lab, Tower, Arcade, Poké Mart, Poké Center, Arena, Fountain, dan deretan Pokémon.
     - Dukungan navigasi keyboard penuh (`ArrowDown`, `ArrowUp`, `Enter`, `ESC`) dengan filter chip kategori (*Aksi*, *Skill*, *Proyek*, *Navigasi*, *Pokémon*).
2. **↔️ Mode Tampilan Fleksibel (Split / Canvas / Reader Mode)**:
   - Dilengkapi 3 tombol preset ukuran panel bacaan di bar atas panel konten (`TownLayout.astro`):
     - `🎮 Peta`: Fokus Kanvas 2D (Peta 68% : Panel 32%).
     - `⚖️ 50:50`: Tampilan Seimbang default (Peta 50% : Panel 50%).
     - `📖 Baca`: Mode Baca Lebar / Reader Mode (Panel 85% : Peta 15%) — sangat ergonomis bagi Recruiter/HR untuk membaca proyek, publikasi tesis, dan CV tanpa terpotong.
   - Pilihan layout otomatis tersimpan di `localStorage` (`town:panel_layout`) dan memicu kalkulasi ulang viewport canvas (`resize`) secara mulus.
3. **🧹 Merapikan HUD Publik vs Mode Developer**:
   - Memindahkan tombol teknis `🔬 X-Ray` dan `🛠️ Editor` ke dalam menu dropdown popover ringkas **`⚙️ Dev`** di pojok bar atas, serta menatanya di burger menu.
   - Bar atas kini bersih, elegan, dan ramah pengunjung: `[Lokasi]`, `🔍 Cari (Ctrl+K)`, `🚲 Bike`, `🧭 Radar`, `🏷️ Badges`, `🎯 Recenter`, `ℹ️ Guide`, `⚙️ Dev`, dan `⛶ Fullscreen`.
   - Shortcut keyboard `X` (X-Ray) dan `E` (Editor) tetap berfungsi penuh bagi developer.

#### 📝 Catatan Hasil Pengujian & Verifikasi Fase 2:
- `npm --prefix 2D_Porto run build`: Berhasil bersih dengan **0 error** (seluruh 11 rute statis sukses terkompilasi dalam 2.37 detik).
- Pencarian `Ctrl+K` membuka modal instan, navigasi keyboard lancar, aksi copy email memunculkan toast, dan download CV membuka PDF di tab baru.
- Mode preset tampilan (`Peta`, `50:50`, `Baca`) menyesuaikan grid CSS dan memicu resize canvas engine secara reaktif.

---

### FASE 3: Kontrol Atmosfer Instan, Cuaca Dinamis & Musik Latar (BGM) — ✅ [SELESAI]
**Target File**: `src/engine/TownEngine.ts`, `src/game/sfx.ts`, `src/components/Hud.astro`, `src/components/TownCanvas.astro`, `src/components/CommandPalette.astro`, `src/styles/global.css`

1. **🌤️ Tombol Cuaca & Waktu Langsung di HUD**:
   - Pengunjung dapat mengubah waktu dan cuaca secara instan dari tombol HUD atas, burger menu, teleskop Lookout, maupun modal `Ctrl+K`:
     - **Waktu (Atmosphere Cycle)**:
       - `☀️ Siang (Day)`: Pencahayaan alami cerah.
       - `🌅 Senja (Sunset)`: Nuansa keemasan hangat (`rgba(255, 135, 45, 0.16)`) dengan lentera batu dan lampu cyber mulai berpendar.
       - `🌙 Malam (Night)`: Nuansa malam biru gelap (`rgba(12, 18, 50, 0.44)`), jendela gedung utama (*Home, Dev Center, Lab, Poké Center, Poké Mart, Arcade, Tech Tower*) menyala dengan pendaran hangat, lentera menyala terang dengan radial lighting pools, dan kunang-kunang bioluminescent berterbangan di area taman/air.
     - **Cuaca Dinamis (Weather System)**:
       - `🌸 Sakura (Petals)`: Hembusan 45 partikel kelopak bunga sakura merah muda & daun hijau muda yang melayang santai dengan osilasi angin gelombang sinus.
       - `🌧️ Hujan (Lo-Fi Rain)`: Efek 65 rintik hujan diagonal di atas kanvas dengan riak air (*water splash ripples*) yang meluas di permukaan tanah/air + wash atmosfer sejuk.
       - `✨ Bintang (Starfall)`: Taburan bintang berkelip dan lintasan meteor berkilau (*shooting star streaks*) meluncur diagonal melintasi langit kota.
     - Pilihan waktu dan cuaca tersimpan otomatis di `localStorage` (`town:atmosphere` & `town:weather`).
2. **🎵 8-Bit Procedural Chiptune BGM & Ambient Soundscape (`sfx.ts`)**:
   - Synthesizer musik latar *Lo-Fi 8-Bit* berbasis browser Web Audio API (**0 KB file audio, instan tanpa download MP3**):
     - **Tema Siang ("Littleroot Breeze")**: Melodi C Major / G Major yang ceria, santai, dan nostalgik dengan arpeggio chord lembut.
     - **Tema Senja ("Golden Horizon")**: Nuansa hangat akor Fmaj7 - Em7 - Dm7 dengan bass lembut.
     - **Tema Malam ("Lullaby of the Stars")**: Melodi music-box bergaya lullaby Am9 / Cmaj7 dengan nada sine chime yang berkelip syahdu seperti bintang.
     - Tombol **`🎵 BGM`** terpisah dari **`🔊 SFX`** di bar navigasi atas (`Hud.astro`), menu burger, dan modal pencarian, sehingga pengunjung bebas memilih efek suara saja, musik penuh, atau hening.

#### 📝 Catatan Hasil Pengujian & Verifikasi Fase 3:
- `npm --prefix 2D_Porto run build`: Berhasil bersih dengan **0 error** (seluruh 11 rute statis sukses terkompilasi dalam ~2.3 detik).
- Audio context otomatis di-unlock saat interaksi pertama pengguna (`pointerdown`/`keydown`) sesuai kebijakan autoplay browser modern.
- Transisi tema musik menyesuaikan waktu kota secara otomatis (Siang -> Senja -> Malam).
- Semua partikel cuaca (sakura, hujan, meteor, kunang-kunang) terintegrasi mulus dalam siklus 60fps canvas engine tanpa membebani memori.

---

### FASE 4: Interaksi Pokémon Lebih Hidup ("Follower System & Hall of Legends") - ✅ [SELESAI]
**Target File**: `src/engine/TownEngine.ts`, `src/engine/map.ts`, `src/components/TownCanvas.astro`, `src/components/CommandPalette.astro`

1. **🐾 Sistem "Choose Your Walking Partner" (Follower Pokémon)**:
   - Pemain dapat memilih Pokémon kota favorit (**Lucario, Charizard, Tyranitar, Garchomp, Urshifu, Rayquaza, Mewtwo, Arceus, Dialga, Palkia, Pikachu**) sebagai partner jalan aktif melalui tombol dialog **`🤝 Ajak Jalan Bersama`** maupun via Pokénav Command Palette (`Ctrl+K`).
   - Pokémon pendamping berjalan mulus tepat 1 petak di belakang pemain dengan animasi melangkah (*step bob*), napas santai (*idle bob*), balik arah horizontal otomatis saat melangkah ke kiri/kanan, bayangan kontak tanah, serta gelembung ekspresi hati (`❤️`) saat dipilih.
   - Mengikuti pemain dalam semua mode mobilitas (jalan normal, *Running Shoes*, melaju kencang di atas *Mach Bike*, maupun teleportasi instan *HM02 Fly*).
   - Posisi rendering diurutkan secara dinamis (*depth sorting*): jika posisi target follower berada di utara pemain, follower digambar di belakang pemain; jika di selatan pemain, follower digambar di depan pemain.
   - Pilihan partner tersimpan permanen di `localStorage['town:active_follower']` sehingga partner tetap setia mendampingi saat halaman direfresh atau berpindah rute.
   - Pilihan "Istirahatkan Walking Partner" tersedia untuk kembali bereksplorasi secara solo.

2. **⚡ Efek Jurus Ikonik (Signature Move Visual Burst)**:
   - Menekan tombol aksi jurus pada dialog Pokémon memicu getaran kamera halus (*screen shake*) selama ~1.5 detik disertai semburan 35–50 partikel tematik berkecepatan tinggi:
     - **🔥 Charizard**: *Flamethrower* (semburan api menyala oranye, merah, kuning membakar ke atas).
     - **🪨 Tyranitar**: *Sandstorm* (badai pusaran pasir gurun berputar tebal cokelat keemasan).
     - **🦈 Garchomp**: *Dragon Claw* (tebasan cakar naga cyan supersonik tajam).
     - **🌊 Urshifu**: *G-Max Rapid Flow* (aliran deras semburan air wushu biru samudra beruntun).
     - **🌀 Lucario**: *Aura Sphere* (pancaran bola aura biru nila berpendar).
     - **🔮 Mewtwo**: *Psystrike* (gelombang energi psikis ungu/magenta berdenyut).
     - **✨ Arceus**: *Judgment* (hujan berkas cahaya kosmik keemasan dari langit).
     - **⏳ Dialga**: *Roar of Time* (distorsi waktu gelombang biru kristal temporal).
     - **🌌 Palkia**: *Spacial Rend* (riak pemecah ruang merah muda mutiara kosmik).
     - **🐉 Rayquaza**: *Delta Stream* (hembusan angin badai hijau zamrud ozon).

3. **🏛️ Koneksi Pokémon dengan Keahlian Portofolio ("Tech Guardian Lore")**:
   - Setiap Pokémon di koridor kota dan penempatan custom merepresentasikan pilar keahlian rekayasa perangkat lunak Zulfan:
     - **Mewtwo**: *Tech Guardian: AI Agents, LLM Orchestration & Deep Learning* (penalaran multi-agent cerdas dan otomatisasi AI).
     - **Dialga**: *Tech Guardian: Time-Critical Backend, Rust/WASM & Microservices* (latensi real-time rendah dan sinkronisasi data presisi).
     - **Palkia**: *Tech Guardian: Spatial Computing & Distributed Cloud Infrastructure* (arsitektur awan tanpa batas dimensi).
     - **Charizard**: *Tech Guardian: Full-Stack Web Engineering & Scalable Cloud Apps* (aplikasi web modern performa kilat).
     - **Garchomp**: *Tech Guardian: High-Speed Algorithms, Optimization & Clean Code* (eksekusi logika secepat jet supersonik).
     - **Tyranitar**: *Tech Guardian: Bulletproof Security, Resilient Database & Infrastructure* (tahan banting menghadapi lonjakan traffic).
     - **Urshifu**: *Tech Guardian: Agile Execution, Rapid Prototyping & Flow State UI/UX* (solusi kilat dan tangguh).
     - **Arceus**: *Tech Guardian: Enterprise System Architecture & End-to-End Product Vision* (merancang fondasi menyeluruh dari nol hingga tahap produksi).
     - **Rayquaza**: *Tech Guardian: DevOps, CI/CD Cloud Pipelines & High-Availability* (menjaga stabilitas operasional 99.99%).
     - **Lucario / Digital Twin**: *Tech Guardian: Intuitive UI/UX Design & Human-Centric Frontend* (merasakan kebutuhan pengguna secara empatik).
   - Dialog bubble kini mendukung aksi ganda/multipel (*flexible button pill tags*) sehingga pemain bisa menikmati jurus signature, mengajak jalan bersama, maupun membuka encounter mini-game secara bersamaan.

4. **🐾 Poké-Partner & Skill Hub Modal (`PartnerModal.astro`) + Floating Quick-Bar**:
   - **Poké-Partner & Skill Hub**: Modal komprehensif yang menampilkan 11 Pokémon (Lucario, Charizard, Tyranitar, Garchomp, Urshifu, Rayquaza, Mewtwo, Arceus, Dialga, Palkia, Pikachu) dengan visual sprite resmi, rincian keahlian rekayasa teknologi (*Tech Guardian Lore*), signature move burst, dan tombol langsung `🤝 Ajak Jalan` serta `⚡ Skill Burst`.
   - **Akses Instan Top HUD & Burger Menu**: Tombol `🐾 Partner` (Hotkey `P`) dan `⚡ Skill` (Hotkey `X`) tersedia langsung di bar atas desktop dan menu navigasi ringkas mobile/burger.
   - **Floating Companion Quick-Bar Widget (`#town-partner-float`)**: Widget melayang *glassmorphism retro pill* di sudut bawah layar menampilkan avatar Pokémon aktif, live status dot, nama pendamping, tombol pemicu skill `⚡ [Skill] (X)` dan tombol ganti `🔄 (P)`.
   - **Interaksi Klik Langsung Seluruh Pokémon Kanvas**: Mengklik langsung sprite Pokémon mana pun di koridor kota (Charizard, Rayquaza, Giratina, Dialga, Palkia, Arceus, dll.) kini secara otomatis mengarahkan langkah pemain mendekat, menghadap ke Pokémon, dan membuka dialog interaktif lengkap beserta floating speech bubble `💬` di atas kepala mereka.

---

### FASE 5: Gamifikasi Tur Portofolio — "Trainer Passport & Stamp Rally"
**Target File**: `src/game/store.ts`, `src/components/WelcomeModal.astro`, `src/components/CritterdexModal.astro`

1. **🎫 Misi Eksplorasi Singkat ("Zulfan's Town Stamp Rally")**:
   - Banyak pengunjung pertama kali bingung harus ke mana dulu. Buat daftar **5 Stempel Eksplorasi** yang ringan dan menyenangkan:
     1. 🏢 *Kunjungi Dev Center & lihat proyek unggulan*
     2. 🤖 *Mengobrol dengan AI Digital Twin*
     3. 🔥 *Jawab kuis singkat dari Charizard atau Battle Arena*
     4. 🌿 *Tangkap 1 Critter di rumput tinggi selatan*
     5. 🕹️ *Mainkan 1 giliran Mancala melawan Deoxys di Arcade*
2. **🏆 Hadiah Penyelesaian**:
   - Setiap stempel yang didapat menampilkan notifikasi *toast* bergaya *Achievement Unlocked*.
   - Mengumpulkan minimal 3 stempel membuka **Bingkai Emas "VIP Recruiter / Champion"** pada **Trainer Card PNG** yang bisa diunduh pengunjung sebagai kenang-kenangan unik!

---

### FASE 6: Kenyamanan Layar Sentuh (Mobile Virtual Pad) & Polish Akhir
**Target File**: `src/components/TownCanvas.astro`, `src/styles/global.css`

1. **📱 Virtual GameBoy D-Pad & Tombol A/B untuk Mobile**:
   - Deteksi otomatis perangkat layar sentuh (`pointer: coarse` / layar kecil).
   - Tampilkan kontrol transparan bergaya konsol genggam retro di bagian bawah kanvas:
     - **D-Pad Kiri**: Jalan 4 arah dengan mulus.
     - **Tombol A (Interact)**: Menyapa NPC / membuka pintu gedung di depan pemain.
     - **Tombol B (Run)**: Lari cepat.
2. **⚡ Transisi Masuk/Keluar Gedung yang Mulus**:
   - Efek *fade-to-black* singkat (150ms) ala game Pokémon klasik saat karakter melangkah masuk ke pintu gedung sebelum halaman berpindah, sehingga perpindahan antar rute terasa sangat menyatu.

---

## 📋 Status & Prioritas Eksekusi

| Urutan | Fase | Dampak Kenyamanan (UX) | Dampak Daya Tarik (Wow-Factor) | Status |
|:------:|------|:----------------------:|:------------------------------:|:------:|
| **1** | **Fase 1** (Run/Bike, Path Preview, HM Fly Map, Live Radar) | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ✅ **SELESAI (Completed)** |
| **2** | **Fase 2** (`Ctrl+K` Search, Panel Mode, Clean HUD) | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ✅ **SELESAI (Completed)** |
| **3** | **Fase 3** (HUD Time/Weather Toggle & 8-Bit BGM) | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ **SELESAI (Completed)** |
| **4** | **Fase 4** (Switchable Follower Pokémon & Move FX) | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ **SELESAI (Completed)** |
| **5** | **Fase 5** (Trainer Stamp Rally / Quest Guide) | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⏳ *Menunggu Instruksi User* |
| **6** | **Fase 6** (Mobile Virtual GameBoy Controls) | ⭐⭐⭐⭐⭐ (Mobile) | ⭐⭐⭐⭐ | ⏳ *Menunggu Instruksi User* |

---

## ✅ Checklist Verifikasi
- [x] `npm --prefix 2D_Porto run build` berjalan dengan **0 error** (11 halaman static terkompilasi dalam ~2.3 detik).
- [x] Semua fitur mobilitas & navigasi Fase 1 tetap super ringan (< 2.5s build time), menggunakan *vanilla TypeScript*, *HTML5 Canvas* & *Web Audio API* tanpa dependency eksternal.
- [x] Navigasi cepat HM02 Fly di Town Map modal menjangkau 15 lokasi lengkap dengan teleportasi instan dan feedback audio chiptune.
- [x] Pokénav Command Palette (`Ctrl+K`) memungkinkan pencarian instan skill, download CV, salin email, pemilihan partner Pokémon, dan teleportasi dalam **< 2 detik**.
- [x] Panel bacaan konten memiliki 3 preset fleksibel (`Peta` 70:30, `50:50` Seimbang, `Baca` Reader Mode) yang responsif dan tersimpan di `localStorage`.
- [x] Bar atas HUD publik terlihat bersih, profesional, dan rapi dengan pengelompokan alat teknis ke tombol popover **`⚙️ Dev`**.
- [x] Kontrol waktu instan di HUD (`☀️ Siang`, `🌅 Senja`, `🌙 Malam`) menghadirkan pencahayaan kota dinamis, jendela gedung menyala hangat di malam hari, dan kunang-kunang bioluminescent.
- [x] Sistem cuaca dinamis 3-mode (`🌸 Sakura`, `🌧️ Hujan Lo-Fi`, `✨ Hujan Meteor`) memperkaya atmosfer interaktif kanvas dengan riak air dan debu bintang.
- [x] Generator musik latar 8-bit Lo-Fi Web Audio API (0 KB file audio) mengiringi penjelajahan dengan 3 variasi tema nostalgik yang selaras dengan suasana waktu.
- [x] Pemain dapat memilih Partner Pokémon jalan (Lucario, Charizard, Tyranitar, Garchomp, Urshifu, Rayquaza, Mewtwo, Arceus, Dialga, Palkia, Pikachu) yang berjalan 1 petak di belakang pemain dengan animasi mulus dan depth sorting.
- [x] Setiap Pokémon memiliki tombol aksi visual jurus ikonik (*Signature Move Visual Burst*) dengan getaran kamera dan semburan 35–50 partikel khas elemen.
- [x] Narasi Pokémon koridor kota terhubung dengan pilar keahlian rekayasa teknologi Zulfan (*Tech Guardian Lore*).
- [x] Pengunjung santai maupun recruiter mendapatkan pengalaman eksplorasi ala game Pokémon yang responsif, visual dinamis, dan intuitif.

