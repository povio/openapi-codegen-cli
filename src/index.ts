// Generator types
export * from "./generators/types/config";

// REST client
export { RestClient } from "./lib/rest/rest-client";
export type { RequestInfo, RequestConfig, Response, RestClient as IRestClient } from "./lib/rest/rest-client.types";
export { RestInterceptor } from "./lib/rest/rest-interceptor";
export { RestUtils } from "./lib/rest/rest.utils";

// Error handling
export { ApplicationException, ErrorHandler, SharedErrorHandler } from "./lib/rest/error-handling";
export type { GeneralErrorCodes, ErrorHandlerOptions, ErrorEntry } from "./lib/rest/error-handling";

// React Query types
export type { AppQueryOptions, AppMutationOptions, AppInfiniteQueryOptions } from "./lib/react-query.types";

// Config
export { OpenApiRouter } from "./lib/config/router.context";
export { OpenApiQueryConfig } from "./lib/config/queryConfig.context";
export type { InvalidationMap } from "./lib/config/queryConfig.context";
export { OpenApiWorkspaceContext } from "./lib/config/workspace.context";

// i18n resources (for consumer apps to merge into their i18n config)
export { ns, resources } from "./lib/config/i18n";

// Auth
export { AuthContext } from "./lib/auth/auth.context";
export { AuthGuard } from "./lib/auth/AuthGuard";
export type { AuthGuardProps } from "./lib/auth/AuthGuard";
