import { describe, expect, test } from "vitest";
import { nonWordCharactersToCamel } from "./string.utils";

describe("Utils: string", () => {
  test("nonWordCharactersToCamel", () => {
    expect(nonWordCharactersToCamel("test word_Another -word")).toEqual("testWordAnotherWord");
  });
});
