import { OpenAPIV3 } from "openapi-types";
import { ALLOWED_METHODS, ALLOWED_PATH_IN, COMPLEXITY_THRESHOLD } from "src/generators/const/openapi.const";
import { VOID_SCHEMA } from "src/generators/const/zod-schemas.const";
import { match } from "ts-pattern";
import { Endpoint } from "../../types/endpoint";
import { GenerateOptions } from "../../types/options";
import {
  getOperationName,
  isErrorStatus,
  isMainResponseStatus,
  isMediaTypeAllowed,
  replaceHyphenatedPath,
} from "../../utils/endpoint.utils";
import { pick } from "../../utils/object.utils";
import { isAllowedParamMediaType, isReferenceObject, pathParamToVariableName } from "../../utils/openapi.utils";
import {
  getBodyZodSchemaName,
  getErrorResponseZodSchemaName,
  getMainResponseZodSchemaName,
  getParamZodSchemaName,
  getZodSchemaName,
  isNamedZodSchema,
} from "../../utils/zod-schema.utils";
import { GenerateContext } from "../GenerateContext.class";
import { getOpenAPISchemaComplexity } from "../openapi/getOpenAPISchemaComplexity";
import { SchemaResolver } from "../SchemaResolver.class";
import { getZodChain } from "../zod/getZodChain";
import { getZodSchema } from "../zod/getZodSchema";
import { ZodSchema } from "../zod/ZodSchema.class";

