import { GenerateFile } from "../types/generate";

export const APP_REST_CLIENT_NAME = "AppRestClient";

export const QUERY_OPTIONS_TYPES = {
  query: "AppQueryOptions",
  infiniteQuery: "AppInfiniteQueryOptions",
  mutation: "AppMutationOptions",
};

// Template
export const TEMPLATE_DATA_FILE_PATH = "src/data";
export const TEMPLATE_DATA_TS_PATH = "@/data";

export const TEMPLATE_IMPORT_PATH_APP_REST_CLIENT = "@/util/rest/clients/app-rest-client";
export const TEMPLATE_IMPORT_PATH_QUERY_TYPES = "@/types/react-query";

// Standalone
export enum StandaloneAssetEnum {
  ReactQueryTypes = "reactQueryTypes",
  RestClient = "restClient",
  RestInterceptor = "restInterceptor",
}
export const STANDALONE_ASSETS: Record<StandaloneAssetEnum, GenerateFile> = {
  [StandaloneAssetEnum.ReactQueryTypes]: { fileName: "react-query.types", extension: "ts" },
  [StandaloneAssetEnum.RestClient]: { fileName: "rest-client", extension: "ts" },
  [StandaloneAssetEnum.RestInterceptor]: { fileName: "rest-interceptor", extension: "ts" },
};

export const STANDALONE_APP_REST_CLIENT_FILE: GenerateFile = { fileName: "app-rest-client", extension: "ts" };

// InvalidateQueryOptions
export const INVALIDATE_QUERIES = {
  optionsType: "InvalidateQueryOptions",
  functionName: "invalidateQueries",
};
export const INVALIDATE_QUERY_OPTIONS_FILE: GenerateFile = { fileName: "invalidateQueries", extension: "ts" };
export const QUERY_MODULES_FILE: GenerateFile = { fileName: "queryModules", extension: "ts" };
