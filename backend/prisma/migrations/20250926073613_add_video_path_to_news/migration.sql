/*
  Warnings:

  - You are about to alter the column `password` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE `News` ADD COLUMN `sourceLink` VARCHAR(191) NULL,
    ADD COLUMN `sourceName` VARCHAR(191) NULL,
    ADD COLUMN `videoPath` VARCHAR(191) NULL,
    ADD COLUMN `youtubeUrl` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `Slider` MODIFY `tagline` VARCHAR(300) NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `password` VARCHAR(100) NOT NULL;
