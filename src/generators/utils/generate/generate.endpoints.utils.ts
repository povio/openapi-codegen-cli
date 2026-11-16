import { OpenAPIV3 } from "openapi-types";

import { AXIOS_REQUEST_CONFIG_NAME, BODY_PARAMETER_NAME, DEFAULT_HEADERS } from "@/generators/const/endpoints.const";
import { SchemaResolver } from "@/generators/core/SchemaResolver.class";
import { Endpoint } from "@/generators/types/endpoint";
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
    let type = "string";
    if (isNamedZodSchema(param.zodSchema)) {
      type = getImportedZodSchemaInferedTypeName(resolver, param.zodSchema, undefined, options?.modelNamespaceTag);
    } else if (param.parameterObject?.schema) {
      // A `$ref` to a simple component is inlined, so type it by the component's schema.
      const schema = resolver.resolveObject(param.parameterObject.schema);
      type = getInlineParameterTsType(isSchemaObject(schema) ? (schema as OpenAPIV3.SchemaObject).type : undefined);
    }

    return {
      name: invalidVariableNameCharactersToCamel(param.name),
      type,
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
        (!options?.excludePageParam || param.name !== resolver.options.infiniteQueryParamNames.page) &&
        (!options?.includeOnlyRequiredParams || param.required) &&
        (!options?.excludePathParams || param.paramType !== "Path"),
    )
    .map((param) => ({
      ...param,
      name:
        options?.replacePageParam && param.name === resolver.options.infiniteQueryParamNames.page
          ? "pageParam"
          : param.name,
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
