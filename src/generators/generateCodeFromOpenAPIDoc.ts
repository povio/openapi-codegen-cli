import { OpenAPIV3 } from "openapi-types";
import { DEFAULT_GENERATE_OPTIONS } from "./const/options.const";
import { getDataFromOpenAPIDoc } from "./core/getDataFromOpenAPIDoc";
import { generateEndpoints } from "./generate/generateEndpoints";
import { generateModels } from "./generate/generateModels";
import { generateQueries } from "./generate/generateQueries";
import { GenerateFileData, GenerateType, GenerateTypeParams } from "./types/generate";
import { GenerateOptions } from "./types/options";
import { getOutputFileName, writeTsFileSync } from "./utils/file.utils";
import { getTagFileName } from "./utils/generate/generate.utils";

export function generateCodeFromOpenAPIDoc(
  openApiDoc: OpenAPIV3.Document,
  cliOptions: Partial<GenerateOptions>,
  writeFiles = true,
) {
  const options = { ...DEFAULT_GENERATE_OPTIONS, ...cliOptions } as GenerateOptions;

  const { resolver, data } = getDataFromOpenAPIDoc(openApiDoc, options);

  const generateFilesData: GenerateFileData[] = [];
  const generateTypes = [GenerateType.Models, GenerateType.Endpoints, GenerateType.Queries];
  const generateFunctions: Record<GenerateType, (params: GenerateTypeParams) => string | undefined> = {
    [GenerateType.Models]: generateModels,
    [GenerateType.Endpoints]: generateEndpoints,
    [GenerateType.Queries]: generateQueries,
  };

  data.forEach((_, tag) => {
    const excludedTag = options.excludeTags.find((excludeTag) => excludeTag.toLowerCase() === tag.toLowerCase());
    if (excludedTag) {
      return;
    }

    generateTypes.forEach((type) => {
      const content = generateFunctions[type]({ resolver, data, tag });
      if (content) {
        const fileName = getOutputFileName({
          output: options.output,
          fileName: getTagFileName({ tag, type, options }),
        });
        generateFilesData.push({ fileName, content });
      }
    });
  });

  if (writeFiles) {
    generateFilesData.forEach(writeTsFileSync);
  }

  return generateFilesData;
}
