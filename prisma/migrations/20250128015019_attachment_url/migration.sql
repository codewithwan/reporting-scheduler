/*
  Warnings:

  - Made the column `attachment_url` on table `Report` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Report" ALTER COLUMN "attachment_url" SET NOT NULL;
