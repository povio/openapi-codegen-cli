import { ACL_APP_ABILITY_FILE, ACL_CHECK_FILE } from "../const/acl.const";
import {
  MUTATION_EFFECTS_FILE,
  QUERY_CONFIG_FILE,
  QUERY_MODULES_FILE,
  STANDALONE_APP_REST_CLIENT_FILE,
  STANDALONE_ASSETS,
  ZOD_EXTENDED_FILE,
} from "../const/deps.const";
import { SchemaResolver } from "../core/SchemaResolver.class";
import { generateAppAcl } from "../generate/generateAcl";
import { generateAclCheck } from "../generate/generateAclCheck";
import { generateAppRestClient } from "../generate/generateAppRestClient";
import { generateQueryModules } from "../generate/generateQueryModules";
import { generateZod } from "../generate/generateZod";
import { GenerateData, GenerateFile, GenerateFileData } from "../types/generate";
import { getOutputFileName, readAssetSync } from "./file.utils";
import { getFileNameWithExtension } from "./generate/generate.utils";

export function getAclFiles(appAclTags: string[], resolver: SchemaResolver): GenerateFileData[] {
  const appAclContent = generateAppAcl(resolver, appAclTags);
  if (!appAclContent) {
    return [];
  }

  return [
    {
      fileName: getOutputFileName({
        output: resolver.options.output,
        fileName: getFileNameWithExtension(ACL_APP_ABILITY_FILE),
      }),
      content: appAclContent,
    },
    ...(resolver.options.checkAcl
      ? [
          {
            fileName: getOutputFileName({
              output: resolver.options.output,
              fileName: getFileNameWithExtension(ACL_CHECK_FILE),
            }),
            content: generateAclCheck(resolver),
          },
        ]
      : []),
  ];
}

export function getMutationEffectsFiles(data: GenerateData, resolver: SchemaResolver): GenerateFileData[] {
  if (!resolver.options.mutationEffects) {
    return [];
  }

  return [
    ...getAssetFiles([QUERY_CONFIG_FILE, MUTATION_EFFECTS_FILE], resolver),
    {
      fileName: getOutputFileName({
        output: resolver.options.output,
        fileName: getFileNameWithExtension(QUERY_MODULES_FILE),
      }),
      content: generateQueryModules({ resolver, data }),
    },
  ];
}

export function getStandaloneFiles(resolver: SchemaResolver): GenerateFileData[] {
  if (!resolver.options.standalone) {
    return [];
  }

  return [
    ...getAssetFiles(Object.values(STANDALONE_ASSETS), resolver),
    {
      fileName: getOutputFileName({
        output: resolver.options.output,
        fileName: getFileNameWithExtension(STANDALONE_APP_REST_CLIENT_FILE),
      }),
      content: generateAppRestClient(resolver),
    },
  ];
}

export function getZodExtendedFiles(data: GenerateData, resolver: SchemaResolver): GenerateFileData[] {
  const hasZodExtendedFile = Array.from(data.values()).some(({ endpoints }) =>
    endpoints.some((endpoint) => endpoint.parameters.some((param) => param.parameterSortingEnumSchemaName)),
  );
  if (!hasZodExtendedFile) {
    return [];
  }

  const zodContent = generateZod(resolver);
  if (!zodContent) {
    return [];
  }

  return [
    {
      fileName: getOutputFileName({
        output: resolver.options.output,
        fileName: getFileNameWithExtension(ZOD_EXTENDED_FILE),
      }),
      content: zodContent,
    },
  ];
}

function getAssetFiles(files: GenerateFile[], resolver: SchemaResolver): GenerateFileData[] {
  return files.reduce((acc, file) => [...acc, getAssetFile(file, resolver)], [] as GenerateFileData[]);
}

function getAssetFile(file: GenerateFile, resolver: SchemaResolver): GenerateFileData {
  const fileName = getFileNameWithExtension(file);
  return {
    fileName: getOutputFileName({ output: resolver.options.output, fileName }),
    content: readAssetSync(fileName),
  };
}
