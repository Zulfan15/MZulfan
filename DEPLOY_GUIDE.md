# 🚀 Panduan Deploy ke GitHub Pages

## Langkah 1: Upload ke GitHub

### 1.1 Buat Repository Baru
1. Buka [GitHub](https://github.com)
2. Klik tombol **"New"** atau **"+"** → **"New repository"**
3. Nama repository: `my-portfolio` (atau nama lain sesuai keinginan)
4. Centang **"Public"** agar bisa diakses semua orang
5. **JANGAN** centang "Add a README file" (karena sudah ada)
6. Klik **"Create repository"**

### 1.2 Upload Files
Setelah repository dibuat, ikuti instruksi di halaman GitHub:

```bash
# Di terminal/command prompt, jalankan perintah berikut:
cd "C:\Users\ACER\Downloads\Porto web\my-portfolio"

# Tambahkan remote origin (ganti 'yourusername' dengan username GitHub Anda)
git remote add origin https://github.com/yourusername/my-portfolio.git

# Rename branch ke main
git branch -M main

# Push ke GitHub
git push -u origin main
```

## Langkah 2: Aktifkan GitHub Pages

### 2.1 Masuk ke Settings Repository
1. Di repository GitHub Anda, klik tab **"Settings"**
2. Scroll ke bawah hingga menemukan bagian **"Pages"**

### 2.2 Konfigurasi Pages
1. **Source**: Pilih **"Deploy from a branch"**
2. **Branch**: Pilih **"main"**
3. **Folder**: Pilih **"/ (root)"**
4. Klik **"Save"**

### 2.3 Tunggu Deployment
- GitHub akan memproses website Anda (2-10 menit)
- Website akan tersedia di: `https://yourusername.github.io/my-portfolio`
- Anda akan mendapat notifikasi saat website sudah live

## Langkah 3: Kustomisasi Website

### 3.1 Edit Informasi Pribadi
Edit file `index.html` dan ganti:
- `"Nama Anda"` → Nama asli Anda
- `"Web Developer & Designer"` → Profesi/bidang Anda
- Deskripsi di hero section
- Konten bagian "About"

### 3.2 Update Social Media Links
Ganti semua link `yourusername` dengan username asli:
```html
<!-- GitHub -->
<a href="https://github.com/username_github_anda" target="_blank">

<!-- LinkedIn -->
<a href="https://linkedin.com/in/username_linkedin_anda" target="_blank">

<!-- Instagram -->
<a href="https://instagram.com/username_instagram_anda" target="_blank">

<!-- Twitter -->
<a href="https://twitter.com/username_twitter_anda" target="_blank">

<!-- WhatsApp (ganti nomor) -->
<a href="https://wa.me/628123456789" target="_blank">

<!-- Email -->
<a href="mailto:email.anda@gmail.com">
```

### 3.3 Upload Foto Profile
1. Ganti file `images/profile.jpg` dengan foto Anda
2. Ukuran recommended: 400x400 pixel, format JPG/PNG

### 3.4 Upload CV/Resume
1. Ganti file `assets/CV.pdf` dengan CV Anda
2. Format: PDF maksimal 5MB

## Langkah 4: Update Website

Setelah melakukan perubahan:
```bash
# Add changes
git add .

# Commit changes
git commit -m "Update personal information and social links"

# Push to GitHub
git push origin main
```

Website akan otomatis ter-update dalam beberapa menit.

## 🎨 Tips Kustomisasi

### Mengubah Warna Theme
Edit variabel di `css/styles.css`:
```css
:root {
    --primary-color: #667eea;    /* Warna utama - biru */
    --secondary-color: #764ba2;  /* Warna sekunder - ungu */
    --accent-color: #f093fb;     /* Warna aksen - pink */
}
```

### Menambah Project Portfolio
Duplikasi blok `.portfolio-item` di `index.html`:
```html
<div class="portfolio-item">
    <div class="portfolio-img">
        <img src="URL_GAMBAR_PROJECT" alt="Nama Project">
        <div class="portfolio-overlay">
            <div class="portfolio-info">
                <h3>Nama Project</h3>
                <p>Deskripsi singkat project</p>
                <div class="portfolio-links">
                    <a href="LINK_LIVE_DEMO" target="_blank">
                        <i class="fas fa-external-link-alt"></i>
                    </a>
                    <a href="LINK_GITHUB_REPO" target="_blank">
                        <i class="fab fa-github"></i>
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>
```

### Menambah Social Media Baru
Tambahkan icon baru (cek [Font Awesome](https://fontawesome.com/icons)):
```html
<a href="https://youtube.com/@channelname" target="_blank" class="social-link">
    <i class="fab fa-youtube"></i>
</a>
```

## 🔧 Troubleshooting

### Website Tidak Muncul
1. Cek di repository Settings → Pages
2. Pastikan Source = "Deploy from a branch"
3. Pastikan Branch = "main"
4. Tunggu 5-10 menit setelah push

### Error 404
1. Pastikan file `index.html` ada di root folder
2. Cek huruf besar/kecil nama file
3. Pastikan repository public

### Images Tidak Muncul
1. Cek path file di `index.html`
2. Pastikan file ada di folder `images/`
3. Gunakan relative path, bukan absolute

## 📞 Support

Jika ada masalah:
1. Cek [GitHub Pages Documentation](https://docs.github.com/en/pages)
2. Buat issue di repository ini
3. Hubungi melalui social media yang tertera

---

🎉 **Selamat! Website portfolio Anda sudah online dan bisa diakses siapa saja!** 🎉
