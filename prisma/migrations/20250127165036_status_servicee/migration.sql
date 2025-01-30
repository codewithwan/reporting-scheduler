/*
  Warnings:

  - The `serviceStatus` column on the `Report` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "StatusService" AS ENUM ('FINISHED', 'UNFINISHED');

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "serviceStatus",
ADD COLUMN     "serviceStatus" "StatusService" NOT NULL DEFAULT 'UNFINISHED';

-- DropEnum
DROP TYPE "ServiceStatus";
