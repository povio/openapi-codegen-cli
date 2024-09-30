import { Endpoint } from "../types/endpoint";
import { GenerateData, Import } from "../types/generate";
import { GenerateOptions } from "../types/options";
import { getTagFileName } from "./file.utils";
import { getEndpointName, getEndpointTag } from "./generate.endpoints.utils";
import { getZodSchemaInferedTypeName, getZodSchemaTag } from "./generate.zod.utils";

export function getModelsImports({
  tag,
  data,
  zodSchemas = [],
  zodSchemasAsTypes = [],
  options,
}: {
  tag: string;
  data: GenerateData;
  zodSchemas?: string[];
  zodSchemasAsTypes?: string[];
  options: GenerateOptions;
}) {
  const zodSchemaImports = getImports({
    tag,
    entities: zodSchemas,
    getTag: (zodSchema) => getZodSchemaTag({ data, zodSchema }),
    getEntityName: (zodSchema) => zodSchema,
    options,
  });
  const zodSchemaTypeImports = getImports({
    tag,
    entities: zodSchemasAsTypes,
    getTag: (zodSchema) => getZodSchemaTag({ data, zodSchema }),
    getEntityName: (zodSchema) => getZodSchemaInferedTypeName(zodSchema, options.schemaSuffix),
    options,
  });
  return mergeImports(zodSchemaImports, zodSchemaTypeImports);
}

export function getEndpointsImports({
  data,
  tag,
  endpoints,
  options,
}: {
  tag: string;
  data: GenerateData;
  endpoints: Endpoint[];
  options: GenerateOptions;
}) {
  return getImports({
    tag,
    entities: endpoints,
    entityType: "endpoint",
    getTag: (endpoint) => getEndpointTag({ data, endpoint }),
    getEntityName: getEndpointName,
    options,
  });
}

function getImports<T>({
  tag,
  entityType = "model",
  entities,
  getTag,
  getEntityName,
  options,
}: {
  tag: string;
  entityType?: "model" | "endpoint";
  entities: T[];
  getTag: (entity: T) => string;
  getEntityName: (entity: T) => string;
  options: GenerateOptions;
}) {
  const imports = new Map<string, Import>();
  entities.forEach((entity) => {
    const entityTag = getTag(entity);
    if (!imports.has(entityTag)) {
      const sameDir = tag === entityTag;
      imports.set(entityTag, {
        bindings: [getEntityName(entity)],
        from: `${sameDir ? "./" : "../"}${getTagFileName(entityTag, entityType === "model" ? options.modelsConfig.outputFileNameSuffix : options.endpointsConfig.outputFileNameSuffix, !sameDir)}`,
      });
    } else {
      imports.get(entityTag)!.bindings.push(getEntityName(entity));
    }
  });
  return Array.from(imports.values());
}

function mergeImports(...importArrs: Import[][]): Import[] {
  const merged = new Map<string, Import>();
  importArrs.forEach((imports) => {
    imports.forEach((importItem) => {
      if (!merged.has(importItem.from)) {
        merged.set(importItem.from, importItem);
      } else {
        merged.get(importItem.from)!.bindings.push(...importItem.bindings);
      }
    });
  });
  return Array.from(merged.values());
}
