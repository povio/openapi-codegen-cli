import { OpenAPIV3 } from "openapi-types";
import { ALLOWED_METHODS } from "src/generators/const/openapi.const";
import { VOID_SCHEMA } from "src/generators/const/zod.const";
import { invalidVariableNameCharactersToCamel } from "src/generators/utils/js.utils";
import { formatTag, getOperationsByTag, getOperationTag } from "src/generators/utils/tag.utils";
import { Endpoint, EndpointParameter } from "../../types/endpoint";
import { GenerateOptions } from "../../types/options";
import { pick } from "../../utils/object.utils";
import {
  getUniqueOperationName,
  getUniqueOperationNamesWithoutSplitByTags,
  isErrorStatus,
  isMainResponseStatus,
  isMediaTypeAllowed,
  isReferenceObject,
  replaceHyphenatedPath,
} from "../../utils/openapi.utils";
import {
  getErrorResponseZodSchemaName,
  getMainResponseZodSchemaName,
  getZodSchemaOperationName,
} from "../../utils/zod-schema.utils";
import { SchemaResolver } from "../SchemaResolver.class";
import { getZodChain } from "../zod/getZodChain";
import { getZodSchema } from "../zod/getZodSchema";
import { resolveZodSchemaName } from "../zod/resolveZodSchemaName";
import { getEndpointBody } from "./getEndpointBody";
import { getEndpointParameter } from "./getEndpointParameter";

export function getEndpointsFromOpenAPIDoc({
  resolver,
  options,
}: {
  resolver: SchemaResolver;
  options: GenerateOptions;
}) {
  const endpoints = [];
  const validationErrorMessages = [];
  const operationsByTag = getOperationsByTag(resolver.openApiDoc, options);
  const operationNames = getUniqueOperationNamesWithoutSplitByTags({
    openApiDoc: resolver.openApiDoc,
    operationsByTag,
    options,
  });

  for (const path in resolver.openApiDoc.paths) {
    const pathItemObj = resolver.openApiDoc.paths[path] as OpenAPIV3.PathItemObject;
    const pathItem = pick(pathItemObj, ALLOWED_METHODS);
    const pathParameters = getParameters(pathItemObj.parameters ?? []);

    for (const method in pathItem) {
      const operation = pathItem[method as keyof typeof pathItem] as OpenAPIV3.OperationObject | undefined;
      if (!operation || (operation.deprecated && !options?.withDeprecatedEndpoints)) {
        continue;
      }

      const invalidOperationId =
        operation.operationId && operation.operationId !== invalidVariableNameCharactersToCamel(operation.operationId);
      if (invalidOperationId) {
        validationErrorMessages.push(`INVALID OPERATION ID: ${operation.operationId}`);
      }

      const parameters = Object.entries({
        ...pathParameters,
        ...getParameters(operation.parameters ?? []),
      }).map(([, param]) => param);
      const operationName = getUniqueOperationName({ path, method, operation, operationsByTag, options });
      const isUniqueOperationName = operationNames.filter((name) => name === operationName).length <= 1;
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
        const body = getEndpointBody({ resolver, operation, operationName, isUniqueOperationName, tag, options });
        if (body) {
          endpoint.parameters.push(body.endpointParameter);
          endpoint.requestFormat = body.requestFormat;
        }
      }

      for (const param of parameters) {
        const endpointParameter = getEndpointParameter({
          resolver,
          param,
          operationName,
          isUniqueOperationName,
          tag,
          options,
        });
        if (endpointParameter) {
          endpoint.parameters.push(endpointParameter);
        }
      }

      const missingPathParameters = getMissingPathParameters(endpoint);
      missingPathParameters.forEach((pathParam) => {
        endpoint.parameters.push(pathParam);
      });
      if (missingPathParameters.length > 0) {
        validationErrorMessages.push(
          `MISSING PATH PARAMETERS: ${missingPathParameters.map(({ name }) => name).join(", ")} in ${path}`,
        );
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
            fallbackName: zodSchema.ref
              ? undefined
              : getResponseZodSchemaName({ statusCode, endpoint, operationName, isUniqueOperationName, tag }),
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

  return { endpoints, validationErrorMessages };
}

function getResponseZodSchemaName({
  statusCode,
  endpoint,
  operationName,
  isUniqueOperationName,
  tag,
}: {
  statusCode: string;
  endpoint: Endpoint;
  operationName: string;
  isUniqueOperationName: boolean;
  tag: string;
}): string {
  const status = Number(statusCode);
  const zodSchemaOperationName = getZodSchemaOperationName(operationName, isUniqueOperationName, tag);
  if ((!isMainResponseStatus(status) || endpoint.response) && statusCode !== "default" && isErrorStatus(status)) {
    return getErrorResponseZodSchemaName(zodSchemaOperationName, statusCode);
  }
  return getMainResponseZodSchemaName(zodSchemaOperationName);
}

function getParameters(parameters: NonNullable<OpenAPIV3.PathItemObject["parameters"]>) {
  return Object.fromEntries(
    (parameters ?? []).map((param) => [isReferenceObject(param) ? param.$ref : param.name, param] as const),
  );
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
    zodSchema: "z.string()",
    parameterObject: { name, required: true, in: "path", schema: { type: "string" } },
  };
}
