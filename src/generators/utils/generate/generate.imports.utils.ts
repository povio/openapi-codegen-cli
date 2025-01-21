import { DATA_FILE_PATH, DATA_TS_PATH } from "src/generators/const/template.const";
import { SchemaResolver } from "src/generators/core/SchemaResolver.class";
import { Endpoint } from "../../types/endpoint";
import { GenerateType, Import } from "../../types/generate";
import { GenerateOptions } from "../../types/options";
import { getEndpointName, getEndpointTag } from "./generate.endpoints.utils";
import { getNamespaceName, getTagFileName } from "./generate.utils";
import { getZodSchemaInferedTypeName } from "./generate.zod.utils";

export function getModelsImports({
  resolver,
  tag,
  zodSchemas = [],
  zodSchemasAsTypes = [],
  options,
}: {
  resolver: SchemaResolver;
  tag: string;
  zodSchemas?: string[];
  zodSchemasAsTypes?: string[];
  options: GenerateOptions;
}) {
  const type = GenerateType.Models;
  const getTag = (zodSchemaName: string) => resolver.getTagByZodSchemaName(zodSchemaName);

  const zodSchemaImports = getImports({
    type,
    tag,
    entities: zodSchemas,
    getTag,
    getEntityName: (zodSchema) => zodSchema,
    options,
  });

  const zodSchemaTypeImports = getImports({
    type,
    tag,
    entities: zodSchemasAsTypes,
    getTag,
    getEntityName: (zodSchema) => getZodSchemaInferedTypeName(zodSchema, options),
    options,
  });

  return mergeImports(options, zodSchemaImports, zodSchemaTypeImports);
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

export function getImportPath(options: Pick<GenerateOptions, "output" | "importPath">) {
  let importPath = DATA_TS_PATH;
  const regex = new RegExp(`^${DATA_FILE_PATH}`, "g");
  if (options.importPath === "relative") {
    importPath = "../";
  } else if (options.importPath === "absolute") {
    importPath = options.output;
  } else if (regex.test(options.output)) {
    importPath = options.output.replace(regex, DATA_TS_PATH);
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
        bindings: [options.includeNamespaces ? getNamespaceName({ type, tag, options }) : getEntityName(entity)],
        from: `${sameTagDir ? "./" : getImportPath(options)}${getTagFileName({ type, tag, includeTagDir: !sameTagDir, options })}`,
      });
    } else if (!options.includeNamespaces) {
      imports.get(tag)!.bindings.push(getEntityName(entity));
    }
  });
  return Array.from(imports.values());
}

function mergeImports(options: GenerateOptions, ...importArrs: Import[][]): Import[] {
  const merged = new Map<string, Import>();
  importArrs.forEach((imports) => {
    imports.forEach((importItem) => {
      if (!merged.has(importItem.from)) {
        merged.set(importItem.from, importItem);
      } else if (!options.includeNamespaces) {
        merged.get(importItem.from)!.bindings.push(...importItem.bindings);
      }
    });
  });
  return Array.from(merged.values());
}
