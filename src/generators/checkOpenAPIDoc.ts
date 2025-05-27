import { OpenAPIV3 } from "openapi-types";
import { chk } from "src/helpers/chalk.helper";
import { DEFAULT_GENERATE_OPTIONS } from "./const/options.const";
import { VALIDATION_ERROR_TYPE_TITLE } from "./const/validation.const";
import { getDataFromOpenAPIDoc } from "./core/getDataFromOpenAPIDoc";
import { GenerateType } from "./types/generate";
import { GenerateOptions } from "./types/options";
import { ValidationErrorType } from "./types/validation";
import { getOutputFileName } from "./utils/file.utils";
import { getTagFileName } from "./utils/generate/generate.utils";
import { isTagExcluded } from "./utils/tag.utils";
import { groupByType } from "./utils/validation.utils";

export function checkOpenAPIDoc(openApiDoc: OpenAPIV3.Document, cliOptions?: Partial<GenerateOptions>) {
  const options = { ...DEFAULT_GENERATE_OPTIONS, ...cliOptions } as GenerateOptions;

  const { resolver, data } = getDataFromOpenAPIDoc(openApiDoc, options);

  if (resolver.validationErrors.length > 0) {
    const groupedErrors = groupByType(resolver.validationErrors);
    Object.entries(groupedErrors).forEach(([type, errorMessages]) => {
      console.log(
        `${chk.red(`${VALIDATION_ERROR_TYPE_TITLE[type as ValidationErrorType]}:`)}\n${errorMessages.map((message) => `- ${message}`).join("\n")}\n`,
      );
    });
  } else {
    const outputs = [...data.keys()].reduce(
      (acc, tag) => [...acc, ...(isTagExcluded(tag, options) ? [] : getOutputFileNames(tag, options))],
      [] as string[],
    );
    console.log(`${chk.green("Outputs:")}\n${outputs.map((output) => `- ${output}`).join("\n")}\n`);
  }

  return resolver.validationErrors;
}

function getOutputFileNames(tag: string, options: GenerateOptions) {
  return [GenerateType.Models, GenerateType.Endpoints, GenerateType.Queries].map((type) =>
    getOutputFileName({ output: options.output, fileName: getTagFileName({ tag, type, options }) }),
  );
}
