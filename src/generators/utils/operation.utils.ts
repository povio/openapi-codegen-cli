import { OpenAPIV3 } from "openapi-types";
import { RESERVED_WORDS } from "../const/js.const";
import { ALLOWED_METHODS } from "../const/openapi.const";
import { OperationObject } from "../types/openapi";
import { GenerateOptions } from "../types/options";
import { invalidVariableNameCharactersToCamel } from "./js.utils";
import { pick } from "./object.utils";
import { pathToVariableName } from "./openapi.utils";
import { capitalize, removeWord } from "./string.utils";
import { getOperationTag } from "./tag.utils";

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
    if (!RESERVED_WORDS.includes(operationNameWithoutTag)) {
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
    const pathItemObj = openApiDoc.paths[path] as OpenAPIV3.PathItemObject;
    const pathItem = pick(pathItemObj, ALLOWED_METHODS);

    for (const method in pathItem) {
      const operation = pathItem[method as keyof typeof pathItem] as OperationObject | undefined;
      if (!operation || (operation.deprecated && !options.withDeprecatedEndpoints)) {
        continue;
      }

      const operationName = getUniqueOperationName({ path, method, operation, operationsByTag, options });
      operationNames.push(operationName);
    }
  }
  return operationNames;
}
