/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";

import {
  NativeHttpError,
  NativeRequest,
  NativeRequestConfig,
  NativeRequestInfo,
  NativeResponse,
} from "./native-rest-client.types";
import type { GeneralTransportErrorCode, RestTransport, RestTransportInterceptor } from "./rest-transport.types";

type NativeResult<T, IsRawRes extends boolean> = IsRawRes extends true ? NativeResponse<T> : T;

export class NativeRestClient implements RestTransport {
  private readonly interceptors: RestTransportInterceptor[];

  constructor({
    config,
    interceptors = [],
  }: {
    config?: { baseURL?: string; headers?: HeadersInit; credentials?: RequestCredentials };
    interceptors?: RestTransportInterceptor[];
  } = {}) {
    this.baseURL = config?.baseURL ?? "";
    this.headers = config?.headers;
    this.credentials = config?.credentials;
    this.interceptors = [...interceptors];
  }

  private readonly baseURL: string;
  private readonly headers?: HeadersInit;
  private readonly credentials?: RequestCredentials;

  attachInterceptor(interceptor: RestTransportInterceptor) {
    this.interceptors.push(interceptor);
  }

  ejectInterceptor(interceptor: RestTransportInterceptor) {
    const index = this.interceptors.indexOf(interceptor);
    if (index >= 0) this.interceptors.splice(index, 1);
  }

  get<T, E extends string = GeneralTransportErrorCode, R extends boolean = false>(
    info: NativeRequestInfo<T, E>,
    url: string,
    config?: NativeRequestConfig<R>,
  ): Promise<NativeResult<T, R>> {
    return this.request(info, "GET", url, undefined, config);
  }

  post<T, E extends string = GeneralTransportErrorCode, R extends boolean = false>(
    info: NativeRequestInfo<T, E>,
    url: string,
    data?: unknown,
    config?: NativeRequestConfig<R>,
  ): Promise<NativeResult<T, R>> {
    return this.request(info, "POST", url, data, config);
  }

  patch<T, E extends string = GeneralTransportErrorCode, R extends boolean = false>(
    info: NativeRequestInfo<T, E>,
    url: string,
    data?: unknown,
    config?: NativeRequestConfig<R>,
  ): Promise<NativeResult<T, R>> {
    return this.request(info, "PATCH", url, data, config);
  }

  put<T, E extends string = GeneralTransportErrorCode, R extends boolean = false>(
    info: NativeRequestInfo<T, E>,
    url: string,
    data?: unknown,
    config?: NativeRequestConfig<R>,
  ): Promise<NativeResult<T, R>> {
    return this.request(info, "PUT", url, data, config);
  }

  delete<T, E extends string = GeneralTransportErrorCode, R extends boolean = false>(
    info: NativeRequestInfo<T, E>,
    url: string,
    data?: unknown,
    config?: NativeRequestConfig<R>,
  ): Promise<NativeResult<T, R>> {
    return this.request(info, "DELETE", url, data, config);
  }

  async upload(
    url: string,
    data: BodyInit,
    config: NativeRequestConfig = {},
    method: "put" | "post" = "put",
  ): Promise<void> {
    if (config.onUploadProgress && typeof XMLHttpRequest !== "undefined") {
      await this.uploadWithXhr(url, data, config, method);
      return;
    }
    await this.execute(
      { url, method: method.toUpperCase(), body: data, headers: new Headers(config.headers), signal: config.signal },
      config,
      false,
    );
  }

  private async request<T, E extends string, R extends boolean>(
    info: NativeRequestInfo<T, E>,
    method: string,
    path: string,
    data?: unknown,
    config: NativeRequestConfig<R> = {},
  ): Promise<NativeResult<T, R>> {
    const errorStack = new Error().stack;
    try {
      const headers = new Headers(this.headers);
      new Headers(config.headers).forEach((value, key) => headers.set(key, value));
      let body: BodyInit | undefined;
      if (data != null) {
        if (data instanceof FormData || data instanceof Blob || typeof data === "string") body = data;
        else {
          body = JSON.stringify(data);
          if (!headers.has("content-type")) headers.set("content-type", "application/json");
        }
      }
      const request: NativeRequest = {
        url: this.resolveUrl(path, config.params),
        method,
        headers,
        body,
        signal: config.signal,
        credentials: config.credentials ?? this.credentials,
      };
      const response = await this.execute(request, config);
      const parseResult = info.resSchema.safeParse(response.data);
      let dataResult: T;
      if (parseResult.success) dataResult = parseResult.data;
      else if (config.allowInvalidResponseData && method === "GET") {
        parseResult.error.name = "BE Response schema mismatch - ZodError";
        parseResult.error.stack = [parseResult.error.stack, ...(errorStack?.split("\n").slice(2) ?? [])].join("\n");
        console.error(parseResult.error);
        dataResult = response.data as T;
      } else throw parseResult.error;
      return (config.rawResponse ? { ...response, data: dataResult } : dataResult) as NativeResult<T, R>;
    } catch (error) {
      if (error instanceof z.ZodError) error.name = "BE Response schema mismatch - ZodError";
      const transformed = await this.runErrorInterceptors(error);
      throw transformed;
    }
  }

