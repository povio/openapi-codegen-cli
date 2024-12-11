import { describe, expect, test } from "vitest";
import { getTsPath } from "./generate.imports.utils";

describe("Utils: generate imports", () => {
  test("getTsPath", () => {
    expect(getTsPath({ output: "output" })).toEqual("../");
    expect(getTsPath({ output: "some-folder" })).toEqual("../");
    expect(getTsPath({ output: "src/data" })).toEqual("@/data/");
    expect(getTsPath({ output: "src/data/auto-gen" })).toEqual("@/data/auto-gen/");
  });
});
