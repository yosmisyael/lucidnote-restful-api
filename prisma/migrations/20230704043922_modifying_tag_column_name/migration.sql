/*
  Warnings:

  - You are about to drop the column `tagId` on the `tags` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `tags` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id` to the `tags` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `junctionNotesTags` DROP FOREIGN KEY `junctionNotesTags_tagId_fkey`;

-- DropIndex
DROP INDEX `tags_tagId_key` ON `tags`;

-- AlterTable
ALTER TABLE `tags` DROP COLUMN `tagId`,
    ADD COLUMN `id` VARCHAR(100) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `tags_id_key` ON `tags`(`id`);

-- AddForeignKey
ALTER TABLE `junctionNotesTags` ADD CONSTRAINT `junctionNotesTags_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `tags`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
