/*
  Warnings:

  - Added the required column `content` to the `ReplyComment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ReplyComment" ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "isEdited" BOOLEAN;
