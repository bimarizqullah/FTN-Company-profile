# Frontend - Fiber Teknologi Nusantara

Frontend website company profile untuk Fiber Teknologi Nusantara yang dibangun menggunakan Vue.js 3 dengan TypeScript.

## Fitur

- **Responsive Design**: Website yang responsif untuk desktop, tablet, dan mobile
- **Modern UI/UX**: Menggunakan Tailwind CSS untuk desain yang modern dan menarik
- **Company Profile Pages**:
  - Home: Slider hero, about section, services preview
  - About: Company story, vision & mission, values, achievements
  - Services: Daftar layanan dengan detail modal
  - Gallery: Galeri foto dengan filter kategori
  - Management: Tim manajemen dan struktur organisasi
  - Contact: Form kontak dan informasi perusahaan

## Teknologi yang Digunakan

- **Vue.js 3**: Framework JavaScript progresif
- **TypeScript**: Type safety untuk development yang lebih baik
- **Vue Router**: Client-side routing
- **Pinia**: State management
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client untuk API calls
- **Headless UI**: Komponen UI yang accessible
- **Heroicons**: Icon library

## Struktur Project

```
src/
├── components/          # Komponen Vue yang dapat digunakan kembali
│   ├── AppHeader.vue   # Header website
│   └── AppFooter.vue   # Footer website
├── views/              # Halaman-halaman website
│   ├── HomeView.vue    # Halaman beranda
│   ├── AboutView.vue   # Halaman tentang kami
│   ├── ServicesView.vue # Halaman layanan
│   ├── GalleryView.vue # Halaman galeri
│   ├── ManagementView.vue # Halaman manajemen
│   └── ContactView.vue # Halaman kontak
├── services/           # Service layer untuk API calls
│   ├── api.ts         # Konfigurasi axios
│   ├── authService.ts # Service untuk autentikasi
│   ├── userService.ts # Service untuk user management
│   └── companyService.ts # Service untuk data company profile
├── stores/             # Pinia stores
│   └── auth.ts        # Store untuk autentikasi
├── router/             # Vue Router configuration
│   └── index.ts       # Route definitions
└── assets/             # Static assets
    └── main.css       # Tailwind CSS imports
```

## Instalasi dan Setup

### Prerequisites

- Node.js (versi 16 atau lebih baru)
- npm atau yarn

### Langkah Instalasi

1. **Clone repository dan masuk ke folder frontend**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   Buat file `.env` di root folder frontend:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

4. **Jalankan development server**
   ```bash
   npm run dev
   ```

5. **Build untuk production**
   ```bash
   npm run build
   ```

## Konfigurasi API

Frontend ini terhubung dengan backend API yang berjalan di `http://localhost:3000`. Pastikan backend sudah berjalan sebelum menggunakan frontend.

### Endpoint yang Digunakan

- **Sliders**: `/api/sliders` - Data slider untuk homepage
- **Services**: `/api/services` - Data layanan perusahaan
- **Gallery**: `/api/gallery` - Data galeri foto
- **Management**: `/api/management` - Data tim manajemen
- **Contact**: `/api/contact` - Submit form kontak
- **Office**: `/api/office` - Data kantor perusahaan

## Development

### Menjalankan Development Server

```bash
npm run dev
```

Website akan berjalan di `http://localhost:5173`

### Build untuk Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

### Format Code

```bash
npm run format
```

## Deployment

### Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

### Netlify

1. Build project:
   ```bash
   npm run build
   ```

2. Upload folder `dist` ke Netlify

### Manual Deployment

1. Build project:
   ```bash
   npm run build
   ```

2. Upload isi folder `dist` ke web server

## Customization

### Mengubah Warna Theme

Edit file `tailwind.config.js` untuk mengubah warna utama website:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      }
    }
  }
}
```

### Menambah Halaman Baru

1. Buat file Vue baru di `src/views/`
2. Tambahkan route di `src/router/index.ts`
3. Update navigation di `src/components/AppHeader.vue`

### Mengubah Konten

Konten website dapat diubah melalui:
- **Static content**: Edit langsung di file Vue
- **Dynamic content**: Update data di backend API

## Troubleshooting

### CORS Error

Pastikan backend mengizinkan request dari domain frontend. Tambahkan header CORS di backend:

```javascript
app.use(cors({
  origin: 'http://localhost:5173'
}));
```

### API Connection Error

1. Pastikan backend berjalan di `http://localhost:3000`
2. Check network tab di browser developer tools
3. Verify API endpoint di `src/services/api.ts`

### Build Error

1. Clear node_modules dan reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Check TypeScript errors:
   ```bash
   npm run type-check
   ```

## Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

MIT License - lihat file LICENSE untuk detail lebih lanjut.
