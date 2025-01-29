-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_category_id_fkey";

-- AlterTable
ALTER TABLE "Report" ALTER COLUMN "category_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
