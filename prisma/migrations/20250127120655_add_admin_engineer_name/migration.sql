/*
  Warnings:

  - Added the required column `adminName` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `engineerName` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Schedule" ADD COLUMN     "adminName" VARCHAR NOT NULL,
ADD COLUMN     "engineerName" VARCHAR NOT NULL;
