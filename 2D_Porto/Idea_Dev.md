# 🚀 Rencana Pengembangan Dev Center · Mission Control (`/dev`)
> Panduan komprehensif peningkatan User Experience (UX), Daya Tarik Interaktif, dan Kenyamanan Eksplorasi Portofolio pada halaman `/dev`.

---

## 📌 Ringkasan Status & Tujuan
Halaman **Dev Center** (`http://localhost:4321/dev`) adalah pusat kendali misi rekayasa perangkat lunak dan AI milik Muhammad Zulfan. Halaman ini menggabungkan simulasi ruangan indoor 2D retro di sebelah kiri dan data komprehensif portofolio di sebelah kanan.

Tujuan utama pengembangan ini:
1. **Ergonomi & Kenyamanan Membaca**: Memudahkan recruiter dan pengunjung menavigasi isi portofolio tanpa kelelahan men-scroll halaman yang sangat panjang.
2. **Solusi Link 404 "Debrief →"**: Mengganti link halaman proyek yang saat ini 404 menjadi modal inspeksi teknis mendalam (*Mission Debrief Drawer*) yang interaktif.
3. **Bi-Directional Sync (Sinkronisasi Dua Arah)**: Menghubungkan eksplorasi ruangan 2D (konsol AI, server rack, whiteboard) secara langsung dengan kartu informasi di panel kanan.
4. **Developer Comfort & Wow-Factor**: Memberikan atmosfer ruangan kendali misi yang hidup dengan easter egg *Poké Flute*, mesin kopi penambah kecepatan, dan terminal mini.

---

## 🗺️ Roadmap 4 Fase

### ⚡ Fase 1: Ergonomi Panel Kanan & Kenyamanan Navigasi (SELESAI ✅)
- [x] **Sticky HUD Sub-Nav Bar**:
  - Bar navigasi lengket di bagian atas panel kanan: `[ ⚡ Ringkasan ]` `[ 🚀 Launches ]` `[ 🛠️ Interactive Stack ]` `[ 🏆 Honors ]` `[ 💬 Comms ]`.
  - Dilengkapi scroll-spy indikator aktif saat pengguna men-scroll.
- [x] **Interactive Tech Stack Chips & Proyek Filtering**:
  - Semua chip stack (Python, YOLOv11, Laravel, Docker, dll.) dapat diklik.
  - Klik chip akan langsung memfilter atau menyorot (*glow*) kartu proyek yang menggunakan teknologi tersebut di bagian *Launches*, lengkap dengan badge count ("Dipakai di X Proyek") dan tombol *Reset Filter*.
- [x] **Category Filter Tabs pada Bagian Launches**:
  - Filter kategori cepat: `[ Semua (7) ]`, `[ AI & Computer Vision ]`, `[ Cloud & Backend ]`, `[ IoT & Embedded ]`.
- [x] **Collapsible Honors & Top 3 Highlight**:
  - Menampilkan 3 pencapaian tertinggi secara menonjol (dengan ikon lencana pixel retro).
  - 6 pencapaian lainnya dapat dibuka/tutup dengan tombol *"Lihat semua 9 penghargaan (Expand/Collapse)"* agar halaman tetap ringkas.

---

### 🛰️ Fase 2: "Mission Debrief" Drawer / Modal (SELESAI ✅)
- [x] **Modal Interaktif Mission Debrief**:
  - Mengubah link `Debrief →` pada 7 proyek agar membuka dialog modal arsitektur sistem tanpa pindah halaman (mengatasi error 404).
