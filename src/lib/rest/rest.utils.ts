import type { AxiosError, AxiosResponseHeaders } from "axios";
import { z } from "zod";

import { isAxiosErrorLike } from "./http-error.utils";
import { NativeHttpError } from "./native-rest-client.types";

function getResponseData(error: unknown) {
  if (error instanceof NativeHttpError) return error.response.data;
  return isAxiosErrorLike(error) ? error.response?.data : undefined;
}

export namespace RestUtils {
  export const extractServerResponseCode = (e: unknown): string | number | null => {
    if (e instanceof z.ZodError) {
      return "validation-exception";
    }

    const data = getResponseData(e) as { code: unknown } | undefined;

    if (typeof data?.code === "string") {
      return data.code;
    }

    if (typeof data?.code === "number") {
      return data.code;
    }

    return null;
  };

  export const doesServerErrorMessageContain = (e: AxiosError, text: string): boolean => {
    const message = extractServerErrorMessage(e);
    if (message === null || message === undefined) {
      return false;
    }

    return message.toLowerCase().includes(text.toLowerCase());
  };

  export const extractServerErrorMessage = (e: unknown): string | null => {
    if (e instanceof z.ZodError) {
      return e.message;
    }

    const data = getResponseData(e) as { message: unknown } | undefined;

    if (typeof data?.message === "string") {
      return data.message;
    }

    return null;
  };

  export const extractContentDispositionFilename = (headers: AxiosResponseHeaders) => {
    const contentDisposition = headers["content-disposition"] as string | undefined;
    return contentDisposition ? /filename=["']?([^"';]+)/i.exec(contentDisposition)?.[1] : undefined;
  };
}
