import { AxiosInstance } from "axios";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class RestInterceptor<T extends any[]> {
  private interceptorIdMap: { client: AxiosInstance; interceptorId: number }[] = [];

  constructor(private applyInterceptor: (client: AxiosInstance, ...args: T) => number) {}

  public addInterceptor(client: AxiosInstance, ...args: T) {
    this.removeInterceptor(client);
    const interceptorId = this.applyInterceptor(client, ...args);
    this.interceptorIdMap.push({ client, interceptorId });
  }

  public removeInterceptor(client: AxiosInstance) {
    const interceptorId = this.interceptorIdMap.find((i) => i.client === client)?.interceptorId;

    if (interceptorId != null) {
      client.interceptors.request.eject(interceptorId);
      this.interceptorIdMap = this.interceptorIdMap.filter((i) => i.client !== client);
    }
  }
}
