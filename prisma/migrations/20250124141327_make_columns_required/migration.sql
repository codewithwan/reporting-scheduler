/*
  Warnings:

  - The values [REQUESTED,APPROVED,RESCHEDULE,COMPLETED] on the enum `ScheduleStatus` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `adminName` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `engineerName` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ScheduleStatus_new" AS ENUM ('ACCEPTED', 'REJECTED', 'RESCHEDULED', 'PENDING', 'CANCELED');
ALTER TABLE "Schedule" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Schedule" ALTER COLUMN "status" TYPE "ScheduleStatus_new" USING ("status"::text::"ScheduleStatus_new");
ALTER TYPE "ScheduleStatus" RENAME TO "ScheduleStatus_old";
ALTER TYPE "ScheduleStatus_new" RENAME TO "ScheduleStatus";
DROP TYPE "ScheduleStatus_old";
ALTER TABLE "Schedule" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "Schedule" ADD COLUMN     "adminName" VARCHAR NOT NULL,
ADD COLUMN     "engineerName" VARCHAR NOT NULL,
ADD COLUMN     "phoneNumber" VARCHAR NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING';
