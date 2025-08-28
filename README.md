# Fiber Teknologi Nusantara - Company Profile Website

Website company profile untuk Fiber Teknologi Nusantara yang terdiri dari frontend Vue.js dan backend Next.js.

## 🚀 Fitur

### Frontend (Vue.js)
- **Responsive Design**: Website yang responsif untuk semua device
- **Modern UI/UX**: Menggunakan Tailwind CSS untuk desain yang modern
- **Company Profile Pages**:
  - 🏠 **Home**: Slider hero, about section, services preview
  - ℹ️ **About**: Company story, vision & mission, values, achievements
  - 🔧 **Services**: Daftar layanan dengan detail modal
  - 📸 **Gallery**: Galeri foto dengan filter kategori
  - 👥 **Management**: Tim manajemen dan struktur organisasi
  - 📞 **Contact**: Form kontak dan informasi perusahaan

### Backend (Next.js)
- **RESTful API**: API endpoints untuk semua data company profile
- **Authentication**: Sistem login/logout dengan JWT
- **File Upload**: Upload dan management file gambar
- **Database**: PostgreSQL dengan Prisma ORM
- **Admin Dashboard**: Panel admin untuk mengelola konten

## 🛠️ Teknologi yang Digunakan

### Frontend
- **Vue.js 3**: Framework JavaScript progresif
- **TypeScript**: Type safety untuk development yang lebih baik
- **Vue Router**: Client-side routing
- **Pinia**: State management
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client untuk API calls
- **Headless UI**: Komponen UI yang accessible
- **Heroicons**: Icon library

### Backend
- **Next.js 14**: React framework dengan App Router
- **TypeScript**: Type safety
- **Prisma**: Database ORM
- **PostgreSQL**: Database
- **JWT**: Authentication
- **Multer**: File upload handling
- **bcrypt**: Password hashing

## 📁 Struktur Project

```
fiber-teknologinusantara/
├── frontend/                 # Vue.js frontend
│   ├── src/
│   │   ├── components/      # Komponen Vue
│   │   ├── views/          # Halaman website
│   │   ├── services/       # API services
│   │   ├── stores/         # Pinia stores
│   │   └── router/         # Vue Router
│   ├── package.json
│   └── README.md
├── backend/                  # Next.js backend
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/        # API routes
│   │   │   ├── dashboard/  # Admin dashboard
│   │   │   └── components/ # React components
│   │   ├── lib/            # Utilities
│   │   └── middlewares/    # Custom middlewares
│   ├── prisma/             # Database schema
│   ├── package.json
│   └── README.md
├── package.json             # Root package.json
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js (versi 18 atau lebih baru)
- npm atau yarn
- PostgreSQL database

### Instalasi

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd fiber-teknologinusantara
   ```

2. **Install semua dependencies**
   ```bash
   npm run install:all
   ```

3. **Setup database**
   ```bash
   cd backend
   # Copy .env.example ke .env dan sesuaikan konfigurasi database
   cp .env.example .env
   
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev
   
   # Seed database (optional)
   npx prisma db seed
   ```

4. **Setup environment variables**

   **Backend (.env)**
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/ftn_db"
   JWT_SECRET="your-jwt-secret"
   ```

   **Frontend (.env)**
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

5. **Jalankan development servers**
   ```bash
   # Jalankan backend dan frontend secara bersamaan
   npm run dev
   
   # Atau jalankan secara terpisah
   npm run dev:backend  # Backend di http://localhost:3000
   npm run dev:frontend # Frontend di http://localhost:5173
   ```

## 📖 Penggunaan

### Frontend
- Buka `http://localhost:5173` di browser
- Navigasi melalui menu untuk melihat berbagai halaman
- Form kontak dapat digunakan untuk mengirim pesan

### Backend Admin Dashboard
- Buka `http://localhost:3000/login`
- Login dengan kredensial admin
- Akses dashboard untuk mengelola konten website

### API Endpoints

#### Public Endpoints
- `GET /api/sliders` - Data slider homepage
- `GET /api/services` - Data layanan
- `GET /api/gallery` - Data galeri
- `GET /api/management` - Data tim manajemen
- `GET /api/office` - Data kantor
- `POST /api/contact` - Submit form kontak

#### Protected Endpoints (Admin)
- `POST /api/auth/login` - Login admin
- `POST /api/auth/logout` - Logout admin
- `GET /api/user/me` - Profile admin
- `GET /api/dashboard` - Dashboard stats
- `GET /api/summary/stats` - Summary statistics

## 🏗️ Development

### Menambah Halaman Baru (Frontend)

1. Buat file Vue baru di `frontend/src/views/`
2. Tambahkan route di `frontend/src/router/index.ts`
3. Update navigation di `frontend/src/components/AppHeader.vue`

### Menambah API Endpoint (Backend)

1. Buat file route baru di `backend/src/app/api/`
2. Implementasi handler untuk GET, POST, PUT, DELETE
3. Tambahkan middleware authentication jika diperlukan

### Database Schema Changes

1. Update schema di `backend/prisma/schema.prisma`
2. Generate migration:
   ```bash
   npx prisma migrate dev --name description
   ```
3. Update Prisma client:
   ```bash
   npx prisma generate
   ```

## 🚀 Deployment

### Frontend Deployment

#### Vercel
```bash
cd frontend
npm run build
vercel
```

#### Netlify
```bash
cd frontend
npm run build
# Upload folder dist ke Netlify
```

### Backend Deployment

#### Vercel
```bash
cd backend
vercel
```

#### Railway
```bash
# Connect repository ke Railway
# Railway akan auto-deploy dari main branch
```

### Environment Variables

Pastikan set environment variables di platform deployment:

**Frontend**
- `VITE_API_BASE_URL`: URL backend API

**Backend**
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret untuk JWT tokens

## 🐛 Troubleshooting

### CORS Error
Pastikan backend mengizinkan request dari domain frontend:
```javascript
// backend/src/app/api/cors.ts
export const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.FRONTEND_URL || 'http://localhost:5173',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}
```

### Database Connection Error
1. Check `DATABASE_URL` di `.env`
2. Pastikan PostgreSQL berjalan
3. Run `npx prisma db push` untuk sync schema

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

## 📝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - lihat file [LICENSE](LICENSE) untuk detail lebih lanjut.

## 📞 Support

Untuk pertanyaan atau dukungan, silakan hubungi:
- Email: info@ftn.co.id
- Website: https://ftn.co.id

---

**Fiber Teknologi Nusantara** - Menghubungkan Indonesia dengan masa depan digital 🌟



