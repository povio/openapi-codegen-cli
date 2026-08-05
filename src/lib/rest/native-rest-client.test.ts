import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { NativeRestClient } from "./native-rest-client";
import { NativeRestInterceptor } from "./native-rest-interceptor";
import { NativeHttpError } from "./native-rest-client.types";

describe("NativeRestClient", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("uses fetch, serializes params, and validates JSON", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ id: "1" }), { status: 200, headers: { "content-type": "application/json" } }),
      );
    vi.stubGlobal("fetch", fetchMock);

    const client = new NativeRestClient({ config: { baseURL: "https://api.example.com/v1/" } });
    const result = await client.get({ resSchema: z.object({ id: z.string() }) }, "items", {
      params: { tag: ["a", "b"], page: 2 },
    });

    expect(result).toEqual({ id: "1" });
    expect(fetchMock.mock.calls[0]?.[0]).toBe("https://api.example.com/v1/items?tag=a&tag=b&page=2");
  });

  it("runs request interceptors and can return response metadata", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), { status: 201, headers: { "content-type": "application/json" } }),
      );
    vi.stubGlobal("fetch", fetchMock);
    const auth = new NativeRestInterceptor({
      onRequest(request) {
        request.headers.set("authorization", "Bearer token");
        return request;
      },
    });
    const client = new NativeRestClient({
      config: { baseURL: "https://api.example.com" },
      interceptors: [auth],
    });

    const response = await client.post(
      { resSchema: z.object({ ok: z.boolean() }) },
      "/items",
      { name: "item" },
      { rawResponse: true },
    );

    expect(response.status).toBe(201);
    expect(response.data).toEqual({ ok: true });
    const init = fetchMock.mock.calls[0]?.[1] as RequestInit;
    expect((init.headers as Headers).get("authorization")).toBe("Bearer token");
    expect(init.body).toBe(JSON.stringify({ name: "item" }));
  });

  it("supports an injected fetch implementation", async () => {
    const customFetch = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), { headers: { "content-type": "application/json" } }),
      );
    const client = new NativeRestClient({
      config: { baseURL: "https://api.example.com", fetch: customFetch },
    });

    await client.get({ resSchema: z.object({ ok: z.boolean() }) }, "/items");

    expect(customFetch).toHaveBeenCalledOnce();
  });

  it("lets an error interceptor refresh credentials and retry a request", async () => {
    const customFetch = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ code: "UNAUTHORIZED" }), {
          status: 401,
          headers: { "content-type": "application/json" },
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ id: "1" }), {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
      );
    const client = new NativeRestClient({
      config: { baseURL: "https://api.example.com", fetch: customFetch },
      interceptors: [
        {
          async onError(error, context) {
            if (error instanceof NativeHttpError && error.response.status === 401) {
              context.request.headers.set("authorization", "Bearer refreshed");
              return context.retry();
            }
            throw error;
          },
        },
      ],
    });

    await expect(client.get({ resSchema: z.object({ id: z.string() }) }, "/items")).resolves.toEqual({ id: "1" });
    expect((customFetch.mock.calls[1]?.[1]?.headers as Headers).get("authorization")).toBe("Bearer refreshed");
  });

  it("uses XHR only when browser upload progress is requested", async () => {
    const fetchMock = vi.fn();
    const progress = vi.fn();
    const instances: MockXmlHttpRequest[] = [];
    class MockXmlHttpRequest {
      upload: { onprogress?: (event: { loaded: number; total: number }) => void } = {};
      status = 200;
      timeout = 0;
      onload?: () => void;
      onerror?: () => void;
      ontimeout?: () => void;
      onabort?: () => void;
      method?: string;
      url?: string;
      constructor() {
        instances.push(this);
      }
      open(method: string, url: string) {
        this.method = method;
        this.url = url;
      }
      setRequestHeader() {}
      abort() {
        this.onabort?.();
      }
      send() {
        this.upload.onprogress?.({ loaded: 5, total: 10 });
        this.onload?.();
      }
    }
    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("XMLHttpRequest", MockXmlHttpRequest);

    const client = new NativeRestClient();
    await client.upload("https://uploads.example.com/file", new Blob(["data"]), { onUploadProgress: progress });

    expect(fetchMock).not.toHaveBeenCalled();
    expect(instances[0]).toMatchObject({ method: "PUT", url: "https://uploads.example.com/file" });
    expect(progress).toHaveBeenCalledWith({ loaded: 5, total: 10 });
  });

  it("throws transport errors directly for the application to handle", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ code: "NOT_FOUND", message: "Missing" }), {
          status: 404,
          headers: { "content-type": "application/json" },
        }),
      ),
    );
    const client = new NativeRestClient({ config: { baseURL: "https://api.example.com" } });

    const request = client.get({ resSchema: z.object({ id: z.string() }) }, "/missing");

    await expect(request).rejects.toBeInstanceOf(NativeHttpError);
    await expect(request).rejects.toMatchObject({
      response: { status: 404, data: { code: "NOT_FOUND", message: "Missing" } },
    });
  });
});
