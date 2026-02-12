import { styleText } from "node:util";

import { OpenAPIV3 } from "openapi-types";

import { log } from "@/helpers/cli.helper";

import { VALIDATION_ERROR_TYPE_TITLE } from "./const/validation.const";
import { getDataFromOpenAPIDoc } from "./core/getDataFromOpenAPIDoc";
import { GenerateType } from "./types/generate";
import { GenerateOptions } from "./types/options";
import { ValidationErrorType } from "./types/validation";
import { getOutputFileName } from "./utils/file.utils";
import { getTagFileName } from "./utils/generate/generate.utils";
import { groupByType } from "./utils/validation.utils";

export function checkOpenAPIDoc(openApiDoc: OpenAPIV3.Document, options: GenerateOptions) {
  const { resolver, data } = getDataFromOpenAPIDoc(openApiDoc, options);

  if (resolver.validationErrors.length > 0) {
    const groupedErrors = groupByType(resolver.validationErrors);
    Object.entries(groupedErrors).forEach(([type, errorMessages]) => {
      log(
        `${styleText("red", `${VALIDATION_ERROR_TYPE_TITLE[type as ValidationErrorType]}:`)}\n${errorMessages.map((message) => `- ${message}`).join("\n")}\n`,
      );
    });
  } else {
    const outputs = [...data.keys()].reduce(
      (acc, tag) => [...acc, ...getOutputFileNames(tag, options)],
      [] as string[],
    );
    log(`${styleText("green", "Outputs:")}\n${outputs.map((output) => `- ${output}`).join("\n")}\n`);
  }

  return resolver.validationErrors;
}

function getOutputFileNames(tag: string, options: GenerateOptions) {
  return [GenerateType.Models, GenerateType.Endpoints, GenerateType.Queries].map((type) =>
    getOutputFileName({ output: options.output, fileName: getTagFileName({ tag, type, options }) }),
  );
}
