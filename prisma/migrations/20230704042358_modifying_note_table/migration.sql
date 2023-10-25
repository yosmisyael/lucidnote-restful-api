/*
  Warnings:

  - The primary key for the `notes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `noteId` on the `notes` table. All the data in the column will be lost.
  - Added the required column `id` to the `notes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `junctionNotesTags` DROP FOREIGN KEY `junctionNotesTags_noteId_fkey`;

-- AlterTable
ALTER TABLE `notes` DROP PRIMARY KEY,
    DROP COLUMN `noteId`,
    ADD COLUMN `id` VARCHAR(100) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `junctionNotesTags` ADD CONSTRAINT `junctionNotesTags_noteId_fkey` FOREIGN KEY (`noteId`) REFERENCES `notes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
