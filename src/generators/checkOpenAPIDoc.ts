import type { OpenAPIV3 } from "openapi-types";

import { Logger } from "../helpers/logger";
import { VALIDATION_ERROR_TYPE_TITLE } from "./const/validation.const";
import { getDataFromOpenAPIDoc } from "./core/getDataFromOpenAPIDoc";
import { GenerateType } from "./types/generate";
import type { GenerateOptions } from "./types/options";
import type { ValidationErrorType } from "./types/validation";
import { getOutputFileName } from "./utils/file.utils";
import { getTagFileName } from "./utils/generate/generate.utils";
import { groupByType } from "./utils/validation.utils";

export function checkOpenAPIDoc(
  openApiDoc: OpenAPIV3.Document,
  options: GenerateOptions,
  logger: Logger = new Logger(false),
) {
  const { resolver, data } = getDataFromOpenAPIDoc(openApiDoc, options);

  if (resolver.validationErrors.length > 0) {
    const groupedErrors = groupByType(resolver.validationErrors);
    Object.entries(groupedErrors).forEach(([type, errorMessages]) => {
      logger.error(
        `${`${VALIDATION_ERROR_TYPE_TITLE[type as ValidationErrorType]}:`}\n${errorMessages.map((message) => `- ${message}`).join("\n")}\n`,
      );
    });
  } else {
    const outputs = [...data.keys()].reduce(
      (acc, tag) => [...acc, ...getOutputFileNames(tag, options)],
      [] as string[],
    );
    logger.info(`${"Outputs:"}\n${outputs.map((output) => `- ${output}`).join("\n")}\n`);
  }

  return resolver.validationErrors;
}

function getOutputFileNames(tag: string, options: GenerateOptions) {
  return [GenerateType.Models, GenerateType.Endpoints, GenerateType.Queries].map((type) =>
    getOutputFileName({ output: options.output, fileName: getTagFileName({ tag, type, options }) }),
  );
}
