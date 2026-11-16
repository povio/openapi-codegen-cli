import { OpenAPIV3 } from "openapi-types";

import { AXIOS_REQUEST_CONFIG_NAME, BODY_PARAMETER_NAME, DEFAULT_HEADERS } from "@/generators/const/endpoints.const";
import { SchemaResolver } from "@/generators/core/SchemaResolver.class";
import { Endpoint, EndpointParameter } from "@/generators/types/endpoint";
import { GenerateType } from "@/generators/types/generate";
import { GenerateOptions } from "@/generators/types/options";
import { invalidVariableNameCharactersToCamel, isValidPropertyName } from "@/generators/utils/js.utils";
import { isEndpointParameterRequired } from "@/generators/utils/endpoint.utils";
import { getNamespaceName } from "@/generators/utils/namespace.utils";
import { isSchemaObject } from "@/generators/utils/openapi-schema.utils";
import { isQuery } from "@/generators/utils/query.utils";
import { decapitalize, snakeToCamel } from "@/generators/utils/string.utils";
import { getEndpointTag } from "@/generators/utils/tag.utils";
import { isNamedZodSchema } from "@/generators/utils/zod-schema.utils";

import { getImportedZodSchemaInferedTypeName } from "./generate.zod.utils";

const endpointNameCache = new WeakMap<Endpoint, string>();
const endpointPathCache = new WeakMap<Endpoint, string>();
const endpointBodyCache = new WeakMap<Endpoint, ReturnType<typeof findEndpointBody>>();
const endpointConfigCache = new WeakMap<Endpoint, ReturnType<typeof createEndpointConfig>>();

export const getEndpointName = (endpoint: Endpoint) => {
  let name = endpointNameCache.get(endpoint);
  if (name === undefined) {
    name = decapitalize(snakeToCamel(endpoint.operationName));
    endpointNameCache.set(endpoint, name);
  }
  return name;
};

export function getImportedEndpointName(endpoint: Endpoint, options: GenerateOptions) {
  const namespacePrefix = options.tsNamespaces
    ? `${getNamespaceName({ type: GenerateType.Endpoints, tag: getEndpointTag(endpoint, options), options })}.`
    : "";
  return `${namespacePrefix}${getEndpointName(endpoint)}`;
}

export const requiresBody = (endpoint: Endpoint) => endpoint.method !== OpenAPIV3.HttpMethods.GET;

const findEndpointBody = (endpoint: Endpoint) => endpoint.parameters.find((param) => param.type === "Body");

export const getEndpointBody = (endpoint: Endpoint) => {
  if (!endpointBodyCache.has(endpoint)) {
    endpointBodyCache.set(endpoint, findEndpointBody(endpoint));
  }
  return endpointBodyCache.get(endpoint);
};

export const hasEndpointConfig = (endpoint: Endpoint, resolver: SchemaResolver) => {
  const endpointConfig = getEndpointConfig(endpoint);
  const hasAxiosRequestConfig = resolver.options.axiosRequestConfig;
  const needsBlobConfig = endpoint.mediaDownload || endpoint.response === "z.instanceof(Blob)";
  return Object.keys(endpointConfig).length > 0 || hasAxiosRequestConfig || needsBlobConfig;
};

export const getEndpointPath = (endpoint: Endpoint) => {
  let endpointPath = endpointPathCache.get(endpoint);
  if (endpointPath === undefined) {
    endpointPath = endpoint.path.replace(/:([a-zA-Z0-9_]+)/g, "${$1}");
    endpointPathCache.set(endpoint, endpointPath);
  }
  return endpointPath;
};

/**
 * The TS type of an inline (unnamed) parameter schema by its OpenAPI `type`; a type array
 * (`["string", "null"]`) is the union of its members' types.
 * Mirrored by `primitive_parameter_type` in native/src/render.rs.
 */
function getInlineParameterTsType(schemaType: unknown): string {
  const getSingleType = (type: unknown) => {
    switch (type) {
      case "number":
      case "integer":
        return "number";
      case "boolean":
        return "boolean";
      case "array":
        return "unknown[]";
      case "object":
        return "Record<string, unknown>";
      case "null":
        return "null";
      default:
        return "string";
    }
  };
  if (Array.isArray(schemaType)) {
    const types = [...new Set(schemaType.map(getSingleType))];
    return types.length > 0 ? types.join(" | ") : "string";
  }
  return getSingleType(schemaType);
}

