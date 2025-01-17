/*
  Warnings:

  - You are about to drop the column `admin_id` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `engineer_id` on the `Schedule` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPERADMIN', 'ADMIN', 'ENGINEER');

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_admin_id_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_engineer_id_fkey";

-- AlterTable
ALTER TABLE "LogActivity" ADD COLUMN     "device" VARCHAR,
ADD COLUMN     "ipAddress" VARCHAR;

-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "admin_id",
DROP COLUMN "engineer_id";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'ENGINEER';

-- CreateTable
CREATE TABLE "_ScheduleEngineers" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_ScheduleEngineers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ScheduleAdmins" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_ScheduleAdmins_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ScheduleEngineers_B_index" ON "_ScheduleEngineers"("B");

-- CreateIndex
CREATE INDEX "_ScheduleAdmins_B_index" ON "_ScheduleAdmins"("B");

-- AddForeignKey
ALTER TABLE "_ScheduleEngineers" ADD CONSTRAINT "_ScheduleEngineers_A_fkey" FOREIGN KEY ("A") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ScheduleEngineers" ADD CONSTRAINT "_ScheduleEngineers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ScheduleAdmins" ADD CONSTRAINT "_ScheduleAdmins_A_fkey" FOREIGN KEY ("A") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ScheduleAdmins" ADD CONSTRAINT "_ScheduleAdmins_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
