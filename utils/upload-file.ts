import axios from "axios";

export type AttachmentState =
  | "idle"
  | "uploading"
  | "processing"
  | "done"
  | "error";

export interface FileAttachment {
  id: string;
  file: File;
  name: string;
  size: number;
  formattedSize: string;
  fileType: string;
  categoryLabel: string;
  progress: number; // 0 - 100
  state: AttachmentState;
  statusText?: string;
  error?: string;
  key?: string;
  docId?: string;
  abortController?: AbortController;
}

export function formatFileSize(bytes?: number | null): string {
  if (!bytes || bytes <= 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getFileCategoryLabel(
  fileName: string,
  mimeType?: string
): string {
  const ext = fileName.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "pdf":
      return "PDF";
    case "doc":
    case "docx":
      return "DOCX";
    case "md":
    case "markdown":
      return "Markdown";
    case "txt":
      return "Text";
    case "csv":
      return "CSV";
    default:
      if (mimeType?.includes("pdf")) return "PDF";
      if (mimeType?.includes("word")) return "DOCX";
      return ext?.toUpperCase() || "Document";
  }
}

/**
 * Uploads a file to a presigned S3 / R2 URL using axios with onUploadProgress.
 */
export async function uploadFileWithAxios(
  url: string,
  file: File,
  onProgress?: (percent: number) => void,
  signal?: AbortSignal
): Promise<void> {
  await axios.put(url, file, {
    headers: {
      "Content-Type": file.type,
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total) {
        const percent = Math.min(
          100,
          Math.max(0, Math.round((progressEvent.loaded * 100) / progressEvent.total))
        );
        onProgress?.(percent);
      }
    },
    signal,
  });
}
