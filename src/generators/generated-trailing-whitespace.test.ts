import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";
import { parse } from "yaml";

import { generateFilesFromNativeOpenAPI } from "../native/generateFilesFromNativeOpenAPI";

import { DEFAULT_GENERATE_OPTIONS } from "./const/options.const";
import { generateCodeFromOpenAPIDoc } from "./generateCodeFromOpenAPIDoc";
import { GenerateOptions } from "./types/options";

// Formatters such as `bun fmt` keep whitespace inside comments, so generated files must not contain any.
describe("generated files have no trailing whitespace", () => {
  test.each(
    ["test/petstore.yaml", "test/configuration.yaml"].flatMap((input) =>
      [{}, { tsNamespaces: false }, { modelsInCommon: true, checkAcl: true, infiniteQueries: true }].flatMap(
        (overrides) => (["typescript", "native"] as const).map((backend) => ({ input, overrides, backend })),
      ),
    ),
  )("$input ($backend, $overrides)", ({ input, overrides, backend }) => {
    const source = readFileSync(input, "utf8");
    const options: GenerateOptions = { ...DEFAULT_GENERATE_OPTIONS, output: "output", ...overrides };
    const files =
      backend === "typescript"
        ? generateCodeFromOpenAPIDoc(parse(source), options)
        : generateFilesFromNativeOpenAPI(source, true, options);
    expect(files?.length).toBeGreaterThan(0);
    const linesWithTrailingWhitespace = (files ?? []).flatMap(({ fileName, content }) =>
      content
        .split("\n")
        .flatMap((line, index) => (/[ \t]$/.test(line) ? [`${fileName}:${index + 1}: ${JSON.stringify(line)}`] : [])),
    );
    expect(linesWithTrailingWhitespace).toEqual([]);
  });
});
