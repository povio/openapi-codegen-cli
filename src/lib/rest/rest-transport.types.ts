import { z } from "zod";

export type GeneralTransportErrorCode =
  | "DATA_VALIDATION_ERROR"
  | "NETWORK_ERROR"
  | "CANCELED_ERROR"
  | "INTERNAL_ERROR"
  | "UNKNOWN_ERROR";

export type RestResponseType = "json" | "text" | "blob" | "arrayBuffer";
export type TransportFetch = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export interface UploadProgress {
  loaded: number;
  total: number;
}

export interface TransportRequestConfig<IsRawRes extends boolean = false> {
  headers?: HeadersInit;
  params?: Record<string, unknown>;
  signal?: AbortSignal;
  timeout?: number;
  credentials?: RequestCredentials;
  responseType?: RestResponseType;
  rawResponse?: IsRawRes;
  allowInvalidResponseData?: boolean;
  onUploadProgress?: (progress: UploadProgress) => void;
}

export interface TransportResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
  url: string;
}

export interface RestRequestInfo<ZOutput, ECodes extends string> {
  resSchema: z.ZodType<ZOutput>;
}

export interface TransportRequest {
  url: string;
  method: string;
  headers: Headers;
  body?: BodyInit | null;
  signal?: AbortSignal;
  credentials?: RequestCredentials;
  retryCount?: number;
}

export interface TransportErrorContext {
  request: TransportRequest;
  response?: TransportResponse<unknown>;
  retry(request?: TransportRequest): Promise<TransportResponse<unknown>>;
}

export interface RestTransportInterceptor {
  onRequest?(request: TransportRequest): TransportRequest | Promise<TransportRequest>;
  onResponse?<T>(response: TransportResponse<T>): TransportResponse<T> | Promise<TransportResponse<T>>;
  onError?(error: unknown, context: TransportErrorContext): unknown | Promise<unknown>;
}

export type TransportResult<T, IsRawRes extends boolean> = IsRawRes extends true ? TransportResponse<T> : T;

export interface RestTransport {
  attachInterceptor(interceptor: RestTransportInterceptor): void;
  ejectInterceptor(interceptor: RestTransportInterceptor): void;
  get<T, E extends string, R extends boolean = false>(
    info: RestRequestInfo<T, E>,
    url: string,
    config?: TransportRequestConfig<R>,
  ): Promise<TransportResult<T, R>>;
  post<T, E extends string, R extends boolean = false>(
    info: RestRequestInfo<T, E>,
    url: string,
    data?: unknown,
    config?: TransportRequestConfig<R>,
  ): Promise<TransportResult<T, R>>;
  patch<T, E extends string, R extends boolean = false>(
    info: RestRequestInfo<T, E>,
    url: string,
    data?: unknown,
    config?: TransportRequestConfig<R>,
  ): Promise<TransportResult<T, R>>;
  put<T, E extends string, R extends boolean = false>(
    info: RestRequestInfo<T, E>,
    url: string,
    data?: unknown,
    config?: TransportRequestConfig<R>,
  ): Promise<TransportResult<T, R>>;
  delete<T, E extends string, R extends boolean = false>(
    info: RestRequestInfo<T, E>,
    url: string,
    data?: unknown,
    config?: TransportRequestConfig<R>,
  ): Promise<TransportResult<T, R>>;
  upload(url: string, data: BodyInit, config?: TransportRequestConfig, method?: "put" | "post"): Promise<void>;
}

export class HttpError<T = unknown> extends Error {
  constructor(
    message: string,
    public readonly response: TransportResponse<T>,
  ) {
    super(message);
    this.name = "HttpError";
  }
}
