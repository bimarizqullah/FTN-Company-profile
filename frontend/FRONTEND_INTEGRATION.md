# Frontend Integration untuk Messages

## Perubahan yang Dilakukan

### 1. Service Contact (`src/services/contactService.ts`)
- **File Baru**: Service khusus untuk mengelola contact messages
- **Fungsi**: `sendMessage()` - Mengirim pesan ke backend API
- **Interface**: `ContactMessage` dan `ContactMessageResponse`

### 2. Update ContactView.vue
- **Import**: Menambahkan `contactService` untuk mengirim pesan
- **Fungsi `submitForm()`**: 
  - Menggunakan service yang sudah ada
  - Data yang dikirim sesuai dengan format backend
  - Error handling yang lebih baik
  - Notifikasi yang lebih informatif

### 3. Konfigurasi Vite (`vite.config.ts`)
- **Environment**: Menambahkan default API base URL
- **Server**: Konfigurasi port dan host untuk development

## Struktur Data yang Dikirim

```typescript
interface ContactMessage {
  name: string        // Nama pengirim (wajib)
  email: string       // Email pengirim (wajib)
  phone?: string      // Nomor telepon (opsional)
  subject: string     // Subjek pesan (wajib)
  message: string     // Isi pesan (wajib)
}
```

## API Endpoint yang Digunakan

- **URL**: `POST /contact/send-email`
- **Base URL**: `http://localhost:3000/api` (development)
- **Headers**: `Content-Type: application/json`

## Error Handling

Frontend menangani berbagai jenis error:

1. **400 Bad Request**: Data tidak valid
2. **500 Server Error**: Kesalahan server
3. **Network Error**: Tidak dapat terhubung ke server
4. **Generic Error**: Error lainnya

## Cara Penggunaan

1. User mengisi formulir contact di website
2. Klik tombol "Kirim Pesan"
3. Data dikirim ke backend melalui `contactService.sendMessage()`
4. Backend menyimpan data ke database
5. User mendapat notifikasi sukses/error
6. Form direset jika berhasil

## Testing

Untuk testing, pastikan:
1. Backend server berjalan di `http://localhost:3000`
2. Frontend server berjalan di `http://localhost:5173`
3. Database sudah memiliki tabel `Message`
4. API endpoint `/api/contact/send-email` dapat diakses

## File yang Dimodifikasi

- `src/views/ContactView.vue` - Update fungsi submit
- `src/services/contactService.ts` - Service baru
- `vite.config.ts` - Konfigurasi environment

## Catatan

- Frontend menggunakan axios instance yang sudah dikonfigurasi
- Error handling menggunakan try-catch dengan pesan yang user-friendly
- Data phone dikirim sebagai `undefined` jika kosong (bukan `null`)
- Form direset otomatis setelah berhasil mengirim


