-- DropForeignKey
ALTER TABLE "DocumentEmbedding" DROP CONSTRAINT "DocumentEmbedding_documentId_fkey";

-- AddForeignKey
ALTER TABLE "DocumentEmbedding" ADD CONSTRAINT "DocumentEmbedding_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;
