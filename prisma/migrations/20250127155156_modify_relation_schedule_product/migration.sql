-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
