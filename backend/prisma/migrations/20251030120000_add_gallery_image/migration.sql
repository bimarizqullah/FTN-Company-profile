-- Migration: add_gallery_image
-- Creates GalleryImage table, migrates existing Gallery.imagePath values into it,
-- then drops the old Gallery.imagePath column.

/* 1) Create the new table for gallery images */
CREATE TABLE IF NOT EXISTS `GalleryImage` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `imagePath` TEXT NOT NULL,
  `galleryId` INT NOT NULL,
  `sortOrder` INT NOT NULL DEFAULT 0,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `GalleryImage_galleryId_idx` (`galleryId`),
  CONSTRAINT `GalleryImage_gallery_fk` FOREIGN KEY (`galleryId`) REFERENCES `Gallery`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

/* 2) Migrate existing single-image values from Gallery.imagePath into GalleryImage.
	This preserves current gallery images. If the gallery row has an imagePath, a
	GalleryImage row will be created with sortOrder = 0. */
INSERT INTO `GalleryImage` (`imagePath`, `galleryId`, `sortOrder`, `createdAt`)
SELECT `imagePath`, `id`, 0, NOW()
FROM `Gallery`
WHERE `imagePath` IS NOT NULL AND `imagePath` <> '';

/* 3) Remove old column from Gallery now that images live in GalleryImage.
	It's safe to drop because we migrated existing values above. */
ALTER TABLE `Gallery` DROP COLUMN IF EXISTS `imagePath`;

-- End of migration

