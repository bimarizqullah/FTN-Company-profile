-- DropForeignKey
ALTER TABLE `Gallery` DROP FOREIGN KEY `Gallery_createdBy_fkey`;

-- DropForeignKey
ALTER TABLE `Language` DROP FOREIGN KEY `Language_createdBy_fkey`;

-- DropForeignKey
ALTER TABLE `Management` DROP FOREIGN KEY `Management_createdBy_fkey`;

-- DropForeignKey
ALTER TABLE `Project` DROP FOREIGN KEY `Project_createdBy_fkey`;

-- DropForeignKey
ALTER TABLE `RolePermission` DROP FOREIGN KEY `RolePermission_permissionId_fkey`;

-- DropForeignKey
ALTER TABLE `RolePermission` DROP FOREIGN KEY `RolePermission_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `Service` DROP FOREIGN KEY `Service_createdBy_fkey`;

-- DropForeignKey
ALTER TABLE `Slider` DROP FOREIGN KEY `Slider_createdBy_fkey`;

-- DropForeignKey
ALTER TABLE `UserRole` DROP FOREIGN KEY `UserRole_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `UserRole` DROP FOREIGN KEY `UserRole_userId_fkey`;

-- DropIndex
DROP INDEX `Gallery_createdBy_fkey` ON `Gallery`;

-- DropIndex
DROP INDEX `Language_createdBy_fkey` ON `Language`;

-- DropIndex
DROP INDEX `Management_createdBy_fkey` ON `Management`;

-- DropIndex
DROP INDEX `Project_createdBy_fkey` ON `Project`;

-- DropIndex
DROP INDEX `Service_createdBy_fkey` ON `Service`;

-- DropIndex
DROP INDEX `Slider_createdBy_fkey` ON `Slider`;

-- AlterTable
ALTER TABLE `Permission` MODIFY `description` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Role` MODIFY `description` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `RolePermission_roleId_idx` ON `RolePermission`(`roleId`);

-- CreateIndex
CREATE INDEX `UserRole_userId_idx` ON `UserRole`(`userId`);

-- AddForeignKey
ALTER TABLE `Slider` ADD CONSTRAINT `Slider_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Gallery` ADD CONSTRAINT `Gallery_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Service` ADD CONSTRAINT `Service_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Management` ADD CONSTRAINT `Management_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Language` ADD CONSTRAINT `Language_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRole` ADD CONSTRAINT `UserRole_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRole` ADD CONSTRAINT `UserRole_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RolePermission` ADD CONSTRAINT `RolePermission_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RolePermission` ADD CONSTRAINT `RolePermission_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `Permission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `RolePermission` DROP INDEX `RolePermission_permissionId_fkey`, ADD INDEX `RolePermission_permissionId_idx` (`permissionId`);

-- RenameIndex
ALTER TABLE `UserRole` DROP INDEX `UserRole_roleId_fkey`, ADD INDEX `UserRole_roleId_idx` (`roleId`);

