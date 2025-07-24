import { ACL_APP_ABILITY_FILE, ACL_CHECK_FILE } from "src/generators/const/acl.const";
import {
  MUTATION_EFFECTS_FILE,
  QUERY_MODULES_FILE,
  STANDALONE_APP_REST_CLIENT_FILE,
  STANDALONE_ASSETS,
  StandaloneAssetEnum,
  ZOD_UTILS_FILE,
} from "src/generators/const/deps.const";
import { GenerateFile, GenerateType } from "../../types/generate";
import { GenerateOptions } from "../../types/options";
import { capitalize, decapitalize } from "../string.utils";
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

export const getNamespaceName = ({
  type,
  tag,
  options,
}: {
  type: GenerateType;
  tag: string;
  options: GenerateOptions;
}) => `${capitalize(tag)}${options.configs[type].namespaceSuffix}`;

export function getAppRestClientImportPath(options: GenerateOptions) {
  if (!options.standalone) {
    return options.restClientImportPath;
  }
  return `${getImportPath(options)}${STANDALONE_APP_REST_CLIENT_FILE.fileName}`;
}

export function getQueryTypesImportPath(options: GenerateOptions) {
  if (!options.standalone) {
    return options.queryTypesImportPath;
  }
  return `${getImportPath(options)}${STANDALONE_ASSETS[StandaloneAssetEnum.ReactQueryTypes].fileName}`;
}

export function getQueryModulesImportPath(options: GenerateOptions) {
  return `${getImportPath(options)}${QUERY_MODULES_FILE.fileName}`;
}

export function getMutationEffectsImportPath(options: GenerateOptions) {
  return `${getImportPath(options)}${MUTATION_EFFECTS_FILE.fileName}`;
}

export function getAclCheckImportPath(options: GenerateOptions) {
  return `${getImportPath(options)}${ACL_CHECK_FILE.fileName}`;
}

export function getZodUtilsImportPath(options: GenerateOptions) {
  return `${getImportPath(options)}${ZOD_UTILS_FILE.fileName}`;
}

export function getAppAbilitiesImportPath(options: GenerateOptions) {
  return `${getImportPath(options)}${ACL_APP_ABILITY_FILE.fileName}`;
}
