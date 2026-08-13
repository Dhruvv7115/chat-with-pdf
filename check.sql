SELECT conname, conrelid::regclass FROM pg_constraint WHERE conrelid IN ('"Pdf"'::regclass, '"PdfEmbedding"'::regclass, '"Chat"'::regclass);
