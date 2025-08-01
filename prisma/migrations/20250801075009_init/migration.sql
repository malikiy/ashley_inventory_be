-- CreateTable
CREATE TABLE `User_Access` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `full_name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `status` INTEGER NOT NULL,

    UNIQUE INDEX `User_Access_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Item_Master` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `asset_id` VARCHAR(191) NOT NULL,
    `hotel_code` VARCHAR(191) NOT NULL,
    `department_code` VARCHAR(191) NOT NULL,
    `asset_name` VARCHAR(191) NOT NULL,
    `asset_type` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `brand_model` VARCHAR(191) NOT NULL,
    `serial_number` VARCHAR(191) NOT NULL,
    `barcode` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `date_created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
