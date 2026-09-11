import { describe, expect, it } from "vitest";

import { NativeHttpError } from "./native-rest-client.types";
import { RestUtils } from "./rest.utils";

describe("transport-neutral REST utilities", () => {
  it("matches messages from both native and Axios-shaped errors", () => {
    const response = {
      data: { message: "Access Denied" },
      status: 403,
      statusText: "Forbidden",
      headers: new Headers(),
      url: "/test",
    };
    const errors = [new NativeHttpError("Forbidden", response), { isAxiosError: true, response }];
    for (const error of errors) {
      expect(RestUtils.doesServerErrorMessageContain(error, "denied")).toBe(true);
      expect(RestUtils.doesServerErrorMessageContain(error, "missing")).toBe(false);
    }
    expect(RestUtils.doesServerErrorMessageContain(null, "denied")).toBe(false);
  });

  it("extracts filenames from native Headers and Axios-style records", () => {
    for (const headers of [
      new Headers({ "Content-Disposition": 'attachment; filename="report.csv"' }),
      { "content-disposition": 'attachment; filename="report.csv"' },
    ]) {
      expect(RestUtils.extractContentDispositionFilename(headers)).toBe("report.csv");
    }
    for (const headers of [new Headers(), {}, { "content-disposition": 42 }]) {
      expect(RestUtils.extractContentDispositionFilename(headers)).toBeUndefined();
    }
  });
});
