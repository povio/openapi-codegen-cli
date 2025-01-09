import SwaggerParser from "@apidevtools/swagger-parser";
import { exec } from "child_process";
import { OpenAPIV3 } from "openapi-types";
import { generateCodeFromOpenAPIDoc } from "src/generators/generateCodeFromOpenAPIDoc";
import { logError, logInfo, logSuccess } from "src/helpers/cli.helper";

export type GenerateParams = {
  input: string;
  output: string;
  includeNamespaces: boolean;
  useRelativeImports: boolean;
  splitByTags: boolean;
  defaultTag: string;
  excludeTags: string;
  removeOperationPrefixEndingWith: string;
  prettier: boolean;
  verbose: boolean;
};

export async function generate({
  input,
  output,
  includeNamespaces,
  useRelativeImports,
  splitByTags,
  defaultTag,
  excludeTags,
  removeOperationPrefixEndingWith,
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
      useRelativeImports,
      splitByTags,
      defaultTag,
      excludeTags: excludeTags.split(","),
      removeOperationPrefixEndingWith,
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
        logError(error, "Prettier error");
      } else {
        logSuccess("Ran Prettier successfully");
      }
    }
  });
}
