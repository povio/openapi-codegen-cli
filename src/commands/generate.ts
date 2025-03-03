import SwaggerParser from "@apidevtools/swagger-parser";
import { exec } from "child_process";
import { OpenAPIV3 } from "openapi-types";
import { generateCodeFromOpenAPIDoc } from "src/generators/generateCodeFromOpenAPIDoc";
import { GenerateOptions } from "src/generators/types/options";
import { writeGeneratesFileData } from "src/generators/utils/file.utils";
import { logError, logInfo, logSuccess } from "src/helpers/cli.helper";

export type GenerateParams = {
  excludeTags: string;
  prettier: boolean;
  verbose: boolean;
} & Pick<
  GenerateOptions,
  | "input"
  | "output"
  | "includeNamespaces"
  | "splitByTags"
  | "defaultTag"
  | "removeOperationPrefixEndingWith"
  | "importPath"
  | "extractEnums"
>;

export async function generate({ input, excludeTags, prettier, verbose, ...params }: GenerateParams) {
  const start = Date.now();

  if (verbose) {
    logInfo("Parsing OpenAPI spec...");
  }
  const openApiDoc = (await SwaggerParser.bundle(input)) as OpenAPIV3.Document;
  if (verbose) {
    logSuccess("Parsing finished.");
  }

  if (verbose) {
    logInfo("Generating code...");
  }
  const filesData = generateCodeFromOpenAPIDoc(openApiDoc, {
    input,
    excludeTags: excludeTags.split(","),
    ...params,
  });
  if (verbose) {
    logSuccess("Generation finished.");
  }

  if (verbose) {
    logInfo("Writing files...");
  }
  writeGeneratesFileData(filesData);
  if (verbose) {
    logSuccess("Writing finished.");
  }

  if (prettier) {
    execPrettier({ output: params.output, verbose });
  }

  if (verbose) {
    logInfo(`TIME: ${Date.now() - start}ms`);
  }
}

function execPrettier({ output, verbose }: Pick<GenerateParams, "output" | "verbose">) {
  if (verbose) {
    logInfo("Running Prettier...");
  }
  exec(`prettier --write ${output}`, (error) => {
    if (verbose) {
      if (error) {
        logError(error, "Prettier error");
      } else {
        logSuccess("Prettier finished.");
      }
    }
  });
}
