import { OpenAPIV3 } from "openapi-types";
import { RESERVED_WORDS } from "src/generators/const/js.const";
import { ALLOWED_METHODS } from "src/generators/const/openapi.const";
import { OperationObject } from "src/generators/types/openapi";
import { GenerateOptions } from "src/generators/types/options";
import { invalidVariableNameCharactersToCamel } from "./js.utils";
import { pick } from "./object.utils";
import { isPathExcluded, pathToVariableName } from "./openapi.utils";
import { capitalize, removeWord } from "./string.utils";
import { getOperationTag, isTagExcluded } from "./tag.utils";

export function isOperationExcluded(operation: OperationObject, options: GenerateOptions) {
  const isDeprecated = operation.deprecated && !options.withDeprecatedEndpoints;
  const tag = getOperationTag(operation, options);
  const isExcluded = isTagExcluded(tag, options);
  return isDeprecated || isExcluded;
}

export function getOperationName({
  path,
  method,
  operation,
  options,
  tag,
  keepOperationTag,
  keepOperationPrefix,
}: {
  path: string;
  method: string;
  operation: OperationObject;
  options: GenerateOptions;
  tag: string;
  keepOperationTag?: boolean;
  keepOperationPrefix?: boolean;
}) {
  const pathOperationName = `${method}${pathToVariableName(path)}`;
  let operationName = operation.operationId
    ? invalidVariableNameCharactersToCamel(operation.operationId)
    : pathOperationName;

  if (options.removeOperationPrefixEndingWith && keepOperationPrefix) {
    const splits = operationName.split(options.removeOperationPrefixEndingWith);
    operationName = splits.map((split, index) => (index === 0 ? split : capitalize(split))).join("");
  } else if (options.removeOperationPrefixEndingWith && !keepOperationPrefix) {
    const regex = new RegExp(`^.*${options.removeOperationPrefixEndingWith}`);
    operationName = operationName.replace(regex, "");
  }

  if (options.tsNamespaces && !keepOperationTag) {
    const operationNameWithoutTag = removeWord(operationName, tag);
    if (operationNameWithoutTag === "") {
      operationName = method.toLowerCase();
    } else if (!RESERVED_WORDS.includes(operationNameWithoutTag)) {
      operationName = operationNameWithoutTag;
    }
  }

  return RESERVED_WORDS.includes(operationName) ? pathOperationName : operationName;
}

export function getUniqueOperationName({
  operationsByTag,
  ...params
}: {
  path: string;
  method: string;
  operation: OperationObject;
  operationsByTag: Record<string, OperationObject[]>;
  options: GenerateOptions;
}) {
  const { operation, options } = params;
  const tag = options.splitByTags ? getOperationTag(operation, options) : options.defaultTag;

  const operationName = (keepOperationTag?: boolean) => {
    const name = getOperationName({ ...params, tag, keepOperationTag });
    const operationsWithName = operationsByTag[tag].filter(
      (operation) => getOperationName({ ...params, operation, tag, keepOperationTag }) === name,
    );
    if (operationsWithName.length === 1) {
      return name;
    }
  };

  return (
    operationName() ??
    operationName(true) ??
    getOperationName({ ...params, tag, keepOperationTag: true, keepOperationPrefix: true })
  );
}

export function getUniqueOperationNamesWithoutSplitByTags(
  openApiDoc: OpenAPIV3.Document,
  operationsByTag: Record<string, OperationObject[]>,
  options: GenerateOptions,
) {
  const operationNames: string[] = [];
  for (const path in openApiDoc.paths) {
    if (isPathExcluded(path, options)) {
      continue;
    }

    const pathItemObj = openApiDoc.paths[path] as OpenAPIV3.PathItemObject;
    const pathItem = pick(pathItemObj, ALLOWED_METHODS);

    for (const method in pathItem) {
      const operation = pathItem[method as keyof typeof pathItem] as OperationObject | undefined;
      if (!operation || isOperationExcluded(operation, options)) {
        continue;
      }

      const operationName = getUniqueOperationName({ path, method, operation, operationsByTag, options });
      operationNames.push(operationName);
    }
  }
  return operationNames;
}

export function getOperationsByTag(openApiDoc: OpenAPIV3.Document, options: GenerateOptions) {
  const operationsByTag: Record<string, OperationObject[]> = {};
  for (const path in openApiDoc.paths) {
    if (isPathExcluded(path, options)) {
      continue;
    }

    const pathItemObj = openApiDoc.paths[path] as OpenAPIV3.PathItemObject;
    const pathItem = pick(pathItemObj, ALLOWED_METHODS);

    for (const method in pathItem) {
      const operation = pathItem[method as keyof typeof pathItem] as OperationObject | undefined;
      if (!operation || isOperationExcluded(operation, options)) {
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
