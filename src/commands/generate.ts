import SwaggerParser from "@apidevtools/swagger-parser";
import { OpenAPIV3 } from "openapi-types";
import { generateCodeFromOpenAPIDoc } from "src/generators";
import { logInfo, logSuccess } from "src/helpers/cli.helper";

export type GenerateParams = {
  input: string;
  output: string;
  verbose: boolean;
};

export async function generate({ input, output, verbose }: GenerateParams) {
  if (verbose) {
    logInfo(`Parsing OpenAPI spec from "${input}"`);
  }
  const openApiDoc = (await SwaggerParser.bundle(input)) as OpenAPIV3.Document;

  if (verbose) {
    logInfo("Generating code from OpenAPI spec");
  }
  generateCodeFromOpenAPIDoc({ openApiDoc, output });
  if (verbose) {
    logSuccess("Generated code successfully");
  }
}
