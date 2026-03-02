import { ACL_APP_ABILITY_FILE } from "@/generators/const/acl.const";
import {
  APP_REST_CLIENT_FILE,
  QUERY_MODULES_FILE,
} from "@/generators/const/deps.const";
import { DEFAULT_GENERATE_OPTIONS } from "@/generators/const/options.const";
import { GenerateFile, GenerateType } from "@/generators/types/generate";
import { GenerateOptions } from "@/generators/types/options";
import { decapitalize } from "@/generators/utils/string.utils";

import { getImportPath } from "./generate.imports.utils";

export function getFileNameWithExtension({ fileName, extension }: GenerateFile) {
  return `${fileName}.${extension}`;
}

function getTagFileNameWithoutExtension({
  type,
  tag,
  options,
  includeTagDir = true,
}: {
  type: GenerateType;
  tag: string;
  includeTagDir?: boolean;
  options: GenerateOptions;
}) {
  const outputFileNameSuffix = options.configs[type].outputFileNameSuffix;
  if (!tag) {
    return outputFileNameSuffix;
  }
  return `${includeTagDir ? `${decapitalize(tag)}/` : ""}${decapitalize(tag)}.${outputFileNameSuffix}`;
}

export function getTagImportPath(...args: Parameters<typeof getTagFileNameWithoutExtension>) {
  return getTagFileNameWithoutExtension(...args);
}

export function getTagFileName(...args: Parameters<typeof getTagFileNameWithoutExtension>) {
  return `${getTagFileNameWithoutExtension(...args)}.ts`;
}

export function getAppRestClientImportPath(options: GenerateOptions) {
  if (options.restClientImportPath === DEFAULT_GENERATE_OPTIONS.restClientImportPath) {
    return `${getImportPath(options)}${APP_REST_CLIENT_FILE.fileName}`;
  }
  return options.restClientImportPath;
}

export function getQueryModulesImportPath(options: GenerateOptions) {
  return `${getImportPath(options)}${QUERY_MODULES_FILE.fileName}`;
}

export function getQueryTypesImportPath(options: GenerateOptions) {
  return options.queryTypesImportPath;
}

export function getAppAbilitiesImportPath(options: GenerateOptions) {
  return `${getImportPath(options)}${ACL_APP_ABILITY_FILE.fileName}`;
}
