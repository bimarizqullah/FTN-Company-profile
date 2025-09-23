# Fix untuk Masalah Gambar Tidak Muncul di Frontend

## Masalah
Frontend tidak bisa menampilkan gambar slider dan gallery karena error `ERR_CONNECTION_REFUSED` saat mengakses `202.10.45.138:3000/uploads/...`

## Solusi yang Diimplementasikan

### 1. Buat API Route untuk Static Files
Dibuat file `backend/src/app/api/uploads/[...path]/route.ts` untuk melayani file uploads melalui API route.

**Fitur:**
- Security check untuk mencegah directory traversal
- Support berbagai format gambar (jpg, png, gif, webp, svg)
- Proper content-type headers
- CORS headers untuk akses dari frontend
- Cache headers untuk performa

### 2. Update Konfigurasi Frontend
Diperbarui `frontend/src/services/api.ts`:
- Mengubah `UPLOAD_BASE_URL` dari `http://localhost:3000` ke `http://localhost:3000/api/uploads`
- Menggunakan localhost sebagai default untuk development

### 3. Cara Kerja
1. Frontend meminta gambar melalui URL: `http://localhost:3000/api/uploads/sliders/filename.jpg`
2. API route menangani request dan melayani file dari `public/uploads/` directory
3. File dikembalikan dengan proper headers dan content-type

## Testing
Untuk menguji apakah fix berhasil:
1. Pastikan backend server berjalan di `localhost:3000`
2. Buka frontend dan periksa console browser
3. Gambar slider dan gallery seharusnya sudah bisa ditampilkan

## Environment Configuration
Untuk production, buat file `.env.local` di frontend dengan:
```
VITE_API_BASE_URL=http://your-server-ip:3000/api
VITE_UPLOAD_BASE_URL=http://your-server-ip:3000/api/uploads
```

## Catatan
- Pastikan backend server berjalan sebelum mengakses frontend
- Jika masih ada masalah, periksa apakah port 3000 tidak terblokir firewall
- Untuk production, ganti localhost dengan IP server yang sesuai

