"use client";

import { useState } from "react";
import { api } from "@/trpc/client";
import { toast } from "sonner";
import axios from "axios";
import { getFileType } from "@/utils/file-type";
import {
  FileAttachment,
  formatFileSize,
  getFileCategoryLabel,
  uploadFileWithAxios,
} from "@/utils/upload-file";

export function useDocumentUpload(options?: {
  onSuccess?: (doc: {
    id: string;
    key: string;
    title: string;
    fileType: string;
  }) => void;
  onError?: (error: string) => void;
}) {
  const [attachment, setAttachment] = useState<FileAttachment | null>(null);
  const uploadDoc = api.pdf.getUploadUrl.useMutation();
  const saveDoc = api.pdf.saveDoc.useMutation();
  const utils = api.useUtils();

  const startUpload = async (file: File) => {
    // 1. Validate file type
    const fileType = getFileType(file);
    if (!fileType) {
      toast.error(
        "File type not supported. Please upload one of: [PDF, DOCX, TXT, MD, CSV]"
      );
      return;
    }

    const abortController = new AbortController();
    const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");

    const newAttachment: FileAttachment = {
      id: `${Date.now()}-${safeFileName}`,
      file,
      name: file.name,
      size: file.size,
      formattedSize: formatFileSize(file.size),
      fileType,
      categoryLabel: getFileCategoryLabel(file.name, file.type),
      progress: 0,
      state: "uploading",
      abortController,
    };

    setAttachment(newAttachment);

    try {
      // 2. Get pre-signed upload URL
      const { url, key } = await uploadDoc.mutateAsync({
        name: file.name,
        type: file.type,
        size: file.size,
      });

      // 3. Upload directly to S3 via axios with real-time percentage progress
      await uploadFileWithAxios(
        url,
        file,
        (progress) => {
          setAttachment((prev) =>
            prev && prev.id === newAttachment.id
              ? { ...prev, progress }
              : prev
          );
        },
        abortController.signal
      );

      // 4. Validate content length / pages
      setAttachment((prev) =>
        prev && prev.id === newAttachment.id
          ? {
              ...prev,
              progress: 100,
              state: "processing",
              statusText: "Validating document...",
            }
          : prev
      );

      const validationRes = await fetch("/api/documents/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, fileType }),
        signal: abortController.signal,
      });
      const validation = await validationRes.json();

      if (!validation.ok) {
        throw new Error(validation.error || "Document validation failed");
      }

      // 5. Save Document to Database
      const doc = await saveDoc.mutateAsync({
        key,
        title: safeFileName,
        fileType,
        fileSize: file.size,
      });

      // Invalidate queries so docs & quota lists refresh
      utils.pdf.getAllUserDocsWithUrls.invalidate();
      utils.pdf.getUserDocs.invalidate();
      utils.pdf.getUploadQuota.invalidate();

      setAttachment((prev) =>
        prev && prev.id === newAttachment.id
          ? {
              ...prev,
              state: "done",
              key,
              docId: doc.id,
              statusText: undefined,
            }
          : prev
      );

      options?.onSuccess?.({
        id: doc.id,
        key,
        title: safeFileName,
        fileType,
      });

      return doc;
    } catch (err: any) {
      if (
        axios.isCancel(err) ||
        err?.name === "CanceledError" ||
        err?.name === "AbortError"
      ) {
        return;
      }
      const msg = err?.message || "Failed to upload file";
      setAttachment((prev) =>
        prev && prev.id === newAttachment.id
          ? {
              ...prev,
              state: "error",
              error: msg,
            }
          : prev
      );
      toast.error(msg);
      options?.onError?.(msg);
    }
  };

  const cancelUpload = () => {
    if (attachment?.abortController) {
      attachment.abortController.abort();
    }
    setAttachment(null);
  };

  return {
    attachment,
    setAttachment,
    startUpload,
    cancelUpload,
    isUploading:
      attachment?.state === "uploading" || attachment?.state === "processing",
  };
}
