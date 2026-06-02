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
  getMessage: (t: TFunction<string, undefined>, error: unknown) => string;
}

export interface DomainErrorEntry {
  code: number;
  condition?: (error: unknown) => boolean;
  getMessage: (t: TFunction<string, undefined>, error: unknown) => string;
}

export class DomainErrorRegistry {
  private static readonly entries = new Map<number, DomainErrorEntry>();

  static register(entry: DomainErrorEntry): void;
  static register(entries: DomainErrorEntry[]): void;
  static register(entryOrEntries: DomainErrorEntry | DomainErrorEntry[]): void {
    const items = Array.isArray(entryOrEntries) ? entryOrEntries : [entryOrEntries];
    for (const item of items) {
      this.entries.set(item.code, item);
    }
  }

  static unregister(code: number): void {
    this.entries.delete(code);
  }

  static clear(): void {
    this.entries.clear();
  }

  static getEntry(code: number): DomainErrorEntry | undefined {
    return this.entries.get(code);
  }
}

export interface ErrorHandlerOptions<CodeT extends string | number> {
  entries: ErrorEntry<CodeT>[];
  t?: TFunction<string, undefined>;
  onRethrowError?: (error: unknown, exception: ApplicationException<CodeT | GeneralErrorCodes>) => void;
}

export class ErrorHandler<CodeT extends string | number> {
  entries: ErrorEntry<CodeT | GeneralErrorCodes>[] = [];
  private readonly userEntries: ErrorEntry<CodeT | GeneralErrorCodes>[];
  private readonly generalEntries: ErrorEntry<CodeT | GeneralErrorCodes>[];
  private t: TFunction<string, undefined>;
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

    this.userEntries = [...entries];
    this.generalEntries = [dataValidationError, internalError, networkError, canceledError, unknownError];
    // combined for public backward compatibility
    this.entries = [...this.userEntries, ...this.generalEntries];
  }

  private matchesEntry(error: unknown, entry: ErrorEntry<CodeT | GeneralErrorCodes>, code: string | number | null): boolean {
    if (entry.condition) {
      return entry.condition(error);
    }
    return code === entry.code;
  }

  public setTranslateFunction(t: TFunction<string, undefined>) {
    this.t = t;
  }

  public rethrowError(error: unknown): ApplicationException<CodeT | GeneralErrorCodes> {
    const code = RestUtils.extractServerResponseCode(error);
    const serverMessage = RestUtils.extractServerErrorMessage(error);

    // 1. Per-instance custom entries (highest priority)
    const userEntry = this.userEntries.find((entry) => this.matchesEntry(error, entry, code));
    if (userEntry) {
      const exception = new ApplicationException(userEntry.getMessage(this.t, error), userEntry.code, serverMessage);
      this.onRethrowError?.(error, exception);
      throw exception;
    }

    // 2. Global domain error registry (numeric codes)
    if (typeof code === "number") {
      const registryEntry = DomainErrorRegistry.getEntry(code);
      if (registryEntry && (!registryEntry.condition || registryEntry.condition(error))) {
        const exception = new ApplicationException(registryEntry.getMessage(this.t, error), registryEntry.code, serverMessage);
        this.onRethrowError?.(error, exception as unknown as ApplicationException<CodeT | GeneralErrorCodes>);
        throw exception;
      }
    }

    // 3. Built-in general fallbacks (lowest priority)
    const generalEntry = this.generalEntries.find((entry) => this.matchesEntry(error, entry, code))!;
    const exception = new ApplicationException(generalEntry.getMessage(this.t, error), generalEntry.code, serverMessage);
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
      if (error.serverMessage != null) {
        return error.serverMessage;
      }
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
