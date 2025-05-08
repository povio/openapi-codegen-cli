import { OpenAPIV3 } from "openapi-types";
import { ACL_APP_ABILITY_FILE } from "./const/acl.const";
import { INVALIDATE_QUERY_OPTIONS_FILE, STANDALONE_APP_REST_CLIENT_FILE, STANDALONE_ASSETS } from "./const/deps.const";
import { DEFAULT_GENERATE_OPTIONS } from "./const/options.const";
import { getDataFromOpenAPIDoc } from "./core/getDataFromOpenAPIDoc";
import { SchemaResolver } from "./core/SchemaResolver.class";
import { generateAcl, generateAppAcl } from "./generate/generateAcl";
import { generateAppRestClient } from "./generate/generateAppRestClient";
import { generateEndpoints } from "./generate/generateEndpoints";
import { generateInvalidateQueries } from "./generate/generateInvalidateQueries";
import { generateModels } from "./generate/generateModels";
import { generateQueries } from "./generate/generateQueries";
import { GenerateFileData, GenerateType, GenerateTypeParams } from "./types/generate";
import { GenerateOptions } from "./types/options";
import { getOutputFileName, readAssetSync } from "./utils/file.utils";
import { getFileNameWithExtension, getTagFileName } from "./utils/generate/generate.utils";

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
        if (type === GenerateType.Acl) {
          appAclTags.push(tag);
        }
      }
    });
  });

  const appAclContent = generateAppAcl(resolver, appAclTags);
  if (appAclContent) {
    const fileName = getOutputFileName({
      output: options.output,
      fileName: getFileNameWithExtension(ACL_APP_ABILITY_FILE),
    });
    generateFilesData.push({ fileName, content: appAclContent });
  }

  if (options.invalidateQueryOptions) {
    generateFilesData.push({
      fileName: getOutputFileName({
        output: resolver.options.output,
        fileName: getFileNameWithExtension(INVALIDATE_QUERY_OPTIONS_FILE),
      }),
      content: generateInvalidateQueries({ resolver, data }),
    });
  }

  if (options.standalone) {
    generateFilesData.push(...getStandaloneFiles(resolver));
  }

  return generateFilesData;
}

function getStandaloneFiles(resolver: SchemaResolver) {
  const generateFilesData: GenerateFileData[] = [];

  Object.values(STANDALONE_ASSETS).forEach((file) => {
    const fileName = getFileNameWithExtension(file);
    generateFilesData.push({
      content: readAssetSync(fileName),
      fileName: getOutputFileName({ output: resolver.options.output, fileName }),
    });
  });

  generateFilesData.push({
    fileName: getOutputFileName({
      output: resolver.options.output,
      fileName: getFileNameWithExtension(STANDALONE_APP_REST_CLIENT_FILE),
    }),
    content: generateAppRestClient(resolver),
  });

  return generateFilesData;
}
