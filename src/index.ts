import SwaggerParser from "@apidevtools/swagger-parser";
import { OpenAPIV3 } from "openapi-types";
import { DEFAULT_GENERATE_OPTIONS } from "./generators/const/options.const";
import { getMetadataFromOpenAPIDoc } from "./generators/core/getMetadataFromOpenAPIDoc";
import { generateCodeFromOpenAPIDoc } from "./generators/generateCodeFromOpenAPIDoc";
import { GenerateParams } from "./generators/types/metadata";
import { GenerateOptions } from "./generators/types/options";

export async function getGenerateMetadata({ input, options: genOptions }: GenerateParams) {
  const options = { ...DEFAULT_GENERATE_OPTIONS, ...genOptions } as GenerateOptions;

  const openApiDoc = (await SwaggerParser.bundle(input)) as OpenAPIV3.Document;

  return await getMetadataFromOpenAPIDoc(openApiDoc, options);
}

export async function getGenerateFilesData({ input, options: genOptions }: GenerateParams) {
  const options = { ...DEFAULT_GENERATE_OPTIONS, ...genOptions } as GenerateOptions;

  const openApiDoc = (await SwaggerParser.bundle(input)) as OpenAPIV3.Document;

  return generateCodeFromOpenAPIDoc(openApiDoc, options);
}

// Generator exports
export { GenerateFileData } from "./generators/types/generate";
export * from "./generators/types/metadata";
export * from "./generators/types/config";

// Library exports - REST client
export { RestClient } from "./lib/rest/rest-client";
export type { RequestInfo, RequestConfig, Response, RestClient as IRestClient } from "./lib/rest/rest-client.types";
export { RestInterceptor } from "./lib/rest/rest-interceptor";
export { RestUtils } from "./lib/rest/rest.utils";
export { ApplicationException, ErrorHandler, SharedErrorHandler } from "./lib/rest/error-handling";
export type { GeneralErrorCodes, ErrorEntry } from "./lib/rest/error-handling";

// Library exports - React Query types
export type { AppQueryOptions, AppMutationOptions, AppInfiniteQueryOptions } from "./lib/react-query.types";

// Library exports - Config
export { OpenApiRouter } from "./lib/config/router.context";
export { OpenApiQueryConfig } from "./lib/config/queryConfig.context";

// Library exports - Auth
export { AuthContext } from "./lib/auth/auth.context";
export { AuthGuard } from "./lib/auth/AuthGuard";
export type { AuthGuardProps } from "./lib/auth/AuthGuard";

// Library exports - ACL
export { AbilityContext } from "./lib/acl/ability.context";
export { createAclGuard } from "./lib/acl/AclGuard";
export { Can } from "./lib/acl/Can";
export type { AppAbilities, AppAbility } from "./lib/acl/appAbility.types";
