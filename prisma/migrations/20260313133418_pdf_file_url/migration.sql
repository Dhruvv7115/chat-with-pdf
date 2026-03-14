/*
  Warnings:

  - A unique constraint covering the columns `[fileUrl]` on the table `Pdf` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Pdf_fileUrl_key" ON "Pdf"("fileUrl");
