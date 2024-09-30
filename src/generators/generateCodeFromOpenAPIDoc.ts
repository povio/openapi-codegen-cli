import { OpenAPIV3 } from "openapi-types";
import { DEFAULT_GENERATE_OPTIONS } from "./const/options.const";
import { generateDataFromOpenAPIDoc } from "./core/generateDataFromOpenAPIDoc";
import { generateEndpoints } from "./generate/generateEndpoints";
import { generateModels } from "./generate/generateModels";
import { generateQueries } from "./generate/generateQueries";
import { GenerateOptions } from "./types/options";
import { getTagFileName, writeTsFileSync } from "./utils/file.utils";

export function generateCodeFromOpenAPIDoc({
  openApiDoc,
  output,
  options,
}: {
  openApiDoc: OpenAPIV3.Document;
  output: string;
  options?: GenerateOptions;
}) {
  options = { ...DEFAULT_GENERATE_OPTIONS, ...options };

  const { resolver, data } = generateDataFromOpenAPIDoc({ openApiDoc, options });

  data.forEach((_, tag) => {
    if (
      options.excludeTags?.findIndex((excludeTag) => excludeTag.toLocaleLowerCase() === tag.toLocaleLowerCase()) !== -1
    ) {
      return;
    }

    const zodSchemasCode = generateModels({ resolver, data, tag, options });
    if (zodSchemasCode) {
      writeTsFileSync({
        output,
        fileName: getTagFileName(tag, options.modelsConfig.outputFileNameSuffix),
        data: zodSchemasCode,
      });
    }

    const endpointsCode = generateEndpoints({ data, tag, options });
    if (endpointsCode) {
      writeTsFileSync({
        output,
        fileName: getTagFileName(tag, options.endpointsConfig.outputFileNameSuffix),
        data: endpointsCode,
      });
    }

    const queriesCode = generateQueries({ data, tag, options });
    if (queriesCode) {
      writeTsFileSync({
        output,
        fileName: getTagFileName(tag, options.queriesConfig.outputFileNameSuffix),
        data: queriesCode,
      });
    }
  });
}
