import {
  STANDALONE_APP_REST_CLIENT_FILE,
  STANDALONE_ASSETS,
  StandaloneAssetEnum,
  TEMPLATE_IMPORT_PATH_APP_REST_CLIENT,
  TEMPLATE_IMPORT_PATH_QUERY_TYPES,
} from "src/generators/const/deps.const";
import { GenerateOptions } from "src/generators/types/options";
import { getImportPath } from "./generate/generate.imports.utils";

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
