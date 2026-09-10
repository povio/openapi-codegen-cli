import { parse } from "yaml";
import { resolveConfig } from "../src/generators/core/resolveConfig";
import { generateCodeFromOpenAPIDoc } from "../src/generators/generateCodeFromOpenAPIDoc";
import { generateFilesFromNativeOpenAPI } from "../src/native/generateFilesFromNativeOpenAPI";
import { type ParityScenario } from "./renderer-parity-configs";

export const parityFixtures = ["test/petstore.yaml", "test/configuration.yaml"];

export function renderParityCase(source: string, scenario: ParityScenario, renderer: "js" | "native") {
  let options;
  try {
    options = resolveConfig({
      fileConfig: {
        input: "fixture",
        output: "generated",
        acl: false,
        restClientImportPath: "@test/rest",
        ...scenario.options,
      },
      params: {},
    });
  } catch (error) {
    if (scenario.invalid && error instanceof Error && error.message === scenario.invalid)
      return { files: [], route: "rejected" };
    throw error;
  }
  if (scenario.invalid) throw new Error(`Invalid configuration was accepted: ${scenario.name}`);
  if (renderer === "js") return { files: generateCodeFromOpenAPIDoc(parse(source), options), route: "js" };
  // Match the production route: complete native first, otherwise native extraction with
  // per-generator rendering. Never retry a failed native call using JavaScript extraction.
  const previous = process.env.OPENAPI_CODEGEN_REQUIRE_FULL_NATIVE;
  process.env.OPENAPI_CODEGEN_REQUIRE_FULL_NATIVE = "0";
  try {
    const files = generateFilesFromNativeOpenAPI(source, true, options);
    if (files) return { files, route: "full-native" };
    return {
      files: generateCodeFromOpenAPIDoc(parse(source), options, undefined, { source, yaml: true }),
      route: "hybrid-native",
    };
  } finally {
    if (previous === undefined) delete process.env.OPENAPI_CODEGEN_REQUIRE_FULL_NATIVE;
    else process.env.OPENAPI_CODEGEN_REQUIRE_FULL_NATIVE = previous;
  }
}
