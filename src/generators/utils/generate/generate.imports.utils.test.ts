import { describe, expect, test } from "vitest";
import { getImportPath } from "./generate.imports.utils";

describe("Utils: generate imports", () => {
  test("getImportPath", () => {
    expect(getImportPath({ output: "output", importPath: "ts" })).toEqual("@/data/");
    expect(getImportPath({ output: "output", importPath: "relative" })).toEqual("../");
    expect(getImportPath({ output: "output", importPath: "absolute" })).toEqual("output/");
    expect(getImportPath({ output: "some-folder", importPath: "ts" })).toEqual("@/data/");
    expect(getImportPath({ output: "some-folder", importPath: "relative" })).toEqual("../");
    expect(getImportPath({ output: "some-folder", importPath: "absolute" })).toEqual("some-folder/");
    expect(getImportPath({ output: "src/data", importPath: "ts" })).toEqual("@/data/");
    expect(getImportPath({ output: "src/data", importPath: "relative" })).toEqual("../");
    expect(getImportPath({ output: "src/data", importPath: "absolute" })).toEqual("src/data/");
    expect(getImportPath({ output: "src/data/auto-gen", importPath: "ts" })).toEqual("@/data/auto-gen/");
    expect(getImportPath({ output: "src/data/auto-gen", importPath: "relative" })).toEqual("../");
    expect(getImportPath({ output: "src/data/auto-gen", importPath: "absolute" })).toEqual("src/data/auto-gen/");
    expect(getImportPath({ output: "frontend/src/data/auto-gen", importPath: "ts" })).toEqual("@/data/");
    expect(getImportPath({ output: "frontend/src/data/auto-gen", importPath: "relative" })).toEqual("../");
    expect(getImportPath({ output: "frontend/src/data/auto-gen", importPath: "absolute" })).toEqual(
      "frontend/src/data/auto-gen/",
    );
  });
});
