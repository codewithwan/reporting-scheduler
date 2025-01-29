/*
  Warnings:

  - You are about to drop the column `service_status` on the `Report` table. All the data in the column will be lost.
  - The `status` column on the `Report` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ServiceStatus" AS ENUM ('YES', 'NO');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PROCESS', 'COMPLETED');

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "service_status",
ADD COLUMN     "serviceStatus" "ServiceStatus" NOT NULL DEFAULT 'NO',
DROP COLUMN "status",
ADD COLUMN     "status" "ReportStatus" NOT NULL DEFAULT 'PROCESS';
