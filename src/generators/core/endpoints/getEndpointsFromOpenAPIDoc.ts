import { OpenAPIV3 } from "openapi-types";
import { ALLOWED_METHODS } from "src/generators/const/openapi.const";
import { VOID_SCHEMA } from "src/generators/const/zod.const";
import { Endpoint } from "../../types/endpoint";
import { GenerateOptions } from "../../types/options";
import { pick } from "../../utils/object.utils";
import {
  formatTag,
  getOperationTag,
  getUniqueOperationName,
  isErrorStatus,
  isMainResponseStatus,
  isMediaTypeAllowed,
  isReferenceObject,
  replaceHyphenatedPath,
} from "../../utils/openapi.utils";
import { getErrorResponseZodSchemaName, getMainResponseZodSchemaName } from "../../utils/zod-schema.utils";
import { SchemaResolver } from "../SchemaResolver.class";
import { getZodChain } from "../zod/getZodChain";
import { getZodSchema } from "../zod/getZodSchema";
import { resolveZodSchemaName } from "../zod/resolveZodSchemaName";
import { getEndpointBody } from "./getEndpointBody";
import { getEndpointParameter } from "./getEndpointParameter";

export function getEndpointsFromOpenAPIDoc({
  openApiDoc,
  resolver,
  options,
}: {
  openApiDoc: OpenAPIV3.Document;
  resolver: SchemaResolver;
  options: GenerateOptions;
}) {
  const endpoints = [];

  for (const path in openApiDoc.paths) {
    const pathItemObj = openApiDoc.paths[path] as OpenAPIV3.PathItemObject;
    const pathItem = pick(pathItemObj, ALLOWED_METHODS);
    const pathParameters = getParameters(pathItemObj.parameters ?? []);

    for (const method in pathItem) {
      const operation = pathItem[method as keyof typeof pathItem] as OpenAPIV3.OperationObject | undefined;
      if (!operation || (operation.deprecated && !options?.withDeprecatedEndpoints)) {
        continue;
      }

      const parameters = Object.entries({
        ...pathParameters,
        ...getParameters(operation.parameters ?? []),
      }).map(([, param]) => param);
      const operationName = getUniqueOperationName({ path, method, operation, openApiDoc, options });
      const tag = getOperationTag(operation, options);
      const endpoint: Endpoint = {
        method: method as OpenAPIV3.HttpMethods,
        path: replaceHyphenatedPath(path),
        operationName,
        description: operation.description,
        tags: operation.tags?.map(formatTag),
        requestFormat: "application/json",
        parameters: [],
        response: "",
        errors: [],
      };

      if (operation.requestBody) {
        const body = getEndpointBody({ resolver, operation, operationName, tag, options });
        if (body) {
          endpoint.parameters.push(body.endpointParameter);
          endpoint.requestFormat = body.requestFormat;
        }
      }

      for (const param of parameters) {
        const endpointParameter = getEndpointParameter({ resolver, param, operationName, tag, options });
        if (endpointParameter) {
          endpoint.parameters.push(endpointParameter);
        }
      }

      for (const statusCode in operation.responses) {
        const responseObj = <OpenAPIV3.ResponseObject>resolver.resolveObject(operation.responses[statusCode]);
        const mediaTypes = Object.keys(responseObj.content ?? {});
        const matchingMediaType = mediaTypes.find(isMediaTypeAllowed);

        let schema: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject | undefined;
        let responseZodSchema: string | undefined;
        if (matchingMediaType) {
          endpoint.responseFormat = matchingMediaType;
          schema = responseObj.content?.[matchingMediaType]?.schema;
        } else {
          responseZodSchema = VOID_SCHEMA;
        }

        if (schema) {
          const zodSchema = getZodSchema({ schema, resolver, meta: { isRequired: true }, tag, options });

          const schemaObject = resolver.resolveObject(schema);

          const zodSchemaName = resolveZodSchemaName({
            schema: schemaObject,
            zodSchema,
            fallbackName: zodSchema.ref ? undefined : getResponseZodSchemaName(statusCode, endpoint),
            resolver,
            tag,
            options,
          });

          responseZodSchema = zodSchemaName + getZodChain({ schema: schemaObject, meta: zodSchema.meta, options });
        }

        if (responseZodSchema) {
          const status = Number(statusCode);

          if (isMainResponseStatus(status)) {
            endpoint.response = responseZodSchema;
            endpoint.responseObject = responseObj;
          } else if (statusCode !== "default" && isErrorStatus(status)) {
            endpoint.errors.push({
              zodSchema: responseZodSchema,
              status,
              description: responseObj.description,
            });
          }
        }
      }

      if (!endpoint.response) {
        endpoint.response = VOID_SCHEMA;
      }

      endpoints.push(endpoint);
    }
  }

  return endpoints;
}

function getResponseZodSchemaName(statusCode: string, endpoint: Endpoint): string {
  const status = Number(statusCode);
  if ((!isMainResponseStatus(status) || endpoint.response) && statusCode !== "default" && isErrorStatus(status)) {
    return getErrorResponseZodSchemaName(endpoint.operationName, statusCode);
  }
  return getMainResponseZodSchemaName(endpoint.operationName);
}

function getParameters(parameters: NonNullable<OpenAPIV3.PathItemObject["parameters"]>) {
  return Object.fromEntries(
    (parameters ?? []).map((param) => [isReferenceObject(param) ? param.$ref : param.name, param] as const),
  );
}
