-- Rename tables (preserves all data instead of dropping)
ALTER TABLE "Pdf" RENAME TO "Document";
ALTER TABLE "PdfEmbedding" RENAME TO "DocumentEmbedding";

-- Rename FK columns to match new names
ALTER TABLE "Chat" RENAME COLUMN "pdfId" TO "documentId";
ALTER TABLE "DocumentEmbedding" RENAME COLUMN "pdfId" TO "documentId";

-- Make documentId on Chat nullable (for doc-less chats)
ALTER TABLE "Chat" ALTER COLUMN "documentId" DROP NOT NULL;

-- Add fileType with a default so existing 5 rows don't break, then drop the default
CREATE TYPE "FileType" AS ENUM ('PDF', 'DOCX', 'MARKDOWN', 'TXT', 'IMAGE');
ALTER TABLE "Document" ADD COLUMN "fileType" "FileType" NOT NULL DEFAULT 'PDF';
ALTER TABLE "Document" ALTER COLUMN "fileType" DROP DEFAULT;

-- Rename constraints to match Prisma's naming convention going forward
ALTER TABLE "Document" RENAME CONSTRAINT "Pdf_pkey" TO "Document_pkey";
ALTER TABLE "Document" RENAME CONSTRAINT "Pdf_userId_fkey" TO "Document_userId_fkey";

ALTER TABLE "DocumentEmbedding" RENAME CONSTRAINT "PdfEmbedding_pkey" TO "DocumentEmbedding_pkey";
ALTER TABLE "DocumentEmbedding" RENAME CONSTRAINT "PdfEmbedding_pdfId_fkey" TO "DocumentEmbedding_documentId_fkey";

ALTER TABLE "Chat" RENAME CONSTRAINT "Chat_pdfId_fkey" TO "Chat_documentId_fkey";

-- Rename the unique index on fileKey
ALTER INDEX "Pdf_fileKey_key" RENAME TO "Document_fileKey_key";