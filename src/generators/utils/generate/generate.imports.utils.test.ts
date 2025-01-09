import { describe, expect, test } from "vitest";
import { getImportPath } from "./generate.imports.utils";

describe("Utils: generate imports", () => {
  test("getImportPath", () => {
    expect(getImportPath({ output: "output", useRelativeImports: true })).toEqual("../");
    expect(getImportPath({ output: "some-folder", useRelativeImports: true })).toEqual("../");
    expect(getImportPath({ output: "some-folder", useRelativeImports: false })).toEqual("@/data/");
    expect(getImportPath({ output: "src/data", useRelativeImports: false })).toEqual("@/data/");
    expect(getImportPath({ output: "src/data/auto-gen", useRelativeImports: false })).toEqual("@/data/auto-gen/");
  });
});
