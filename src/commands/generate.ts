import SwaggerParser from "@apidevtools/swagger-parser";
import { OpenAPIV3 } from "openapi-types";
import { getZodSchemasFromOpenApiDoc } from "src/generators";
import { logInfo } from "src/helpers/cli.helper";

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
    logInfo(`Generating Zod schemas from OpenAPI document`);
  }

  const zodSchemas = getZodSchemasFromOpenApiDoc(openApiDoc);

  if (verbose) {
    logInfo(`Generated Zod schemas:\n${JSON.stringify(zodSchemas, null, 2)}`);
  }
}
