import { OpenAPIV3 } from "openapi-types";
import { match } from "ts-pattern";

import { ALLOWED_PATH_IN } from "@/generators/const/openapi.const";
import { SchemaResolver } from "@/generators/core/SchemaResolver.class";
import { getEnumZodSchemaCodeFromEnumNames } from "@/generators/core/zod/getZodSchema";
import { EndpointParameter } from "@/generators/types/endpoint";
import { ParameterObject } from "@/generators/types/openapi";
import {
  isParamMediaTypeAllowed,
  isSortingParameterObject,
  pathParamToVariableName,
} from "@/generators/utils/openapi.utils";
import {
  getEnumZodSchemaName,
  getParamZodSchemaName,
  getZodSchemaOperationName,
} from "@/generators/utils/zod-schema.utils";
import { resolveEndpointZodSchema } from "./resolveEndpointZodSchema";

export function getEndpointParameter({
  resolver,
  param,
  operationName,
  isUniqueOperationName,
  tag,
}: {
  resolver: SchemaResolver;
  param: OpenAPIV3.ReferenceObject | ParameterObject;
  operationName: string;
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

  const fallbackName = getParamZodSchemaName(
    getZodSchemaOperationName(operationName, isUniqueOperationName, tag),
    paramObj.name,
  );

  let parameterSortingEnumSchemaName: string | undefined = undefined;
  if (isSortingParameterObject(paramObj)) {
    const enumZodSchemaName = getEnumZodSchemaName(
      fallbackName,
      resolver.options.enumSuffix,
      resolver.options.schemaSuffix,
    );
    const code = getEnumZodSchemaCodeFromEnumNames(paramObj["x-enumNames"]);
    resolver.setZodSchema(enumZodSchemaName, code, tag);
    parameterSortingEnumSchemaName = enumZodSchemaName;
  }

  const zodSchemaName = resolveEndpointZodSchema({
    resolver,
    schema,
    meta: { isRequired: paramObj.in === "path" ? true : (paramObj.required ?? false) },
    tag,
    fallbackName,
    composeBeforeResolve: true,
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
    parameterSortingEnumSchemaName,
  };
}
