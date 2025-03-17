import { SchemaResolver } from "src/generators/core/SchemaResolver.class";
import { GenerateType } from "src/generators/types/generate";
import { GenerateOptions } from "src/generators/types/options";
import { removeSuffix } from "../string.utils";
import { isNamedZodSchema } from "../zod-schema.utils";
import { getNamespaceName } from "./generate.utils";
import { VOID_SCHEMA } from "src/generators/const/zod.const";

export const getZodSchemaInferedTypeName = (zodSchemaName: string, options: GenerateOptions) =>
  removeSuffix(zodSchemaName, options.schemaSuffix);

export const getImportedZodSchemaName = (resolver: SchemaResolver, zodSchemaName: string) => {
  if (!isNamedZodSchema(zodSchemaName)) {
    return zodSchemaName;
  }

  const namespacePrefix = resolver.options.includeNamespaces
    ? `${getNamespaceName({ type: GenerateType.Models, tag: resolver.getTagByZodSchemaName(zodSchemaName), options: resolver.options })}.`
    : "";
  return `${namespacePrefix}${zodSchemaName}`;
};

export const getImportedZodSchemaInferedTypeName = (resolver: SchemaResolver, zodSchemaName: string) => {
  if (!isNamedZodSchema(zodSchemaName)) {
    return zodSchemaName === VOID_SCHEMA ? "void" : zodSchemaName;
  }

  const namespacePrefix = resolver.options.includeNamespaces
    ? `${getNamespaceName({ type: GenerateType.Models, tag: resolver.getTagByZodSchemaName(zodSchemaName), options: resolver.options })}.`
    : "";
  return `${namespacePrefix}${getZodSchemaInferedTypeName(zodSchemaName, resolver.options)}`;
};
