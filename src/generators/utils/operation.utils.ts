import { OpenAPIV3 } from "openapi-types";

import { RESERVED_WORDS } from "@/generators/const/js.const";
import { ALLOWED_METHODS } from "@/generators/const/openapi.const";
import { OperationObject } from "@/generators/types/openapi";
import { GenerateOptions } from "@/generators/types/options";

import { invalidVariableNameCharactersToCamel } from "./js.utils";
import { pick } from "./object.utils";
import { isPathExcluded, pathToVariableName } from "./openapi.utils";
import { capitalize, removeWord } from "./string.utils";
import { getOperationTag, isTagIncluded } from "./tag.utils";

export function isOperationExcluded(operation: OperationObject, options: GenerateOptions) {
  const isDeprecated = operation.deprecated && !options.withDeprecatedEndpoints;
  const tag = getOperationTag(operation, options);
  const isIncluded = isTagIncluded(tag, options);
  return isDeprecated || !isIncluded;
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
  return resolveOperationName({ path, method, operation, options, tag, keepOperationTag, keepOperationPrefix }).name;
}

function resolveOperationName({
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
  const usesPathAsSource = !operation.operationId;
  let pathOperationName: string | undefined;
  let operationName: string;
  if (operation.operationId) {
    operationName = invalidVariableNameCharactersToCamel(operation.operationId);
  } else {
    pathOperationName = `${method}${pathToVariableName(path)}`;
    operationName = pathOperationName;
  }

  if (options.removeOperationPrefixEndingWith && keepOperationPrefix) {
    const splits = operationName.split(options.removeOperationPrefixEndingWith);
    operationName = splits.map((split, index) => (index === 0 ? split : capitalize(split))).join("");
  } else if (options.removeOperationPrefixEndingWith && !keepOperationPrefix) {
    const regex = new RegExp(`^.*${options.removeOperationPrefixEndingWith}`);
    operationName = operationName.replace(regex, "");
  }

  if ((options.tsNamespaces || options.treeShakeableNamespaces) && !keepOperationTag) {
    const operationNameWithoutTag = removeWord(operationName, tag);
    if (operationNameWithoutTag === "") {
      operationName = method.toLowerCase();
    } else if (!RESERVED_WORDS.includes(operationNameWithoutTag)) {
      operationName = operationNameWithoutTag;
    }
  }

  const usesReservedWordFallback = RESERVED_WORDS.includes(operationName);
  if (usesReservedWordFallback && pathOperationName === undefined) {
    pathOperationName = `${method}${pathToVariableName(path)}`;
  }
  return {
    name: usesReservedWordFallback ? pathOperationName! : operationName,
    usesPathAsSource,
    usesReservedWordFallback,
  };
}

type OperationNameIndex = {
  stableCounts: Map<string, number>;
  pathSourceCount: number;
  reservedFallbackCount: number;
};

export type IndexedOperation = {
  path: string;
  method: string;
  operation: OperationObject;
  tag: string;
  pathParameters: OpenAPIV3.PathItemObject["parameters"];
};

function createOperationNameIndex({
  operations,
  options,
  tag,
  keepOperationTag,
}: {
  operations: OperationObject[];
  options: GenerateOptions;
  tag: string;
  keepOperationTag?: boolean;
}): OperationNameIndex {
  const index: OperationNameIndex = { stableCounts: new Map(), pathSourceCount: 0, reservedFallbackCount: 0 };
  for (const operation of operations) {
    if (!operation.operationId) {
      index.pathSourceCount++;
      continue;
    }

    const result = resolveOperationName({
      path: "",
      method: "",
      operation,
      options,
      tag,
      keepOperationTag,
    });
    if (result.usesReservedWordFallback) {
      index.reservedFallbackCount++;
    } else {
      index.stableCounts.set(result.name, (index.stableCounts.get(result.name) ?? 0) + 1);
    }
  }
  return index;
}

export function getUniqueOperationName({
  operationsByTag,
  nameIndexes,
  ...params
}: {
  path: string;
  method: string;
  operation: OperationObject;
  operationsByTag: Record<string, OperationObject[]>;
  options: GenerateOptions;
  nameIndexes?: [OperationNameIndex, OperationNameIndex];
}) {
  const { operation, options } = params;
  const tag = options.splitByTags ? getOperationTag(operation, options) : options.defaultTag;

  const operationName = (keepOperationTag?: boolean, nameIndex?: OperationNameIndex) => {
    const name = getOperationName({ ...params, tag, keepOperationTag });
    if (nameIndex) {
      const pathSourceMatches =
        nameIndex.pathSourceCount > 0 &&
        getOperationName({
          ...params,
          operation: {} as OperationObject,
          tag,
          keepOperationTag,
        }) === name;
      const pathFallbackMatches =
        nameIndex.reservedFallbackCount > 0 && `${params.method}${pathToVariableName(params.path)}` === name;
      const matchingOperations =
        (nameIndex.stableCounts.get(name) ?? 0) +
        (pathSourceMatches ? nameIndex.pathSourceCount : 0) +
        (pathFallbackMatches ? nameIndex.reservedFallbackCount : 0);
      return matchingOperations === 1 ? name : undefined;
    }

    let matchingOperations = 0;
    for (const candidate of operationsByTag[tag]) {
      if (getOperationName({ ...params, operation: candidate, tag, keepOperationTag }) === name) {
        matchingOperations++;
        if (matchingOperations > 1) {
          return;
        }
      }
    }
    if (matchingOperations === 1) {
      return name;
    }
  };

  return (
    operationName(undefined, nameIndexes?.[0]) ??
    operationName(true, nameIndexes?.[1]) ??
    getOperationName({ ...params, tag, keepOperationTag: true, keepOperationPrefix: true })
  );
}

export function getUniqueOperationNamesWithoutSplitByTags(
  openApiDoc: OpenAPIV3.Document,
  operationsByTag: Record<string, OperationObject[]>,
  options: GenerateOptions,
  operationNameByOperation?: WeakMap<OperationObject, string>,
) {
  const indexedOperations: IndexedOperation[] = [];
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
      indexedOperations.push({
        path,
        method,
        operation,
        tag: options.splitByTags ? getOperationTag(operation, options) : options.defaultTag,
        pathParameters: pathItemObj.parameters,
      });
    }
  }
  return getUniqueOperationNamesFromIndex(indexedOperations, operationsByTag, options, operationNameByOperation);
}

