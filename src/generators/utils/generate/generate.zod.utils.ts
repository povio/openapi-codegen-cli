import { SchemaResolver } from "src/generators/core/SchemaResolver.class";
import { GenerateType } from "src/generators/types/generate";
import { GenerateOptions } from "src/generators/types/options";
import { removeSuffix } from "../string.utils";
import { isNamedZodSchema } from "../zod-schema.utils";
import { getNamespaceName } from "./generate.utils";

export const getZodSchemaInferedTypeName = (zodSchemaName: string, options: GenerateOptions) =>
  removeSuffix(zodSchemaName, options.schemaSuffix);

export const getImportedZodSchemaName = ({
  resolver,
  zodSchemaName,
  options,
}: {
  resolver: SchemaResolver;
  zodSchemaName: string;
  options: GenerateOptions;
}) => {
  if (!isNamedZodSchema(zodSchemaName)) {
    return zodSchemaName;
  }

  const namespacePrefix = options.includeNamespaces
    ? `${getNamespaceName({ type: GenerateType.Models, tag: resolver.getTagByZodSchemaName(zodSchemaName), options })}.`
    : "";
  return `${namespacePrefix}${zodSchemaName}`;
};

export const getImportedZodSchemaInferedTypeName = ({
  resolver,
  zodSchemaName,
  options,
}: {
  resolver: SchemaResolver;
  zodSchemaName: string;
  options: GenerateOptions;
}) => {
  if (!isNamedZodSchema(zodSchemaName)) {
    return zodSchemaName;
  }

  const namespacePrefix = options.includeNamespaces
    ? `${getNamespaceName({ type: GenerateType.Models, tag: resolver.getTagByZodSchemaName(zodSchemaName), options })}.`
    : "";
  return `${namespacePrefix}${getZodSchemaInferedTypeName(zodSchemaName, options)}`;
};
