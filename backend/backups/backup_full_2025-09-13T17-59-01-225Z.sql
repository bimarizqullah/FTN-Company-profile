-- MySQL dump 10.13  Distrib 8.0.43, for Linux (x86_64)
--
-- Host: localhost    Database: fiber-teknologinusantara
-- ------------------------------------------------------
-- Server version	8.0.43-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Backup`
--

DROP TABLE IF EXISTS `Backup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Backup` (
  `id` int NOT NULL AUTO_INCREMENT,
  `filename` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `backupType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tables` json NOT NULL,
  `includeData` tinyint(1) NOT NULL DEFAULT '1',
  `includeSchema` tinyint(1) NOT NULL DEFAULT '1',
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fileSize` int NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'completed',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `createdBy` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Backup_createdBy_fkey` (`createdBy`),
  CONSTRAINT `Backup_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Backup`
--

LOCK TABLES `Backup` WRITE;
/*!40000 ALTER TABLE `Backup` DISABLE KEYS */;
/*!40000 ALTER TABLE `Backup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CacheLog`
--

DROP TABLE IF EXISTS `CacheLog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CacheLog` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cacheType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `clearedItems` json NOT NULL,
  `totalCleared` int NOT NULL DEFAULT '0',
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `clearedBy` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `CacheLog_clearedBy_fkey` (`clearedBy`),
  CONSTRAINT `CacheLog_clearedBy_fkey` FOREIGN KEY (`clearedBy`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CacheLog`
--

