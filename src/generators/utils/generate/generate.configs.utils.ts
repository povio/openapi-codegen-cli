import { OpenAPIV3 } from "openapi-types";
import { BUILD_CONFIG_SUFFIX } from "src/generators/const/buildConfigs.const";
import { JSON_APPLICATION_FORMAT } from "src/generators/const/endpoints.const";
import { ANY_SCHEMA } from "src/generators/const/zod.const";
import { SchemaResolver } from "src/generators/core/SchemaResolver.class";
import { BuilderConfig } from "src/generators/types/builder-config";
import { Endpoint, EndpointParameter, ExtendedEndpoint } from "src/generators/types/endpoint";
import { GenerateTypeParams } from "src/generators/types/generate";
import { GenerateOptions } from "src/generators/types/options";
import {
  getPathSegments,
  isBulkDeleteEndpoint,
  isCreateEndpoint,
  isDeleteEndpoint,
  isPathSegmentParam,
  isReadAllEndpoint,
  isReadEndpoint,
  isUpdateEndpoint,
} from "src/generators/utils/endpoint.utils";
import { isReferenceObject } from "src/generators/utils/openapi-schema.utils";
import { isSortingParameterObject } from "src/generators/utils/openapi.utils";
import { camelToSpaceSeparated, capitalize, kebabToCamel } from "src/generators/utils/string.utils";
import { isNamedZodSchema } from "src/generators/utils/zod-schema.utils";

import { getImportedAbilityFunctionName } from "./generate.acl.utils";
import { getEndpointBody } from "./generate.endpoints.utils";
import {
  getAclImports,
  getInfiniteQueriesImports,
  getModelsImports,
  getQueriesImports,
  mergeImports,
} from "./generate.imports.utils";
import { getImportedInfiniteQueryName, getImportedQueryName } from "./generate.query.utils";
import { getImportedZodSchemaName } from "./generate.zod.utils";

