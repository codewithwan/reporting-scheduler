/*
  Warnings:

  - You are about to drop the column `device` on the `LogActivity` table. All the data in the column will be lost.
  - You are about to drop the column `ipAddress` on the `LogActivity` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `_ScheduleAdmins` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ScheduleEngineers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `admin_id` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `engineer_id` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ScheduleAdmins" DROP CONSTRAINT "_ScheduleAdmins_A_fkey";

-- DropForeignKey
ALTER TABLE "_ScheduleAdmins" DROP CONSTRAINT "_ScheduleAdmins_B_fkey";

-- DropForeignKey
ALTER TABLE "_ScheduleEngineers" DROP CONSTRAINT "_ScheduleEngineers_A_fkey";

-- DropForeignKey
ALTER TABLE "_ScheduleEngineers" DROP CONSTRAINT "_ScheduleEngineers_B_fkey";

-- AlterTable
ALTER TABLE "LogActivity" DROP COLUMN "device",
DROP COLUMN "ipAddress";

-- AlterTable
ALTER TABLE "Schedule" ADD COLUMN     "admin_id" UUID NOT NULL,
ADD COLUMN     "engineer_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" VARCHAR NOT NULL DEFAULT 'ENGINEER';

-- DropTable
DROP TABLE "_ScheduleAdmins";

-- DropTable
DROP TABLE "_ScheduleEngineers";

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_engineer_id_fkey" FOREIGN KEY ("engineer_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