function getEndpointParamTsType(resolver: SchemaResolver, param: EndpointParameter, modelNamespaceTag?: string) {
  if (isNamedZodSchema(param.zodSchema)) {
    return getImportedZodSchemaInferedTypeName(resolver, param.zodSchema, undefined, modelNamespaceTag);
  }
  if (param.parameterObject?.schema) {
    // A `$ref` to a simple component is inlined, so type it by the component's schema.
    const schema = resolver.resolveObject(param.parameterObject.schema);
    return getInlineParameterTsType(isSchemaObject(schema) ? (schema as OpenAPIV3.SchemaObject).type : undefined);
  }
  return "string";
}

const cursorPaginationCache = new WeakMap<SchemaResolver, WeakMap<Endpoint, boolean>>();

/**
 * Whether `endpoint` is a cursor paginated GET endpoint: it has an optional string query parameter named
 * `infiniteQueryParamNames.cursor`, and a response schema with a string property named
 * `infiniteQueryResponseParamNames.nextCursor` (directly or through `allOf`), which is the cursor of
 * the next page. A page-number parameter of the endpoint must be optional too (it is left unset).
 * Otherwise the pages cannot be typed by their cursor, so the endpoint is not
 * cursor paginated (it can still be page-number paginated).
 */
export function isCursorPaginatedGetEndpoint(resolver: SchemaResolver, endpoint: Endpoint) {
  let resolverCache = cursorPaginationCache.get(resolver);
  if (!resolverCache) {
    resolverCache = new WeakMap();
    cursorPaginationCache.set(resolver, resolverCache);
  }
  let cached = resolverCache.get(endpoint);
  if (cached === undefined) {
    cached = computeIsCursorPaginatedGetEndpoint(resolver, endpoint);
    resolverCache.set(endpoint, cached);
  }
  return cached;
}

export const getCursorParamName = (options: GenerateOptions) => options.infiniteQueryParamNames.cursor ?? "cursor";
export const getNextCursorResponseParamName = (options: GenerateOptions) =>
  options.infiniteQueryResponseParamNames.nextCursor ?? "nextCursor";

function computeIsCursorPaginatedGetEndpoint(resolver: SchemaResolver, endpoint: Endpoint) {
  const cursor = getCursorParamName(resolver.options);
  const nextCursor = getNextCursorResponseParamName(resolver.options);
  if (!cursor || !nextCursor || endpoint.method !== OpenAPIV3.HttpMethods.GET) return false;
  const findQueryParam = (name: string) =>
    endpoint.parameters.find((param) => param.name === name && param.type === "Query");
  const cursorParam = findQueryParam(cursor);
  // The first page is requested without a cursor (and a page-number parameter is left unset).
  if (
    !cursorParam ||
    isEndpointParameterRequired(cursorParam) ||
    getEndpointParamTsType(resolver, cursorParam) !== "string"
  ) {
    return false;
  }
  const pageParam = findQueryParam(resolver.options.infiniteQueryParamNames.page);
  if (pageParam && isEndpointParameterRequired(pageParam)) return false;
  return Object.values(endpoint.responseObject?.content ?? {}).some(
    (media) => media.schema !== undefined && hasStringProperty(resolver, media.schema, nextCursor, 0),
  );
}

type SchemaOrRef = OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject;

function resolveSchema(resolver: SchemaResolver, schema: SchemaOrRef): OpenAPIV3.SchemaObject | undefined {
  let resolved: SchemaOrRef | undefined = schema;
  for (let depth = 0; resolved && "$ref" in resolved && depth < 32; depth++) {
    resolved = resolver.resolveObject<OpenAPIV3.SchemaObject>(resolved);
  }
  return resolved && typeof resolved === "object" && !("$ref" in resolved) ? resolved : undefined;
}

function hasStringProperty(resolver: SchemaResolver, schema: SchemaOrRef, name: string, depth: number): boolean {
  const resolved = resolveSchema(resolver, schema);
  if (!resolved || depth > 32) return false;
  const property =
    resolved.properties && Object.hasOwn(resolved.properties, name) ? resolved.properties[name] : undefined;
  if (property) return isStringSchema(resolver, property, 0);
  return (resolved.allOf ?? []).some((member) => hasStringProperty(resolver, member, name, depth + 1));
}

