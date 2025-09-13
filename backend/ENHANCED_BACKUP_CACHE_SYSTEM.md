# Sistem Backup Data dan Clear Cache yang Disempurnakan

## Overview
Sistem backup data dan clear cache telah disempurnakan untuk memberikan fleksibilitas maksimal sesuai kebutuhan user. Sistem ini mendukung berbagai jenis backup dan cache clearing dengan opsi yang dapat dikustomisasi.

## Fitur Utama

### 🔄 **Sistem Backup Fleksibel**

#### **1. Jenis Backup**
- **Full Backup**: Backup seluruh database
- **Partial Backup**: Backup tabel-tabel inti (User, Role, Permission)
- **Selective Backup**: User dapat memilih tabel mana yang akan di-backup

#### **2. Opsi Backup**
- **Include Schema**: Menyertakan struktur tabel
- **Include Data**: Menyertakan data dalam tabel
- **Description**: Deskripsi untuk backup (opsional)

#### **3. Backup History**
- Menampilkan riwayat backup terbaru
- Status backup (completed, failed, in_progress)
- Ukuran file backup
- Tombol restore untuk setiap backup

### 🗑️ **Sistem Clear Cache Fleksibel**

#### **1. Jenis Cache**
- **All Caches**: Clear semua jenis cache
- **Database Cache**: Clear cache database dan koneksi
- **Session Cache**: Clear file session dan in-memory session
- **File Cache**: Clear file upload dan temporary files
- **Memory Cache**: Clear Node.js memory cache
- **Redis Cache**: Clear Redis cache (jika dikonfigurasi)

#### **2. Opsi Clear Cache**
- **Clear All**: Clear semua jenis cache sekaligus
- **Specific Keys**: Clear cache dengan key tertentu
- **Selective Clearing**: Pilih jenis cache yang akan di-clear

#### **3. Cache History**
- Menampilkan riwayat operasi clear cache
- Jumlah item yang di-clear
- Waktu operasi

## API Endpoints

### **Backup Management**

#### **POST /api/system/backup**
Membuat backup baru dengan opsi fleksibel.

**Request Body:**
```json
{
  "backupType": "full|partial|selective",
  "tables": ["User", "Role", "Permission"],
  "includeData": true,
  "includeSchema": true,
  "description": "Backup description"
}
```

