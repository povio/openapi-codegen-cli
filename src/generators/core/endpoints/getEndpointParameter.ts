import { OpenAPIV3 } from "openapi-types";
import { ALLOWED_PATH_IN } from "src/generators/const/openapi.const";
import { EndpointParameter } from "src/generators/types/endpoint";
import { GenerateOptions } from "src/generators/types/options";
import {
  isParamMediaTypeAllowed,
  isReferenceObject,
  pathParamToVariableName,
} from "src/generators/utils/openapi.utils";
import { getParamZodSchemaName } from "src/generators/utils/zod-schema.utils";
import { match } from "ts-pattern";
import { SchemaResolver } from "../SchemaResolver.class";
import { getZodChain } from "../zod/getZodChain";
import { getZodSchema } from "../zod/getZodSchema";
import { resolveZodSchemaName } from "../zod/resolveZodSchemaName";

export function getEndpointParameter({
  resolver,
  param,
  operationName,
  tag,
  options,
}: {
  resolver: SchemaResolver;
  param: OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject;
  operationName: string;
  tag: string;
  options: GenerateOptions;
}): EndpointParameter | undefined {
  const paramObj = (
    isReferenceObject(param) ? resolver.getSchemaByRef(param.$ref) : param
  ) as OpenAPIV3.ParameterObject;

  if (!ALLOWED_PATH_IN.includes(paramObj.in)) {
    return;
  }

  let schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject | undefined;
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
  } else {
    schema = isReferenceObject(paramObj.schema) ? resolver.getSchemaByRef(paramObj.schema.$ref) : paramObj.schema;
  }

  if (options?.withDescription && schema) {
    (schema as OpenAPIV3.SchemaObject).description = (paramObj.description ?? "").trim();
  }

  // resolve ref if needed, and fallback to default (unknown) value if needed
  schema = schema ? (isReferenceObject(schema) ? resolver.getSchemaByRef(schema.$ref) : schema)! : {};

  const paramZodSchema = getZodSchema({
    schema,
    resolver,
    meta: { isRequired: paramObj.in === "path" ? true : paramObj.required ?? false },
    tag,
    options,
  });

  const zodSchemaName = resolveZodSchemaName({
    zodSchema: paramZodSchema.assign(
      paramZodSchema.getCodeString(tag, options) + getZodChain({ schema, meta: paramZodSchema.meta, options }),
    ),
    fallbackName: getParamZodSchemaName(operationName, paramObj.name),
    resolver,
    tag,
    options,
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
  };
}
