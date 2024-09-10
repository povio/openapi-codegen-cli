import SwaggerParser from "@apidevtools/swagger-parser";
import { OpenAPIV3 } from "openapi-types";
import { generateCodeFromOpenAPIDoc } from "src/generators/code-generation";
import { printCodeToFiles } from "src/generators/code-print";
import { logInfo, logSuccess } from "src/helpers/cli.helper";

export type GenerateParams = {
  input: string;
  output: string;
  verbose: boolean;
};

export async function generate({ input, output, verbose }: GenerateParams) {
  if (verbose) {
    logInfo(`Parsing OpenAPI document from "${input}"`);
  }
  const openApiDoc = (await SwaggerParser.bundle(input)) as OpenAPIV3.Document;

  if (verbose) {
    logInfo("Generating code from OpenAPI document");
  }
  const code = generateCodeFromOpenAPIDoc(openApiDoc);

  if (verbose) {
    logInfo(`Printing generated code to "${output}"`);
  }
  printCodeToFiles(code, output);

  if (verbose) {
    logSuccess("Generated code successfully");
  }
}
