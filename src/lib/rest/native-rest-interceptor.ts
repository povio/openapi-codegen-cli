import type { RestTransportInterceptor, TransportRequest, TransportResponse } from "./rest-transport.types";

export type NativeInterceptor = RestTransportInterceptor;

export class NativeRestInterceptor implements RestTransportInterceptor {
  constructor(private readonly interceptor: RestTransportInterceptor) {}

  onRequest(request: TransportRequest) {
    return this.interceptor.onRequest?.(request) ?? request;
  }

  onResponse<T>(response: TransportResponse<T>) {
    return this.interceptor.onResponse?.(response) ?? response;
  }

  onError(error: unknown) {
    if (!this.interceptor.onError) throw error;
    return this.interceptor.onError(error);
  }
}
