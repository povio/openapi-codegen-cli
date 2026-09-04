import { OpenAPIV3 } from "openapi-types";

import { JSON_APPLICATION_FORMAT } from "@/generators/const/endpoints.const";
import { HttpStatusCode } from "@/generators/const/validation.const";
import { STRING_SCHEMA, VOID_SCHEMA } from "@/generators/const/zod.const";
import { SchemaResolver } from "@/generators/core/SchemaResolver.class";
import { getZodChain } from "@/generators/core/zod/getZodChain";
import { getZodSchema } from "@/generators/core/zod/getZodSchema";
import { resolveZodSchemaName } from "@/generators/core/zod/resolveZodSchemaName";
import { Endpoint, EndpointParameter } from "@/generators/types/endpoint";
import { invalidVariableNameCharactersToCamel } from "@/generators/utils/js.utils";
import { isReferenceObject } from "@/generators/utils/openapi-schema.utils";
import { isErrorStatus, isMainResponseStatus, replaceHyphenatedPath } from "@/generators/utils/openapi.utils";
import { formatTag } from "@/generators/utils/tag.utils";
import {
  getInvalidOperationIdError,
  getInvalidStatusCodeError,
  getMissingPathParameterError,
  getMissingStatusCodeError,
  getMultipleSuccessStatusCodesError,
} from "@/generators/utils/validation.utils";
import { getResponseZodSchemaName } from "@/generators/utils/zod-schema.utils";
import { Profiler } from "@/helpers/profile.helper";

import { getEndpointAcl } from "./getEndpointAcl";
import { getEndpointBody } from "./getEndpointBody";
import { getEndpointParameter } from "./getEndpointParameter";

