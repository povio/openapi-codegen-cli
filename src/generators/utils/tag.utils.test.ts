import { describe, expect, test } from "vitest";
import { DEFAULT_GENERATE_OPTIONS } from "@/generators/const/options.const";
import { isTagIncluded } from "./tag.utils";

describe("Utils: tag", () => {
  describe("isTagIncluded", () => {
    const options = DEFAULT_GENERATE_OPTIONS;

    test("includes all when both are empty", () => {
      expect(isTagIncluded("auth", { ...options, includeTags: [], excludeTags: [] })).toBe(true);
    });

    test("includes only includeTags when specified", () => {
      const config = { ...options, includeTags: ["auth", "user"], excludeTags: [] };
      expect(isTagIncluded("auth", config)).toBe(true);
      expect(isTagIncluded("user", config)).toBe(true);
      expect(isTagIncluded("other", config)).toBe(false);
    });

    test("excludes excludeTags when includeTags is empty", () => {
      const config = { ...options, includeTags: [], excludeTags: ["auth", "user"] };
      expect(isTagIncluded("auth", config)).toBe(false);
      expect(isTagIncluded("user", config)).toBe(false);
      expect(isTagIncluded("other", config)).toBe(true);
    });

    test("includeTags has high priority over excludeTags", () => {
      const config = { ...options, includeTags: ["auth"], excludeTags: ["auth"] };
      // If it's in includeTags, it should be included regardless of excludeTags
      expect(isTagIncluded("auth", config)).toBe(true);
    });

    test("includeTags overrides excludeTags (only includeTags are considered)", () => {
      const config = { ...options, includeTags: ["auth"], excludeTags: ["user"] };
      expect(isTagIncluded("auth", config)).toBe(true);
      expect(isTagIncluded("user", config)).toBe(false); // Not in includeTags
      expect(isTagIncluded("other", config)).toBe(false); // Not in includeTags
    });

    test("case insensitive matching", () => {
      expect(isTagIncluded("AUTH", { ...options, includeTags: ["auth"], excludeTags: [] })).toBe(true);
      expect(isTagIncluded("auth", { ...options, includeTags: ["AUTH"], excludeTags: [] })).toBe(true);
      expect(isTagIncluded("AUTH", { ...options, includeTags: [], excludeTags: ["auth"] })).toBe(false);
    });
  });
});
