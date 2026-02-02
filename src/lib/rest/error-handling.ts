import { isAxiosError, isCancel } from "axios";
import { z } from "zod";

import { RestUtils } from "./rest.utils";

// codes that we want to handle in every scenario
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
  condition: (error: unknown) => boolean;
  getMessage: (error: unknown) => string;
}

export interface ErrorHandlerOptions<CodeT extends string> {
  entries: ErrorEntry<CodeT>[];
  onRethrowError?: (error: unknown, exception: ApplicationException<CodeT | GeneralErrorCodes>) => void;
}

export class ErrorHandler<CodeT extends string> {
  entries: ErrorEntry<CodeT | GeneralErrorCodes>[] = [];
  private onRethrowError?: (error: unknown, exception: ApplicationException<CodeT | GeneralErrorCodes>) => void;

  constructor({ entries, onRethrowError }: ErrorHandlerOptions<CodeT>) {
    this.onRethrowError = onRethrowError;
    type ICodeT = CodeT | GeneralErrorCodes;

    // implement checking for each of the general errors

    const dataValidationError: ErrorEntry<ICodeT> = {
      code: "DATA_VALIDATION_ERROR",
      condition: (e) => {
        return e instanceof z.ZodError;
      },
      getMessage: () => "An error occurred while validating the data",
    };

    const internalError: ErrorEntry<ICodeT> = {
      code: "INTERNAL_ERROR",
      condition: (e) => {
        if (isAxiosError(e)) {
          return e.response?.status != null && e.response.status >= 500 && e.response.status < 600;
        }

        return false;
      },
      getMessage: () => "An internal error occurred. This is most likely a bug on our end. Please try again later.",
    };

    const networkError: ErrorEntry<ICodeT> = {
      code: "NETWORK_ERROR",
      condition: (e) => {
        if (isAxiosError(e)) {
          return e.code === "ERR_NETWORK";
        }

        return false;
      },
      getMessage: () => "A network error occurred. Are you connected to the internet?",
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
      getMessage: () => "The request was canceled.",
    };

    const unknownError: ErrorEntry<ICodeT> = {
      code: "UNKNOWN_ERROR",
      condition: () => true,
      getMessage: () => "An unknown error occurred. Please try again later.",
    };

    // general errors have the lowest priority
    this.entries = [...entries, dataValidationError, internalError, networkError, canceledError, unknownError];
  }

  // convert the error into an application exception
  public rethrowError(error: unknown): ApplicationException<CodeT | GeneralErrorCodes> {
    const errorEntry = this.entries.find((entry) => entry.condition(error ?? {}))!;

    const serverMessage = RestUtils.extractServerErrorMessage(error);
    const exception = new ApplicationException(errorEntry.getMessage(error), errorEntry.code, serverMessage);

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
      return "An unknown error occurred. Please try again later.";
    }

    return null;
  }
}

// can be used for endpoints that only need general error handling
export const SharedErrorHandler = new ErrorHandler<never>({ entries: [] });
