import { QUERY_IMPORT } from "../const/imports.const";
import { QUERY_HOOKS } from "../const/query.const";
import { EndpointParameter } from "../types/endpoint";
import { GenerateData, Import } from "../types/generate";
import { GenerateOptions } from "../types/options";
import { getEndpointsImports, getModelsImports } from "../utils/generate.imports.utils";
import { getHbsTemplateDelegate } from "../utils/hbs-template.utils";
import { isNamedZodSchema } from "../utils/zod-schema.utils";

export function generateQueries({
  data,
  tag = "",
  options,
}: {
  data: GenerateData;
  tag?: string;
  options: GenerateOptions;
}) {
  const endpoints = data.get(tag)?.endpoints;
  if (!endpoints || endpoints.length === 0) {
    return;
  }

  const queryEndpoints = endpoints.filter((endpoint) => endpoint.method === "get");
  const mutationEndpoints = endpoints.filter((endpoint) => endpoint.method !== "get");

  const queryImport: Import = {
    ...QUERY_IMPORT,
    bindings: [
      ...(queryEndpoints.length > 0 ? [QUERY_HOOKS.query] : []),
      ...(mutationEndpoints.length > 0 ? [QUERY_HOOKS.mutation] : []),
    ],
  };

  const filteredMutationEndpointParams = mutationEndpoints.filter((endpoint) => endpoint.parameters.length > 1);
  const endpointParams = [...queryEndpoints, ...filteredMutationEndpointParams].reduce(
    (prev, curr) => [...prev, ...curr.parameters],
    [] as EndpointParameter[],
  );
  const modelsImports = getModelsImports({
    data,
    tag,
    zodSchemasAsTypes: Array.from(new Set(endpointParams.map((param) => param.schema).filter(isNamedZodSchema))),
    options,
  });

  const endpointsImports = getEndpointsImports({
    data,
    tag,
    endpoints,
    options,
  });

  const hbsTemplate = getHbsTemplateDelegate({ templateName: "queries", options });

  return hbsTemplate({
    queryImport,
    modelsImports,
    endpointsImports,
    endpoints,
    queryEndpoints,
  });
}
