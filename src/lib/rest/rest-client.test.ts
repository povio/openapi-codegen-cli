import axios from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { RestClient } from "./rest-client";

vi.mock("axios", () => ({
  default: {
    create: vi.fn(),
  },
}));

const mockedAxiosCreate = vi.mocked(axios.create);

describe("RestClient allowInvalidResponseData", () => {
  const clientMock = vi.fn();
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    clientMock.mockReset();
    mockedAxiosCreate.mockReturnValue(
      Object.assign(clientMock, {
        interceptors: {
          request: { use: vi.fn(), eject: vi.fn() },
          response: { use: vi.fn(), eject: vi.fn() },
        },
        getUri: vi.fn(),
        request: vi.fn(),
        get: vi.fn(),
        delete: vi.fn(),
        head: vi.fn(),
        options: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        patch: vi.fn(),
        postForm: vi.fn(),
        putForm: vi.fn(),
        patchForm: vi.fn(),
        defaults: {},
      }) as never,
    );
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("returns invalid GET response data and logs the Zod error when allowed", async () => {
    clientMock.mockResolvedValue({ data: { id: 123 } });

    const client = new RestClient();
    const result = await client.get(
      { resSchema: z.object({ id: z.string() }), allowInvalidResponseData: true },
      "/items/1",
    );

    expect(result).toEqual({ id: 123 });
    expect(consoleErrorSpy).toHaveBeenCalledOnce();
  });

  it("still rejects invalid non-GET response data when allowed", async () => {
    clientMock.mockResolvedValue({ data: { id: 123 } });

    const client = new RestClient();

    await expect(
      client.post({ resSchema: z.object({ id: z.string() }), allowInvalidResponseData: true }, "/items"),
    ).rejects.toThrow();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });
});
