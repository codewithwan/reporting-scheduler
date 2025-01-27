/*
  Warnings:

  - You are about to drop the column `adminName` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `engineerName` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `Schedule` table. All the data in the column will be lost.
  - Added the required column `phoneNumber` to the `Reminder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customer_id` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `role` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Reminder" ADD COLUMN     "phoneNumber" VARCHAR NOT NULL;

-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "adminName",
DROP COLUMN "engineerName",
DROP COLUMN "phoneNumber",
ADD COLUMN     "customer_id" UUID NOT NULL,
ALTER COLUMN "activity" DROP NOT NULL,
ALTER COLUMN "location" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL;

-- CreateTable
CREATE TABLE "Customer" (
    "id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "company" VARCHAR NOT NULL,
    "position" VARCHAR,
    "email" VARCHAR NOT NULL,
    "phoneNumber" VARCHAR NOT NULL,
    "address" VARCHAR,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" UUID NOT NULL,
    "schedule_id" UUID NOT NULL,
    "engineer_id" UUID NOT NULL,
    "reportText" TEXT NOT NULL,
    "report_date" TIMESTAMP(3) NOT NULL,
    "attachmentUrl" VARCHAR,
    "status" VARCHAR NOT NULL DEFAULT 'submitted',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "serialNumber" VARCHAR NOT NULL,
    "purchase_date" TIMESTAMP(3) NOT NULL,
    "warranty_expiry" TIMESTAMP(3) NOT NULL,
    "description" TEXT,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_engineer_id_fkey" FOREIGN KEY ("engineer_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
