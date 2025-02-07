import { OpenAPIV3 } from "openapi-types";
import { ALLOWED_METHODS } from "../const/openapi.const";
import { GenerateOptions } from "../types/options";
import { pick } from "./object.utils";
import { nonWordCharactersToCamel } from "./string.utils";

export function formatTag(tag: string) {
  return nonWordCharactersToCamel(tag);
}

export function getOperationTag(operation: OpenAPIV3.OperationObject, options: GenerateOptions) {
  const tag = operation.tags?.[0];
  return formatTag(tag ?? options.defaultTag);
}

export function getOperationsByTag(openApiDoc: OpenAPIV3.Document, options: GenerateOptions) {
  const operationsByTag: Record<string, OpenAPIV3.OperationObject[]> = {};
  for (const path in openApiDoc.paths) {
    const pathItemObj = openApiDoc.paths[path] as OpenAPIV3.PathItemObject;
    const pathItem = pick(pathItemObj, ALLOWED_METHODS);

    for (const method in pathItem) {
      const operation = pathItem[method as keyof typeof pathItem] as OpenAPIV3.OperationObject | undefined;
      if (!operation || (operation.deprecated && !options?.withDeprecatedEndpoints)) {
        continue;
      }

      const tag = options.splitByTags ? getOperationTag(operation, options) : options.defaultTag;
      if (!operationsByTag[tag]) {
        operationsByTag[tag] = [];
      }
      operationsByTag[tag].push(operation);
    }
  }
  return operationsByTag;
}
