import { OpenAPIV3 } from "openapi-types";
import { ALLOWED_PATH_IN } from "src/generators/const/openapi.const";
import { EndpointParameter } from "src/generators/types/endpoint";
import { ParameterObject } from "src/generators/types/openapi";
import {
  isParamMediaTypeAllowed,
  isSortingParameterObject,
  pathParamToVariableName,
} from "src/generators/utils/openapi.utils";
import {
  getEnumZodSchemaName,
  getParamZodSchemaName,
  getZodSchemaOperationName,
} from "src/generators/utils/zod-schema.utils";
import { match } from "ts-pattern";
import { SchemaResolver } from "../SchemaResolver.class";
import { getZodChain } from "../zod/getZodChain";
import { getEnumZodSchemaCodeFromEnumNames, getZodSchema } from "../zod/getZodSchema";
import { resolveZodSchemaName } from "../zod/resolveZodSchemaName";

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

    const mediaTypeObject = paramObj.content[matchingMediaType];
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

  const zodSchema = getZodSchema({
    schema,
    resolver,
    meta: { isRequired: paramObj.in === "path" ? true : paramObj.required ?? false },
    tag,
  });

  const schemaObject = resolver.resolveObject(schema);

  const zodChain = getZodChain({ schema: schemaObject, meta: zodSchema.meta, options: resolver.options });

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
    parameterSortingEnumSchemaName,
  };
}