function getUniqueOperationNamesFromIndex(
  indexedOperations: IndexedOperation[],
  operationsByTag: Record<string, OperationObject[]>,
  options: GenerateOptions,
  operationNameByOperation?: WeakMap<OperationObject, string>,
) {
  const operationNames: string[] = [];
  const nameIndexesByTag = new Map<string, [OperationNameIndex, OperationNameIndex]>();
  for (const { path, method, operation, tag } of indexedOperations) {
    let nameIndexes = nameIndexesByTag.get(tag);
    if (!nameIndexes) {
      const operations = operationsByTag[tag];
      nameIndexes = [
        createOperationNameIndex({ operations, options, tag }),
        createOperationNameIndex({ operations, options, tag, keepOperationTag: true }),
      ];
      nameIndexesByTag.set(tag, nameIndexes);
    }
    const operationName = getUniqueOperationName({
      path,
      method,
      operation,
      operationsByTag,
      options,
      nameIndexes,
    });
    operationNameByOperation?.set(operation, operationName);
    operationNames.push(operationName);
  }
  return operationNames;
}

export function getOperationIndex(openApiDoc: OpenAPIV3.Document, options: GenerateOptions) {
  const operationsByTag: Record<string, OperationObject[]> = {};
  const indexedOperations: IndexedOperation[] = [];
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
      (operationsByTag[tag] ??= []).push(operation);
      indexedOperations.push({ path, method, operation, tag, pathParameters: pathItemObj.parameters });
    }
  }

  const operationNameByOperation = new WeakMap<OperationObject, string>();
  const operationNames = getUniqueOperationNamesFromIndex(
    indexedOperations,
    operationsByTag,
    options,
    operationNameByOperation,
  );
  return { operationsByTag, operationNames, operationNameByOperation, indexedOperations };
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
