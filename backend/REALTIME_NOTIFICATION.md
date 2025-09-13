# Fitur Notifikasi Realtime untuk Messages

## Deskripsi
Fitur notifikasi realtime menampilkan badge di sidebar yang menunjukkan jumlah pesan yang belum dibaca. Badge akan update secara otomatis setiap 30 detik dan juga ketika admin melakukan aksi pada messages.

## Komponen yang Ditambahkan

### 1. API Endpoint
**`/api/messages/unread-count` (GET)**
- Mengembalikan jumlah pesan yang belum dibaca
- Memerlukan autentikasi Bearer token
- Response: `{ unreadCount: number, timestamp: string }`

### 2. Custom Hook
**`useUnreadMessages`** (`src/app/hooks/useUnreadMessages.ts`)
- Hook untuk mengelola state unread count
- Polling otomatis setiap 30 detik
- Error handling untuk token expired
- Function `refreshCount()` untuk manual refresh

### 3. Komponen Badge
**`NotificationBadge`** (`src/app/components/admin-dashboard/NotificationBadge.tsx`)
- Komponen badge merah dengan angka
- Menampilkan "99+" jika count > 99
- Tidak ditampilkan jika count = 0
- Styling responsive untuk collapsed/expanded sidebar

### 4. Update Sidebar
**`Sidebar.tsx`**
- Menggunakan hook `useUnreadMessages`
- Menampilkan badge di menu Messages
- Support untuk mode collapsed dan expanded
- Badge positioning yang berbeda untuk setiap mode

### 5. Update Messages Page
**`MessageList.tsx`**
- Menggunakan hook untuk refresh count
- Auto refresh setelah mark as read/unread
- Auto refresh setelah delete message

## Cara Kerja

### 1. Polling Otomatis
- Hook `useUnreadMessages` melakukan polling setiap 30 detik
- Mengambil data dari `/api/messages/unread-count`
- Update state `unreadCount` jika ada perubahan

### 2. Manual Refresh
- Ketika admin mark message as read/unread → `refreshCount()`
- Ketika admin delete message → `refreshCount()`
- Refresh langsung tanpa menunggu polling

### 3. Badge Display
- **Expanded Sidebar**: Badge di sebelah kanan label "Messages"
- **Collapsed Sidebar**: Badge di pojok kanan atas icon
- **Hidden**: Badge tidak ditampilkan jika count = 0

## Styling Badge

### Expanded Mode
```css
className="ml-auto"
```
- Badge di sebelah kanan label
- Ukuran normal (min-w-[20px] h-5)

### Collapsed Mode
```css
className="absolute -top-1 -right-1 text-[10px] min-w-[16px] h-4"
```
- Badge di pojok kanan atas icon
- Ukuran lebih kecil untuk fit dengan icon

## Error Handling

### 1. Token Expired
- Jika response 401, clear token dan set count = 0
- User akan diarahkan ke login page

### 2. Network Error
- Keep previous count value
- Log error ke console
- Tidak mengganggu UI

### 3. Server Error
- Keep previous count value
- Log error ke console
- Retry pada polling berikutnya

## Performance

### 1. Polling Interval
- **30 detik**: Balance antara realtime dan performance
- Bisa disesuaikan di hook `useUnreadMessages`

### 2. Conditional Rendering
- Badge hanya di-render jika count > 0
- Mengurangi DOM manipulation

### 3. Memoization
- Hook menggunakan `useCallback` untuk prevent unnecessary re-renders
- Dependency array yang tepat untuk useEffect

## Testing

### 1. Manual Testing
1. Buka dashboard admin
2. Kirim pesan dari frontend
3. Lihat badge muncul di sidebar
4. Mark message as read
5. Lihat badge hilang/berkurang
6. Collapse sidebar
7. Lihat badge masih muncul di icon

### 2. API Testing
```bash
# Test unread count endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:3000/api/messages/unread-count
```

## File yang Dibuat/Dimodifikasi

### File Baru:
- `src/app/api/messages/unread-count/route.ts`
- `src/app/hooks/useUnreadMessages.ts`
- `src/app/components/admin-dashboard/NotificationBadge.tsx`

### File yang Dimodifikasi:
- `src/app/components/admin-dashboard/Sidebar.tsx`
- `src/app/dashboard/messages/list/page.tsx`

## Konfigurasi

### Polling Interval
Ubah di `useUnreadMessages.ts`:
```typescript
const interval = setInterval(() => {
  fetchUnreadCount();
}, 30000); // 30 detik
```

### Badge Styling
Ubah di `NotificationBadge.tsx`:
```typescript
className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full min-w-[20px] h-5"
```

## Catatan Teknis

- Badge hanya muncul untuk menu "Messages"
- Polling berhenti ketika komponen unmount
- Token validation otomatis
- Responsive design untuk semua ukuran sidebar
- TypeScript support penuh


