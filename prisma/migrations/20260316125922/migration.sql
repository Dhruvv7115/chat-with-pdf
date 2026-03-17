-- CreateTable
CREATE TABLE "PdfEmbedding" (
    "id" TEXT NOT NULL,
    "pdfId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "embedding" vector(3072),

    CONSTRAINT "PdfEmbedding_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PdfEmbedding" ADD CONSTRAINT "PdfEmbedding_pdfId_fkey" FOREIGN KEY ("pdfId") REFERENCES "Pdf"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