export function getEndpointsFromOpenAPIDoc(resolver: SchemaResolver, profiler = new Profiler(false)) {
  const endpoints = [];
  const responseSchemaByRefAndTag = new Map<
    string,
    { schemaObject: OpenAPIV3.SchemaObject; responseZodSchema: string }
  >();

  for (const context of resolver.getOperationContexts()) {
    const { path, method, operation, operationName, isUniqueOperationName, tag, parameters, responses } = context;

    const invalidOperationId =
      operation.operationId && operation.operationId !== invalidVariableNameCharactersToCamel(operation.operationId);
    if (operation.operationId && invalidOperationId) {
      resolver.validationErrors.push(getInvalidOperationIdError(operation.operationId));
    }

    const endpoint: Endpoint = {
      method,
      path: replaceHyphenatedPath(path),
      operationName,
      description: operation.description,
      summary: operation.summary,
      tags: operation.tags?.map(formatTag),
      requestFormat: JSON_APPLICATION_FORMAT,
      parameters: [],
      response: "",
      errors: [],
      responseStatusCodes: [],
      mediaUpload: !!operation["x-media-upload"],
      mediaDownload: !!operation["x-media-download"],
    };

    if (operation.requestBody) {
      const body = profiler.runSync("endpoints.body", () =>
        getEndpointBody({ resolver, operation, operationName, isUniqueOperationName, tag }),
      );
      if (body) {
        endpoint.parameters.push(body.endpointParameter);
        endpoint.requestFormat = body.requestFormat;
      }
    }

    for (const param of parameters) {
      const endpointParameter = profiler.runSync("endpoints.parameter", () =>
        getEndpointParameter({
          resolver,
          param,
          operationName,
          isUniqueOperationName,
          tag,
        }),
      );
      if (endpointParameter) {
        endpoint.parameters.push(endpointParameter);
      }
    }

    const missingPathParameters = getMissingPathParameters(endpoint.path, endpoint.parameters);
    endpoint.parameters.push(...missingPathParameters);
    if (missingPathParameters.length > 0) {
      resolver.validationErrors.push(getMissingPathParameterError(missingPathParameters, path));
    }

    for (const { statusCode, responseObj, matchingMediaType, schema } of responses) {
      endpoint.responseStatusCodes.push(statusCode);
      if (matchingMediaType) {
        const statusNum = Number(statusCode);
        // Only let success responses (2xx) or "default" (when nothing is set yet) determine the
        // response format used for the Accept header. Error responses (4xx/5xx) must not
        // overwrite the success content-type — doing so would strip rawResponse/blob config
        // from blob-download endpoints that also declare domain-error responses.
        if (isMainResponseStatus(statusNum) || (statusCode === "default" && !endpoint.responseFormat)) {
          endpoint.responseFormat = matchingMediaType;
        }
      } else if (statusCode === "200") {
        resolver.validationErrors.push(
          getInvalidStatusCodeError({ received: "200", expected: "204" }, operation, endpoint),
        );
      }

      if (schema) {
        const responseCacheKey = isReferenceObject(schema) ? `${schema.$ref}|${tag}` : undefined;
        let resolvedResponse = responseCacheKey ? responseSchemaByRefAndTag.get(responseCacheKey) : undefined;
        if (!resolvedResponse) {
          const zodSchema = profiler.runSync("endpoints.response.zod", () =>
            getZodSchema({
              schema,
              resolver,
              meta: { isRequired: true },
              tag,
            }),
          );

          const schemaObject = resolver.resolveObject(schema);
          const zodSchemaName = resolveZodSchemaName({
            schema: schemaObject,
            zodSchema,
            fallbackName: zodSchema.ref
              ? undefined
              : getResponseZodSchemaName({ statusCode, operationName, isUniqueOperationName, tag }),
            resolver,
            tag,
          });
          resolvedResponse = {
            schemaObject,
            responseZodSchema:
              zodSchemaName + getZodChain({ schema: schemaObject, meta: zodSchema.meta, options: resolver.options }),
          };
          if (responseCacheKey) {
            responseSchemaByRefAndTag.set(responseCacheKey, resolvedResponse);
          }
        }
        const { schemaObject, responseZodSchema } = resolvedResponse;

        const status = Number(statusCode);

        if (isMainResponseStatus(status) && !endpoint.response) {
          endpoint.response = responseZodSchema;
          endpoint.responseObject = responseObj;
          endpoint.responseDescription = responseObj?.description;
        } else if (statusCode === "default" && !endpoint.response) {
          // Nest/Swagger often puts the JSON body only under `default` while `200` has no content.
          endpoint.response = responseZodSchema;
          endpoint.responseObject = responseObj;
          endpoint.responseDescription = responseObj?.description;
        } else if (statusCode !== "default" && !Number.isNaN(status) && isErrorStatus(status)) {
          const rawSchema = schemaObject as Record<string, unknown>;
          const domainStr = rawSchema["x-domain-error-domain"];
          const domainName = rawSchema["x-domain-error-name"];
          const codeEnum = (rawSchema?.properties as Record<string, unknown> | undefined)?.code;
          const codeEnumArr = (codeEnum as Record<string, unknown> | undefined)?.enum;
          const domainCode =
            Array.isArray(codeEnumArr) &&
            codeEnumArr.length === 1 &&
            (typeof codeEnumArr[0] === "number" || typeof codeEnumArr[0] === "string")
              ? (codeEnumArr[0] as number | string)
              : undefined;

          endpoint.errors.push({
            zodSchema: responseZodSchema,
            status,
            description: responseObj?.description,
            ...(typeof domainStr === "string" && domainCode !== undefined
              ? {
                  domainError: {
                    domain: domainStr,
                    code: domainCode,
                    ...(typeof domainName === "string" ? { name: domainName } : {}),
                  },
                }
              : {}),
          });
        }
      } else {
        const status = Number(statusCode);
        const responseZodSchema = VOID_SCHEMA;

        if (statusCode !== "default" && !Number.isNaN(status) && isErrorStatus(status)) {
          endpoint.errors.push({
            zodSchema: responseZodSchema,
            status,
            description: responseObj?.description,
          });
        }
      }
    }

    if (!endpoint.response) {
      endpoint.response = VOID_SCHEMA;
    }

    const mainStatusCodes: number[] = [];
    for (const { statusCode } of responses) {
      const status = Number(statusCode);
      if (isMainResponseStatus(status)) {
        mainStatusCodes.push(status);
      }
    }
    if (mainStatusCodes.length > 1) {
      resolver.validationErrors.push(
        getMultipleSuccessStatusCodesError(mainStatusCodes.map(String) as HttpStatusCode[], operation, endpoint),
      );
    }

    const resolvedAcl = getEndpointAcl({ resolver, endpoint, operation });
    if (resolvedAcl?.length) {
      endpoint.acl = resolvedAcl;
    }

    if (operation.security?.[0].Authorization && !endpoint.responseStatusCodes.includes("401")) {
      resolver.validationErrors.push(getMissingStatusCodeError("401", operation, endpoint));
    }

    if (endpoint.acl?.[0] && !endpoint.responseStatusCodes.includes("403")) {
      resolver.validationErrors.push(getMissingStatusCodeError("403", operation, endpoint));
    }

    endpoints.push(endpoint);
  }

  return endpoints;
}

function getMissingPathParameters(path: string, parameters: EndpointParameter[]): EndpointParameter[] {
  if (!path.includes(":")) {
    return [];
  }

  const parameterNames = new Set(parameters.map(({ name }) => name));
  const missingParameters: EndpointParameter[] = [];
  for (const match of path.matchAll(/:([a-zA-Z0-9_]+)/g)) {
    const name = match[1];
    if (name && !parameterNames.has(name)) {
      missingParameters.push(getPathParameterFromName(name));
    }
  }
  return missingParameters;
}

function getPathParameterFromName(name: string): EndpointParameter {
  return {
    name,
    type: "Path",
    zodSchema: STRING_SCHEMA,
    parameterObject: { name, required: true, in: "path", schema: { type: "string" } },
  };
}
