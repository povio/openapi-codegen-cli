import { OpenAPIV3 } from "openapi-types";

import { getDataFromOpenAPIDoc } from "./core/getDataFromOpenAPIDoc";
import { generateAcl } from "./generate/generateAcl";
import { generateConfigs } from "./generate/generateConfigs";
import { generateEndpoints } from "./generate/generateEndpoints";
import { generateModels } from "./generate/generateModels";
import { generateQueries } from "./generate/generateQueries";
import { GenerateFileData, GenerateType, GenerateTypeParams } from "./types/generate";
import { GenerateOptions } from "./types/options";
import { getOutputFileName } from "./utils/file.utils";
import {
  getAclFiles,
  getAppRestClientFiles,
  getMutationEffectsFiles,
  getZodExtendedFiles,
} from "./utils/generate-files.utils";
import { getTagFileName } from "./utils/generate/generate.utils";

export function generateCodeFromOpenAPIDoc(openApiDoc: OpenAPIV3.Document, options: GenerateOptions) {
  const { resolver, data } = getDataFromOpenAPIDoc(openApiDoc, options);

  const generateFilesData: GenerateFileData[] = [];
  const appAclTags: string[] = [];
  const generateTypes = [
    GenerateType.Models,
    GenerateType.Endpoints,
    GenerateType.Queries,
    ...(resolver.options.acl ? [GenerateType.Acl] : []),
    ...(resolver.options.builderConfigs ? [GenerateType.Configs] : []),
  ];
  const generateFunctions: Record<GenerateType, (params: GenerateTypeParams) => string | undefined> = {
    [GenerateType.Models]: generateModels,
    [GenerateType.Endpoints]: generateEndpoints,
    [GenerateType.Queries]: generateQueries,
    [GenerateType.Acl]: generateAcl,
    [GenerateType.Configs]: generateConfigs,
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
    ...getAclFiles(data, resolver),
    ...getMutationEffectsFiles(data, resolver),
    ...getZodExtendedFiles(data, resolver),
    ...getAppRestClientFiles(resolver),
  );

  return generateFilesData;
}
