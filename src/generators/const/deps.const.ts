import { GenerateFile, Import } from "src/generators/types/generate";

export const APP_REST_CLIENT_NAME = "AppRestClient";

export const QUERY_OPTIONS_TYPES = {
  query: "AppQueryOptions",
  infiniteQuery: "AppInfiniteQueryOptions",
  mutation: "AppMutationOptions",
};

// Template
export const TEMPLATE_DATA_FILE_PATH = "src/data";
export const TEMPLATE_DATA_TS_PATH = "@/data";

export const TEMPLATE_IMPORTS = {
  appRestClient: "@/util/rest/clients/app-rest-client",
  queryTypes: "@/types/react-query",
  errorHandling: "@/util/vendor/error-handling",
  abilityContext: "@/data/acl/ability.context",
};

export const ERROR_HANDLERS = {
  ErrorHandler: "ErrorHandler",
  SharedErrorHandler: "SharedErrorHandler",
};
export const ERROR_HANDLING_IMPORT: Import = {
  bindings: [ERROR_HANDLERS.ErrorHandler, ERROR_HANDLERS.SharedErrorHandler],
  from: TEMPLATE_IMPORTS.errorHandling,
};
export const ABILITY_CONTEXT = "AbilityContext";
export const ABILITY_CONTEXT_IMPORT: Import = {
  bindings: [ABILITY_CONTEXT],
  from: TEMPLATE_IMPORTS.abilityContext,
};

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

// QueryModules
export const QUERY_MODULE_ENUM = "QueryModule";
export const QUERY_MODULES_FILE: GenerateFile = { fileName: "queryModules", extension: "ts" };

// QueryConfig
export const QUERY_CONFIG_FILE: GenerateFile = { fileName: "queryConfig.context", extension: "tsx" };

// MutationEffects
export const MUTATION_EFFECTS = {
  optionsType: "MutationEffectsOptions",
  hookName: "useMutationEffects",
  runFunctionName: "runMutationEffects",
};
export const MUTATION_EFFECTS_FILE: GenerateFile = { fileName: "useMutationEffects", extension: "ts" };

// ZodExtended
export const ZOD_EXTENDED = {
  namespace: "ZodExtended",
  exports: {
    parse: "parse",
    sortExp: "sortExp",
    brand: "brand",
  },
};
export const ZOD_EXTENDED_FILE: GenerateFile = { fileName: "zod.extended", extension: "ts" };
