import { OperationObject } from "src/generators/types/openapi";
import { GenerateOptions } from "src/generators/types/options";
import { nonWordCharactersToCamel } from "./string.utils";

export function formatTag(tag: string) {
  return nonWordCharactersToCamel(tag);
}

export function getOperationTag(operation: OperationObject, options: GenerateOptions) {
  const tag = operation.tags?.[0];
  return formatTag(tag ?? options.defaultTag);
}

export function isTagExcluded(tag: string, options: GenerateOptions) {
  return options.excludeTags.some((excludeTag) => excludeTag.toLowerCase() === tag.toLowerCase());
}
