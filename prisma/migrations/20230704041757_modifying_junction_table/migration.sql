/*
  Warnings:

  - The primary key for the `notes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `notes` table. All the data in the column will be lost.
  - The primary key for the `tags` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `tags` table. All the data in the column will be lost.
  - You are about to drop the column `tag` on the `tags` table. All the data in the column will be lost.
  - You are about to drop the `notes_tag` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[tagId]` on the table `tags` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `noteId` to the `notes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tagId` to the `tags` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tagName` to the `tags` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `notes_tag` DROP FOREIGN KEY `notes_tag_note_id_fkey`;

-- DropForeignKey
ALTER TABLE `notes_tag` DROP FOREIGN KEY `notes_tag_tag_id_fkey`;

-- DropIndex
DROP INDEX `tags_id_key` ON `tags`;

-- AlterTable
ALTER TABLE `notes` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `noteId` VARCHAR(100) NOT NULL,
    ADD PRIMARY KEY (`noteId`);

-- AlterTable
ALTER TABLE `tags` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `tag`,
    ADD COLUMN `tagId` VARCHAR(100) NOT NULL,
    ADD COLUMN `tagName` VARCHAR(100) NOT NULL,
    ADD PRIMARY KEY (`tagName`, `username`);

-- DropTable
DROP TABLE `notes_tag`;

-- CreateTable
CREATE TABLE `junctionNotesTags` (
    `tagId` VARCHAR(100) NOT NULL,
    `noteId` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`tagId`, `noteId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `tags_tagId_key` ON `tags`(`tagId`);

-- AddForeignKey
ALTER TABLE `junctionNotesTags` ADD CONSTRAINT `junctionNotesTags_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `tags`(`tagId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `junctionNotesTags` ADD CONSTRAINT `junctionNotesTags_noteId_fkey` FOREIGN KEY (`noteId`) REFERENCES `notes`(`noteId`) ON DELETE RESTRICT ON UPDATE CASCADE;
