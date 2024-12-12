/*
  Warnings:

  - Added the required column `key` to the `SelectedFile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SelectedFile" ADD COLUMN     "key" TEXT NOT NULL;
