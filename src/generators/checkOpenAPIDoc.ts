import { OpenAPIV3 } from "openapi-types";
import { logInfo } from "src/helpers/cli.helper";
import { DEFAULT_GENERATE_OPTIONS } from "./const/options.const";
import { getDataFromOpenAPIDoc } from "./core/getDataFromOpenAPIDoc";
import { GenerateType } from "./types/generate";
import { GenerateOptions } from "./types/options";
import { getFileName } from "./utils/file.utils";
import { getTagFileName } from "./utils/generate/generate.utils";

export function checkOpenAPIDoc({
  openApiDoc,
  options: cliOptions,
}: {
  openApiDoc: OpenAPIV3.Document;
  options?: Partial<GenerateOptions>;
}) {
  const options = { ...DEFAULT_GENERATE_OPTIONS, ...cliOptions } as GenerateOptions;

  const { resolver, data, validationErrorMessages } = getDataFromOpenAPIDoc({ openApiDoc, options });

  const errorMessages = [...validationErrorMessages, ...resolver.validationErrorMessages];
  if (errorMessages.length > 0) {
    logInfo(`Issues:\n${errorMessages.map((message) => `- ${message}`).join("\n")}`);
  } else {
    const outputs = [...data.keys()].reduce((acc, tag) => {
      const excludedTagIndex = options.excludeTags?.findIndex(
        (excludeTag) => excludeTag.toLocaleLowerCase() === tag.toLocaleLowerCase(),
      );
      const isExcludedTag = excludedTagIndex !== -1;
      if (isExcludedTag) {
        return acc;
      }

      return [
        ...acc,
        ...[GenerateType.Models, GenerateType.Endpoints, GenerateType.Queries].map((type) =>
          getFileName({ output: options.output, fileName: getTagFileName({ tag, type, options }) }),
        ),
      ];
    }, [] as string[]);
    logInfo(`Output:\n${outputs.map((message) => `- ${message}`).join("\n")}`);
  }

  return errorMessages;
}