- [x] **Detail Teknis Kaya untuk Tiap 7 Proyek**:
  1. **AeroScan Tactical AI**: Alur YOLOv11-OBB + ByteTrack, benchmark TensorRT 1.8ms inference, metrik akurasi 94.2% mAP@50, FP16 CUDA execution.
  2. **FoodLink Cloud-Native**: Arsitektur Laravel 12 + Docker + Redis, p99 latency <45ms, PostGIS query <8ms, manajemen antrean donasi.
  3. **Thesis: Spam Classifier**: Pipeline NLP TF-IDF + SVM, akurasi 99.56% pada sidang skripsi, 10,000+ dataset komentar YouTube.
  4. **Automated OMR Grader**: Algoritma kontur OpenCV, deskew hingga 35°, kecepatan <0.35s per lembar LJK, FastAPI + Next.js.
  5. **FoodRescue Platform**: Penghargaan Bronze Medal IDEA FEST 3, integrasi Leaflet GIS untuk kalkulasi jarak relawan, 3 role portals.
  6. **InceptionV3 Deep Learning**: Evaluasi transfer learning, konvergensi loss function, akurasi 91.4% pada 6 kelas material sampah.
  7. **RC Tank IoT**: Mikrokontroler ESP32 FreeRTOS, dual motor driver PWM, ultrasonic obstacle sensing <15cm, Flutter WebSocket remote control.
- [x] **Navigasi Misi Cepat**:
  - Tombol `[ ← Prev Mission ]` dan `[ Next Mission → ]`, tab selector instan, serta dukungan navigasi tombol keyboard panah (Left/Right).

---

### 🔄 Fase 3: Sinkronisasi Dua Arah (Bi-Directional Sync) Kanvas 2D ↔ Panel Kanan (SELESAI ✅)
- [x] **Interaksi Objek 2D Menyorot Kartu di Panel Kanan**:
  - 🖥️ `console-wasm` (AI Inference Console) → Menyorot kartu proyek **AeroScan** & membuka bubble dengan tombol langsung ke Debrief Modal.
  - 🌐 `console-edge` (Distributed Edge Console) → Menyorot proyek **FoodLink** & tombol Debrief Modal.
  - ⚡ `console-static` (Static Architecture Console) → Menyorot proyek **OMR Grader** & membuka section Arsitektur Kota.
  - 🗄️ `rack` (Server Rack) → Membuka Telemetry Modal dan status server compute.
  - 📋 `whiteboard` (Architecture Whiteboard) → Menyorot skripsi/arsitektur sistem & membuka brief debrief.
- [x] **Fitur "📍 Sorot di Ruangan 2D" di Panel Kanan**:
  - Tiap kartu proyek di panel kanan dan tiap slide di modal debrief memiliki tombol `📍 2D Room` / `📍 Locate Console in 2D Room`.
  - Karakter di kanvas 2D secara otomatis berjalan (*pathfinding walkTo*) ke depan meja konsol yang relevan dan menghadap ke konsol.

---

### 🎮 Fase 4: Menghidupkan Ruangan 2D & Fitur Developer Comfort
- [ ] **Coffee Machine "Robusta Overclock"**:
  - Berinteraksi dengan mesin kopi di kanvas memberikan buff `⚡ Overclock Speed (+50% kecepatan jalan)` selama 30 detik di dalam Dev Center.
- [ ] **Snorlax Mission Control Interaktif + Poké Flute**:
  - Mengganti aksi teleport langsung dengan dialog interaktif:
    - `🎵 Mainkan Poké Flute`: Snorlax bangun sesaat, menguap dengan animasi pixel, dan memberikan easter egg stamp.
    - `📊 Cek Uptime Server`: Menampilkan log sistem (99.9% uptime).
    - `🏥 Ke Poké Center`: Opsi sukarela untuk teleport ke `/reception`.
- [ ] **Pokémon Server Assistant (Porygon / Rotom)**:
  - Sprite Porygon / Rotom melayang dengan efek animasi di dekat Server Rack untuk menjaga stabilitas suhu data center.
- [ ] **ZulfanOS Mini-Terminal**:
  - Terminal mini opsional di panel kanan untuk mengetik perintah cepat (`help`, `projects`, `skills`, `coffee`, `contact`).
