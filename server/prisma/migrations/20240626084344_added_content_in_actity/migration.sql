/*
  Warnings:

  - Added the required column `content` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contentId` to the `Activity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "contentId" TEXT NOT NULL;
