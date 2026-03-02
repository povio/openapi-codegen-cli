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
import { shouldInlineEndpointsForTag } from "./utils/tag.utils";
import { Profiler } from "../helpers/profile.helper";

export function generateCodeFromOpenAPIDoc(
  openApiDoc: OpenAPIV3.Document,
  options: GenerateOptions,
  profiler?: Profiler,
) {
  const p = profiler ?? new Profiler(false);
  const importPath = options.standalone && options.importPath === "ts" ? "relative" : options.importPath;
  const { resolver, data } = p.runSync("data.extract", () =>
    getDataFromOpenAPIDoc(openApiDoc, { ...options, importPath }, p),
  );

  const generateFilesData: GenerateFileData[] = [];
  const appAclTags: string[] = [];
  const modelsOnly = Boolean(resolver.options.modelsOnly);
  const shouldGenerateEndpoints =
    !modelsOnly && Array.from(data.keys()).some((tag) => !shouldInlineEndpointsForTag(tag, resolver.options));
  const generateTypes = modelsOnly
    ? [GenerateType.Models]
    : [
        GenerateType.Models,
        ...(shouldGenerateEndpoints ? [GenerateType.Endpoints] : []),
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
      const content = p.runSync(`render.${type}`, () => generateFunctions[type]({ resolver, data, tag }));
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

  if (!modelsOnly) {
    generateFilesData.push(
      ...p.runSync("render.AclShared", () => getAclFiles(data, resolver)),
      ...p.runSync("render.MutationEffects", () => getMutationEffectsFiles(data, resolver)),
      ...p.runSync("render.ZodExtended", () => getZodExtendedFiles(data, resolver)),
      ...p.runSync("render.Standalone", () => getAppRestClientFiles(resolver)),
    );
  }

  return generateFilesData;
}
