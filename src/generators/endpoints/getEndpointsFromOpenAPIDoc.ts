import { OpenAPIV3 } from "openapi-types";
import { Endpoint } from "src/generators/types/endpoint";
import { GenerateOptions } from "src/generators/types/options";
import { match } from "ts-pattern";
import { GenerateContext } from "../GenerateContext.class";
import { getOpenAPISchemaComplexity } from "../openapi/getOpenAPISchemaComplexity";
import { SchemaResolver } from "../SchemaResolver.class";
import {
  getOperationAlias,
  isErrorStatus,
  isMainResponseStatus,
  isMediaTypeAllowed,
  replaceHyphenatedPath,
} from "../utils/endpoint.utils";
import { pick } from "../utils/object.utils";
import { isAllowedParamMediaType, isReferenceObject, pathParamToVariableName } from "../utils/openapi.utils";
import {
  getBodyZodSchemaName,
  getErrorResponseZodSchemaName,
  getMainResponseZodSchemaName,
  getParamZodSchemaName,
  getZodSchemaName,
  isNamedZodSchema,
  VOID_SCHEMA,
} from "../utils/zod-schema.utils";
import { getZodChain } from "../zod/getZodChain";
import { getZodSchema } from "../zod/getZodSchema";
import { ZodSchema } from "../zod/ZodSchema.class";

const COMPLEXITY_THRESHOLD = 2;
const ALLOWED_PATH_IN_VALUES = ["query", "header", "path"] as Array<OpenAPIV3.ParameterObject["in"]>;

