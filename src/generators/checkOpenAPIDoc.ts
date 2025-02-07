import { OpenAPIV3 } from "openapi-types";
import { logInfo } from "src/helpers/cli.helper";
import { DEFAULT_GENERATE_OPTIONS } from "./const/options.const";
import { getDataFromOpenAPIDoc } from "./core/getDataFromOpenAPIDoc";
import { GenerateType } from "./types/generate";
import { GenerateOptions } from "./types/options";
import { getFileName } from "./utils/file.utils";
import { getTagFileName } from "./utils/generate/generate.utils";

export function checkOpenAPIDoc(openApiDoc: OpenAPIV3.Document, cliOptions?: Partial<GenerateOptions>) {
  const options = { ...DEFAULT_GENERATE_OPTIONS, ...cliOptions } as GenerateOptions;

  const { resolver, data, validationErrorMessages } = getDataFromOpenAPIDoc(openApiDoc, options);

  const errorMessages = [...validationErrorMessages, ...resolver.validationErrorMessages];
  if (errorMessages.length > 0) {
    logMessages("Issues", errorMessages);
  } else {
    const outputs = [...data.keys()].reduce((acc, tag) => {
      const excludedTag = options.excludeTags.find((excludeTag) => excludeTag.toLowerCase() === tag.toLowerCase());
      return excludedTag ? acc : [...acc, ...getTagOutputFileNames(tag, options)];
    }, [] as string[]);
    logMessages("Output", outputs);
  }

  return errorMessages;
}

function getTagOutputFileNames(tag: string, options: GenerateOptions) {
  return [GenerateType.Models, GenerateType.Endpoints, GenerateType.Queries].map((type) =>
    getFileName({ output: options.output, fileName: getTagFileName({ tag, type, options }) }),
  );
}

function logMessages(title: string, messages: string[]) {
  logInfo(`${title}:\n${messages.map((message) => `- ${message}`).join("\n")}`);
}
