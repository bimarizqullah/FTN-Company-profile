-- CreateTable
CREATE TABLE `Backup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `filename` VARCHAR(191) NOT NULL,
    `backupType` VARCHAR(191) NOT NULL,
    `tables` JSON NOT NULL,
    `includeData` BOOLEAN NOT NULL DEFAULT true,
    `includeSchema` BOOLEAN NOT NULL DEFAULT true,
    `description` VARCHAR(191) NULL,
    `fileSize` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'completed',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CacheLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cacheType` VARCHAR(191) NOT NULL,
    `clearedItems` JSON NOT NULL,
    `totalCleared` INTEGER NOT NULL DEFAULT 0,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `clearedBy` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RestoreLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `backupId` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'in_progress',
    `errorMessage` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `completedAt` DATETIME(3) NULL,
    `restoredBy` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Backup` ADD CONSTRAINT `Backup_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CacheLog` ADD CONSTRAINT `CacheLog_clearedBy_fkey` FOREIGN KEY (`clearedBy`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RestoreLog` ADD CONSTRAINT `RestoreLog_restoredBy_fkey` FOREIGN KEY (`restoredBy`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RestoreLog` ADD CONSTRAINT `RestoreLog_backupId_fkey` FOREIGN KEY (`backupId`) REFERENCES `Backup`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
