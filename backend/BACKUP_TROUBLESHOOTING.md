# Troubleshooting Backup yang Failed

## Masalah yang Ditemukan

### **Root Cause: Environment Variables**
Backup failed karena sistem menggunakan `DATABASE_URL` dari Prisma, bukan `DATABASE_USER`, `DATABASE_PASSWORD`, dan `DATABASE_NAME` secara terpisah.

## Solusi yang Diimplementasikan

### **1. Fixed Database Connection Parsing**
- **Sebelum**: Menggunakan `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_NAME` secara terpisah
- **Sesudah**: Parse `DATABASE_URL` untuk mendapatkan connection details

### **2. Enhanced Error Handling**
- Validasi environment variables
- Better error messages
- Logging untuk debugging
- Save failed backup records

### **3. Improved MySQL Commands**
- Added `--single-transaction` untuk consistency
- Added `--routines` dan `--triggers` untuk completeness
- Better port handling dengan `-P` flag

## Konfigurasi yang Diperlukan

### **Environment Variables**
Buat file `.env` di root backend dengan konfigurasi berikut:

```env
# Database Configuration
DATABASE_URL="mysql://username:password@host:port/database_name"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key"

# Environment
NODE_ENV="development"
```

### **Contoh Konfigurasi**

#### **Local Development**
```env
DATABASE_URL="mysql://bimadev:maharaja098@localhost:3306/fiber-teknologinusantara"
```

#### **Production**
```env
DATABASE_URL="mysql://username:password@your-production-host:3306/fiber-teknologinusantara"
```

#### **Docker**
```env
DATABASE_URL="mysql://root:password@db:3306/fiber-teknologinusantara"
```

## Testing Database Connection

### **Manual Test**
Gunakan script test yang telah dibuat:

```bash
# Set DATABASE_URL dan test koneksi
DATABASE_URL="mysql://bimadev:maharaja098@localhost:3306/fiber-teknologinusantara" node test-db-connection.js
```

### **Expected Output**
```
Testing database connection...
Environment variables:
DATABASE_URL: ***SET***
Parsed connection details:
Host: localhost
Port: 3306
User: root
Database: fiber-teknologinusantara
Password: ***SET***

Testing basic connection...
✅ Basic connection successful

Testing database access...
✅ Database access successful
Tables found: 17

Testing mysqldump...
✅ mysqldump test successful
Dump output length: 1234
```

## Common Issues dan Solutions

### **1. DATABASE_URL Not Set**
**Error**: `DATABASE_URL is not configured`

**Solution**: 
- Buat file `.env` di root backend
- Set `DATABASE_URL` dengan format yang benar
- Restart aplikasi

### **2. Database Connection Failed**
**Error**: `Connection failed: Access denied for user`

**Solutions**:
- Periksa username dan password
- Pastikan database server berjalan
- Periksa host dan port
- Pastikan user memiliki akses ke database

### **3. Database Not Found**
**Error**: `Unknown database 'database_name'`

**Solutions**:
- Pastikan database sudah dibuat
- Periksa nama database di DATABASE_URL
- Jalankan `npx prisma migrate dev` untuk setup database

### **4. mysqldump Command Not Found**
**Error**: `mysqldump: command not found`

**Solutions**:
- Install MySQL client tools
- Ubuntu/Debian: `sudo apt-get install mysql-client`
- CentOS/RHEL: `sudo yum install mysql`
- macOS: `brew install mysql-client`

### **5. Permission Denied**
**Error**: `Permission denied for user`

**Solutions**:
- Pastikan user memiliki privilege yang cukup
- Grant privileges: `GRANT ALL PRIVILEGES ON database_name.* TO 'username'@'host';`
- Restart MySQL service

### **6. Disk Space Issues**
**Error**: `No space left on device`

**Solutions**:
- Periksa disk space: `df -h`
- Hapus backup lama
- Pindahkan backup ke storage lain
- Clean up temporary files

## Backup Command Examples

### **Full Backup**
```bash
mysqldump -h localhost -P 3306 -u bimadev -pmaharaja098 --single-transaction --routines --triggers fiber-teknologinusantara > backup.sql
```

### **Partial Backup (Core Tables)**
```bash
mysqldump -h localhost -P 3306 -u bimadev -pmaharaja098 --single-transaction --routines --triggers fiber-teknologinusantara User Role Permission > backup.sql
```

### **Schema Only**
```bash
mysqldump -h localhost -P 3306 -u bimadev -pmaharaja098 --no-data --single-transaction --routines --triggers fiber-teknologinusantara > schema.sql
```

### **Data Only**
```bash
mysqldump -h localhost -P 3306 -u bimadev -pmaharaja098 --no-create-info --single-transaction --routines --triggers fiber-teknologinusantara > data.sql
```

## Restore Command Examples

### **Full Restore**
```bash
mysql -h localhost -P 3306 -u bimadev -pmaharaja098 fiber-teknologinusantara < backup.sql
```

### **Schema Restore**
```bash
mysql -h localhost -P 3306 -u bimadev -pmaharaja098 fiber-teknologinusantara < schema.sql
```

## Monitoring dan Logging

### **Backup Logs**
- Check console logs untuk error messages
- Monitor backup status di database
- Check file system untuk backup files

### **Database Logs**
- MySQL error log: `/var/log/mysql/error.log`
- MySQL slow query log
- Application logs

### **System Logs**
- Check disk space
- Monitor memory usage
- Check network connectivity

## Best Practices

### **1. Environment Configuration**
- Gunakan `.env` file untuk development
- Gunakan environment variables untuk production
- Jangan commit `.env` file ke version control
- Gunakan `.env.example` sebagai template

### **2. Database Security**
- Gunakan strong passwords
- Limit database user privileges
- Enable SSL untuk production
- Regular security updates

### **3. Backup Strategy**
- Test backup secara berkala
- Simpan backup di multiple locations
- Implement backup rotation
- Monitor backup success rate

### **4. Error Handling**
- Implement proper error handling
- Log semua operasi backup
- Monitor backup failures
- Setup alerts untuk critical failures

## File yang Dimodifikasi

1. `src/app/api/system/backup/route.ts` - Fixed database connection parsing
2. `src/app/api/system/backup/[id]/restore/route.ts` - Fixed restore command
3. `test-db-connection.js` - Updated test script
4. `env.example` - Added environment configuration template

## Testing Checklist

- [ ] DATABASE_URL configured correctly
- [ ] Database connection successful
- [ ] mysqldump command available
- [ ] Database user has proper privileges
- [ ] Sufficient disk space available
- [ ] Backup files created successfully
- [ ] Restore functionality working
- [ ] Error handling working properly

## Next Steps

1. **Setup Environment**: Buat file `.env` dengan DATABASE_URL yang benar
2. **Test Connection**: Jalankan test script untuk verify koneksi
3. **Test Backup**: Coba buat backup melalui UI
4. **Monitor Logs**: Check console logs untuk error messages
5. **Verify Files**: Pastikan backup files terbuat di folder `backups/`

Dengan perbaikan ini, sistem backup seharusnya berfungsi dengan baik dan memberikan error messages yang lebih informatif jika ada masalah.
