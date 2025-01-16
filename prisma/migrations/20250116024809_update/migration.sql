/*
  Warnings:

  - The `status` column on the `Reminder` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Schedule` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ScheduleStatus" AS ENUM ('PENDING', 'COMPLETED', 'RESCHEDULED');

-- CreateEnum
CREATE TYPE "ReminderStatus" AS ENUM ('PENDING', 'SENT');

-- AlterTable
ALTER TABLE "Reminder" DROP COLUMN "status",
ADD COLUMN     "status" "ReminderStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "status",
ADD COLUMN     "status" "ScheduleStatus" NOT NULL DEFAULT 'PENDING';
