/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { z } from "zod";

import { ErrorHandler } from "./error-handling";
import { RestInterceptor } from "./rest-interceptor";

export type GeneralErrorCodes = string;

export interface RequestInfo<ZOutput, ECodes extends string> {
  resSchema: z.ZodType<ZOutput>;
  errorHandler?: ErrorHandler<ECodes>;
}

export interface RequestConfig<IsRawRes extends boolean = false> {
  rawResponse?: IsRawRes;
}

export type Response<ZOutput, IsRawRes extends boolean = false> = IsRawRes extends true
  ? AxiosResponse<ZOutput>
  : ZOutput;

export interface RestClient {
  attachInterceptors<T extends any[]>(interceptors?: RestInterceptor<T>[], ...args: T): void;

  attachInterceptor<T extends any[]>(interceptor: RestInterceptor<T>, ...args: T): void;

  ejectInterceptor<T extends any[]>(interceptor: RestInterceptor<T>): void;

  get<ZOutput, ECodes extends string = GeneralErrorCodes, IsRawRes extends boolean = false>(
    requestInfo: RequestInfo<ZOutput, ECodes>,
    url: string,
    requestConfig?: AxiosRequestConfig & RequestConfig<IsRawRes>,
  ): Promise<Response<ZOutput, IsRawRes>>;

  post<ZOutput, ECodes extends string = GeneralErrorCodes, IsRawRes extends boolean = false>(
    requestInfo: RequestInfo<ZOutput, ECodes>,
    url: string,
    data?: any,
    requestConfig?: AxiosRequestConfig & RequestConfig<IsRawRes>,
  ): Promise<Response<ZOutput, IsRawRes>>;

  patch<ZOutput, ECodes extends string = GeneralErrorCodes, IsRawRes extends boolean = false>(
    requestInfo: RequestInfo<ZOutput, ECodes>,
    url: string,
    data?: any,
    requestConfig?: AxiosRequestConfig & RequestConfig<IsRawRes>,
  ): Promise<Response<ZOutput, IsRawRes>>;

  put<ZOutput, ECodes extends string = GeneralErrorCodes, IsRawRes extends boolean = false>(
    requestInfo: RequestInfo<ZOutput, ECodes>,
    url: string,
    data?: any,
    requestConfig?: AxiosRequestConfig & RequestConfig<IsRawRes>,
  ): Promise<Response<ZOutput, IsRawRes>>;

  delete<ZOutput, ECodes extends string = GeneralErrorCodes, IsRawRes extends boolean = false>(
    requestInfo: RequestInfo<ZOutput, ECodes>,
    url: string,
    data?: any,
    requestConfig?: AxiosRequestConfig & RequestConfig<IsRawRes>,
  ): Promise<Response<ZOutput, IsRawRes>>;
}
