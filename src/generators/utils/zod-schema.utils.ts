import { normalizeString } from "./openapi.utils";
import { capitalize, removeSuffix, snakeToCamel, suffixIfNeeded } from "./string.utils";

const BODY_SUFFIX = "Body";
const PARAM_SUFFIX = "Param";
const RESPONSE_SUFFIX = "Response";
const ERROR_RESPONSE_SUFFIX = "ErrorResponse";

export const VOID_SCHEMA = "z.void()";

export const getZodSchemaName = (name: string, schemaSuffix: string) =>
  suffixIfNeeded(capitalize(normalizeString(name)), schemaSuffix);

export const isNamedZodSchema = (schema: string) => !schema.startsWith("z.");

export const getBodyZodSchemaName = (operationName: string) => snakeToCamel(`${operationName}_${BODY_SUFFIX}`);

export const getParamZodSchemaName = (operationName: string, paramName: string) =>
  snakeToCamel(`${operationName}_${paramName}${PARAM_SUFFIX}`);

export const getMainResponseZodSchemaName = (operationName: string) =>
  snakeToCamel(`${operationName}${RESPONSE_SUFFIX}`);

export const getErrorResponseZodSchemaName = (operationName: string, statusCode: string) =>
  snakeToCamel(`${operationName}_${statusCode}_${ERROR_RESPONSE_SUFFIX}`);

export const getZodSchemaInferedTypeName = (zodSchemaName: string, suffix: string) =>
  removeSuffix(zodSchemaName, suffix);
