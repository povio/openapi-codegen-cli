import { describe, expect, test } from "vitest";
import { pathToVariableName, toBoolean } from "./openapi.utils";

describe("Utils: openapi", () => {
  describe("toBoolean", () => {
    test("returns boolean true, when string value 'true'", () => {
      expect(toBoolean("true", false)).toEqual(true);
    });

    test("returns boolean false, when string value 'false'", () => {
      expect(toBoolean("false", true)).toEqual(false);
    });

    test("returns default boolean value, when empty string is present", () => {
      expect(toBoolean("", true)).toEqual(true);
      expect(toBoolean("", false)).toEqual(false);
    });

    test("returns default boolean value, when undefined", () => {
      expect(toBoolean(undefined, true)).toEqual(true);
      expect(toBoolean(undefined, false)).toEqual(false);
    });
  });

  describe("pathToVariableName", () => {
    test("no path parameters", () => {
      expect(pathToVariableName("/business-partners")).toEqual("BusinessPartners");
    });

    test("one path parameter", () => {
      expect(pathToVariableName("/business-partners/{id}")).toEqual("BusinessPartnersById");
      expect(pathToVariableName("/business-partners/{id}/remarks")).toEqual("BusinessPartnersRemarksById");
    });

    test("multiple path parameters", () => {
      expect(pathToVariableName("/business-partners/{id}/remarks/{remarkId}")).toEqual(
        "BusinessPartnersRemarksByRemarkId",
      );
    });
  });
});
