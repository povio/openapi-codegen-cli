import { ZOD_EXTENDED } from "src/generators/const/deps.const";
import {
  BODY_SCHEMA_SUFFIX,
  ENUM_SCHEMA,
  ERROR_RESPONSE_SCHEMA_SUFFIX,
  PARAM_SCHEMA_SUFFIX,
  RESPONSE_SCHEMA_SUFFIX,
} from "src/generators/const/zod.const";

import { isErrorStatus, isMainResponseStatus, normalizeString } from "./openapi.utils";
import { capitalize, snakeToCamel, suffixIfNeeded } from "./string.utils";

export const getZodSchemaName = (name: string, schemaSuffix: string) =>
  suffixIfNeeded(capitalize(normalizeString(name)), schemaSuffix);

export const getEnumZodSchemaName = (name: string, enumSuffix: string, schemaSuffix: string) =>
  suffixIfNeeded(capitalize(normalizeString(name)), `${enumSuffix}${schemaSuffix}`);

export const isNamedZodSchema = (schema: string) =>
  ["z.", `${ZOD_EXTENDED.namespace}.`].every((searchString) => !schema.startsWith(searchString));

export const isEnumZodSchema = (schema: string) => schema.startsWith(ENUM_SCHEMA);

export const getZodSchemaOperationName = (operationName: string, isUniqueOperationName: boolean, tag: string) =>
  isUniqueOperationName ? operationName : `${tag}_${operationName}`;

export const getBodyZodSchemaName = (operationName: string) => snakeToCamel(`${operationName}_${BODY_SCHEMA_SUFFIX}`);

export const getParamZodSchemaName = (operationName: string, paramName: string) =>
  snakeToCamel(`${operationName}_${paramName}${PARAM_SCHEMA_SUFFIX}`);

export const getMainResponseZodSchemaName = (operationName: string) =>
  snakeToCamel(`${operationName}${RESPONSE_SCHEMA_SUFFIX}`);

export const getErrorResponseZodSchemaName = (operationName: string, statusCode: string) =>
  snakeToCamel(`${operationName}_${statusCode}_${ERROR_RESPONSE_SCHEMA_SUFFIX}`);

export function getResponseZodSchemaName({
  statusCode,
  operationName,
  isUniqueOperationName,
  tag,
}: {
  statusCode: string;
  operationName: string;
  isUniqueOperationName: boolean;
  tag: string;
}): string {
  const status = Number(statusCode);
  const zodSchemaOperationName = getZodSchemaOperationName(operationName, isUniqueOperationName, tag);
  if (!isMainResponseStatus(status) && statusCode !== "default" && isErrorStatus(status)) {
    return getErrorResponseZodSchemaName(zodSchemaOperationName, statusCode);
  }
  return getMainResponseZodSchemaName(zodSchemaOperationName);
}