export function getBuilderConfigs({ data, tag, resolver }: GenerateTypeParams) {
  const endpoints = data.get(tag)?.endpoints;
  if (!endpoints || endpoints.length === 0) {
    return { configs: [] };
  }

  const extendedEndpoints: ExtendedEndpoint[] = endpoints.map((endpoint) => ({
    ...endpoint,
    pathSegments: getPathSegments(endpoint.path),
  }));
  const readAllEndpoints = extendedEndpoints.filter((endpoint) => isReadAllEndpoint(endpoint, resolver.options));
  const namedReadAllEndpoints = resolveBuilderConfigNames(readAllEndpoints);

  let hasZodImport = false;
  const importedZodSchemas: string[] = [];
  const importedEndpoints: Endpoint[] = [];
  const importedInfiniteEndpoints: Endpoint[] = [];

  const configs = Object.entries(namedReadAllEndpoints).map(([name, readAllEndpoint]) => {
    // Read all config
    const columnsConfig = getColumnsConfig(resolver, readAllEndpoint);
    if (!columnsConfig) {
      return;
    }

    importedEndpoints.push(readAllEndpoint);
    importedInfiniteEndpoints.push(readAllEndpoint);

    if (columnsConfig.zodSchema) {
      if (isNamedZodSchema(columnsConfig.zodSchema)) {
        importedZodSchemas.push(columnsConfig.zodSchema);
      } else {
        hasZodImport = true;
      }
    }
    if (columnsConfig.sortableEnumSchemaName) {
      importedZodSchemas.push(columnsConfig.sortableEnumSchemaName);
    }

    const filter = readAllEndpoint.parameters.find((param) => param.name === resolver.options.filterParamName);
    if (filter) {
      importedZodSchemas.push(filter.zodSchema);
    }

    const config: BuilderConfig = {
      name,
      title: capitalize(camelToSpaceSeparated(name.replace(/config$/i, ""))),
      readAll: {
        acl: getAclConfig(readAllEndpoint, resolver.options),
        paginated: getImportedQueryName(readAllEndpoint, resolver.options),
        infinite: resolver.options.infiniteQueries
          ? getImportedInfiniteQueryName(readAllEndpoint, resolver.options)
          : undefined,
        filters: getInputsConfig(resolver, filter),
        columns: columnsConfig.columns,
      },
    };

    // Read config
    const readEndpoint = extendedEndpoints.find((endpoint) => isReadEndpoint(endpoint, readAllEndpoint));
    if (readEndpoint) {
      importedEndpoints.push(readEndpoint);

      let responseSchema = readEndpoint.response;
      if (isNamedZodSchema(responseSchema)) {
        importedZodSchemas.push(responseSchema);
        responseSchema = getImportedZodSchemaName(resolver, responseSchema);
      } else {
        hasZodImport = true;
      }

      config.read = {
        acl: getAclConfig(readEndpoint, resolver.options),
        schema: responseSchema,
        query: getImportedQueryName(readEndpoint, resolver.options),
      };
    }

    // Create config
    const createEndpoint = extendedEndpoints.find((endpoint) => isCreateEndpoint(endpoint, readAllEndpoint));
    if (createEndpoint) {
      importedEndpoints.push(createEndpoint);

      const body = getEndpointBody(createEndpoint);
      if (body) {
        importedZodSchemas.push(body.zodSchema);
      }

      config.create = {
        acl: getAclConfig(createEndpoint, resolver.options),
        mutation: getImportedQueryName(createEndpoint, resolver.options),
        inputDefs: getInputsConfig(resolver, body),
      };
    }

    // Update config
    const updateEndpoint = extendedEndpoints.find((endpoint) => isUpdateEndpoint(endpoint, readAllEndpoint));
    if (updateEndpoint) {
      importedEndpoints.push(updateEndpoint);

      const body = getEndpointBody(updateEndpoint);
      if (body) {
        importedZodSchemas.push(body.zodSchema);
      }

      config.update = {
        acl: getAclConfig(updateEndpoint, resolver.options),
        mutation: getImportedQueryName(updateEndpoint, resolver.options),
        inputDefs: getInputsConfig(resolver, body),
      };
    }

    // Delete config
    const deleteEndpoint = extendedEndpoints.find((endpoint) => isDeleteEndpoint(endpoint, readAllEndpoint));
    if (deleteEndpoint) {
      importedEndpoints.push(deleteEndpoint);

      config.delete = {
        acl: getAclConfig(deleteEndpoint, resolver.options),
        mutation: getImportedQueryName(deleteEndpoint, resolver.options),
      };
    }

    // Bulk delete config
    const bulkDeleteEndpoint = extendedEndpoints.find((endpoint) => isBulkDeleteEndpoint(endpoint, readAllEndpoint));
    if (bulkDeleteEndpoint) {
      importedEndpoints.push(bulkDeleteEndpoint);

      const body = getEndpointBody(bulkDeleteEndpoint);
      if (body) {
        importedZodSchemas.push(body.zodSchema);
      }

      config.bulkDelete = {
        acl: getAclConfig(bulkDeleteEndpoint, resolver.options),
        mutation: getImportedQueryName(bulkDeleteEndpoint, resolver.options),
        inputDefs: getInputsConfig(resolver, body),
      };
    }

    return config;
  });

  const modelsImports = getModelsImports({ resolver, tag, zodSchemas: importedZodSchemas });
  const queriesImports = getQueriesImports({ tag, endpoints: importedEndpoints, options: resolver.options });
  const infiniteQueriesImports = resolver.options.infiniteQueries
    ? getInfiniteQueriesImports({
        tag,
        endpoints: importedInfiniteEndpoints,
        options: resolver.options,
      })
    : [];
  const aclImports = getAclImports({
    tag,
    endpoints: importedEndpoints.filter((endpoint) => endpoint.acl),
    options: resolver.options,
  });

  return {
    configs: configs.filter(Boolean) as BuilderConfig[],
    hasZodImport,
    modelsImports,
    queriesImports: mergeImports(resolver.options, queriesImports, infiniteQueriesImports),
    aclImports,
  };
}

