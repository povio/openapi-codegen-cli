import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, CreateAxiosDefaults } from "axios";
import { z } from "zod";
import { RestInterceptor } from "./rest-interceptor";

interface RequestInfo<ZResDto extends z.ZodRawShape, ResDto, Res> {
  resSchema: z.ZodEffects<z.ZodObject<ZResDto, "strip", z.ZodTypeAny, ResDto>, Res> | z.ZodSchema<Res>;
}

interface RequestConfig<RawRes extends boolean = false> {
  rawResponse?: RawRes;
}

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

  public async get<ZResDto extends z.ZodRawShape, ResDto, Res, RawRes extends boolean = false>(
    requestInfo: RequestInfo<ZResDto, ResDto, Res>,
    url: string,
    requestConfig?: AxiosRequestConfig & RequestConfig<RawRes>,
  ): Promise<RawRes extends true ? AxiosResponse<Res> : Res> {
    return this.makeRequest(requestInfo, { ...requestConfig, method: "get", url });
  }

  public async post<ZResDto extends z.ZodRawShape, ResDto, Res, RawRes extends boolean = false>(
    requestInfo: RequestInfo<ZResDto, ResDto, Res>,
    url: string,
    data?: any,
    requestConfig?: AxiosRequestConfig & RequestConfig<RawRes>,
  ): Promise<RawRes extends true ? AxiosResponse<Res> : Res> {
    return this.makeRequest(requestInfo, { ...requestConfig, method: "post", url, data });
  }

  public async patch<ZResDto extends z.ZodRawShape, ResDto, Res, RawRes extends boolean = false>(
    requestInfo: RequestInfo<ZResDto, ResDto, Res>,
    url: string,
    data?: any,
    requestConfig?: AxiosRequestConfig & RequestConfig<RawRes>,
  ): Promise<RawRes extends true ? AxiosResponse<Res> : Res> {
    return this.makeRequest(requestInfo, { ...requestConfig, method: "patch", url, data });
  }

  public async put<ZResDto extends z.ZodRawShape, ResDto, Res, RawRes extends boolean = false>(
    requestInfo: RequestInfo<ZResDto, ResDto, Res>,
    url: string,
    data?: any,
    requestConfig?: AxiosRequestConfig & RequestConfig<RawRes>,
  ): Promise<RawRes extends true ? AxiosResponse<Res> : Res> {
    return this.makeRequest(requestInfo, { ...requestConfig, method: "put", url, data });
  }

  public async delete<ZResDto extends z.ZodRawShape, ResDto, Res, RawRes extends boolean = false>(
    requestInfo: RequestInfo<ZResDto, ResDto, Res>,
    url: string,
    data?: any,
    requestConfig?: AxiosRequestConfig & RequestConfig<RawRes>,
  ): Promise<RawRes extends true ? AxiosResponse<Res> : Res> {
    return this.makeRequest(requestInfo, { ...requestConfig, method: "delete", url, data });
  }

  private async makeRequest<ZResDto extends z.ZodRawShape, ResDto, Res, RawRes extends boolean = false>(
    requestInfo: RequestInfo<ZResDto, ResDto, Res>,
    requestConfig: AxiosRequestConfig & RequestConfig<RawRes>,
  ): Promise<RawRes extends true ? AxiosResponse<Res> : Res> {
    const { rawResponse, ...config } = requestConfig;

    const res = await this.client(config);

    const resData = requestInfo.resSchema.parse(res.data);

    return (rawResponse ? { ...res, data: resData } : resData) as RawRes extends true ? AxiosResponse<Res> : Res;
  }
}
