/*
  Warnings:

  - You are about to drop the column `fileUrl` on the `Pdf` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fileKey]` on the table `Pdf` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fileKey` to the `Pdf` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Pdf_fileUrl_key";

-- AlterTable
ALTER TABLE "Pdf" DROP COLUMN "fileUrl",
ADD COLUMN     "fileKey" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Pdf_fileKey_key" ON "Pdf"("fileKey");
