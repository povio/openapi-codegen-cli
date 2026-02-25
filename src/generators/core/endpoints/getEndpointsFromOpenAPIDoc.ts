import { OpenAPIV3 } from "openapi-types";

import { JSON_APPLICATION_FORMAT } from "@/generators/const/endpoints.const";
import { HttpStatusCode } from "@/generators/const/validation.const";
import { STRING_SCHEMA, VOID_SCHEMA } from "@/generators/const/zod.const";
import { Profiler } from "@/helpers/profile.helper";
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

import { getEndpointAcl } from "./getEndpointAcl";
import { getEndpointBody } from "./getEndpointBody";
import { getEndpointParameter } from "./getEndpointParameter";
import { resolveEndpointZodSchema } from "./resolveEndpointZodSchema";
import type { OperationContext, SchemaResolver } from "../SchemaResolver.class";

export function getEndpointsFromOpenAPIDoc(resolver: SchemaResolver, profiler?: Profiler) {
  const endpoints = [];
  const p = profiler ?? new Profiler(false);

  for (const context of resolver.getOperationContexts()) {
    endpoints.push(buildEndpointFromOperationContext(resolver, context, p));
  }

  return endpoints;
}

export function buildEndpointFromOperationContext(
  resolver: SchemaResolver,
  context: OperationContext,
  profiler?: Profiler,
) {
  const p = profiler ?? new Profiler(false);
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

  p.runSync("endpoints.requestBody", () => {
    if (operation.requestBody) {
      const body = getEndpointBody({ resolver, operation, operationName, isUniqueOperationName, tag });
      if (body) {
        endpoint.parameters.push(body.endpointParameter);
        endpoint.requestFormat = body.requestFormat;
      }
    }
  });

  p.runSync("endpoints.params", () => {
    for (const param of parameters) {
      const endpointParameter = getEndpointParameter({
        resolver,
        param,
        operationName,
        isUniqueOperationName,
        tag,
      });
      if (endpointParameter) {
        endpoint.parameters.push(endpointParameter);
      }
    }
  });

  p.runSync("endpoints.pathParams", () => {
    const missingPathParameters = getMissingPathParameters(endpoint);
    missingPathParameters.forEach((pathParam) => {
      endpoint.parameters.push(pathParam);
    });
    if (missingPathParameters.length > 0) {
      resolver.validationErrors.push(getMissingPathParameterError(missingPathParameters, path));
    }
  });

  p.runSync("endpoints.responses", () => {
    for (const responseData of responses) {
      const { statusCode, responseObj, matchingMediaType, schema } = responseData;
      endpoint.responseStatusCodes.push(statusCode);
      let responseZodSchema: string | undefined;
      if (matchingMediaType) {
        endpoint.responseFormat = matchingMediaType;
      } else {
        responseZodSchema = VOID_SCHEMA;
        if (statusCode === "200") {
          resolver.validationErrors.push(
            getInvalidStatusCodeError({ received: "200", expected: "204" }, operation, endpoint),
          );
        }
      }

      if (schema) {
        responseZodSchema = resolveEndpointZodSchema({
          resolver,
          schema,
          meta: { isRequired: true },
          tag,
          fallbackName: isReferenceObject(schema)
            ? undefined
            : getResponseZodSchemaName({ statusCode, operationName, isUniqueOperationName, tag }),
          composeBeforeResolve: false,
        });
      }

      if (responseZodSchema) {
        const status = Number(statusCode);

        if (isMainResponseStatus(status) && !endpoint.response) {
          endpoint.response = responseZodSchema;
          endpoint.responseObject = responseObj;
          endpoint.responseDescription = responseObj?.description;
        } else if (statusCode !== "default" && isErrorStatus(status)) {
          endpoint.errors.push({
            zodSchema: responseZodSchema,
            status,
            description: responseObj?.description,
          });
        }
      }
    }
  });

  if (!endpoint.response) {
    endpoint.response = VOID_SCHEMA;
  }

  p.runSync("endpoints.statusValidation", () => {
    const mainStatusCodes = Object.keys(operation.responses).map(Number).filter(isMainResponseStatus);
    if (mainStatusCodes.length > 1) {
      resolver.validationErrors.push(
        getMultipleSuccessStatusCodesError(mainStatusCodes.map(String) as HttpStatusCode[], operation, endpoint),
      );
    }
  });

  p.runSync("endpoints.acl", () => {
    endpoint.acl = getEndpointAcl({ resolver, endpoint, operation });
  });

  if (operation.security?.[0].Authorization && !endpoint.responseStatusCodes.includes("401")) {
    resolver.validationErrors.push(getMissingStatusCodeError("401", operation, endpoint));
  }

  if (endpoint.acl?.[0] && !endpoint.responseStatusCodes.includes("403")) {
    resolver.validationErrors.push(getMissingStatusCodeError("403", operation, endpoint));
  }

  return endpoint;
}

function getMissingPathParameters(endpoint: Endpoint): EndpointParameter[] {
  const pathParams = [...endpoint.path.matchAll(/:([a-zA-Z0-9_]+)/g)].map((param) => param[1]);
  return pathParams
    .filter((pathParam) => endpoint.parameters.findIndex(({ name }) => name === pathParam) === -1)
    .map((name) => getPathParameterFromName(name));
}

function getPathParameterFromName(name: string): EndpointParameter {
  return {
    name,
    type: "Path",
    zodSchema: STRING_SCHEMA,
    parameterObject: { name, required: true, in: "path", schema: { type: "string" } },
  };
}
