// Generator types
export { GenerateFileData } from "./generators/types/generate";
export * from "./generators/types/metadata";
export * from "./generators/types/config";

// REST client
export { RestClient } from "./lib/rest/rest-client";
export type { RequestInfo, RequestConfig, Response, RestClient as IRestClient } from "./lib/rest/rest-client.types";
export { RestInterceptor } from "./lib/rest/rest-interceptor";
export { RestUtils } from "./lib/rest/rest.utils";

// Error handling
export { ApplicationException, ErrorHandler, SharedErrorHandler } from "./lib/rest/error-handling";
export type { GeneralErrorCodes } from "./lib/rest/error-handling";

// React Query types
export type { AppQueryOptions, AppMutationOptions, AppInfiniteQueryOptions } from "./lib/react-query.types";

// Config
export { OpenApiRouter } from "./lib/config/router.context";
export { OpenApiQueryConfig } from "./lib/config/queryConfig.context";

// Auth
export { AuthContext } from "./lib/auth/auth.context";
export { AuthGuard } from "./lib/auth/AuthGuard";
export type { AuthGuardProps } from "./lib/auth/AuthGuard";

// ACL
export { AbilityContext } from "./lib/acl/ability.context";
export { createAclGuard } from "./lib/acl/AclGuard";
export { Can } from "./lib/acl/Can";
export type { AppAbilities, AppAbility } from "./lib/acl/appAbility.types";