export function getEndpointsFromOpenAPIDoc({
  resolver,
  openApiDoc,
  options,
}: {
  resolver: SchemaResolver;
  openApiDoc: OpenAPIV3.Document;
  options: GenerateOptions;
}) {
  const ctx = new GenerateContext();
  const endpoints = [];

  const resolveZodSchema = (input: ZodSchema, fallbackName?: string) => {
    const result = input.toString();

    if ((!isNamedZodSchema(result) || input.ref === undefined) && fallbackName) {
      // result is simple enough that it doesn't need to be assigned to a variable
      if (input.complexity < COMPLEXITY_THRESHOLD) {
        return result;
      }

      const safeName = getZodSchemaName(fallbackName, options.schemaSuffix);

      // result is complex and would benefit from being re-used
      let formatedName = safeName;

      // iteratively add suffix number to prevent overwriting
      let reuseCount = 1;
      let zodSchemaNameExists = false;
      while ((zodSchemaNameExists = Boolean(ctx.getZodSchemaByName(formatedName)))) {
        if (zodSchemaNameExists) {
          if (ctx.getSchemaNamesByCode(result)?.includes(formatedName)) {
            return formatedName;
          } else if (ctx.getZodSchemaByName(formatedName) === safeName) {
            return formatedName;
          } else {
            reuseCount += 1;
            formatedName = `${safeName}__${reuseCount}`;
          }
        }
      }

      ctx.setZodSchema(formatedName, result);
      ctx.addSchemaName(result, formatedName);

      return formatedName;
    }

    // result is a reference to another schema
    let schema = ctx.getZodSchemaByName(result);
    if (!schema && input.ref) {
      schema = ctx.getZodSchemaByName(resolver.getZodSchemaNameByRef(input.ref));
    }

    if (input.ref && schema) {
      const complexity = getOpenAPISchemaComplexity({ current: 0, schema: resolver.getSchemaByRef(input.ref) });

      // ref result is simple enough that it doesn't need to be assigned to a variable
      if (complexity < COMPLEXITY_THRESHOLD) {
        return ctx.getZodSchemaByName(result)!;
      }

      return result;
    }

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
      if (!operation) {
        continue;
      }
      if (options?.withDeprecatedEndpoints ? false : operation.deprecated) {
        continue;
      }

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
        requestFormat: "application/json",
        parameters: [],
        errors: [],
        response: "",
      };

      if (operation.requestBody) {
        const requestBody = (
          isReferenceObject(operation.requestBody)
            ? resolver.getSchemaByRef(operation.requestBody.$ref)
            : operation.requestBody
        ) as OpenAPIV3.RequestBodyObject;
        const mediaTypes = Object.keys(requestBody.content ?? {});
        const matchingMediaType = mediaTypes.find(isAllowedParamMediaType);
        if (matchingMediaType) {
          endpoint.requestFormat = matchingMediaType;
        }

        const bodySchema = matchingMediaType && requestBody.content?.[matchingMediaType]?.schema;
        if (bodySchema) {
          const bodyCode = getZodSchema({
            schema: bodySchema,
            resolver,
            ctx,
            meta: { isRequired: requestBody.required ?? true },
            options,
          });

          endpoint.parameters.push({
            name: "body",
            type: "Body",
            description: requestBody.description!,
            schema:
              resolveZodSchema(bodyCode, getBodyZodSchemaName(operationName)) +
              getZodChain({
                schema: isReferenceObject(bodySchema) ? resolver.getSchemaByRef(bodySchema.$ref) : bodySchema,
                meta: bodyCode.meta,
              }),
          });
        }
      }

      for (const param of parameters) {
        const paramItem = (
          isReferenceObject(param) ? resolver.getSchemaByRef(param.$ref) : param
        ) as OpenAPIV3.ParameterObject;
        if (ALLOWED_PATH_IN_VALUES.includes(paramItem.in)) {
          let paramSchema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject | undefined;
          if (paramItem.content) {
            const mediaTypes = Object.keys(paramItem.content ?? {});
            const matchingMediaType = mediaTypes.find(isAllowedParamMediaType);

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
              ? resolver.getSchemaByRef(paramItem.schema.$ref)
              : paramItem.schema;
          }

          if (options?.withDescription && paramSchema) {
            (paramSchema as OpenAPIV3.SchemaObject).description = (paramItem.description ?? "").trim();
          }

          // resolve ref if needed, and fallback to default (unknown) value if needed
          paramSchema = paramSchema
            ? (isReferenceObject(paramSchema) ? resolver.getSchemaByRef(paramSchema.$ref) : paramSchema)!
            : {};

          const paramCode = getZodSchema({
            schema: paramSchema ?? {},
            resolver,
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
            schema: resolveZodSchema(
              paramCode.assign(
                paramCode.toString() + getZodChain({ schema: paramSchema, meta: paramCode.meta, options }),
              ),
              getParamZodSchemaName(operationName, paramItem.name),
            ),
            openApiObject: paramItem,
          });
        }
      }

      for (const statusCode in operation.responses) {
        const responseItem = (
          isReferenceObject(operation.responses[statusCode])
            ? resolver.getSchemaByRef(operation.responses[statusCode].$ref)
            : operation.responses[statusCode]
        ) as OpenAPIV3.ResponseObject;

        const mediaTypes = Object.keys(responseItem.content ?? {});
        const matchingMediaType = mediaTypes.find(isMediaTypeAllowed);
        if (matchingMediaType) {
          endpoint.responseFormat = matchingMediaType;
        }

        const maybeSchema = matchingMediaType ? responseItem.content?.[matchingMediaType]?.schema : null;

        let schemaString = matchingMediaType ? undefined : VOID_SCHEMA;
        let schema: ZodSchema | undefined;

        if (maybeSchema) {
          schema = getZodSchema({ schema: maybeSchema, resolver, ctx, meta: { isRequired: true }, options });
          schemaString =
            (schema.ref
              ? resolveZodSchema(schema)
              : resolveZodSchema(schema, getResponseZodSchemaName(statusCode, endpoint))) +
            getZodChain({
              schema: isReferenceObject(maybeSchema) ? resolver.getSchemaByRef(maybeSchema.$ref) : maybeSchema,
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

      if (!endpoint.response) {
        endpoint.response = VOID_SCHEMA;
      }

      endpoints.push(endpoint);
    }
  }

  return { endpoints, ctx };
}

function getResponseZodSchemaName(statusCode: string, endpoint: Endpoint): string {
  const status = Number(statusCode);
  if ((!isMainResponseStatus(status) || endpoint.response) && statusCode !== "default" && isErrorStatus(status)) {
    return getErrorResponseZodSchemaName(endpoint.alias, statusCode);
  }
  return getMainResponseZodSchemaName(endpoint.alias);
}

function getParametersMap(parameters: NonNullable<OpenAPIV3.PathItemObject["parameters"]>) {
  return Object.fromEntries(
    (parameters ?? []).map((param) => [isReferenceObject(param) ? param.$ref : param.name, param] as const),
  );
}
