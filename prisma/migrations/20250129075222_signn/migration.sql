/*
  Warnings:

  - You are about to drop the column `engineer_signa` on the `Report` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Report" DROP COLUMN "engineer_signa",
ADD COLUMN     "engineer_sign" TEXT;
