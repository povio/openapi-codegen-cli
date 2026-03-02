import { ACL_APP_ABILITY_FILE } from "@/generators/const/acl.const";
import {
  APP_REST_CLIENT_FILE,
  QUERY_MODULES_FILE,
} from "@/generators/const/deps.const";
import { DEFAULT_GENERATE_OPTIONS } from "@/generators/const/options.const";
import { SchemaResolver } from "@/generators/core/SchemaResolver.class";
import { generateAppAcl } from "@/generators/generate/generateAcl";
import { generateAppRestClient } from "@/generators/generate/generateAppRestClient";
import { generateQueryModules } from "@/generators/generate/generateQueryModules";
import { GenerateData, GenerateFile, GenerateFileData } from "@/generators/types/generate";

import { getOutputFileName } from "./file.utils";
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
  ];
}

export function getMutationEffectsFiles(data: GenerateData, resolver: SchemaResolver): GenerateFileData[] {
  if (!resolver.options.mutationEffects) {
    return [];
  }

  return [
    {
      fileName: getOutputFileName({
        output: resolver.options.output,
        fileName: getFileNameWithExtension(QUERY_MODULES_FILE),
      }),
      content: generateQueryModules({ resolver, data }),
    },
  ];
}

export function getZodExtendedFiles(_data: GenerateData, _resolver: SchemaResolver): GenerateFileData[] {
  return [];
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
