# 🌟 Portfolio Website

Website portfolio pribadi yang modern dan responsif dengan integrasi social media. Dibangun menggunakan HTML5, CSS3, dan JavaScript vanilla.

## 🚀 Demo

🌐 **Live Demo:** [https://yourusername.github.io/my-portfolio](https://yourusername.github.io/my-portfolio)

## ✨ Fitur

- 📱 **Responsive Design** - Tampil sempurna di semua perangkat
- 🎨 **Modern UI/UX** - Desain yang clean dan profesional
- 🌙 **Smooth Animations** - Animasi yang halus dan menarik
- 📧 **Social Media Integration** - Link ke semua platform social media
- 📄 **CV Download** - Tombol download CV/Resume
- 🎯 **Fast Loading** - Optimized untuk performa terbaik
- 🔍 **SEO Friendly** - Meta tags yang dioptimasi

## 🛠️ Teknologi

- **HTML5** - Struktur semantic
- **CSS3** - Styling modern dengan Flexbox & Grid
- **JavaScript** - Interaktivitas dan animasi
- **Font Awesome** - Icons yang keren
- **Google Fonts** - Typography yang cantik

## 📁 Struktur Project

```
my-portfolio/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # Main stylesheet
├── js/
│   └── main.js         # JavaScript functionality
├── images/
│   └── profile.jpg     # Profile picture
├── assets/
│   └── CV.pdf          # Your CV/Resume
└── README.md           # This file
```

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/my-portfolio.git
cd my-portfolio
```

### 2. Kustomisasi
Ubah informasi berikut di `index.html`:
- Ganti "Nama Anda" dengan nama asli
- Update link social media
- Ganti email dan nomor telepon
- Upload foto profile ke `images/profile.jpg`
- Upload CV ke `assets/CV.pdf`

### 3. Deploy ke GitHub Pages

1. **Push ke GitHub:**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Aktifkan GitHub Pages:**
   - Go to repository Settings
   - Scroll to "Pages" section
   - Source: Deploy from a branch
   - Branch: main / (root)
   - Save

3. **Website akan tersedia di:**
   `https://yourusername.github.io/my-portfolio`

## 🎨 Kustomisasi

### Mengubah Warna
Edit variabel CSS di `css/styles.css`:
```css
:root {
    --primary-color: #667eea;    /* Warna utama */
    --secondary-color: #764ba2;  /* Warna sekunder */
    --accent-color: #f093fb;     /* Warna aksen */
}
```

### Menambah Social Media
Di `index.html`, tambahkan link baru:
```html
<a href="https://tiktok.com/@yourusername" target="_blank" class="social-link">
    <i class="fab fa-tiktok"></i>
</a>
```

### Menambah Project Portfolio
Duplikasi dan edit bagian `.portfolio-item` di `index.html`.

## 📱 Social Media Links

Update link berikut di `index.html`:

- **GitHub:** `https://github.com/yourusername`
- **LinkedIn:** `https://linkedin.com/in/yourusername`
- **Instagram:** `https://instagram.com/yourusername`
- **Twitter:** `https://twitter.com/yourusername`
- **WhatsApp:** `https://wa.me/6281234567890`
- **Email:** `your.email@gmail.com`

## 🔧 Pengembangan Lanjutan

### Menambah Dark Mode
```css
@media (prefers-color-scheme: dark) {
    :root {
        --bg-light: #1a202c;
        --bg-white: #2d3748;
        --text-dark: #f7fafc;
    }
}
```

### Menambah Contact Form
Integrasikan dengan services seperti:
- **Formspree** - https://formspree.io/
- **Netlify Forms** - https://www.netlify.com/products/forms/
- **EmailJS** - https://www.emailjs.com/

## 📊 Analytics

Tambahkan Google Analytics:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact

**Nama Anda** - [@yourusername](https://twitter.com/yourusername) - your.email@gmail.com

Project Link: [https://github.com/yourusername/my-portfolio](https://github.com/yourusername/my-portfolio)

---

⭐ **Jangan lupa beri star jika project ini membantu!** ⭐

## Deployment

To deploy this project on GitHub Pages:

1. Push your code to a GitHub repository.
2. Go to the repository settings.
3. Scroll down to the "GitHub Pages" section.
4. Select the branch you want to use (usually `main` or `master`).
5. Click "Save".
6. Your website will be published at `https://yourusername.github.io/my-portfolio`.

## Contact

For any inquiries, please reach out to me via my social media accounts linked on the website.