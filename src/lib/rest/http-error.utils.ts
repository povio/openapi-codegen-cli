export interface HttpErrorLike {
  code?: string;
  response?: { status?: number; data?: unknown };
}

export function isAxiosErrorLike(error: unknown): error is HttpErrorLike {
  return typeof error === "object" && error !== null && "isAxiosError" in error;
}

export function isCanceledRequest(error: unknown) {
  if (error instanceof DOMException && ["AbortError", "TimeoutError"].includes(error.name)) return true;
  if (isAxiosErrorLike(error)) return error.code === "ERR_CANCELED" || error.code === "ECONNABORTED";
  return false;
}
