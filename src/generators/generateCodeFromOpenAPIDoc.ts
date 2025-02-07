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

export function generateCodeFromOpenAPIDoc(openApiDoc: OpenAPIV3.Document, cliOptions?: Partial<GenerateOptions>) {
  const options = { ...DEFAULT_GENERATE_OPTIONS, ...cliOptions } as GenerateOptions;

  const { resolver, data } = getDataFromOpenAPIDoc(openApiDoc, options);

  data.forEach((_, tag) => {
    const excludedTag = options.excludeTags.find((excludeTag) => excludeTag.toLowerCase() === tag.toLowerCase());
    if (excludedTag) {
      return;
    }

    generateCodeByType({ resolver, data, type: GenerateType.Models, tag });
    generateCodeByType({ resolver, data, type: GenerateType.Endpoints, tag });
    generateCodeByType({ resolver, data, type: GenerateType.Queries, tag });
  });
}

function generateCodeByType({
  resolver,
  data,
  type,
  tag,
}: {
  resolver: SchemaResolver;
  data: GenerateData;
  type: GenerateType;
  tag: string;
}) {
  let code: string | undefined;

  switch (type) {
    case GenerateType.Models:
      code = generateModels({ resolver, data, tag });
      break;
    case GenerateType.Endpoints:
      code = generateEndpoints({ resolver, data, tag });
      break;
    case GenerateType.Queries:
      code = generateQueries({ resolver, data, tag });
      break;
  }

  if (code) {
    writeTsFileSync({
      output: resolver.options.output,
      fileName: getTagFileName({ tag, type, options: resolver.options }),
      data: code,
    });
  }
}
