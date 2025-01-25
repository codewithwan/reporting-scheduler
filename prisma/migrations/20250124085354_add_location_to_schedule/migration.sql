/*
  Warnings:

  - The values [RESCHEDULED] on the enum `ScheduleStatus` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `activity` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ScheduleStatus_new" AS ENUM ('REQUESTED', 'PENDING', 'APPROVED', 'RESCHEDULE', 'COMPLETED', 'CANCELED');
ALTER TABLE "Schedule" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Schedule" ALTER COLUMN "status" TYPE "ScheduleStatus_new" USING ("status"::text::"ScheduleStatus_new");
ALTER TYPE "ScheduleStatus" RENAME TO "ScheduleStatus_old";
ALTER TYPE "ScheduleStatus_new" RENAME TO "ScheduleStatus";
DROP TYPE "ScheduleStatus_old";
ALTER TABLE "Schedule" ALTER COLUMN "status" SET DEFAULT 'REQUESTED';
COMMIT;

-- AlterTable
ALTER TABLE "Schedule" ADD COLUMN     "activity" VARCHAR NOT NULL,
ADD COLUMN     "location" VARCHAR NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'REQUESTED';
