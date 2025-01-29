/*
  Warnings:

  - You are about to drop the column `attachmentUrl` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `reportText` on the `Report` table. All the data in the column will be lost.
  - Added the required column `customer_id` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `problem` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `processing_time_end` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `processing_time_start` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `service_id` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `service_status` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Report" DROP COLUMN "attachmentUrl",
DROP COLUMN "reportText",
ADD COLUMN     "attachment_url" VARCHAR,
ADD COLUMN     "customer_id" UUID NOT NULL,
ADD COLUMN     "problem" TEXT NOT NULL,
ADD COLUMN     "processing_time_end" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "processing_time_start" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "service_id" UUID NOT NULL,
ADD COLUMN     "service_status" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "Service" (
    "id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
