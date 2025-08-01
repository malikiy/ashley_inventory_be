/*
  Warnings:

  - A unique constraint covering the columns `[asset_id]` on the table `Item_Master` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[serial_number]` on the table `Item_Master` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[barcode]` on the table `Item_Master` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Item_Master_asset_id_key` ON `Item_Master`(`asset_id`);

-- CreateIndex
CREATE UNIQUE INDEX `Item_Master_serial_number_key` ON `Item_Master`(`serial_number`);

-- CreateIndex
CREATE UNIQUE INDEX `Item_Master_barcode_key` ON `Item_Master`(`barcode`);
