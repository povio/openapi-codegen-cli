import SwaggerParser from "@apidevtools/swagger-parser";
import { OpenAPIV3 } from "openapi-types";
import { checkOpenAPIDoc } from "src/generators/checkOpenApiDoc";
import { GenerateOptions } from "src/generators/types/options";
import { logInfo, logSuccess } from "src/helpers/cli.helper";

export type CheckParams = {
  excludeTags: string;
  verbose: boolean;
} & Pick<GenerateOptions, "input" | "splitByTags" | "defaultTag">;

export async function check({ input, excludeTags, verbose, ...params }: CheckParams) {
  if (verbose) {
    logInfo("Parsing OpenAPI spec...");
  }
  const openApiDoc = (await SwaggerParser.bundle(input)) as OpenAPIV3.Document;
  if (verbose) {
    logSuccess("Parsing finished.");
  }

  if (verbose) {
    logInfo("Running check...");
  }
  const errorMessages = checkOpenAPIDoc({
    openApiDoc,
    options: {
      input,
      excludeTags: excludeTags.split(","),
      ...params,
    },
  });

  if (errorMessages.length === 0) {
    logSuccess("Check finished.");
  } else {
    throw new Error(`Check finished. Found ${errorMessages.length} issues.`);
  }
}