function resolveBuilderConfigNames(endpoints: ExtendedEndpoint[]): Record<string, ExtendedEndpoint> {
  const sortedEndpoints = endpoints
    .map((endpoint) => ({
      ...endpoint,
      namePathSegments: endpoint.pathSegments.filter((segment) => !isPathSegmentParam(segment)),
    }))
    .sort((a, b) => a.namePathSegments.length - b.namePathSegments.length);

  const namedEndpoints: Record<string, ExtendedEndpoint> = {};
  for (const endpoint of sortedEndpoints) {
    const namePathSegments = endpoint.namePathSegments;

    let name =
      namePathSegments.length > 0
        ? `${kebabToCamel(namePathSegments.pop()!)}${capitalize(BUILD_CONFIG_SUFFIX)}`
        : BUILD_CONFIG_SUFFIX;
    while (namedEndpoints[name]) {
      if (namePathSegments.length === 0) {
        throw new Error(`Can't uniquely resolve builder config name: ${name}`);
      }
      name = `${kebabToCamel(namePathSegments.pop()!)}${capitalize(name)}`;
    }
    namedEndpoints[name] = endpoint;
  }

  return namedEndpoints;
}

function getAclConfig(endpoint: Endpoint, options: GenerateOptions) {
  return options.acl && endpoint.acl ? getImportedAbilityFunctionName(endpoint, options) : undefined;
}

function getInputsConfig(resolver: SchemaResolver, endpointParameter?: EndpointParameter) {
  if (!endpointParameter) {
    return;
  }

  let schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject | undefined;
  if (endpointParameter.type === "Body") {
    schema = endpointParameter.bodyObject?.content[JSON_APPLICATION_FORMAT]?.schema;
  } else {
    schema = endpointParameter.parameterObject?.schema;
  }

  if (!schema) {
    return;
  }

  const schemaObj = resolver.resolveObject(schema);
  const inputs = Object.keys(schemaObj?.properties ?? {}).reduce((acc, key) => ({ ...acc, [key]: true }), {});
  return { schema: getImportedZodSchemaName(resolver, endpointParameter.zodSchema), options: { inputs } };
}

function getColumnsConfig(resolver: SchemaResolver, endpoint: Endpoint) {
  const endpointResponse = endpoint.responseObject;
  if (!endpointResponse) {
    return;
  }

  const schema = endpointResponse.content?.[JSON_APPLICATION_FORMAT]?.schema;
  if (!schema) {
    return;
  }

  const properties = getSchemaProperties(resolver, schema);
  const arrayPropertyKeys = Object.keys(properties).filter(
    (key) => resolver.resolveObject(properties[key]).type === "array",
  );
  arrayPropertyKeys.sort((a, b) => {
    const aIndex = resolver.options.dataResponseParamNames.indexOf(a);
    const bIndex = resolver.options.dataResponseParamNames.indexOf(b);
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return a.localeCompare(b);
  });
  const propertyKey = arrayPropertyKeys[0];
  if (!propertyKey) {
    return;
  }

  const dataSchemaObj = resolver.resolveObject(properties[propertyKey]);
  if (!dataSchemaObj || dataSchemaObj.type !== "array") {
    return;
  }

  const itemSchema = dataSchemaObj.items;
  const itemSchemaObj = resolver.resolveObject(itemSchema);
  if (!itemSchemaObj) {
    return;
  }

  const zodSchema = isReferenceObject(itemSchema) ? resolver.getZodSchemaNameByRef(itemSchema.$ref) : ANY_SCHEMA;
  const columns = Object.keys(itemSchemaObj?.properties ?? {}).reduce((acc, key) => ({ ...acc, [key]: true }), {});

  const sortableEnumSchemaName = endpoint.parameters.find(
    (param) => param.parameterObject && isSortingParameterObject(param.parameterObject),
  )?.parameterSortingEnumSchemaName;

  return {
    columns: {
      schema: getImportedZodSchemaName(resolver, zodSchema),
      options: {
        columns,
        sortable: sortableEnumSchemaName ? getImportedZodSchemaName(resolver, sortableEnumSchemaName) : undefined,
      },
    },
    zodSchema,
    sortableEnumSchemaName,
  };
}

function getSchemaProperties(
  resolver: SchemaResolver,
  schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject,
): { [name: string]: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject } {
  const schemaObj = resolver.resolveObject(schema);
  if (schemaObj.properties) {
    return schemaObj.properties;
  } else if ("allOf" in schemaObj && schemaObj.allOf) {
    return schemaObj.allOf.reduce(
      (acc, cur) => ({ ...acc, ...getSchemaProperties(resolver, cur) }),
      {} as { [name: string]: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject },
    );
  }
  return {};
}
