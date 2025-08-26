import { describe, expect, test } from "vitest";
import { getImportPath } from "./generate.imports.utils";

describe("Utils: generate imports", () => {
  test("getImportPath", () => {
    expect(getImportPath({ output: "output", importPath: "ts", tsPath: "@/data" })).toEqual("@/data/");
    expect(getImportPath({ output: "output", importPath: "ts", tsPath: "@/output" })).toEqual("@/output/");
    expect(getImportPath({ output: "output", importPath: "relative", tsPath: "@/data" })).toEqual("../");
    expect(getImportPath({ output: "output", importPath: "absolute", tsPath: "@/data" })).toEqual("output/");
    expect(getImportPath({ output: "some-folder", importPath: "ts", tsPath: "@/data" })).toEqual("@/data/");
    expect(getImportPath({ output: "some-folder", importPath: "ts", tsPath: "@/output" })).toEqual("@/output/");
    expect(getImportPath({ output: "some-folder", importPath: "relative", tsPath: "@/data" })).toEqual("../");
    expect(getImportPath({ output: "some-folder", importPath: "absolute", tsPath: "@/data" })).toEqual("some-folder/");
    expect(getImportPath({ output: "src/data", importPath: "ts", tsPath: "@/data" })).toEqual("@/data/");
    expect(getImportPath({ output: "src/data", importPath: "ts", tsPath: "@/output" })).toEqual("@/output/");
    expect(getImportPath({ output: "src/data", importPath: "relative", tsPath: "@/data" })).toEqual("../");
    expect(getImportPath({ output: "src/data", importPath: "absolute", tsPath: "@/data" })).toEqual("src/data/");
    expect(getImportPath({ output: "src/data/auto-gen", importPath: "ts", tsPath: "@/data" })).toEqual(
      "@/data/auto-gen/",
    );
    expect(getImportPath({ output: "src/data/auto-gen", importPath: "ts", tsPath: "@/output" })).toEqual(
      "@/output/auto-gen/",
    );
    expect(getImportPath({ output: "src/data/auto-gen", importPath: "relative", tsPath: "@/data" })).toEqual("../");
    expect(getImportPath({ output: "src/data/auto-gen", importPath: "absolute", tsPath: "@/data" })).toEqual(
      "src/data/auto-gen/",
    );
    expect(getImportPath({ output: "frontend/src/data/auto-gen", importPath: "ts", tsPath: "@/data" })).toEqual(
      "@/data/auto-gen/",
    );
    expect(getImportPath({ output: "frontend/src/data/auto-gen", importPath: "ts", tsPath: "@/output" })).toEqual(
      "@/output/auto-gen/",
    );
    expect(getImportPath({ output: "frontend/src/data/auto-gen", importPath: "relative", tsPath: "@/data" })).toEqual(
      "../",
    );
    expect(getImportPath({ output: "frontend/src/data/auto-gen", importPath: "absolute", tsPath: "@/data" })).toEqual(
      "frontend/src/data/auto-gen/",
    );
  });
});
