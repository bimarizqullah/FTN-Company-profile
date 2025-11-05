-- AlterTable
ALTER TABLE `Category` ADD COLUMN `type` ENUM('news', 'article', 'both') NOT NULL DEFAULT 'both';

-- AlterTable
ALTER TABLE `SubCategory` ADD COLUMN `type` ENUM('news', 'article', 'both') NOT NULL DEFAULT 'both';

-- CreateIndex
CREATE INDEX `Category_type_idx` ON `Category`(`type`);

-- CreateIndex
CREATE INDEX `SubCategory_type_idx` ON `SubCategory`(`type`);
