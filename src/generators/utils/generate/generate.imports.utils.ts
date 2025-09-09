import { TEMPLATE_DATA_FILE_PATH } from "src/generators/const/deps.const";
import { SchemaResolver } from "src/generators/core/SchemaResolver.class";
import { Endpoint } from "src/generators/types/endpoint";
import { GenerateType, Import } from "src/generators/types/generate";
import { GenerateOptions } from "src/generators/types/options";
import { getUniqueArray } from "src/generators/utils/array.utils";
import { getNamespaceName } from "src/generators/utils/namespace.utils";
import { getEndpointTag } from "src/generators/utils/tag.utils";
import { getAbilityFunctionName } from "./generate.acl.utils";
import { getEndpointName } from "./generate.endpoints.utils";
import { getInfiniteQueryName, getQueryName } from "./generate.query.utils";
import { getTagImportPath } from "./generate.utils";
import { getZodSchemaInferedTypeName } from "./generate.zod.utils";

export function getModelsImports({
  resolver,
  tag,
  zodSchemas = [],
  zodSchemasAsTypes = [],
}: {
  resolver: SchemaResolver;
  tag: string;
  zodSchemas?: string[];
  zodSchemasAsTypes?: string[];
}) {
  const type = GenerateType.Models;
  const getTag = (zodSchemaName: string) => resolver.getTagByZodSchemaName(zodSchemaName);

  const zodSchemaImports = getImports({
    type,
    tag,
    entities: zodSchemas,
    getTag,
    getEntityName: (zodSchema) => zodSchema,
    options: resolver.options,
  });

  const zodSchemaTypeImports = getImports({
    type,
    tag,
    entities: zodSchemasAsTypes,
    getTag,
    getEntityName: (zodSchema) => getZodSchemaInferedTypeName(zodSchema, resolver.options),
    options: resolver.options,
  });

  return mergeImports(resolver.options, zodSchemaImports, zodSchemaTypeImports);
}

export function getEndpointsImports({
  tag,
  endpoints,
  options,
}: {
  tag: string;
  endpoints: Endpoint[];
  options: GenerateOptions;
}) {
  return getImports({
    type: GenerateType.Endpoints,
    tag,
    entities: endpoints,
    getTag: (endpoint) => getEndpointTag(endpoint, options),
    getEntityName: getEndpointName,
    options,
  });
}

export function getQueriesImports({
  tag,
  endpoints,
  options,
}: {
  tag: string;
  endpoints: Endpoint[];
  options: GenerateOptions;
}) {
  return getImports({
    type: GenerateType.Queries,
    tag,
    entities: endpoints,
    getTag: (endpoint) => getEndpointTag(endpoint, options),
    getEntityName: getQueryName,
    options,
  });
}

export function getInfiniteQueriesImports({
  tag,
  endpoints,
  options,
}: {
  tag: string;
  endpoints: Endpoint[];
  options: GenerateOptions;
}) {
  return getImports({
    type: GenerateType.Queries,
    tag,
    entities: endpoints,
    getTag: (endpoint) => getEndpointTag(endpoint, options),
    getEntityName: getInfiniteQueryName,
    options,
  });
}

export function getAclImports({
  tag,
  endpoints,
  options,
}: {
  tag: string;
  endpoints: Endpoint[];
  options: GenerateOptions;
}) {
  return getImports({
    type: GenerateType.Acl,
    tag,
    entities: endpoints,
    getTag: (endpoint) => getEndpointTag(endpoint, options),
    getEntityName: getAbilityFunctionName,
    options,
  });
}

export function getEntityImports({
  tags,
  entityName,
  getAliasEntityName,
  type,
  options,
}: {
  tags: string[];
  entityName: string;
  getAliasEntityName?: (tag: string) => string;
  type: GenerateType;
  options: GenerateOptions;
}) {
  const imports = new Map<string, Import>();
  tags.forEach((tag) => {
    const name = `${entityName}${getAliasEntityName ? ` as ${getAliasEntityName(tag)}` : ""}`;
    if (!imports.has(tag)) {
      imports.set(tag, {
        bindings: [options.tsNamespaces ? getNamespaceName({ type, tag, options }) : name],
        from: `${getImportPath(options)}${getTagImportPath({ type, tag, includeTagDir: true, options })}`,
      });
    } else if (!options.tsNamespaces) {
      imports.get(tag)!.bindings.push(name);
    }
  });
  return Array.from(imports.values());
}

export function getImportPath(options: Pick<GenerateOptions, "output" | "importPath" | "tsPath">) {
  let importPath = options.tsPath;
  if (options.importPath === "relative") {
    importPath = "../";
  } else if (options.importPath === "absolute") {
    importPath = options.output;
  } else if (new RegExp(`${TEMPLATE_DATA_FILE_PATH}`, "g").test(options.output)) {
    importPath = options.output.replace(new RegExp(`.*${TEMPLATE_DATA_FILE_PATH}`, "g"), options.tsPath);
  }
  return `${importPath}/`.replace(/\/\//g, "/");
}

function getImports<T>({
  type = GenerateType.Models,
  tag: currentTag,
  entities,
  getTag,
  getEntityName,
  options,
}: {
  type: GenerateType;
  tag: string;
  entities: T[];
  getTag: (entity: T) => string;
  getEntityName: (entity: T) => string;
  options: GenerateOptions;
}) {
  const imports = new Map<string, Import>();
  entities.forEach((entity) => {
    const tag = getTag(entity);
    if (!imports.has(tag)) {
      const sameTagDir = currentTag === tag;
      imports.set(tag, {
        bindings: [options.tsNamespaces ? getNamespaceName({ type, tag, options }) : getEntityName(entity)],
        from: `${sameTagDir ? "./" : getImportPath(options)}${getTagImportPath({ type, tag, includeTagDir: !sameTagDir, options })}`,
      });
    } else if (!options.tsNamespaces) {
      imports.get(tag)!.bindings.push(getEntityName(entity));
    }
  });
  return Array.from(imports.values());
}

export function mergeImports(options: GenerateOptions, ...importArrs: Import[][]): Import[] {
  const merged = new Map<string, Import>();
  importArrs.forEach((imports) => {
    imports.forEach((importItem) => {
      if (!merged.has(importItem.from)) {
        merged.set(importItem.from, importItem);
      } else if (!options.tsNamespaces) {
        merged.get(importItem.from)!.bindings.push(...importItem.bindings);
      }
    });
  });
  return Array.from(merged.values()).map((importItem) => ({
    ...importItem,
    bindings: getUniqueArray(importItem.bindings),
  }));
}
