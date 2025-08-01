-- AlterTable
ALTER TABLE `gallery` ADD COLUMN `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active';
