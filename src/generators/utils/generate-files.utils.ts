import { ACL_APP_ABILITY_FILE, ACL_CHECK_FILE } from "@/generators/const/acl.const";
import {
  APP_REST_CLIENT_FILE,
  CROSS_TAB_QUERY_INVALIDATION_FILE,
  MUTATION_EFFECTS_FILE,
  QUERY_MODULES_FILE,
  ZOD_EXTENDED_FILE,
} from "@/generators/const/deps.const";
import { PACKAGE_IMPORT_PATH } from "@/generators/const/package.const";
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
    ...getAssetFiles([MUTATION_EFFECTS_FILE, CROSS_TAB_QUERY_INVALIDATION_FILE], resolver),
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
  return files.map((file) => getAssetFile(file, resolver));
}

function getAssetFile(file: GenerateFile, resolver: SchemaResolver): GenerateFileData {
  const fileName = getFileNameWithExtension(file);
  let content = readAssetSync(fileName);

  if (file.fileName === MUTATION_EFFECTS_FILE.fileName) {
    content = content.replace(
      'import { OpenApiQueryConfig, QueryModule, InvalidationMap } from "../lib/config/queryConfig.context";',
      `import { OpenApiQueryConfig, InvalidationMap } from "${PACKAGE_IMPORT_PATH}";\nimport { QueryModule } from "./${QUERY_MODULES_FILE.fileName}";`,
    );
  }

  return {
    fileName: getOutputFileName({ output: resolver.options.output, fileName }),
    content,
  };
}
