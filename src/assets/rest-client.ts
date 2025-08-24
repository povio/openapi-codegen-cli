import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, CreateAxiosDefaults } from "axios";
import { z } from "zod";
import { RestInterceptor } from "./rest-interceptor";

interface RequestInfo<ZOutput> {
  resSchema: z.ZodType<ZOutput>;
}

interface RequestConfig<IsRawRes extends boolean = false> {
  rawResponse?: IsRawRes;
}

type Response<ZOutput, IsRawRes extends boolean = false> = IsRawRes extends true ? AxiosResponse<ZOutput> : ZOutput;

export class RestClient {
  private client: AxiosInstance;

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

  public async get<ZOutput, IsRawRes extends boolean = false>(
    requestInfo: RequestInfo<ZOutput>,
    url: string,
    requestConfig?: AxiosRequestConfig & RequestConfig<IsRawRes>,
  ): Promise<Response<ZOutput, IsRawRes>> {
    return this.makeRequest(requestInfo, { ...requestConfig, method: "get", url });
  }

  public async post<ZOutput, IsRawRes extends boolean = false>(
    requestInfo: RequestInfo<ZOutput>,
    url: string,
    data?: any,
    requestConfig?: AxiosRequestConfig & RequestConfig<IsRawRes>,
  ): Promise<Response<ZOutput, IsRawRes>> {
    return this.makeRequest(requestInfo, { ...requestConfig, method: "post", url, data });
  }

  public async patch<ZOutput, IsRawRes extends boolean = false>(
    requestInfo: RequestInfo<ZOutput>,
    url: string,
    data?: any,
    requestConfig?: AxiosRequestConfig & RequestConfig<IsRawRes>,
  ): Promise<Response<ZOutput, IsRawRes>> {
    return this.makeRequest(requestInfo, { ...requestConfig, method: "patch", url, data });
  }

  public async put<ZOutput, IsRawRes extends boolean = false>(
    requestInfo: RequestInfo<ZOutput>,
    url: string,
    data?: any,
    requestConfig?: AxiosRequestConfig & RequestConfig<IsRawRes>,
  ): Promise<Response<ZOutput, IsRawRes>> {
    return this.makeRequest(requestInfo, { ...requestConfig, method: "put", url, data });
  }

  public async delete<ZOutput, IsRawRes extends boolean = false>(
    requestInfo: RequestInfo<ZOutput>,
    url: string,
    data?: any,
    requestConfig?: AxiosRequestConfig & RequestConfig<IsRawRes>,
  ): Promise<Response<ZOutput, IsRawRes>> {
    return this.makeRequest(requestInfo, { ...requestConfig, method: "delete", url, data });
  }

  private async makeRequest<ZOutput, IsRawRes extends boolean = false>(
    requestInfo: RequestInfo<ZOutput>,
    requestConfig: AxiosRequestConfig & RequestConfig<IsRawRes>,
  ): Promise<Response<ZOutput, IsRawRes>> {
    const { rawResponse, ...config } = requestConfig;

    const res = await this.client(config);

    const resData = requestInfo.resSchema.parse(res.data);

    return (rawResponse ? { ...res, data: resData } : resData) as Response<ZOutput, IsRawRes>;
  }
}