  private async execute(
    request: NativeRequest,
    config: NativeRequestConfig<boolean> = {},
    applyInterceptors = true,
  ): Promise<NativeResponse<unknown>> {
    let next = request;
    if (applyInterceptors) {
      for (const interceptor of this.interceptors) next = (await interceptor.onRequest?.(next)) ?? next;
    }
    const timeoutController = config.timeout ? new AbortController() : undefined;
    const timer = timeoutController ? setTimeout(() => timeoutController.abort(), config.timeout) : undefined;
    if (timeoutController && next.signal) {
      if (next.signal.aborted) timeoutController.abort(next.signal.reason);
      else next.signal.addEventListener("abort", () => timeoutController.abort(next.signal?.reason), { once: true });
    }
    const signal = timeoutController?.signal ?? next.signal;
    try {
      const res = await fetch(next.url, {
        method: next.method,
        headers: next.headers,
        body: next.body,
        signal,
        credentials: next.credentials,
      });
      const data = await this.readResponse(res, config.responseType);
      let response: NativeResponse<unknown> = {
        data,
        status: res.status,
        statusText: res.statusText,
        headers: res.headers,
        url: res.url,
      };
      if (!res.ok) throw new NativeHttpError(`Request failed with status ${res.status}`, response);
      if (applyInterceptors) {
        for (const interceptor of this.interceptors) response = (await interceptor.onResponse?.(response)) ?? response;
      }
      return response;
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  private async readResponse(response: globalThis.Response, type?: NativeRequestConfig<boolean>["responseType"]) {
    if (response.status === 204) return undefined;
    if (type === "blob") return response.blob();
    if (type === "arrayBuffer") return response.arrayBuffer();
    if (type === "text") return response.text();
    const text = await response.text();
    if (text === "") return undefined;
    if (!response.headers.get("content-type")?.includes("json")) {
      try {
        return JSON.parse(text);
      } catch {
        return text;
      }
    }
    return JSON.parse(text);
  }

  private resolveUrl(path: string, params?: Record<string, unknown>) {
    const baseURL = this.baseURL && !this.baseURL.endsWith("/") ? `${this.baseURL}/` : this.baseURL;
    const url = /^https?:\/\//.test(path)
      ? new URL(path)
      : new URL(path.replace(/^\//, ""), baseURL || globalThis.location?.origin);
    for (const [key, value] of Object.entries(params ?? {})) {
      if (value == null) continue;
      if (Array.isArray(value)) value.forEach((item) => url.searchParams.append(key, String(item)));
      else url.searchParams.append(key, String(value));
    }
    return url.toString();
  }

  private async runErrorInterceptors(error: unknown) {
    let next = error;
    for (const interceptor of [...this.interceptors].reverse()) {
      if (interceptor.onError) {
        try {
          next = await interceptor.onError(next);
        } catch (transformed) {
          next = transformed;
        }
      }
    }
    return next;
  }

  private uploadWithXhr(url: string, data: BodyInit, config: NativeRequestConfig<boolean>, method: "put" | "post") {
    return new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(method.toUpperCase(), url);
      new Headers(config.headers).forEach((value, key) => xhr.setRequestHeader(key, value));
      if (config.timeout) xhr.timeout = config.timeout;
      xhr.upload.onprogress = ({ loaded, total }) => config.onUploadProgress?.({ loaded, total });
      xhr.onload = () =>
        xhr.status >= 200 && xhr.status < 300
          ? resolve()
          : reject(new Error(`Upload failed with status ${xhr.status}`));
      xhr.onerror = () => reject(new TypeError("Network request failed"));
      xhr.ontimeout = () => reject(new DOMException("Request timed out", "TimeoutError"));
      config.signal?.addEventListener("abort", () => xhr.abort(), { once: true });
      xhr.onabort = () => reject(config.signal?.reason ?? new DOMException("Request aborted", "AbortError"));
      xhr.send(data as XMLHttpRequestBodyInit);
    });
  }
}
