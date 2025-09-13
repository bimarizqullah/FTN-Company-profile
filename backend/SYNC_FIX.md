# Perbaikan Sinkronisasi Notifikasi dan Daftar Messages

## Masalah yang Diperbaiki
- Badge notifikasi di sidebar menunjukkan 3 pesan belum dibaca
- Daftar messages hanya menampilkan 2 pesan belum dibaca
- Pesan baru yang masuk tidak muncul bersamaan dengan notifikasi

## Solusi yang Diimplementasikan

### 1. Event-Driven Refresh System
**Custom Event: `unreadCountChanged`**
- Dipicu ketika jumlah pesan belum dibaca berubah
- Mengirim detail: `{ newCount, previousCount, timestamp }`
- Memungkinkan komponen lain untuk bereaksi terhadap perubahan

### 2. Hook `useMessageRefresh`
**File**: `src/app/hooks/useMessageRefresh.ts`
- Mendengarkan event `unreadCountChanged`
- Hanya refresh ketika count meningkat (pesan baru masuk)
- Dapat diaktifkan/nonaktifkan berdasarkan kondisi

### 3. Update Hook `useUnreadMessages`
**Perbaikan**:
- Menyimpan `previousCount` sebelum update
- Dispatch event dengan data yang benar
- Polling interval dikurangi dari 30s ke 10s untuk responsivitas

### 4. Update MessageList Component
**Perbaikan**:
- Menggunakan `useMessageRefresh` hook
- Auto refresh daftar messages ketika ada pesan baru
- Hanya aktif ketika di halaman pertama tanpa filter

## Alur Kerja yang Baru

### 1. Pesan Baru Masuk
1. User mengirim pesan dari frontend
2. Backend menyimpan ke database
3. Polling hook mendeteksi perubahan count (max 10 detik)
4. Event `unreadCountChanged` dipicu
5. Badge di sidebar update
6. Daftar messages auto refresh (jika kondisi terpenuhi)

### 2. Admin Mark as Read
1. Admin klik "Tandai Dibaca"
2. Backend update status message
3. `refreshCount()` dipanggil manual
4. Event `unreadCountChanged` dipicu
5. Badge dan daftar messages update

## Kondisi Auto Refresh

Daftar messages akan auto refresh hanya jika:
- `currentPage === 1` (halaman pertama)
- `!searchTerm` (tidak ada pencarian)
- `filterRead === "all"` (tidak ada filter status)

Ini mencegah refresh yang tidak diinginkan ketika admin sedang:
- Mencari pesan tertentu
- Melihat halaman selanjutnya
- Filter berdasarkan status

## Performance Improvements

### 1. Polling Interval
- **Sebelum**: 30 detik
- **Sesudah**: 10 detik
- **Alasan**: Responsivitas yang lebih baik

### 2. Conditional Refresh
- Hanya refresh ketika count meningkat
- Tidak refresh ketika count menurun (mark as read)
- Mencegah unnecessary API calls

### 3. Event-Driven Architecture
- Komponen tidak perlu polling sendiri
- Centralized event system
- Better separation of concerns

## Testing

### 1. Test Sinkronisasi
1. Buka dashboard admin
2. Kirim pesan dari frontend
3. Tunggu max 10 detik
4. Verifikasi badge dan daftar messages update bersamaan

### 2. Test Conditional Refresh
1. Buka halaman messages
2. Pindah ke halaman 2
3. Kirim pesan baru
4. Verifikasi daftar tidak refresh (karena bukan halaman 1)

### 3. Test Manual Actions
1. Mark message as read
2. Verifikasi badge berkurang
3. Verifikasi daftar messages update

## File yang Dimodifikasi

### File Baru:
- `src/app/hooks/useMessageRefresh.ts`

### File yang Dimodifikasi:
- `src/app/hooks/useUnreadMessages.ts`
- `src/app/dashboard/messages/list/page.tsx`

## Debugging

### Console Logs
Hook `useMessageRefresh` akan log:
```
New message detected: 2 -> 3
```

### Event Details
Event `unreadCountChanged` berisi:
```javascript
{
  detail: {
    newCount: 3,
    previousCount: 2,
    timestamp: "2025-01-13T16:45:00.000Z"
  }
}
```

## Konfigurasi

### Polling Interval
Ubah di `useUnreadMessages.ts`:
```typescript
}, 10000); // 10 detik
```

### Auto Refresh Conditions
Ubah di `MessageList.tsx`:
```typescript
enabled: currentPage === 1 && !searchTerm && filterRead === "all"
```

## Catatan Teknis

- Event system menggunakan browser's native CustomEvent
- Hook menggunakan useCallback untuk prevent unnecessary re-renders
- Previous count disimpan di useRef untuk persist across renders
- Error handling tetap mempertahankan previous count value