/** A string schema, optionally nullable (`nullable`, a `"null"` type or a `null` union member). */
function isStringSchema(resolver: SchemaResolver, schema: SchemaOrRef, depth: number): boolean {
  const resolved = resolveSchema(resolver, schema);
  if (!resolved || depth > 32) return false;
  const type = resolved.type as unknown;
  if (type === "string") return true;
  if (Array.isArray(type)) return type.includes("string") && type.every((item) => item === "string" || item === "null");
  if (type !== undefined) return false;
  const members = resolved.anyOf ?? resolved.oneOf;
  if (!members || members.length === 0) return false;
  const isNull = (member: SchemaOrRef) => (resolveSchema(resolver, member)?.type as unknown) === "null";
  return (
    members.every((member) => isNull(member) || isStringSchema(resolver, member, depth + 1)) &&
    members.some((member) => !isNull(member))
  );
}

export function mapEndpointParamsToFunctionParams(
  resolver: SchemaResolver,
  endpoint: Endpoint,
  options?: {
    excludeBodyParam?: boolean;
    excludePageParam?: boolean;
    replacePageParam?: boolean;
    includeFileParam?: boolean;
    includeOnlyRequiredParams?: boolean;
    pathParamsRequiredOnly?: boolean;
    optionalPathParams?: string[];
    modelNamespaceTag?: string;
    excludePathParams?: boolean;
  },
) {
  const optionalPathParams = options?.optionalPathParams ? new Set(options.optionalPathParams) : undefined;

  const params = endpoint.parameters.map((param) => {
    return {
      name: invalidVariableNameCharactersToCamel(param.name),
      type: getEndpointParamTsType(resolver, param, options?.modelNamespaceTag),
      paramType: param.type,
      required: isEndpointParameterRequired(param),
      parameterObject: param.parameterObject,
      bodyObject: param.bodyObject,
    };
  });

  if (options?.includeFileParam && endpoint.mediaUpload) {
    params.push({
      name: "file",
      type: "File",
      paramType: "Body",
      required: false,
      parameterObject: undefined,
      bodyObject: undefined,
    });
  }

  // Cursor paginated infinite queries pass the page cursor as the cursor parameter and leave a
  // page-number parameter of the same endpoint unset.
  const cursor =
    (options?.excludePageParam || options?.replacePageParam) && isCursorPaginatedGetEndpoint(resolver, endpoint)
      ? getCursorParamName(resolver.options)
      : undefined;
  const getPageParamReplacement = (name: string) => {
    if (cursor) {
      if (name === cursor) return "pageParam";
      return name === resolver.options.infiniteQueryParamNames.page ? "undefined" : name;
    }
    return name === resolver.options.infiniteQueryParamNames.page ? "pageParam" : name;
  };

  return params
    .toSorted((a, b) => {
      if (a.required === b.required) {
        const sortedParamTypes = ["Path", "Body", "Query", "Header"];
        return sortedParamTypes.indexOf(a.paramType) - sortedParamTypes.indexOf(b.paramType);
      }
      return a.required ? -1 : 1;
    })
    .filter(
      (param) =>
        (!options?.excludeBodyParam || param.name !== BODY_PARAMETER_NAME) &&
        (!options?.excludePageParam ||
          (param.name !== resolver.options.infiniteQueryParamNames.page && (!cursor || param.name !== cursor))) &&
        (!options?.includeOnlyRequiredParams || param.required) &&
        (!options?.excludePathParams || param.paramType !== "Path"),
    )
    .map((param) => ({
      ...param,
      name: options?.replacePageParam ? getPageParamReplacement(param.name) : param.name,
      required:
        param.paramType === "Path" && optionalPathParams?.has(param.name)
          ? false
          : param.required && (param.paramType === "Path" || !options?.pathParamsRequiredOnly),
    }));
}

/** True when the endpoint has at least one mapped param and every mapped param is optional (safe `= {}` default on the params object). */
export function endpointParamsAllOptional(
  resolver: SchemaResolver,
  endpoint: Endpoint,
  mapOptions?: Parameters<typeof mapEndpointParamsToFunctionParams>[2],
): boolean {
  const params = mapEndpointParamsToFunctionParams(resolver, endpoint, mapOptions);
  if (params.length === 0) {
    return false;
  }
  return params.every((p) => !p.required);
}