LOCK TABLES `CacheLog` WRITE;
/*!40000 ALTER TABLE `CacheLog` DISABLE KEYS */;
/*!40000 ALTER TABLE `CacheLog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Contact`
--

DROP TABLE IF EXISTS `Contact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Contact` (
  `id` int NOT NULL AUTO_INCREMENT,
  `officeId` int NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `position` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `whatsapp` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `createdBy` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Contact_officeId_idx` (`officeId`),
  KEY `Contact_createdBy_fkey` (`createdBy`),
  CONSTRAINT `Contact_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Contact_officeId_fkey` FOREIGN KEY (`officeId`) REFERENCES `Office` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Contact`
--

LOCK TABLES `Contact` WRITE;
/*!40000 ALTER TABLE `Contact` DISABLE KEYS */;
INSERT INTO `Contact` VALUES (1,2,'Bima Cahya Rizqullah','Administrator Office Madiun','bmchy11@gmail.com','08123123123','active','2025-08-24 17:00:14.433','2025-08-24 17:39:12.758',1);
/*!40000 ALTER TABLE `Contact` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Gallery`
--

DROP TABLE IF EXISTS `Gallery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Gallery` (
  `id` int NOT NULL AUTO_INCREMENT,
  `imagePath` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `createdBy` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Gallery_createdBy_fkey` (`createdBy`),
  CONSTRAINT `Gallery_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Gallery`
--

LOCK TABLES `Gallery` WRITE;
/*!40000 ALTER TABLE `Gallery` DISABLE KEYS */;
INSERT INTO `Gallery` VALUES (1,'/uploads/gallery/b6c1ceb8-dc6b-4dc1-930b-e3d52ce4e1a9-1685006480254-83591aaa-b6f2-4bbf-a4e0-565316cdf07b.jpg','“Replika Shinkansen Jepang, simbol inovasi transportasi modern yang menginspirasi masa depan.”','active','2025-08-24 16:47:34.242','2025-08-24 17:49:09.927',1),(2,'/uploads/gallery/ae630bf1-3339-4bb3-9970-43635c814e8b-f8l85gh59j4xqh3.jpeg','“Penandatanganan kerja sama resmi berlangsung, menandai komitmen bersama untuk maju.”','active','2025-08-24 17:46:51.805','2025-08-24 17:49:35.392',1),(3,'/uploads/gallery/3e93bf82-62f1-4e8d-a641-bc1bd3cdabc3-Screenshot from 2025-08-11 23-24-25.png','“Pekerja tengah melakukan penggalian saluran di Jalan Slamet Riyadi, Madiun untuk perbaikan infrastruktur.”','active','2025-08-24 17:47:12.175','2025-08-24 17:49:57.812',1),(4,'/uploads/gallery/cba586c8-2286-41f0-a8fe-005dfa632b58-1685006480254-83591aaa-b6f2-4bbf-a4e0-565316cdf07b.jpg','test1','active','2025-08-29 04:28:41.110','2025-08-29 04:28:41.110',1),(5,'/uploads/gallery/f148eedc-684f-462d-845d-c85e30bbe317-f8l85gh59j4xqh3.jpeg','test2','active','2025-08-29 04:28:52.639','2025-08-29 04:28:52.639',1),(6,'/uploads/gallery/fd9b788d-c966-409d-82b1-a8c4fbd04024-Screenshot from 2025-08-11 23-24-25.png','test3','active','2025-08-29 04:29:05.479','2025-08-29 04:29:05.479',1),(7,'/uploads/gallery/1030335b-bf5b-47d5-80be-5caca5621524-1685006480254-83591aaa-b6f2-4bbf-a4e0-565316cdf07b.jpg','test4','active','2025-08-29 04:29:18.504','2025-08-29 04:29:18.504',1),(8,'/uploads/gallery/706bd996-47ee-40f5-a449-697112416be8-f8l85gh59j4xqh3.jpeg','test5','active','2025-08-29 04:29:29.693','2025-08-29 04:29:29.693',1),(9,'/uploads/gallery/31ace88b-2380-4974-91c9-3c77c061d40b-Screenshot from 2025-08-11 23-24-25.png','test6','active','2025-08-29 04:29:53.022','2025-08-29 04:29:53.022',1),(10,'/uploads/gallery/f2be169c-f33e-4543-b3f1-2954736295ff-1685006480254-83591aaa-b6f2-4bbf-a4e0-565316cdf07b.jpg','test7','active','2025-08-29 04:30:11.607','2025-08-29 04:30:11.607',1);
/*!40000 ALTER TABLE `Gallery` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Language`
--

DROP TABLE IF EXISTS `Language`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Language` (
  `id` int NOT NULL AUTO_INCREMENT,
  `imagePath` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `language` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `createdBy` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Language_createdBy_fkey` (`createdBy`),
  CONSTRAINT `Language_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Language`
--

LOCK TABLES `Language` WRITE;
/*!40000 ALTER TABLE `Language` DISABLE KEYS */;
/*!40000 ALTER TABLE `Language` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Management`
--

DROP TABLE IF EXISTS `Management`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Management` (
  `id` int NOT NULL AUTO_INCREMENT,
  `imagePath` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `position` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `createdBy` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Management_createdBy_fkey` (`createdBy`),
  CONSTRAINT `Management_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Management`
--

LOCK TABLES `Management` WRITE;
/*!40000 ALTER TABLE `Management` DISABLE KEYS */;
INSERT INTO `Management` VALUES (1,'/uploads/management/1756055983195-360_F_460918802_XVCymFr7MoziFpnInbTDvrlblYhvAOi2.jpg','Andjar Wiratma','Komisaris Utama / President Commissioner','active','2025-08-24 17:19:43.198','2025-09-09 15:37:16.479',1),(2,'/uploads/management/1756056011465-360_F_431647519_usrbQ8Z983hTYe8zgA7t1XVc5fEtqcpa.jpg','Purnomo','Komisaris / Commissioner','active','2025-08-24 17:20:11.466','2025-08-24 17:20:11.466',1),(3,'/uploads/management/1756056059069-Perfocal_17-11-2019_TYWFAQ_100_standard-3.jpg','Widyawati Farah Imelda','Direktur Utama / President Director','active','2025-08-24 17:20:59.071','2025-08-24 17:20:59.071',1),(4,'/uploads/management/1756056086315-360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg','Jhon Jeffri AD','Direktur Operasional / Operational Director','active','2025-08-24 17:21:26.316','2025-08-24 17:21:26.316',1);
/*!40000 ALTER TABLE `Management` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Message`
--

DROP TABLE IF EXISTS `Message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Message` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subject` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isRead` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Message`
--

LOCK TABLES `Message` WRITE;
/*!40000 ALTER TABLE `Message` DISABLE KEYS */;
INSERT INTO `Message` VALUES (1,'BIMA CAHYA RIZQULLAH','bmchy11@gmail.com','082141921942','Permohonan','halo dari Bima',1,'2025-09-13 17:07:37.522','2025-09-13 17:07:54.964'),(2,'BIMA CAHYA RIZQULLAH','bmchy11@gmail.com','082141921942','Permohonan','11',1,'2025-09-13 17:10:46.546','2025-09-13 17:25:49.424'),(3,'asdasd','bmchy11@gmail.com','082141921942','Permohonan','qwesadasd',1,'2025-09-13 17:11:04.004','2025-09-13 17:25:48.374'),(4,'BIMA CAHYA RIZQULLAH','bmchy11@gmail.com','082141921942','Permohonan','jhdjdhjfhjdgdhjgj',1,'2025-09-13 17:11:35.762','2025-09-13 17:25:47.332'),(5,'BIMA CAHYA RIZQULLAH','bmchy11@gmail.com','082141921942','Permohonan','11111111',1,'2025-09-13 17:16:28.433','2025-09-13 17:25:46.582');
/*!40000 ALTER TABLE `Message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Office`
--

DROP TABLE IF EXISTS `Office`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Office` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `createdBy` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Office_createdBy_fkey` (`createdBy`),
  CONSTRAINT `Office_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Office`
--

LOCK TABLES `Office` WRITE;
/*!40000 ALTER TABLE `Office` DISABLE KEYS */;
INSERT INTO `Office` VALUES (1,'Head Office - PT Fiber Teknologi Nusantara (Bekasi, Jawa Barat)','Jln. Telaga Sarangan IV. No. 85. Kel. pengasinan. Kec. Rawalumbu. Kota Bekasi. Jawa Barat.','08123456789','fiber-teknologinusantara@gmail.com','active','2025-08-24 16:51:37.612','2025-08-24 16:51:37.612',1),(2,'Branch Office - PT Fiber Teknologi Nusantara (Madiun, Jawa Timur)','Jl. Karta Wijaya No.30, Klegen, Kec. Kartoharjo, Kota Madiun, Jawa Timur 63117','08123456678','fiber-teknologinusantara@gmail.com','active','2025-08-24 16:53:54.072','2025-08-24 16:53:54.072',1);
/*!40000 ALTER TABLE `Office` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Permission`
--

DROP TABLE IF EXISTS `Permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `permission` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Permission_permission_key` (`permission`)
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Permission`
--

LOCK TABLES `Permission` WRITE;
/*!40000 ALTER TABLE `Permission` DISABLE KEYS */;
INSERT INTO `Permission` VALUES (1,'read','Read permission'),(2,'write','Write permission'),(3,'user:create','Membuat user baru'),(4,'user:read','Melihat data user'),(5,'user:update','Mengupdate data user'),(6,'user:delete','Menghapus user'),(7,'user:list','Melihat daftar user'),(8,'management:create','Membuat anggota management'),(9,'management:read','Melihat data management'),(10,'management:update','Mengupdate data management'),(11,'management:delete','Menghapus anggota management'),(12,'management:list','Melihat daftar management'),(13,'slider:create','Membuat slider baru'),(14,'slider:read','Melihat data slider'),(15,'slider:update','Mengupdate slider'),(16,'slider:delete','Menghapus slider'),(17,'slider:list','Melihat daftar slider'),(18,'gallery:create','Upload foto ke gallery'),(19,'gallery:read','Melihat gallery'),(20,'gallery:update','Mengupdate foto gallery'),(21,'gallery:delete','Menghapus foto gallery'),(22,'gallery:list','Melihat daftar gallery'),(23,'service:create','Membuat layanan baru'),(24,'service:read','Melihat data layanan'),(25,'service:update','Mengupdate layanan'),(26,'service:delete','Menghapus layanan'),(27,'service:list','Melihat daftar layanan'),(28,'project:create','Membuat project baru'),(29,'project:read','Melihat data project'),(30,'project:update','Mengupdate project'),(31,'project:delete','Menghapus project'),(32,'project:list','Melihat daftar project'),(33,'contact:create','Membuat kontak baru'),(34,'contact:read','Melihat data kontak'),(35,'contact:update','Mengupdate kontak'),(36,'contact:delete','Menghapus kontak'),(37,'contact:list','Melihat daftar kontak'),(38,'office:create','Membuat kantor baru'),(39,'office:read','Melihat data kantor'),(40,'office:update','Mengupdate kantor'),(41,'office:delete','Menghapus kantor'),(42,'office:list','Melihat daftar kantor'),(43,'role:create','Membuat role baru'),(44,'role:read','Melihat data role'),(45,'role:update','Mengupdate role'),(46,'role:delete','Menghapus role'),(47,'role:list','Melihat daftar role'),(48,'permission:create','Membuat permission baru'),(49,'permission:read','Melihat data permission'),(50,'permission:update','Mengupdate permission'),(51,'permission:delete','Menghapus permission'),(52,'permission:list','Melihat daftar permission'),(53,'role_permission:create','Assign permission ke role'),(54,'role_permission:read','Melihat role-permission mapping'),(55,'role_permission:update','Mengupdate role-permission mapping'),(56,'role_permission:delete','Menghapus role-permission mapping'),(57,'role_permission:list','Melihat daftar role-permission'),(58,'user_role:create','Assign role ke user'),(59,'user_role:read','Melihat user-role mapping'),(60,'user_role:update','Mengupdate user-role mapping'),(61,'user_role:delete','Menghapus user-role mapping'),(62,'user_role:list','Melihat daftar user-role'),(63,'dashboard:access','Akses dashboard'),(64,'dashboard:stats','Melihat statistik dashboard'),(65,'system:settings','Mengakses pengaturan sistem'),(66,'system:backup','Melakukan backup sistem'),(67,'system:logs','Melihat log sistem'),(68,'profile:read','Melihat profil sendiri'),(69,'profile:update','Mengupdate profil sendiri'),(70,'profile:change_password','Mengubah password sendiri'),(71,'content:manage','Mengelola konten'),(72,'content:publish','Mempublikasi konten'),(73,'content:moderate','Moderasi konten');
/*!40000 ALTER TABLE `Permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Project`
--

DROP TABLE IF EXISTS `Project`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Project` (
  `id` int NOT NULL AUTO_INCREMENT,
  `imagePath` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `location` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('ongoing','pending','terminated') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ongoing',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `createdBy` int NOT NULL,
  `endDate` datetime(3) DEFAULT NULL,
  `startDate` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Project_createdBy_fkey` (`createdBy`),
  CONSTRAINT `Project_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Project`
--

LOCK TABLES `Project` WRITE;
/*!40000 ALTER TABLE `Project` DISABLE KEYS */;
INSERT INTO `Project` VALUES (1,'/uploads/projects/1756057903270-images (1).jpeg','Java Backbone Project','Pulau Jawa, Indonesia','Proyek Kabel Bawah Tanah Pulau Jawa','pending','2025-08-24 17:51:43.273','2025-08-24 17:51:43.273',1,NULL,NULL),(2,'/uploads/projects/1756057941463-images.jpeg','Madiun City Project (33Km)','Kota Madiun, Jawa Timur, Indonesia','Proyek Kabel Bawah Tanah Kota Madiun','ongoing','2025-08-24 17:52:21.465','2025-08-24 17:52:21.465',1,NULL,NULL);
/*!40000 ALTER TABLE `Project` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RestoreLog`
--

DROP TABLE IF EXISTS `RestoreLog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RestoreLog` (
  `id` int NOT NULL AUTO_INCREMENT,
  `backupId` int NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'in_progress',
  `errorMessage` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `completedAt` datetime(3) DEFAULT NULL,
  `restoredBy` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `RestoreLog_restoredBy_fkey` (`restoredBy`),
  KEY `RestoreLog_backupId_fkey` (`backupId`),
  CONSTRAINT `RestoreLog_backupId_fkey` FOREIGN KEY (`backupId`) REFERENCES `Backup` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `RestoreLog_restoredBy_fkey` FOREIGN KEY (`restoredBy`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RestoreLog`
--

LOCK TABLES `RestoreLog` WRITE;
/*!40000 ALTER TABLE `RestoreLog` DISABLE KEYS */;
/*!40000 ALTER TABLE `RestoreLog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Role`
--

DROP TABLE IF EXISTS `Role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Role_role_key` (`role`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Role`
--

LOCK TABLES `Role` WRITE;
/*!40000 ALTER TABLE `Role` DISABLE KEYS */;
INSERT INTO `Role` VALUES (1,'superadmin','Administrator role'),(2,'user','Regular user role'),(3,'admin','Administrator role for content management');
/*!40000 ALTER TABLE `Role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RolePermission`
--

DROP TABLE IF EXISTS `RolePermission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RolePermission` (
  `roleId` int NOT NULL,
  `permissionId` int NOT NULL,
  PRIMARY KEY (`roleId`,`permissionId`),
  KEY `RolePermission_roleId_idx` (`roleId`),
  KEY `RolePermission_permissionId_idx` (`permissionId`),
  CONSTRAINT `RolePermission_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `Permission` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `RolePermission_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RolePermission`
--

LOCK TABLES `RolePermission` WRITE;
/*!40000 ALTER TABLE `RolePermission` DISABLE KEYS */;
INSERT INTO `RolePermission` VALUES (1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8),(1,9),(1,10),(1,11),(1,12),(1,13),(1,14),(1,15),(1,16),(1,17),(1,18),(1,19),(1,20),(1,21),(1,22),(1,23),(1,24),(1,25),(1,26),(1,27),(1,28),(1,29),(1,30),(1,31),(1,32),(1,33),(1,34),(1,35),(1,36),(1,37),(1,38),(1,39),(1,40),(1,41),(1,42),(1,43),(1,44),(1,45),(1,46),(1,47),(1,48),(1,49),(1,50),(1,51),(1,52),(1,53),(1,54),(1,55),(1,56),(1,57),(1,58),(1,59),(1,60),(1,61),(1,62),(1,63),(1,64),(1,65),(1,66),(1,67),(1,68),(1,69),(1,70),(1,71),(1,72),(1,73),(2,63),(2,68),(2,69),(2,70),(3,8),(3,9),(3,10),(3,11),(3,12),(3,13),(3,14),(3,15),(3,16),(3,17),(3,18),(3,19),(3,20),(3,21),(3,22),(3,23),(3,24),(3,25),(3,26),(3,27),(3,28),(3,29),(3,30),(3,31),(3,32),(3,33),(3,34),(3,35),(3,36),(3,37),(3,38),(3,39),(3,40),(3,41),(3,42),(3,63),(3,64),(3,68),(3,69),(3,70),(3,71),(3,72);
/*!40000 ALTER TABLE `RolePermission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Service`
--

DROP TABLE IF EXISTS `Service`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Service` (
  `id` int NOT NULL AUTO_INCREMENT,
  `imagePath` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `createdBy` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Service_createdBy_fkey` (`createdBy`),
  CONSTRAINT `Service_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Service`
--

LOCK TABLES `Service` WRITE;
/*!40000 ALTER TABLE `Service` DISABLE KEYS */;
INSERT INTO `Service` VALUES (1,'/uploads/services/1756272290322-Screenshot from 2025-08-11 23-28-43.png','test','test','2025-08-27 05:24:50.323','2025-08-27 05:24:50.323',1),(2,'/uploads/services/1756276150832-Screenshot from 2025-08-11 23-29-03.png','test2','test2','2025-08-27 06:29:10.834','2025-08-27 06:29:10.834',1);
/*!40000 ALTER TABLE `Service` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Slider`
--

DROP TABLE IF EXISTS `Slider`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Slider` (
  `id` int NOT NULL AUTO_INCREMENT,
  `imagePath` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tagline` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subtitle` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `createdBy` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Slider_createdBy_fkey` (`createdBy`),
  CONSTRAINT `Slider_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Slider`
--

LOCK TABLES `Slider` WRITE;
/*!40000 ALTER TABLE `Slider` DISABLE KEYS */;
INSERT INTO `Slider` VALUES (1,'/uploads/sliders/b979907b-9812-4d1a-bcc6-e798fc91b4b4-cubic-3d-geometry-4k-dk-3840x2160.jpg','\"Fastest\"','PT Fiber Teknologi Nusantara','\"Solusi Kabel Bawah Tanah\"','active','2025-08-24 17:16:01.622','2025-08-24 17:16:33.425',1),(2,'/uploads/sliders/6ff9bfdb-aa4e-4795-afeb-e9bf0b9ac72f-3d-cgi-geometry-pattern-bo-3840x2160.jpg','Cleanest','PT Fiber Teknologi Nusantara','\"Mengedepankan Kerapihan\"','active','2025-08-24 17:17:05.991','2025-08-24 17:17:05.991',1),(3,'/uploads/sliders/3a860e85-6c50-4b20-a119-94eb0eade9f3-3d-cubes-loops-surface-1f-3840x2160.jpg','\"Profesionalisme\"','PT Fiber Teknologi Nusantara','\"Konsistensi Pekerjaan\"','active','2025-08-24 17:18:03.349','2025-08-27 05:39:04.699',1);
/*!40000 ALTER TABLE `Slider` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `id` int NOT NULL AUTO_INCREMENT,
  `imagePath` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (1,'/uploads/1756057478458-logo FTN copy2.png','Super Admin Fiber Teknologi Nusantara','superadminftn@fiber-teknologinusantara.com','$2b$10$lyUvtBKzZ6xppaXD/kPfHui8d5so7Kgfa7Qd.13odS3nzlsc4XRWi','active','2025-08-24 16:40:50.693','2025-09-09 15:25:28.251'),(2,NULL,'Regular User','user@example.com','$2b$10$0NWjh65ph3E5Jd.5ZrHyPOKQm2vrGNX6pmnFWtQKc120l8Can7.7S','active','2025-08-24 16:40:50.696','2025-08-24 16:40:50.696'),(3,NULL,'Admin Fiber Teknologi Nusantara','adminftn@fiber-teknologinusantara.com','$2b$10$QGiTjyMbK.F4OvvERdgJG.XjNfYSUnGsROlauLrocLhyVdOOwXjoy','active','2025-09-09 16:05:49.280','2025-09-09 16:05:49.280');
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserRole`
--

DROP TABLE IF EXISTS `UserRole`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserRole` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `roleId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UserRole_userId_roleId_key` (`userId`,`roleId`),
  KEY `UserRole_userId_idx` (`userId`),
  KEY `UserRole_roleId_idx` (`roleId`),
  CONSTRAINT `UserRole_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `UserRole_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserRole`
--

LOCK TABLES `UserRole` WRITE;
/*!40000 ALTER TABLE `UserRole` DISABLE KEYS */;
INSERT INTO `UserRole` VALUES (1,1,1),(2,2,2),(3,3,3);
/*!40000 ALTER TABLE `UserRole` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('079f3e77-3c09-4807-9b0c-508550fd355d','f6e4c47acb93af1c8fa0c9e1d7d6776f381723669710faa1180956420780716f','2025-09-11 03:20:59.036','20250911032059_add_project_dates',NULL,NULL,'2025-09-11 03:20:59.011',1),('1b952d2a-5cb4-4889-88ef-4fb6249195b9','cba5c3872b4f4456705919c42984393fe5aa0a62fecf6f04a0b07ca02e73c8a7','2025-08-24 16:36:47.023','20250824163646_add_office_contact_models',NULL,NULL,'2025-08-24 16:36:46.165',1),('1fc9e0c9-8e7f-4206-a76c-5f0ca9615167','7217940b7cec12de9ab74bd0039ed6b6404c48c1558d2c0b0ebf5af04ce1a11d','2025-09-13 17:46:54.924','20250913174654_add_backup_cache_restore_models',NULL,NULL,'2025-09-13 17:46:54.663',1),('d97017fb-ecbd-4cfc-a4b4-c7c78cd61703','51afdc14e70b2c8957a49d66a13a6164c5f2fc70e052208ddcc361fa69c82ece','2025-09-13 16:42:55.241','20250913164255_add_message_table',NULL,NULL,'2025-09-13 16:42:55.224',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'fiber-teknologinusantara'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-14  0:59:01
