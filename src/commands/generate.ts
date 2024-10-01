import SwaggerParser from "@apidevtools/swagger-parser";
import { OpenAPIV3 } from "openapi-types";
import { generateCodeFromOpenAPIDoc } from "src/generators/generateCodeFromOpenAPIDoc";
import { logInfo, logSuccess } from "src/helpers/cli.helper";

export type GenerateParams = {
  input: string;
  output: string;
  includeNamespaces: boolean;
  splitByTags: boolean;
  defaultTag: string;
  excludeTags: string;
  verbose: boolean;
};

export async function generate({
  input,
  output,
  includeNamespaces,
  splitByTags,
  defaultTag,
  excludeTags,
  verbose,
}: GenerateParams) {
  if (verbose) {
    logInfo(`Parsing OpenAPI spec from "${input}"`);
  }
  const openApiDoc = (await SwaggerParser.bundle(input)) as OpenAPIV3.Document;

  if (verbose) {
    logInfo("Generating code from OpenAPI spec");
  }
  generateCodeFromOpenAPIDoc({
    openApiDoc,
    options: {
      output,
      includeNamespaces,
      splitByTags,
      defaultTag,
      excludeTags: excludeTags.split(","),
    },
  });
  if (verbose) {
    logSuccess("Generated code successfully");
  }
}
