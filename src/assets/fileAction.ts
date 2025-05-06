import { AxiosResponse, AxiosResponseHeaders } from "axios";

export interface FileActionQueryOptions {
  fileName?: string;
  downloadFile?: boolean;
  previewFile?: boolean;
}

export function responseFileAction(res: AxiosResponse<Blob>, options?: FileActionQueryOptions) {
  const fileName = extractFilename(res.headers as AxiosResponseHeaders);

  fileAction(res.data, { ...options, fileName: options?.fileName ?? fileName });
}

export function fileAction(blob: Blob, options?: FileActionQueryOptions) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.download = options?.fileName ?? "download";
  a.rel = "noopener";
  a.href = url;

  if (options?.downloadFile) {
    setTimeout(() => a.dispatchEvent(new MouseEvent("click")), 0);
  }

  if (options?.previewFile) {
    window.open(url, "_blank");
  }

  setTimeout(() => URL.revokeObjectURL(url), 40000); // Cleanup after 40s
}

function extractFilename(headers: AxiosResponseHeaders): string | undefined {
  const contentDisposition = Object.keys(headers).find((key) => key.toLowerCase() === "content-disposition");

  if (!contentDisposition) {
    return undefined;
  }

  const contentDispositionValue = headers[contentDisposition] as string | undefined;
  if (!contentDispositionValue) {
    return undefined;
  }

  const filenameMatch = /filename=["']?([^"';]+)/i.exec(contentDispositionValue);
  return filenameMatch ? filenameMatch[1] : undefined;
}
