/*
  Warnings:

  - You are about to drop the column `service_id` on the `Report` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Service` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_service_id_fkey";

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "service_id";

-- AlterTable
ALTER TABLE "Service" ALTER COLUMN "name" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "ReportService" (
    "report_id" UUID NOT NULL,
    "service_id" UUID NOT NULL,

    CONSTRAINT "ReportService_pkey" PRIMARY KEY ("report_id","service_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Service_name_key" ON "Service"("name");

-- AddForeignKey
ALTER TABLE "ReportService" ADD CONSTRAINT "ReportService_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportService" ADD CONSTRAINT "ReportService_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
