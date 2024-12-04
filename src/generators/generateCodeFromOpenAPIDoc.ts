import { OpenAPIV3 } from "openapi-types";
import { DEFAULT_GENERATE_OPTIONS } from "./const/options.const";
import { getDataFromOpenAPIDoc } from "./core/getDataFromOpenAPIDoc";
import { SchemaResolver } from "./core/SchemaResolver.class";
import { generateEndpoints } from "./generate/generateEndpoints";
import { generateModels } from "./generate/generateModels";
import { generateQueries } from "./generate/generateQueries";
import { GenerateData, GenerateType } from "./types/generate";
import { GenerateOptions } from "./types/options";
import { writeTsFileSync } from "./utils/file.utils";
import { getTagFileName } from "./utils/generate/generate.utils";

export function generateCodeFromOpenAPIDoc({
  openApiDoc,
  options: cliOptions,
}: {
  openApiDoc: OpenAPIV3.Document;
  options?: Partial<GenerateOptions>;
}) {
  const options = { ...DEFAULT_GENERATE_OPTIONS, ...cliOptions } as GenerateOptions;

  const { resolver, data } = getDataFromOpenAPIDoc({ openApiDoc, options });

  data.forEach((_, tag) => {
    const excludedTagIndex = options.excludeTags?.findIndex(
      (excludeTag) => excludeTag.toLocaleLowerCase() === tag.toLocaleLowerCase(),
    );
    const isExcludedTag = excludedTagIndex !== -1;
    if (isExcludedTag) {
      return;
    }

    generateCodeByType({ resolver, data, type: GenerateType.Models, tag, options });
    generateCodeByType({ resolver, data, type: GenerateType.Endpoints, tag, options });
    generateCodeByType({ resolver, data, type: GenerateType.Queries, tag, options });
  });
}

function generateCodeByType({
  resolver,
  data,
  type,
  tag,
  options,
}: {
  resolver: SchemaResolver;
  data: GenerateData;
  type: GenerateType;
  tag: string;
  options: GenerateOptions;
}) {
  let code: string | undefined;

  switch (type) {
    case GenerateType.Models:
      code = generateModels({ resolver, data, tag, options });
      break;
    case GenerateType.Endpoints:
      code = generateEndpoints({ resolver, data, tag, options });
      break;
    case GenerateType.Queries:
      code = generateQueries({ resolver, data, tag, options });
      break;
  }

  if (code) {
    writeTsFileSync({
      output: options.output,
      fileName: getTagFileName({ tag, type, options }),
      data: code,
    });
  }
}
