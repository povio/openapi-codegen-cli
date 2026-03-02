import { GenerateFile, Import } from "@/generators/types/generate";

import { ACL_PACKAGE_IMPORT_PATH, PACKAGE_IMPORT_PATH } from "./package.const";

export const APP_REST_CLIENT_NAME = "AppRestClient";
export const APP_REST_CLIENT_FILE: GenerateFile = { fileName: "app-rest-client", extension: "ts" };

export const QUERY_OPTIONS_TYPES = {
  query: "AppQueryOptions",
  infiniteQuery: "AppInfiniteQueryOptions",
  mutation: "AppMutationOptions",
};

// Template
export const TEMPLATE_DATA_FILE_PATH = "src/data";
export const ERROR_HANDLERS = {
  ErrorHandler: "ErrorHandler",
  SharedErrorHandler: "SharedErrorHandler",
};
export const ERROR_HANDLING_IMPORT: Import = {
  bindings: [ERROR_HANDLERS.ErrorHandler, ERROR_HANDLERS.SharedErrorHandler],
  from: PACKAGE_IMPORT_PATH,
};
export const ABILITY_CONTEXT = "AbilityContext";
export const ABILITY_CONTEXT_IMPORT: Import = {
  bindings: [ABILITY_CONTEXT],
  from: ACL_PACKAGE_IMPORT_PATH,
};
export const BUILDERS_UTILS = {
  dynamicInputs: "dynamicInputs",
  dynamicColumns: "dynamicColumns",
};

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

// ZodExtended
export const ZOD_EXTENDED = {
  namespace: "ZodExtended",
  exports: {
    parse: "parse",
    sortExp: "sortExp",
  },
};
