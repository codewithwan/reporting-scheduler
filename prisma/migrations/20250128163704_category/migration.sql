/*
  Warnings:

  - Made the column `category_id` on table `Report` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_category_id_fkey";

-- AlterTable
ALTER TABLE "Report" ALTER COLUMN "category_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
