import {
  STANDALONE_APP_REST_CLIENT_FILE,
  STANDALONE_ASSETS,
  StandaloneAssetEnum,
  TEMPLATE_IMPORT_PATH_APP_REST_CLIENT,
  TEMPLATE_IMPORT_PATH_QUERY_TYPES,
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
    return TEMPLATE_IMPORT_PATH_APP_REST_CLIENT;
  }
  return `${getImportPath(options)}${STANDALONE_APP_REST_CLIENT_FILE.fileName}`;
}

export function getQueryTypesImportPath(options: GenerateOptions) {
  if (!options.standalone) {
    return TEMPLATE_IMPORT_PATH_QUERY_TYPES;
  }
  return `${getImportPath(options)}${STANDALONE_ASSETS[StandaloneAssetEnum.ReactQueryTypes].fileName}`;
}
