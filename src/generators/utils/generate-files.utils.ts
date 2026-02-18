import { ACL_APP_ABILITY_FILE, ACL_CHECK_FILE } from "@/generators/const/acl.const";
import {
  APP_REST_CLIENT_FILE,
  CROSS_TAB_QUERY_INVALIDATION_FILE,
  QUERY_MODULES_FILE,
  ZOD_EXTENDED_FILE,
} from "@/generators/const/deps.const";
import { DEFAULT_GENERATE_OPTIONS } from "@/generators/const/options.const";
import { SchemaResolver } from "@/generators/core/SchemaResolver.class";
import { generateAppAcl } from "@/generators/generate/generateAcl";
import { generateAclCheck } from "@/generators/generate/generateAclCheck";
import { generateAppRestClient } from "@/generators/generate/generateAppRestClient";
import { generateQueryModules } from "@/generators/generate/generateQueryModules";
import { generateZodExtended } from "@/generators/generate/generateZodExtended";
import { GenerateData, GenerateFile, GenerateFileData } from "@/generators/types/generate";

import { getOutputFileName, readAssetSync } from "./file.utils";
import { getFileNameWithExtension } from "./generate/generate.utils";

export function getAclFiles(data: GenerateData, resolver: SchemaResolver): GenerateFileData[] {
  if (!resolver.options.acl) {
    return [];
  }

  return [
    {
      fileName: getOutputFileName({
        output: resolver.options.output,
        fileName: getFileNameWithExtension(ACL_APP_ABILITY_FILE),
      }),
      content: generateAppAcl({ resolver, data }),
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
    ...getAssetFiles([CROSS_TAB_QUERY_INVALIDATION_FILE], resolver),
    {
      fileName: getOutputFileName({
        output: resolver.options.output,
        fileName: getFileNameWithExtension(QUERY_MODULES_FILE),
      }),
      content: generateQueryModules({ resolver, data }),
    },
  ];
}

export function getZodExtendedFiles(data: GenerateData, resolver: SchemaResolver): GenerateFileData[] {
  if (!resolver.options.parseRequestParams) {
    return [];
  }

  return [
    {
      fileName: getOutputFileName({
        output: resolver.options.output,
        fileName: getFileNameWithExtension(ZOD_EXTENDED_FILE),
      }),
      content: generateZodExtended(resolver),
    },
  ];
}

export function getAppRestClientFiles(resolver: SchemaResolver): GenerateFileData[] {
  const hasCustomImportPath = resolver.options.restClientImportPath !== DEFAULT_GENERATE_OPTIONS.restClientImportPath;
  if (hasCustomImportPath) {
    return [];
  }

  return [
    {
      fileName: getOutputFileName({
        output: resolver.options.output,
        fileName: getFileNameWithExtension(APP_REST_CLIENT_FILE),
      }),
      content: generateAppRestClient(resolver),
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
