import { isAxiosError, isCancel } from "axios";
import { type TFunction } from "i18next";
import { z } from "zod";

import { defaultT } from "../config/i18n";
import { RestUtils } from "./rest.utils";

export type GeneralErrorCodes =
  | "DATA_VALIDATION_ERROR"
  | "NETWORK_ERROR"
  | "CANCELED_ERROR"
  | "INTERNAL_ERROR"
  | "UNKNOWN_ERROR";

export class ApplicationException<CodeT> extends Error {
  public code: CodeT;

  public serverMessage: string | null = null;

  constructor(message: string, code: CodeT, serverMessage: string | null) {
    super(message);

    this.code = code;
    this.serverMessage = serverMessage;
  }
}

export interface ErrorEntry<CodeT> {
  code: CodeT;
  condition?: (error: unknown) => boolean;
  getMessage: (t: TFunction, error: unknown) => string;
}

export interface ErrorHandlerOptions<CodeT extends string> {
  entries: ErrorEntry<CodeT>[];
  t?: TFunction;
  onRethrowError?: (error: unknown, exception: ApplicationException<CodeT | GeneralErrorCodes>) => void;
}

export class ErrorHandler<CodeT extends string> {
  entries: ErrorEntry<CodeT | GeneralErrorCodes>[] = [];
  private t: TFunction;
  private onRethrowError?: (error: unknown, exception: ApplicationException<CodeT | GeneralErrorCodes>) => void;

  constructor({ entries, t = defaultT, onRethrowError }: ErrorHandlerOptions<CodeT>) {
    this.t = t;
    this.onRethrowError = onRethrowError;
    type ICodeT = CodeT | GeneralErrorCodes;

    const dataValidationError: ErrorEntry<ICodeT> = {
      code: "DATA_VALIDATION_ERROR",
      condition: (e) => {
        return e instanceof z.ZodError;
      },
      getMessage: () => this.t("openapi.sharedErrors.dataValidation"),
    };

    const internalError: ErrorEntry<ICodeT> = {
      code: "INTERNAL_ERROR",
      condition: (e) => {
        if (isAxiosError(e)) {
          return e.response?.status != null && e.response.status >= 500 && e.response.status < 600;
        }

        return false;
      },
      getMessage: () => this.t("openapi.sharedErrors.internalError"),
    };

    const networkError: ErrorEntry<ICodeT> = {
      code: "NETWORK_ERROR",
      condition: (e) => {
        if (isAxiosError(e)) {
          return e.code === "ERR_NETWORK";
        }

        return false;
      },
      getMessage: () => this.t("openapi.sharedErrors.networkError"),
    };

    const canceledError: ErrorEntry<ICodeT> = {
      code: "CANCELED_ERROR",
      condition: (e) => {
        if (isCancel(e)) {
          return true;
        }

        if (isAxiosError(e) && e.code === "ECONNABORTED") {
          return true;
        }

        return false;
      },
      getMessage: () => this.t("openapi.sharedErrors.canceledError"),
    };

    const unknownError: ErrorEntry<ICodeT> = {
      code: "UNKNOWN_ERROR",
      condition: () => true,
      getMessage: (_, e) => {
        const code = RestUtils.extractServerResponseCode(e);
        const serverMessage = RestUtils.extractServerErrorMessage(e);

        if (code) {
          let message = `Unknown error, message from server: ${code}`;
          if (serverMessage) {
            message += ` ${serverMessage}`;
          }
          return message;
        }

        return this.t("openapi.sharedErrors.unknownError");
      },
    };

    // general errors have the lowest priority
    this.entries = [...entries, dataValidationError, internalError, networkError, canceledError, unknownError];
  }

  private matchesEntry(error: unknown, entry: ErrorEntry<CodeT | GeneralErrorCodes>, code: string | null): boolean {
    if (entry.condition) {
      return entry.condition(error);
    }
    return code === entry.code;
  }

  public setTranslateFunction(t: TFunction) {
    this.t = t;
  }

  public rethrowError(error: unknown): ApplicationException<CodeT | GeneralErrorCodes> {
    const code = RestUtils.extractServerResponseCode(error);
    const errorEntry = this.entries.find((entry) => this.matchesEntry(error, entry, code))!;

    const serverMessage = RestUtils.extractServerErrorMessage(error);
    const exception = new ApplicationException(errorEntry.getMessage(this.t, error), errorEntry.code, serverMessage);

    this.onRethrowError?.(error, exception);

    throw exception;
  }

  public getError(error: unknown): ApplicationException<CodeT | GeneralErrorCodes> | null {
    if (error instanceof ApplicationException) {
      return error;
    }

    return null;
  }

  public getErrorCode(error: unknown): CodeT | GeneralErrorCodes | null {
    if (error instanceof ApplicationException) {
      return error.code as CodeT;
    }

    return null;
  }

  public static getErrorMessage(error: unknown, fallbackToUnknown = true): string | null {
    if (typeof error === "string") {
      return error;
    }

    if (error instanceof Error) {
      return error.message;
    }

    if (error instanceof ApplicationException) {
      return error.message;
    }

    if (fallbackToUnknown) {
      return defaultT("openapi.sharedErrors.unknownError");
    }

    return null;
  }
}

// can be used for endpoints that only need general error handling
export const SharedErrorHandler = new ErrorHandler<never>({ entries: [] });
