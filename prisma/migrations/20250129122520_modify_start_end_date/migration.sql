/*
  Warnings:

  - You are about to drop the column `execute_at` on the `Schedule` table. All the data in the column will be lost.
  - Added the required column `end_date` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "execute_at",
ADD COLUMN     "end_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "start_date" TIMESTAMP(3) NOT NULL;
