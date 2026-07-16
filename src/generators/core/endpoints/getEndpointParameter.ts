import { OpenAPIV3 } from "openapi-types";
import { match } from "ts-pattern";

import { ALLOWED_PATH_IN } from "@/generators/const/openapi.const";
import { SchemaResolver } from "@/generators/core/SchemaResolver.class";
import { getZodChain } from "@/generators/core/zod/getZodChain";
import { getEnumZodSchemaCodeFromEnumNames, getZodSchema } from "@/generators/core/zod/getZodSchema";
import { resolveZodSchemaName } from "@/generators/core/zod/resolveZodSchemaName";
import { EndpointParameter } from "@/generators/types/endpoint";
import { ParameterObject } from "@/generators/types/openapi";
import { isReferenceObject, isSchemaObject } from "@/generators/utils/openapi-schema.utils";
import {
  isParamMediaTypeAllowed,
  getParameterEnumNames,
  isSortingParameterObject,
  pathParamToVariableName,
} from "@/generators/utils/openapi.utils";
import { resolveQueryFilterComponentName } from "@/generators/utils/query-filter-component-names.utils";
import {
  getEnumZodSchemaName,
  getParamZodSchemaName,
  getZodSchemaOperationName,
} from "@/generators/utils/zod-schema.utils";

export function getEndpointParameter({
  resolver,
  param,
  operationName,
  operationId,
  isUniqueOperationName,
  tag,
}: {
  resolver: SchemaResolver;
  param: OpenAPIV3.ReferenceObject | ParameterObject;
  operationName: string;
  operationId?: string;
  isUniqueOperationName: boolean;
  tag: string;
}): EndpointParameter | undefined {
  const paramObj = resolver.resolveObject(param);
  if (!ALLOWED_PATH_IN.includes(paramObj.in)) {
    return;
  }

  let schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject = {};
  if (paramObj.content) {
    const mediaTypes = Object.keys(paramObj.content ?? {});
    const matchingMediaType = mediaTypes.find(isParamMediaTypeAllowed);

    if (!matchingMediaType) {
      throw new Error(`Unsupported media type for param ${paramObj.name}: ${mediaTypes.join(", ")}`);
    }

    const mediaTypeObject = paramObj.content?.[matchingMediaType];
    if (!mediaTypeObject) {
      throw new Error(`No content with media type for param ${paramObj.name}: ${matchingMediaType}`);
    }

    // this fallback is needed to autofix openapi docs that put the $ref in the wrong place
    // (it should be in the mediaTypeObject.schema, not in the mediaTypeObject itself)
    // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#style-values (just above this anchor)
    schema = mediaTypeObject?.schema ?? mediaTypeObject;
  } else if (paramObj.schema) {
    schema = paramObj.schema;
  }

  if (resolver.options.withDescription && schema) {
    (schema as OpenAPIV3.SchemaObject).description = (paramObj.description ?? "").trim();
  }

  const zodSchemaOperationName = getZodSchemaOperationName(operationName, isUniqueOperationName, tag);
  const legacyFilterComponentName =
    paramObj.name === resolver.options.filterParamName &&
    !isReferenceObject(schema) &&
    resolver.options.queryFilterComponentNames
      ? resolveQueryFilterComponentName(operationId, resolver.options.queryFilterComponentNames)
      : undefined;

  const fallbackName =
    legacyFilterComponentName ??
    getParamZodSchemaName(zodSchemaOperationName, paramObj.name);

  let parameterSortingEnumSchemaName: string | undefined = undefined;
  if (isSortingParameterObject(paramObj, schema, resolver)) {
    const enumZodSchemaName = getEnumZodSchemaName(
      fallbackName,
      resolver.options.enumSuffix,
      resolver.options.schemaSuffix,
    );
    const enumNames = getParameterEnumNames(paramObj, schema);
    const code = getEnumZodSchemaCodeFromEnumNames(enumNames ?? []);
    resolver.setZodSchema(enumZodSchemaName, code, tag);
    parameterSortingEnumSchemaName = enumZodSchemaName;
  }

  const zodSchema = getZodSchema({
    schema,
    resolver,
    meta: { isRequired: paramObj.in === "path" ? true : (paramObj.required ?? false) },
    tag,
  });

  const schemaObject = resolver.resolveObject(schema);

  /**
   * Optional query/header object params (e.g. deepObject `filter`): OpenAPI marks the param
   * `required: false`, so getZodChain would append `.optional()` to the named schema. The
   * endpoints template already wraps named optional params with `.optional()` in
   * `ZodExtended.parse`, which duplicates optionality and breaks consumers that expect a bare
   * object schema (e.g. builder configs). Keep `.nullable()` / defaults / validations; only
   * skip the root presence modifier for object-shaped schemas.
   */
  const rootIsOptionalQueryOrHeaderObject =
    (paramObj.in === "query" || paramObj.in === "header") &&
    !paramObj.required &&
    isSchemaObject(schemaObject) &&
    (schemaObject.type === "object" || (!!schemaObject.properties && Object.keys(schemaObject.properties).length > 0));

  const zodChain = getZodChain({
    schema: schemaObject,
    meta: rootIsOptionalQueryOrHeaderObject ? { ...zodSchema.meta, isRequired: true } : zodSchema.meta,
    options: resolver.options,
  });

  const zodSchemaName = resolveZodSchemaName({
    schema: schemaObject,
    zodSchema: zodSchema.assign(zodSchema.getCodeString(tag) + zodChain),
    fallbackName,
    resolver,
    tag,
  });

  return {
    name: match(paramObj.in)
      .with("path", () => pathParamToVariableName(paramObj.name))
      .otherwise(() => paramObj.name),
    type: match(paramObj.in)
      .with("header", () => "Header")
      .with("query", () => "Query")
      .with("path", () => "Path")
      .run() as "Header" | "Query" | "Path",
    zodSchema: zodSchemaName,
    parameterObject: paramObj,
    ...(parameterSortingEnumSchemaName !== undefined ? { parameterSortingEnumSchemaName } : {}),
  };
}