**Response:**
```json
{
  "message": "Backup created successfully",
  "backup": {
    "id": 1,
    "filename": "backup_full_2024-01-15T10-30-00.sql",
    "backupType": "full",
    "fileSize": 2048576,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### **GET /api/system/backup**
Mendapatkan daftar backup dengan pagination.

**Query Parameters:**
- `page`: Halaman (default: 1)
- `limit`: Jumlah item per halaman (default: 10)
- `backupType`: Filter berdasarkan jenis backup

#### **POST /api/system/backup/[id]/restore**
Restore backup berdasarkan ID.

### **Cache Management**

#### **DELETE /api/system/cache**
Clear cache dengan opsi fleksibel.

**Request Body:**
```json
{
  "cacheType": "all|database|session|file|memory|redis",
  "specificKeys": ["key1", "key2"],
  "clearAll": true
}
```

**Response:**
```json
{
  "message": "Cache cleared successfully",
  "clearedItems": ["Prisma query cache", "Database connection pool"],
  "totalCleared": 2,
  "cacheType": "database"
}
```

#### **GET /api/system/cache**
Mendapatkan riwayat operasi clear cache.

### **System Information**

#### **GET /api/system/info**
Mendapatkan informasi sistem real-time.

**Response:**
```json
{
  "systemInfo": {
    "application": {
      "version": "1.0.0",
      "name": "Fiber Teknologi Nusantara",
      "environment": "production"
    },
    "database": {
      "version": "MySQL 8.0.35",
      "totalUsers": 25,
      "totalMessages": 150,
      "totalBackups": 12,
      "lastBackup": {
        "filename": "backup_full_2024-01-15T10-30-00.sql",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    },
    "system": {
      "uptime": "up 7 days, 14 hours",
      "totalCacheLogs": 45,
      "storage": {
        "used": "2.4 GB",
        "available": "47.6 GB",
        "total": "50 GB"
      }
    }
  }
}
```

#### **GET /api/system/tables**
Mendapatkan daftar tabel yang tersedia untuk backup.

## Database Schema

### **Backup Model**
```prisma
model Backup {
  id          Int       @id @default(autoincrement())
  filename    String    // Nama file backup
  backupType  String    // full, partial, selective
  tables      Json      @default("[]") // Array of table names
  includeData Boolean   @default(true) // Include data in backup
  includeSchema Boolean  @default(true) // Include schema in backup
  description String?   // Deskripsi backup
  fileSize    Int       // Ukuran file dalam bytes
  status      String    @default("completed") // completed, failed, in_progress
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  createdBy   Int
  user        User      @relation("BackupCreatedBy", fields: [createdBy], references: [id], onDelete: Cascade)
  restoreLogs RestoreLog[]
}
```

### **CacheLog Model**
```prisma
model CacheLog {
  id           Int       @id @default(autoincrement())
  cacheType    String    // all, database, session, file, memory, redis
  clearedItems Json      @default("[]") // Array of cleared items
  totalCleared Int       @default(0) // Total number of items cleared
  description  String?   // Deskripsi aktivitas clear cache
  createdAt    DateTime  @default(now())
  clearedBy    Int
  user         User      @relation("CacheLogClearedBy", fields: [clearedBy], references: [id], onDelete: Cascade)
}
```

### **RestoreLog Model**
```prisma
model RestoreLog {
  id            Int       @id @default(autoincrement())
  backupId      Int       // Foreign key ke Backup
  status        String    @default("in_progress") // in_progress, completed, failed
  errorMessage  String?   // Pesan error jika restore gagal
  description   String?   // Deskripsi restore
  createdAt     DateTime  @default(now())
  completedAt   DateTime? // Waktu selesai restore
  restoredBy    Int
  user          User      @relation("RestoreLogRestoredBy", fields: [restoredBy], references: [id], onDelete: Cascade)
  backup        Backup    @relation(fields: [backupId], references: [id], onDelete: Cascade)
}
```

## User Interface

### **System Settings Page**

#### **Backup Management Section**
- **Automatic Backup Frequency**: Konfigurasi frekuensi backup otomatis
- **Create Backup Now**: Tombol untuk membuat backup manual
- **Backup Options Modal**: Modal dengan opsi backup yang fleksibel
- **Backup History**: Daftar backup terbaru dengan tombol restore

#### **Cache Management Section**
- **Clear System Cache**: Tombol untuk clear cache
- **Cache Options Modal**: Modal dengan opsi cache yang fleksibel
- **Cache History**: Riwayat operasi clear cache

#### **System Information Section**
- **Real-time System Info**: Informasi sistem yang update real-time
- **Database Statistics**: Statistik database (users, messages, backups)
- **Storage Information**: Informasi penggunaan storage
- **Server Uptime**: Waktu server berjalan

### **Modal Components**

#### **Backup Options Modal**
- **Backup Type Selection**: Dropdown untuk memilih jenis backup
- **Table Selection**: Checkbox untuk memilih tabel (jika selective)
- **Include Options**: Checkbox untuk schema dan data
- **Description Field**: Textarea untuk deskripsi backup

#### **Cache Options Modal**
- **Cache Type Selection**: Dropdown untuk memilih jenis cache
- **Clear All Option**: Checkbox untuk clear semua cache
- **Specific Keys**: Input untuk key cache tertentu

## Konfigurasi Database

### **MySQL Commands**
Sistem menggunakan `mysqldump` untuk backup dan `mysql` untuk restore:

```bash
# Full backup
mysqldump -h localhost -u username -ppassword database_name > backup.sql

# Partial backup
mysqldump -h localhost -u username -ppassword database_name table1 table2 > backup.sql

# Schema only
mysqldump -h localhost -u username -ppassword --no-data database_name > backup.sql

# Data only
mysqldump -h localhost -u username -ppassword --no-create-info database_name > backup.sql

# Restore
mysql -h localhost -u username -ppassword database_name < backup.sql
```

### **Environment Variables**
```env
DATABASE_USER=your_username
DATABASE_PASSWORD=your_password
DATABASE_NAME=your_database_name
```

## Keamanan

### **Authentication**
- Semua endpoint memerlukan Bearer token
- Token diverifikasi menggunakan JWT
- User harus memiliki akses admin

### **Authorization**
- Hanya admin yang dapat melakukan backup/restore
- Hanya admin yang dapat clear cache
- Log semua aktivitas untuk audit

### **File Security**
- Backup files disimpan di folder `backups/`
- File backup memiliki timestamp untuk identifikasi
- Restore memerlukan konfirmasi user

## Error Handling

### **Backup Errors**
- Database connection errors
- File system errors
- Permission errors
- Disk space errors

### **Cache Errors**
- Cache service unavailable
- Permission errors
- Invalid cache keys

### **Restore Errors**
- Backup file not found
- Database connection errors
- Schema conflicts
- Data integrity errors

## Monitoring dan Logging

### **Backup Logging**
- Log semua operasi backup
- Track status backup (in_progress, completed, failed)
- Monitor file size dan waktu eksekusi

### **Cache Logging**
- Log semua operasi clear cache
- Track jumlah item yang di-clear
- Monitor waktu eksekusi

### **System Monitoring**
- Real-time system information
- Database statistics
- Storage usage monitoring
- Server uptime tracking

## Best Practices

### **Backup Best Practices**
1. **Regular Backups**: Lakukan backup secara berkala
2. **Test Restores**: Test restore backup secara berkala
3. **Offsite Storage**: Simpan backup di lokasi terpisah
4. **Backup Rotation**: Hapus backup lama untuk menghemat space
5. **Documentation**: Dokumentasikan setiap backup

### **Cache Best Practices**
1. **Selective Clearing**: Clear cache yang diperlukan saja
2. **Monitor Performance**: Monitor performa setelah clear cache
3. **Scheduled Clearing**: Jadwalkan clear cache secara berkala
4. **Backup Before Clear**: Backup data penting sebelum clear cache
5. **Test After Clear**: Test aplikasi setelah clear cache

## Troubleshooting

### **Common Issues**

#### **Backup Issues**
- **Permission Denied**: Pastikan user memiliki akses ke database
- **Disk Space**: Pastikan ada cukup space untuk backup
- **Database Lock**: Pastikan tidak ada operasi database yang sedang berjalan

#### **Cache Issues**
- **Cache Not Cleared**: Restart aplikasi jika diperlukan
- **Performance Issues**: Monitor performa setelah clear cache
- **Memory Issues**: Clear memory cache jika aplikasi lambat

#### **Restore Issues**
- **Backup File Missing**: Pastikan file backup ada
- **Schema Conflicts**: Pastikan schema database kompatibel
- **Data Conflicts**: Backup data saat ini sebelum restore

## Future Enhancements

### **Planned Features**
1. **Automated Backup Scheduling**: Cron job untuk backup otomatis
2. **Backup Compression**: Kompresi backup untuk menghemat space
3. **Backup Encryption**: Enkripsi backup untuk keamanan
4. **Cloud Storage Integration**: Integrasi dengan cloud storage
5. **Backup Verification**: Verifikasi integritas backup
6. **Incremental Backups**: Backup incremental untuk efisiensi
7. **Backup Notifications**: Notifikasi email untuk backup status
8. **Backup Analytics**: Analisis penggunaan backup dan cache

### **Performance Optimizations**
1. **Parallel Processing**: Backup paralel untuk tabel besar
2. **Streaming Backup**: Streaming backup untuk database besar
3. **Cache Warming**: Pre-load cache setelah clear
4. **Background Processing**: Proses backup di background
5. **Progress Tracking**: Track progress backup/restore

Sistem backup dan cache yang disempurnakan ini memberikan fleksibilitas maksimal untuk user dalam mengelola data dan performa sistem sesuai dengan kebutuhan spesifik mereka.

