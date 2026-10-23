import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";
import { parse } from "yaml";

import { generateFilesFromNativeOpenAPI } from "../native/generateFilesFromNativeOpenAPI";

import { DEFAULT_GENERATE_OPTIONS } from "./const/options.const";
import { generateCodeFromOpenAPIDoc } from "./generateCodeFromOpenAPIDoc";
import { GenerateOptions } from "./types/options";

// Payloads that only another app consumes are in the components, but no operation uses them.
describe("includeSchemas", () => {
  const source = readFileSync("test/renderer-regressions.yaml", "utf8");
  const render = (backend: "typescript" | "native", overrides: Partial<GenerateOptions>) => {
    const options: GenerateOptions = { ...DEFAULT_GENERATE_OPTIONS, output: "output", ...overrides };
    const files =
      backend === "typescript"
        ? generateCodeFromOpenAPIDoc(parse(source), options)
        : generateFilesFromNativeOpenAPI(source, true, options);
    return (files ?? []).map(({ content }) => content).join("\n");
  };

  test.each(["typescript", "native"] as const)("generates listed schemas and their dependencies (%s)", (backend) => {
    expect(render(backend, {})).not.toContain("ReportPayloadDtoSchema");
    const models = render(backend, { includeSchemas: ["ReportPayloadDto"] });
    expect(models).toContain("export const ReportPayloadDtoSchema");
    expect(models).toContain("export const ReportLineDtoSchema");
  });
});
