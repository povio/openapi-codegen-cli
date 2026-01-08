/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosRequestConfig, CreateAxiosDefaults } from "axios";
import { z } from "zod";

import { GeneralErrorCodes, SharedErrorHandler } from "./error-handling";
import { RestInterceptor } from "./rest-interceptor";
import { RestClient as IRestClient, RequestConfig, RequestInfo, Response } from "./rest-client.types";

export class RestClient implements IRestClient {
  private readonly client: AxiosInstance;

  constructor({
    config,
    interceptors,
  }: {
    config?: CreateAxiosDefaults;
    interceptors?: RestInterceptor<any[]>[];
  } = {}) {
    this.client = axios.create(config);
    this.attachInterceptors(interceptors);
  }

  public attachInterceptors<T extends any[]>(interceptors?: RestInterceptor<T>[], ...args: T) {
    if (interceptors != null) {
      interceptors.forEach((interceptor) => this.attachInterceptor(interceptor, ...args));
    }
  }

  public attachInterceptor<T extends any[]>(interceptor: RestInterceptor<T>, ...args: T) {
    interceptor.addInterceptor(this.client, ...args);
  }

  public ejectInterceptor<T extends any[]>(interceptor: RestInterceptor<T>) {
    interceptor.removeInterceptor(this.client);
  }

  public async get<ZOutput, ECodes extends string = GeneralErrorCodes, IsRawRes extends boolean = false>(
    requestInfo: RequestInfo<ZOutput, ECodes>,
    url: string,
    requestConfig?: AxiosRequestConfig & RequestConfig<IsRawRes>,
  ): Promise<Response<ZOutput, IsRawRes>> {
    return this.makeRequest(requestInfo, { ...requestConfig, method: "get", url });
  }

  public async post<ZOutput, ECodes extends string = GeneralErrorCodes, IsRawRes extends boolean = false>(
    requestInfo: RequestInfo<ZOutput, ECodes>,
    url: string,
    data?: any,
    requestConfig?: AxiosRequestConfig & RequestConfig<IsRawRes>,
  ): Promise<Response<ZOutput, IsRawRes>> {
    return this.makeRequest(requestInfo, { ...requestConfig, method: "post", url, data });
  }

  public async patch<ZOutput, ECodes extends string = GeneralErrorCodes, IsRawRes extends boolean = false>(
    requestInfo: RequestInfo<ZOutput, ECodes>,
    url: string,
    data?: any,
    requestConfig?: AxiosRequestConfig & RequestConfig<IsRawRes>,
  ): Promise<Response<ZOutput, IsRawRes>> {
    return this.makeRequest(requestInfo, { ...requestConfig, method: "patch", url, data });
  }

  public async put<ZOutput, ECodes extends string = GeneralErrorCodes, IsRawRes extends boolean = false>(
    requestInfo: RequestInfo<ZOutput, ECodes>,
    url: string,
    data?: any,
    requestConfig?: AxiosRequestConfig & RequestConfig<IsRawRes>,
  ): Promise<Response<ZOutput, IsRawRes>> {
    return this.makeRequest(requestInfo, { ...requestConfig, method: "put", url, data });
  }

  public async delete<ZOutput, ECodes extends string = GeneralErrorCodes, IsRawRes extends boolean = false>(
    requestInfo: RequestInfo<ZOutput, ECodes>,
    url: string,
    data?: any,
    requestConfig?: AxiosRequestConfig & RequestConfig<IsRawRes>,
  ): Promise<Response<ZOutput, IsRawRes>> {
    return this.makeRequest(requestInfo, { ...requestConfig, method: "delete", url, data });
  }

  private async makeRequest<ZOutput, ECodes extends string = GeneralErrorCodes, IsRawRes extends boolean = false>(
    requestInfo: RequestInfo<ZOutput, ECodes>,
    requestConfig: AxiosRequestConfig & RequestConfig<IsRawRes>,
  ): Promise<Response<ZOutput, IsRawRes>> {
    const errorStack = new Error().stack;

    try {
      const { rawResponse, ...config } = requestConfig;

      const res = await this.client(config);

      const resData = requestInfo.resSchema.parse(res.data);

      return (rawResponse ? { ...res, data: resData } : resData) as Response<ZOutput, IsRawRes>;
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.name = "BE Response schema mismatch - ZodError";
        error.stack = [error.stack, ...(errorStack?.split("\n").slice(2) ?? [])].join("\n");
      }
      const errorHandler = requestInfo.errorHandler ?? SharedErrorHandler;
      errorHandler.rethrowError(error);
      throw error;
    }
  }
}