export function getEndpointConfig(endpoint: Endpoint) {
  let config = endpointConfigCache.get(endpoint);
  if (!config) {
    config = createEndpointConfig(endpoint);
    endpointConfigCache.set(endpoint, config);
  }
  return config;
}

function createEndpointConfig(endpoint: Endpoint) {
  const params = endpoint.parameters
    .filter((param) => param.type === "Query")
    .map((param) => {
      const paramPropertyName = isValidPropertyName(param.name) ? param.name : `"${param.name}"`;
      const paramVariableName = invalidVariableNameCharactersToCamel(param.name);
      return {
        ...param,
        name: paramPropertyName,
        value: paramVariableName,
      };
    });

  const headers: Record<string, string> = {};
  if (endpoint.requestFormat !== DEFAULT_HEADERS["Content-Type"]) {
    headers["Content-Type"] = `'${endpoint.requestFormat}'`;
  }
  if (endpoint.responseFormat && endpoint.responseFormat !== DEFAULT_HEADERS.Accept) {
    headers.Accept = `'${endpoint.responseFormat}'`;
  }
  endpoint.parameters
    .filter((param) => param.type === "Header")
    .forEach((param) => {
      headers[param.name] = invalidVariableNameCharactersToCamel(param.name);
    });

  return {
    ...(params.length > 0 ? { params } : {}),
    ...(Object.keys(headers).length ? { headers } : {}),
  };
}

/** Renders the body of a media-upload mutationFn: call the endpoint (without the file arg) to
 * get upload instructions, then upload the file itself to the returned URL. Lines are relative
 * to the caller's own indent. */
export function renderMediaUploadMutationBody({
  resolver,
  endpointFunction,
  resolvedEndpointArgs,
}: {
  resolver: SchemaResolver;
  endpointFunction: string;
  resolvedEndpointArgs: string;
}): string[] {
  const hasAxiosRequestConfig = resolver.options.axiosRequestConfig;
  return [
    `const uploadInstructions = await ${endpointFunction}(${resolvedEndpointArgs}${hasAxiosRequestConfig ? `${resolvedEndpointArgs ? ", " : ""}${AXIOS_REQUEST_CONFIG_NAME}` : ""});`,
    "",
    "if (file && uploadInstructions.url) {",
    // The response schema may not declare `method`; default to PUT.
    '  const method = ("method" in uploadInstructions && typeof uploadInstructions.method === "string" ? uploadInstructions.method.toLowerCase() : "put") as "put" | "post";',
    "  let dataToSend: File | FormData = file;",
    '  if (method === "post") {',
    "    dataToSend = new FormData();",
    '    if ("fields" in uploadInstructions && uploadInstructions.fields) {',
    "      for (const [key, value] of Object.entries(uploadInstructions.fields)) {",
    "        dataToSend.append(key, String(value));",
    "      }",
    "    }",
    '    dataToSend.append("file", file);',
    "  }",
    resolver.options.restClient === "native"
      ? "  await AppRestClient.upload(uploadInstructions.url, dataToSend, {"
      : "  await axios[method](uploadInstructions.url, dataToSend, {",
    resolver.options.restClient === "native"
      ? '    headers: method === "put" ? { "Content-Type": file.type } : undefined,'
      : "    headers: {",
    ...(resolver.options.restClient === "native" ? [] : ['      "Content-Type": file.type,', "    },"]),
    "    signal: abortController?.signal,",
    "    onUploadProgress: onUploadProgress",
    "    ? (progressEvent) => onUploadProgress({ loaded: progressEvent.loaded, total: progressEvent.total ?? 0 })",
    "    : undefined,",
    resolver.options.restClient === "native" ? "  }, method);" : "  });",
    "}",
    "",
    "return uploadInstructions;",
  ];
}

export function getUpdateQueryEndpoints(endpoint: Endpoint, endpoints: Endpoint[]) {
  return endpoints.filter(
    (e) =>
      isQuery(e) &&
      e.parameters
        .filter((param) => param.parameterObject?.required)
        .every((pathParam) => endpoint.parameters.some((param) => param.name === pathParam.name)) &&
      e.response === endpoint.response,
  );
}
