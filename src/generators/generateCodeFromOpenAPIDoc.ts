import { OpenAPIV3 } from "openapi-types";
import { DEFAULT_GENERATE_OPTIONS } from "./const/options.const";
import { getDataFromOpenAPIDoc } from "./core/getDataFromOpenAPIDoc";
import { generateAcl } from "./generate/generateAcl";
import { generateEndpoints } from "./generate/generateEndpoints";
import { generateModels } from "./generate/generateModels";
import { generateQueries } from "./generate/generateQueries";
import { GenerateFileData, GenerateType, GenerateTypeParams } from "./types/generate";
import { GenerateOptions } from "./types/options";
import { getOutputFileName } from "./utils/file.utils";
import {
  getAclFiles,
  getMutationEffectsFiles,
  getStandaloneFiles,
  getZodUtilsFiles,
} from "./utils/generate-files.utils";
import { getTagFileName } from "./utils/generate/generate.utils";

export function generateCodeFromOpenAPIDoc(openApiDoc: OpenAPIV3.Document, cliOptions: Partial<GenerateOptions>) {
  const importPath = cliOptions.standalone && cliOptions.importPath === "ts" ? "relative" : cliOptions.importPath;
  const options = { ...DEFAULT_GENERATE_OPTIONS, ...cliOptions, importPath } as GenerateOptions;

  const { resolver, data } = getDataFromOpenAPIDoc(openApiDoc, options);

  const generateFilesData: GenerateFileData[] = [];
  const appAclTags: string[] = [];
  const generateTypes = [GenerateType.Models, GenerateType.Endpoints, GenerateType.Queries, GenerateType.Acl];
  const generateFunctions: Record<GenerateType, (params: GenerateTypeParams) => string | undefined> = {
    [GenerateType.Models]: generateModels,
    [GenerateType.Endpoints]: generateEndpoints,
    [GenerateType.Queries]: generateQueries,
    [GenerateType.Acl]: generateAcl,
  };

  data.forEach((_, tag) => {
    generateTypes.forEach((type) => {
      const content = generateFunctions[type]({ resolver, data, tag });
      if (content) {
        const fileName = getOutputFileName({
          output: options.output,
          fileName: getTagFileName({ tag, type, options }),
        });
        generateFilesData.push({ fileName, content });
        if (type === GenerateType.Acl) {
          appAclTags.push(tag);
        }
      }
    });
  });

  generateFilesData.push(
    ...getAclFiles(appAclTags, resolver),
    ...getMutationEffectsFiles(data, resolver),
    ...getZodUtilsFiles(data, resolver),
    ...getStandaloneFiles(resolver),
  );

  return generateFilesData;
}
