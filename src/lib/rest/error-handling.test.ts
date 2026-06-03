import axios from "axios";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ApplicationException, DomainErrorRegistry, ErrorHandler } from "./error-handling";
import { RestUtils } from "./rest.utils";

// ---------------------------------------------------------------------------
// RestUtils.extractServerResponseCode
// ---------------------------------------------------------------------------

function makeAxiosError(data: unknown, status = 400) {
  const err = new axios.AxiosError("request failed");
  err.response = { data, status, statusText: "Bad Request", headers: {}, config: {} } as never;
  return err;
}

describe("RestUtils.extractServerResponseCode", () => {
  it("returns null for a plain Error", () => {
    expect(RestUtils.extractServerResponseCode(new Error("oops"))).toBeNull();
  });

  it("returns 'validation-exception' for a ZodError", async () => {
    const { z } = await import("zod");
    const result = z.string().safeParse(123);
    if (result.success) throw new Error("expected failure");
    expect(RestUtils.extractServerResponseCode(result.error)).toBe("validation-exception");
  });

  it("returns a string code from response.data.code", () => {
    const err = makeAxiosError({ code: "USER_NOT_FOUND" });
    expect(RestUtils.extractServerResponseCode(err)).toBe("USER_NOT_FOUND");
  });

  it("returns a numeric code from response.data.code", () => {
    const err = makeAxiosError({ code: 1001 });
    expect(RestUtils.extractServerResponseCode(err)).toBe(1001);
  });

  it("returns null when code is boolean (neither string nor number)", () => {
    const err = makeAxiosError({ code: true });
    expect(RestUtils.extractServerResponseCode(err)).toBeNull();
  });

  it("returns null when response has no data.code", () => {
    const err = makeAxiosError({ message: "something went wrong" });
    expect(RestUtils.extractServerResponseCode(err)).toBeNull();
  });

  it("existing string behavior unchanged — null when no axios error", () => {
    expect(RestUtils.extractServerResponseCode("a string")).toBeNull();
    expect(RestUtils.extractServerResponseCode(null)).toBeNull();
    expect(RestUtils.extractServerResponseCode(undefined)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// DomainErrorRegistry
// ---------------------------------------------------------------------------

describe("DomainErrorRegistry", () => {
  afterEach(() => DomainErrorRegistry.clear());

  it("registers a single entry and retrieves it", () => {
    DomainErrorRegistry.register({ code: 1001, getMessage: () => "could not launch" });
    expect(DomainErrorRegistry.getEntry(1001)).toBeDefined();
    expect(DomainErrorRegistry.getEntry(1001)!.code).toBe(1001);
  });

  it("registers multiple entries via array", () => {
    DomainErrorRegistry.register([
      { code: 1001, getMessage: () => "could not launch" },
      { code: 2001, getMessage: () => "user not found" },
    ]);
    expect(DomainErrorRegistry.getEntry(1001)).toBeDefined();
    expect(DomainErrorRegistry.getEntry(2001)).toBeDefined();
  });

  it("later register overwrites earlier for same code", () => {
    DomainErrorRegistry.register({ code: 1001, getMessage: () => "old" });
    DomainErrorRegistry.register({ code: 1001, getMessage: () => "new" });
    expect(DomainErrorRegistry.getEntry(1001)!.getMessage({} as never, null)).toBe("new");
  });

  it("unregisters an entry", () => {
    DomainErrorRegistry.register({ code: 1001, getMessage: () => "msg" });
    DomainErrorRegistry.unregister(1001);
    expect(DomainErrorRegistry.getEntry(1001)).toBeUndefined();
  });

  it("clear() removes all entries", () => {
    DomainErrorRegistry.register([
      { code: 1001, getMessage: () => "a" },
      { code: 2001, getMessage: () => "b" },
    ]);
    DomainErrorRegistry.clear();
    expect(DomainErrorRegistry.getEntry(1001)).toBeUndefined();
    expect(DomainErrorRegistry.getEntry(2001)).toBeUndefined();
  });

  it("returns undefined for unregistered code", () => {
    expect(DomainErrorRegistry.getEntry(9999)).toBeUndefined();
  });

  it("registers and retrieves a string code", () => {
    DomainErrorRegistry.register({ code: "BUSINESS_PARTNER_IS_LOCKED", getMessage: () => "locked" });
    expect(DomainErrorRegistry.getEntry("BUSINESS_PARTNER_IS_LOCKED")).toBeDefined();
    expect(DomainErrorRegistry.getEntry("BUSINESS_PARTNER_IS_LOCKED")!.code).toBe("BUSINESS_PARTNER_IS_LOCKED");
  });

  it("unregisters a string code", () => {
    DomainErrorRegistry.register({ code: "SOME_ERROR", getMessage: () => "msg" });
    DomainErrorRegistry.unregister("SOME_ERROR");
    expect(DomainErrorRegistry.getEntry("SOME_ERROR")).toBeUndefined();
  });

  it("string '1001' and number 1001 are distinct entries", () => {
    DomainErrorRegistry.register({ code: "1001", getMessage: () => "string handler" });
    DomainErrorRegistry.register({ code: 1001, getMessage: () => "number handler" });
    expect(DomainErrorRegistry.getEntry("1001")!.getMessage({} as never, null)).toBe("string handler");
    expect(DomainErrorRegistry.getEntry(1001)!.getMessage({} as never, null)).toBe("number handler");
  });

  it("clear() removes both string and number entries", () => {
    DomainErrorRegistry.register({ code: "STRING_CODE", getMessage: () => "a" });
    DomainErrorRegistry.register({ code: 1001, getMessage: () => "b" });
    DomainErrorRegistry.clear();
    expect(DomainErrorRegistry.getEntry("STRING_CODE")).toBeUndefined();
    expect(DomainErrorRegistry.getEntry(1001)).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// ErrorHandler priority chain
// ---------------------------------------------------------------------------

describe("ErrorHandler priority", () => {
  afterEach(() => DomainErrorRegistry.clear());

  function makeNumericDomainAxiosError(code: number) {
    return makeAxiosError({ status: "error", code, message: "domain error" });
  }

  it("string-based per-instance entries still work unchanged", () => {
    const handler = new ErrorHandler({
      entries: [{ code: "USER_NOT_FOUND", condition: (e) => RestUtils.extractServerResponseCode(e) === "USER_NOT_FOUND", getMessage: () => "user not found" }],
    });
    const err = makeAxiosError({ code: "USER_NOT_FOUND" });
    expect(() => handler.rethrowError(err)).toThrow(ApplicationException);
    try {
      handler.rethrowError(err);
    } catch (e) {
      expect((e as ApplicationException<string>).code).toBe("USER_NOT_FOUND");
      expect((e as ApplicationException<string>).message).toBe("user not found");
    }
  });

  it("per-instance entry takes priority over DomainErrorRegistry for the same numeric code", () => {
    DomainErrorRegistry.register({ code: 1001, getMessage: () => "registry message" });

    const handler = new ErrorHandler({
      entries: [
        {
          code: "CUSTOM_OVERRIDE" as string,
          condition: (e) => RestUtils.extractServerResponseCode(e) === 1001,
          getMessage: () => "instance message",
        },
      ],
    });

    const err = makeNumericDomainAxiosError(1001);
    try {
      handler.rethrowError(err);
    } catch (e) {
      expect((e as ApplicationException<string>).message).toBe("instance message");
    }
  });

  it("DomainErrorRegistry matches before UNKNOWN_ERROR fallback", () => {
    DomainErrorRegistry.register({ code: 1001, getMessage: () => "rocket could not launch" });

    const handler = new ErrorHandler({ entries: [] });
    const err = makeNumericDomainAxiosError(1001);
    try {
      handler.rethrowError(err);
    } catch (e) {
      expect((e as ApplicationException<never>).message).toBe("rocket could not launch");
      expect((e as ApplicationException<never>).code).toBe(1001);
    }
  });

  it("unregistered numeric code falls through to UNKNOWN_ERROR", () => {
    const handler = new ErrorHandler({ entries: [] });
    const err = makeNumericDomainAxiosError(9999);
    try {
      handler.rethrowError(err);
    } catch (e) {
      expect((e as ApplicationException<never>).code).toBe("UNKNOWN_ERROR");
    }
  });

  it("DomainErrorRegistry condition can veto a code match", () => {
    DomainErrorRegistry.register({
      code: 1001,
      condition: () => false,
      getMessage: () => "should not be used",
    });

    const handler = new ErrorHandler({ entries: [] });
    const err = makeNumericDomainAxiosError(1001);
    try {
      handler.rethrowError(err);
    } catch (e) {
      // condition returned false → falls through to UNKNOWN_ERROR
      expect((e as ApplicationException<never>).code).toBe("UNKNOWN_ERROR");
    }
  });

  it("multiple ErrorHandler instances share the same DomainErrorRegistry", () => {
    DomainErrorRegistry.register({ code: 2001, getMessage: () => "shared domain msg" });

    const handlerA = new ErrorHandler({ entries: [] });
    const handlerB = new ErrorHandler({ entries: [] });

    for (const handler of [handlerA, handlerB]) {
      try {
        handler.rethrowError(makeNumericDomainAxiosError(2001));
      } catch (e) {
        expect((e as ApplicationException<never>).message).toBe("shared domain msg");
      }
    }
  });

  it("DomainErrorRegistry handles a string code when no per-instance entry matches", () => {
    DomainErrorRegistry.register({ code: "BUSINESS_PARTNER_IS_LOCKED", getMessage: () => "partner is locked" });

    const handler = new ErrorHandler({ entries: [] });
    const err = makeAxiosError({ code: "BUSINESS_PARTNER_IS_LOCKED", message: "locked" });
    try {
      handler.rethrowError(err);
    } catch (e) {
      expect((e as ApplicationException<never>).message).toBe("partner is locked");
      expect((e as ApplicationException<never>).code).toBe("BUSINESS_PARTNER_IS_LOCKED");
    }
  });

  it("per-instance string entry takes priority over registry for the same string code", () => {
    DomainErrorRegistry.register({ code: "BUSINESS_PARTNER_IS_LOCKED", getMessage: () => "registry message" });

    const handler = new ErrorHandler({
      entries: [
        {
          code: "BUSINESS_PARTNER_IS_LOCKED",
          condition: (e) => RestUtils.extractServerResponseCode(e) === "BUSINESS_PARTNER_IS_LOCKED",
          getMessage: () => "instance message",
        },
      ],
    });

    const err = makeAxiosError({ code: "BUSINESS_PARTNER_IS_LOCKED" });
    try {
      handler.rethrowError(err);
    } catch (e) {
      expect((e as ApplicationException<string>).message).toBe("instance message");
    }
  });

  it("string '1001' and number 1001 are matched independently", () => {
    DomainErrorRegistry.register({ code: "1001", getMessage: () => "string handler" });
    DomainErrorRegistry.register({ code: 1001, getMessage: () => "number handler" });

    const handler = new ErrorHandler({ entries: [] });

    // numeric code → number handler
    try {
      handler.rethrowError(makeNumericDomainAxiosError(1001));
    } catch (e) {
      expect((e as ApplicationException<never>).message).toBe("number handler");
    }

    // string code → string handler
    try {
      handler.rethrowError(makeAxiosError({ code: "1001" }));
    } catch (e) {
      expect((e as ApplicationException<never>).message).toBe("string handler");
    }
  });

  it("unregistered string code falls through to UNKNOWN_ERROR", () => {
    const handler = new ErrorHandler({ entries: [] });
    const err = makeAxiosError({ code: "UNREGISTERED_CODE" });
    try {
      handler.rethrowError(err);
    } catch (e) {
      expect((e as ApplicationException<never>).code).toBe("UNKNOWN_ERROR");
    }
  });
});