export function getEndpointsFromOpenAPIDoc({
  openApiDoc,
  resolver,
  options,
}: {
  openApiDoc: OpenAPIV3.Document;
  resolver: SchemaResolver;
  options: GenerateOptions;
}) {
  const ctx = new GenerateContext();
  const endpoints = [];

  for (const path in openApiDoc.paths) {
    const pathItemObj = openApiDoc.paths[path] as OpenAPIV3.PathItemObject;
    const pathItem = pick(pathItemObj, ALLOWED_METHODS);
    const pathParameters = getParameters(pathItemObj.parameters ?? []);

    for (const method in pathItem) {
      const operation = pathItem[method as keyof typeof pathItem] as OpenAPIV3.OperationObject | undefined;
      if (!operation || (options?.withDeprecatedEndpoints ? false : operation.deprecated)) {
        continue;
      }

      const parameters = Object.entries({
        ...pathParameters,
        ...getParameters(operation.parameters ?? []),
      }).map(([_, param]) => param);
      const operationName = getOperationName(path, method, operation);
      const endpoint: Endpoint = {
        method: method as OpenAPIV3.HttpMethods,
        path: replaceHyphenatedPath(path),
        operationName,
        description: operation.description,
        requestFormat: "application/json",
        parameters: [],
        errors: [],
        response: "",
      };

      if (operation.requestBody) {
        const requestBodyObj = (
          isReferenceObject(operation.requestBody)
            ? resolver.getSchemaByRef(operation.requestBody.$ref)
            : operation.requestBody
        ) as OpenAPIV3.RequestBodyObject;
        const mediaTypes = Object.keys(requestBodyObj.content ?? {});
        const matchingMediaType = mediaTypes.find(isAllowedParamMediaType);
        if (matchingMediaType) {
          endpoint.requestFormat = matchingMediaType;
        }

        const bodySchema = matchingMediaType && requestBodyObj.content?.[matchingMediaType]?.schema;
        if (bodySchema) {
          const bodyZodSchema = getZodSchema({
            schema: bodySchema,
            resolver,
            ctx,
            meta: { isRequired: requestBodyObj.required ?? true },
            options,
          });
          const zodSchemaName = resolveZodSchemaName({
            zodSchema: bodyZodSchema,
            fallbackName: getBodyZodSchemaName(operationName),
            resolver,
            ctx,
            options,
          });
          const zodChain = getZodChain({
            schema: isReferenceObject(bodySchema) ? resolver.getSchemaByRef(bodySchema.$ref) : bodySchema,
            meta: bodyZodSchema.meta,
          });
          endpoint.parameters.push({
            name: "body",
            type: "Body",
            description: requestBodyObj.description,
            schema: zodSchemaName + zodChain,
          });
        }
      }

      for (const param of parameters) {
        const paramObj = (
          isReferenceObject(param) ? resolver.getSchemaByRef(param.$ref) : param
        ) as OpenAPIV3.ParameterObject;
        if (ALLOWED_PATH_IN.includes(paramObj.in)) {
          let paramSchema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject | undefined;
          if (paramObj.content) {
            const mediaTypes = Object.keys(paramObj.content ?? {});
            const matchingMediaType = mediaTypes.find(isAllowedParamMediaType);

            if (!matchingMediaType) {
              throw new Error(`Unsupported media type for param ${paramObj.name}: ${mediaTypes.join(", ")}`);
            }

            const mediaTypeObject = paramObj.content[matchingMediaType];
            if (!mediaTypeObject) {
              throw new Error(`No content with media type for param ${paramObj.name}: ${matchingMediaType}`);
            }

            // this fallback is needed to autofix openapi docs that put the $ref in the wrong place
            // (it should be in the mediaTypeObject.schema, not in the mediaTypeObject itself)
            // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#style-values (just above this anchor)
            paramSchema = mediaTypeObject?.schema ?? mediaTypeObject;
          } else {
            paramSchema = isReferenceObject(paramObj.schema)
              ? resolver.getSchemaByRef(paramObj.schema.$ref)
              : paramObj.schema;
          }

          if (options?.withDescription && paramSchema) {
            (paramSchema as OpenAPIV3.SchemaObject).description = (paramObj.description ?? "").trim();
          }

          // resolve ref if needed, and fallback to default (unknown) value if needed
          paramSchema = paramSchema
            ? (isReferenceObject(paramSchema) ? resolver.getSchemaByRef(paramSchema.$ref) : paramSchema)!
            : {};

          const paramZodSchema = getZodSchema({
            schema: paramSchema ?? {},
            resolver,
            ctx,
            meta: { isRequired: paramObj.in === "path" ? true : paramObj.required ?? false },
            options,
          });
          const zodSchemaName = resolveZodSchemaName({
            zodSchema: paramZodSchema.assign(
              paramZodSchema.toString() + getZodChain({ schema: paramSchema, meta: paramZodSchema.meta, options }),
            ),
            fallbackName: getParamZodSchemaName(operationName, paramObj.name),
            resolver,
            ctx,
            options,
          });
          endpoint.parameters.push({
            name: match(paramObj.in)
              .with("path", () => pathParamToVariableName(paramObj.name))
              .otherwise(() => paramObj.name),
            type: match(paramObj.in)
              .with("header", () => "Header")
              .with("query", () => "Query")
              .with("path", () => "Path")
              .run() as "Header" | "Query" | "Path",
            schema: zodSchemaName,
            openApiObject: paramObj,
          });
        }
      }

      for (const statusCode in operation.responses) {
        const responseObj = (
          isReferenceObject(operation.responses[statusCode])
            ? resolver.getSchemaByRef(operation.responses[statusCode].$ref)
            : operation.responses[statusCode]
        ) as OpenAPIV3.ResponseObject;

        const mediaTypes = Object.keys(responseObj.content ?? {});
        const matchingMediaType = mediaTypes.find(isMediaTypeAllowed);
        if (matchingMediaType) {
          endpoint.responseFormat = matchingMediaType;
        }

        const maybeSchema = matchingMediaType ? responseObj.content?.[matchingMediaType]?.schema : null;

        let schema = matchingMediaType ? undefined : VOID_SCHEMA;
        let zodSchema: ZodSchema | undefined;

        if (maybeSchema) {
          zodSchema = getZodSchema({ schema: maybeSchema, resolver, ctx, meta: { isRequired: true }, options });
          const zodSchemaName = resolveZodSchemaName({
            zodSchema,
            fallbackName: zodSchema.ref ? undefined : getResponseZodSchemaName(statusCode, endpoint),
            resolver,
            ctx,
            options,
          });
          schema =
            zodSchemaName +
            getZodChain({
              schema: isReferenceObject(maybeSchema) ? resolver.getSchemaByRef(maybeSchema.$ref) : maybeSchema,
              meta: zodSchema.meta,
            });
        }

        if (schema) {
          const status = Number(statusCode);

          if (isMainResponseStatus(status) && !endpoint.response) {
            endpoint.response = schema;
          } else if (statusCode !== "default" && isErrorStatus(status)) {
            endpoint.errors.push({
              schema,
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

  return { endpoints, ctx };
}

function resolveZodSchemaName({
  zodSchema,
  fallbackName,
  resolver,
  ctx,
  options,
}: {
  zodSchema: ZodSchema;
  fallbackName?: string;
  resolver: SchemaResolver;
  ctx: GenerateContext;
  options: GenerateOptions;
}): string {
  const result = zodSchema.toString();

  if ((!isNamedZodSchema(result) || zodSchema.ref === undefined) && fallbackName) {
    // result is simple enough that it doesn't need to be assigned to a variable
    if (zodSchema.complexity < COMPLEXITY_THRESHOLD) {
      return result;
    }

    const zodSchemaName = getZodSchemaName(fallbackName, options.schemaSuffix);

    // result is complex and would benefit from being re-used
    let formattedZodSchemaName = zodSchemaName;

    // iteratively add suffix number to prevent overwriting
    let reuseCount = 1;
    while (Boolean(ctx.getZodSchemaByName(formattedZodSchemaName))) {
      if (ctx.getSchemaNamesByCode(result)?.includes(formattedZodSchemaName)) {
        return formattedZodSchemaName;
      } else if (ctx.getZodSchemaByName(formattedZodSchemaName) === zodSchemaName) {
        return formattedZodSchemaName;
      } else {
        reuseCount += 1;
        formattedZodSchemaName = `${zodSchemaName}__${reuseCount}`;
      }
    }

    ctx.setZodSchema(formattedZodSchemaName, result);
    ctx.addSchemaName(result, formattedZodSchemaName);

    return formattedZodSchemaName;
  }

  // result is a reference to another schema
  let schema = ctx.getZodSchemaByName(result);
  if (!schema && zodSchema.ref) {
    schema = ctx.getZodSchemaByName(resolver.getZodSchemaNameByRef(zodSchema.ref));
  }

  if (zodSchema.ref && schema) {
    const complexity = getOpenAPISchemaComplexity({ current: 0, schema: resolver.getSchemaByRef(zodSchema.ref) });

    // ref result is simple enough that it doesn't need to be assigned to a variable
    if (complexity < COMPLEXITY_THRESHOLD) {
      return ctx.getZodSchemaByName(result)!;
    }

    return result;
  }

  throw new Error("Invalid ref: " + zodSchema.ref);
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
