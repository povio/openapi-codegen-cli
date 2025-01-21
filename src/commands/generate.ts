import SwaggerParser from "@apidevtools/swagger-parser";
import { exec } from "child_process";
import { OpenAPIV3 } from "openapi-types";
import { generateCodeFromOpenAPIDoc } from "src/generators/generateCodeFromOpenAPIDoc";
import { GenerateOptions } from "src/generators/types/options";
import { logError, logInfo, logSuccess } from "src/helpers/cli.helper";

export type GenerateParams = {
  input: string;
  excludeTags: string;
  prettier: boolean;
  verbose: boolean;
} & Pick<
  GenerateOptions,
  "output" | "includeNamespaces" | "splitByTags" | "defaultTag" | "removeOperationPrefixEndingWith" | "importPath"
>;

export async function generate({ input, excludeTags, prettier, verbose, ...params }: GenerateParams) {
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
      excludeTags: excludeTags.split(","),
      ...params,
    },
  });
  if (verbose) {
    logSuccess("Generated code successfully");
  }

  if (prettier) {
    execPrettier({ output: params.output, verbose });
  }
}

function execPrettier({ output, verbose }: Pick<GenerateParams, "output" | "verbose">) {
  if (verbose) {
    logInfo("Running Prettier");
  }
  exec(`prettier --write ${output}`, (error) => {
    if (verbose) {
      if (error) {
        logError(error, "Prettier error");
      } else {
        logSuccess("Ran Prettier successfully");
      }
    }
  });
}
