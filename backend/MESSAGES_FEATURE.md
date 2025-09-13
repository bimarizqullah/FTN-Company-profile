# Fitur Messages Management

## Deskripsi
Fitur Messages Management memungkinkan admin untuk melihat dan mengelola pesan yang dikirim melalui formulir contact di website frontend.

## Fitur yang Ditambahkan

### 1. Database Schema
- **Tabel `Message`** dengan field:
  - `id`: Primary key
  - `name`: Nama pengirim
  - `email`: Email pengirim
  - `phone`: Nomor telepon pengirim (opsional)
  - `subject`: Subjek pesan
  - `message`: Isi pesan
  - `isRead`: Status sudah dibaca atau belum
  - `createdAt`: Tanggal dibuat
  - `updatedAt`: Tanggal diupdate

### 2. API Endpoints

#### `/api/contact/send-email` (POST)
- Menerima pesan dari formulir contact frontend
- Menyimpan pesan ke database
- Validasi input (name, email, subject, message wajib diisi)

#### `/api/messages` (GET, DELETE)
- **GET**: Mengambil daftar messages dengan pagination dan filtering
  - Query parameters: `page`, `limit`, `isRead`, `search`
- **DELETE**: Menghapus message berdasarkan ID

#### `/api/messages/[id]` (GET, PUT, DELETE)
- **GET**: Mengambil detail message berdasarkan ID
- **PUT**: Update status message (mark as read/unread)
- **DELETE**: Menghapus message berdasarkan ID

#### `/api/messages/stats` (GET)
- Mengambil statistik messages:
  - Total messages
  - Unread messages
  - Read messages
  - Messages hari ini
  - Messages minggu ini
  - Messages bulan ini

### 3. Dashboard Admin

#### Halaman Messages (`/dashboard/messages`)
- **Statistik Cards**: Menampilkan total, unread, read, dan messages hari ini
- **Filter & Search**: 
  - Pencarian berdasarkan nama, email, subjek, atau pesan
  - Filter berdasarkan status (semua, belum dibaca, sudah dibaca)
- **Tabel Messages**: 
  - Menampilkan daftar messages dengan pagination
  - Status read/unread dengan badge berwarna
  - Informasi pengirim (nama, email, telepon)
  - Subjek dan preview pesan
  - Tanggal kirim
- **Aksi**:
  - Lihat detail message (modal)
  - Tandai sebagai dibaca/belum dibaca
  - Hapus message
- **Modal Detail**: Menampilkan informasi lengkap message

#### Integrasi dengan Dashboard Utama
- **Statistik**: Total messages ditampilkan di dashboard utama
- **Sidebar**: Menu "Messages" ditambahkan di grup "Contact Management"
- **Navigasi**: Link antara halaman Contact Management dan Messages

### 4. Frontend Integration
- Formulir contact di frontend sudah terintegrasi dengan endpoint `/api/contact/send-email`
- Data yang dikirim: name, email, phone, subject, message

## Cara Penggunaan

### Untuk Admin:
1. Login ke dashboard admin
2. Klik menu "Messages" di sidebar
3. Lihat statistik messages di bagian atas
4. Gunakan filter dan search untuk mencari messages tertentu
5. Klik "Lihat" untuk melihat detail message
6. Gunakan tombol "Tandai Dibaca/Belum Dibaca" untuk mengupdate status
7. Gunakan tombol "Hapus" untuk menghapus message

### Untuk User Website:
1. Buka halaman contact di website
2. Isi formulir dengan informasi yang diperlukan
3. Klik "Kirim Pesan"
4. Pesan akan tersimpan di database dan dapat dilihat admin

## File yang Dibuat/Dimodifikasi

### File Baru:
- `src/app/api/contact/send-email/route.ts`
- `src/app/api/messages/route.ts`
- `src/app/api/messages/[id]/route.ts`
- `src/app/api/messages/stats/route.ts`
- `src/app/dashboard/messages/page.tsx`
- `src/app/dashboard/messages/list/page.tsx`

### File yang Dimodifikasi:
- `prisma/schema.prisma` - Menambahkan model Message
- `src/app/components/admin-dashboard/Sidebar.tsx` - Menambahkan menu Messages
- `src/app/api/summary/stats/route.ts` - Menambahkan statistik messages
- `src/app/dashboard/contact/list/page.tsx` - Menambahkan link ke Messages

## Migration Database
Jalankan migration untuk menambahkan tabel Message:
```bash
npx prisma migrate dev --name add_message_table
```

## Catatan Teknis
- Semua endpoint memerlukan autentikasi (Bearer token)
- Pagination default: 10 items per halaman
- Search menggunakan case-insensitive matching
- Status messages dapat diupdate secara real-time
- Modal detail message responsive dan user-friendly


