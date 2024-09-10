import { OpenAPIV3 } from "openapi-types";
import { GenerateContext, OpenAPISchemaResolver } from "src/generators/types/context";
import { Endpoint } from "src/generators/types/endpoint";
import { EndpointsOptions, ZodSchemasOptions } from "src/generators/types/options";
import { match, P } from "ts-pattern";
import { pick } from "../object.utils";
import { getOpenAPISchemaComplexity } from "../openapi/openapi-schema-complexity.utils";
import { getOpenAPISchemaDependencyGraph } from "../openapi/openapi-schema-dependency-graph.utils";
import {
  asComponentSchema,
  isReferenceObject,
  normalizeString,
  pathParamToVariableName,
} from "../openapi/openapi.utils";
import { getZodChain, getZodSchema } from "../zod/zod-schema-extraction.utils";
import { ZodSchema } from "../zod/zod-schema.class";
import {
  getOperationAlias,
  isErrorStatus,
  isMainResponseStatus,
  isMediaTypeAllowed,
  replaceHyphenatedPath,
} from "./endpoint";

const voidSchema = "z.void()";

export function getEndpointsFromOpenAPIDoc({
  resolver,
  openApiDoc,
  options = {},
}: {
  resolver: OpenAPISchemaResolver;
  openApiDoc: OpenAPIV3.Document;
  options?: ZodSchemasOptions & EndpointsOptions;
}) {
  const dependencyGraph = getOpenAPISchemaDependencyGraph(
    Object.keys(openApiDoc.components?.schemas ?? {}).map((name) => asComponentSchema(name)),
    resolver.getSchemaByRef,
  );

  const endpoints = [];
  const ctx: GenerateContext = { resolver, zodSchemas: {}, schemas: {} };
  const complexityThreshold = options?.complexityThreshold ?? 4;

  const getZodSchemaName = (input: ZodSchema, fallbackName?: string) => {
    const result = input.toString();

    // special value, inline everything (= no variable used)
    if (complexityThreshold === -1) {
      return input.ref ? ctx.zodSchemas[result]! : result;
    }

    if ((result.startsWith("z.") || input.ref === undefined) && fallbackName) {
      // result is simple enough that it doesn't need to be assigned to a variable
      if (input.complexity < complexityThreshold) {
        return result;
      }

      const safeName = normalizeString(fallbackName);

      // result is complex and would benefit from being re-used
      let formatedName = safeName;

      // iteratively add suffix number to prevent overwriting
      let reuseCount = 1;
      let zodSchemaNameExists = false;
      while ((zodSchemaNameExists = Boolean(ctx.zodSchemas[formatedName]))) {
        if (zodSchemaNameExists) {
          if (ctx.schemas?.[result]?.includes(formatedName)) {
            return formatedName;
          } else if (ctx.zodSchemas[formatedName] === safeName) {
            return formatedName;
          } else {
            reuseCount += 1;
            formatedName = `${safeName}__${reuseCount}`;
          }
        }
      }

      ctx.zodSchemas[formatedName] = result;
      ctx.schemas[result] = (ctx.schemas[result] ?? []).concat(formatedName);

      return formatedName;
    }

    // result is a reference to another schema
    let schema = ctx.zodSchemas[result];
    if (!schema && input.ref) {
      const refInfo = ctx.resolver.resolveRef(input.ref);
      schema = ctx.zodSchemas[refInfo.name];
    }

    if (input.ref && schema) {
      const complexity = getOpenAPISchemaComplexity({ current: 0, schema: ctx.resolver.getSchemaByRef(input.ref) });

      // ref result is simple enough that it doesn't need to be assigned to a variable
      if (complexity < complexityThreshold) {
        return ctx.zodSchemas[result]!;
      }

      return result;
    }

    console.log({ ref: input.ref, fallbackName, result });
    throw new Error("Invalid ref: " + input.ref);
  };

  for (const path in openApiDoc.paths) {
    const pathItemObj = openApiDoc.paths[path] as OpenAPIV3.PathItemObject;
    const pathItem = pick(pathItemObj, [
      "get",
      "put",
      "post",
      "delete",
      "options",
      "head",
      "patch",
      "trace",
    ] as OpenAPIV3.HttpMethods[]);
    const parametersMap = getParametersMap(pathItemObj.parameters ?? []);

    for (const method in pathItem) {
      const operation = pathItem[method as keyof typeof pathItem] as OpenAPIV3.OperationObject | undefined;
      if (!operation) continue;
      if (options?.withDeprecatedEndpoints ? false : operation.deprecated) continue;

      const parameters = Object.entries({
        ...parametersMap,
        ...getParametersMap(operation.parameters ?? []),
      }).map(([_id, param]) => param);
      const operationName = getOperationAlias(path, method, operation);
      const endpoint: Endpoint = {
        method: method as OpenAPIV3.HttpMethods,
        path: replaceHyphenatedPath(path),
        alias: operationName,
        description: operation.description,
        requestFormat: "json",
        parameters: [],
        errors: [],
        response: "",
      };

      if (operation.requestBody) {
        const requestBody = (
          isReferenceObject(operation.requestBody)
            ? ctx.resolver.getSchemaByRef(operation.requestBody.$ref)
            : operation.requestBody
        ) as OpenAPIV3.RequestBodyObject;
        const mediaTypes = Object.keys(requestBody.content ?? {});
        const matchingMediaType = mediaTypes.find(isAllowedParamMediaTypes);

        const bodySchema = matchingMediaType && requestBody.content?.[matchingMediaType]?.schema;
        if (bodySchema) {
          endpoint.requestFormat = match(matchingMediaType)
            .with("application/octet-stream", () => "binary" as const)
            .with("application/x-www-form-urlencoded", () => "form-url" as const)
            .with("multipart/form-data", () => "form-data" as const)
            .with(P.string.includes("json"), () => "json" as const)
            .otherwise(() => "text" as const);

          const bodyCode = getZodSchema({
            schema: bodySchema,
            ctx,
            meta: { isRequired: requestBody.required ?? true },
            options,
          });

          endpoint.parameters.push({
            name: "body",
            type: "Body",
            description: requestBody.description!,
            schema:
              getZodSchemaName(bodyCode, operationName + "_Body") +
              getZodChain({
                schema: isReferenceObject(bodySchema) ? ctx.resolver.getSchemaByRef(bodySchema.$ref) : bodySchema,
                meta: bodyCode.meta,
              }),
          });
        }
      }

      for (const param of parameters) {
        const paramItem = (
          isReferenceObject(param) ? ctx.resolver.getSchemaByRef(param.$ref) : param
        ) as OpenAPIV3.ParameterObject;
        if (allowedPathInValues.includes(paramItem.in)) {
          let paramSchema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject | undefined;
          if (paramItem.content) {
            const mediaTypes = Object.keys(paramItem.content ?? {});
            const matchingMediaType = mediaTypes.find(isAllowedParamMediaTypes);

            if (!matchingMediaType) {
              throw new Error(`Unsupported media type for param ${paramItem.name}: ${mediaTypes.join(", ")}`);
            }

            const mediaTypeObject = paramItem.content[matchingMediaType];
            if (!mediaTypeObject) {
              throw new Error(`No content with media type for param ${paramItem.name}: ${matchingMediaType}`);
            }

            // this fallback is needed to autofix openapi docs that put the $ref in the wrong place
            // (it should be in the mediaTypeObject.schema, not in the mediaTypeObject itself)
            // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#style-values (just above this anchor)
            paramSchema = mediaTypeObject?.schema ?? mediaTypeObject;
          } else {
            paramSchema = isReferenceObject(paramItem.schema)
              ? ctx.resolver.getSchemaByRef(paramItem.schema.$ref)
              : paramItem.schema;
          }

          if (options?.withDescription && paramSchema) {
            (paramSchema as OpenAPIV3.SchemaObject).description = (paramItem.description ?? "").trim();
          }

          // resolve ref if needed, and fallback to default (unknown) value if needed
          paramSchema = paramSchema
            ? (isReferenceObject(paramSchema) ? ctx.resolver.getSchemaByRef(paramSchema.$ref) : paramSchema)!
            : {};

          const paramCode = getZodSchema({
            schema: paramSchema ?? {},
            ctx,
            meta: { isRequired: paramItem.in === "path" ? true : paramItem.required ?? false },
            options,
          });

          endpoint.parameters.push({
            name: match(paramItem.in)
              .with("path", () => pathParamToVariableName(paramItem.name))
              .otherwise(() => paramItem.name),
            type: match(paramItem.in)
              .with("header", () => "Header")
              .with("query", () => "Query")
              .with("path", () => "Path")
              .run() as "Header" | "Query" | "Path",
            schema: getZodSchemaName(
              paramCode.assign(
                paramCode.toString() + getZodChain({ schema: paramSchema, meta: paramCode.meta, options }),
              ),
              paramItem.name,
            ),
          });
        }
      }

      for (const statusCode in operation.responses) {
        const responseItem = (
          isReferenceObject(operation.responses[statusCode])
            ? ctx.resolver.getSchemaByRef(operation.responses[statusCode].$ref)
            : operation.responses[statusCode]
        ) as OpenAPIV3.ResponseObject;

        const mediaTypes = Object.keys(responseItem.content ?? {});
        const matchingMediaType = mediaTypes.find(isMediaTypeAllowed);

        const maybeSchema = matchingMediaType ? responseItem.content?.[matchingMediaType]?.schema : null;

        let schemaString = matchingMediaType ? undefined : voidSchema;
        let schema: ZodSchema | undefined;

        if (maybeSchema) {
          schema = getZodSchema({ schema: maybeSchema, ctx, meta: { isRequired: true }, options });
          schemaString =
            (schema.ref ? getZodSchemaName(schema) : schema.toString()) +
            getZodChain({
              schema: isReferenceObject(maybeSchema) ? ctx.resolver.getSchemaByRef(maybeSchema.$ref) : maybeSchema,
              meta: schema.meta,
            });
        }

        if (schemaString) {
          const status = Number(statusCode);

          if (isMainResponseStatus(status) && !endpoint.response) {
            endpoint.response = schemaString;
          } else if (statusCode !== "default" && isErrorStatus(status)) {
            endpoint.errors.push({
              schema: schemaString as any,
              status,
              description: responseItem.description,
            });
          }
        }
      }

      // use `default` as fallback for `response` undeclared responses
      // if no main response has been found, this should be considered it as a fallback
      // else this will be added as an error response
      if (operation.responses?.default) {
        const responseItem = operation.responses.default as OpenAPIV3.ResponseObject;

        const mediaTypes = Object.keys(responseItem.content ?? {});
        const matchingMediaType = mediaTypes.find(isMediaTypeAllowed);

        const maybeSchema = matchingMediaType && responseItem.content?.[matchingMediaType]?.schema;
        let schemaString = matchingMediaType ? undefined : voidSchema;
        let schema: ZodSchema | undefined;

        if (maybeSchema) {
          schema = getZodSchema({ schema: maybeSchema, ctx, meta: { isRequired: true }, options });
          schemaString =
            (schema.ref ? getZodSchemaName(schema) : schema.toString()) +
            getZodChain({
              schema: isReferenceObject(maybeSchema) ? ctx.resolver.getSchemaByRef(maybeSchema.$ref) : maybeSchema,
              meta: schema.meta,
            });
        }
      }

      if (!endpoint.response) {
        endpoint.response = voidSchema;
      }

      endpoints.push(endpoint);
    }
  }

  return {
    dependencyGraph,
    endpoints,
    schemas: ctx.schemas,
    zodSchemas: ctx.zodSchemas,
  };
}

function getParametersMap(parameters: NonNullable<OpenAPIV3.PathItemObject["parameters"]>) {
  return Object.fromEntries(
    (parameters ?? []).map((param) => [isReferenceObject(param) ? param.$ref : param.name, param] as const),
  );
}

const allowedPathInValues = ["query", "header", "path"] as Array<OpenAPIV3.ParameterObject["in"]>;

const allowedParamMediaTypes = [
  "application/octet-stream",
  "multipart/form-data",
  "application/x-www-form-urlencoded",
  "*/*",
] as const;

function isAllowedParamMediaTypes(
  mediaType: string,
): mediaType is (typeof allowedParamMediaTypes)[number] | `application/${string}json${string}` | `text/${string}` {
  return (
    (mediaType.includes("application/") && mediaType.includes("json")) ||
    allowedParamMediaTypes.includes(mediaType as any) ||
    mediaType.includes("text/")
  );
}
