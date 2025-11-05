-- DropForeignKey
ALTER TABLE `GalleryImage` DROP FOREIGN KEY `GalleryImage_gallery_fk`;

-- AlterTable
ALTER TABLE `GalleryImage` MODIFY `imagePath` VARCHAR(191) NOT NULL,
    MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE `GalleryImage` ADD CONSTRAINT `GalleryImage_galleryId_fkey` FOREIGN KEY (`galleryId`) REFERENCES `Gallery`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
