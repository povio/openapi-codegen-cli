import SwaggerParser from "@apidevtools/swagger-parser";
import { exec } from "child_process";
import { OpenAPIV3 } from "openapi-types";
import { generateCodeFromOpenAPIDoc } from "src/generators/generateCodeFromOpenAPIDoc";
import { logError, logInfo, logSuccess } from "src/helpers/cli.helper";

export type GenerateParams = {
  input: string;
  output: string;
  includeNamespaces: boolean;
  splitByTags: boolean;
  defaultTag: string;
  excludeTags: string;
  prettier: boolean;
  verbose: boolean;
};

export async function generate({
  input,
  output,
  includeNamespaces,
  splitByTags,
  defaultTag,
  excludeTags,
  prettier,
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

  if (prettier) {
    execPrettier({ output, verbose });
  }
}

function execPrettier({ output, verbose }: Pick<GenerateParams, "output" | "verbose">) {
  if (verbose) {
    logInfo("Running Prettier");
  }
  exec(`prettier --write ${output}`, (error) => {
    if (verbose) {
      if (error) {
        logError("Prettier not found");
      } else {
        logSuccess("Ran Prettier successfully");
      }
    }
  });
}
