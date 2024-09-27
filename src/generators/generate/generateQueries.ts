import { QUERY_IMPORT } from "../const/imports.const";
import { QUERY_HOOKS } from "../const/query.const";
import { Endpoint, EndpointParameter } from "../types/endpoint";
import { Import } from "../types/import";
import { GenerateOptions } from "../types/options";
import { getEndpointName, getZodSchemaInferedTypeName } from "../utils/generate.utils";
import { getHbsTemplateDelegate } from "../utils/hbs-template.utils";
import { isNamedZodSchema } from "../utils/zod-schema.utils";

export function generateQueries({ endpoints, options }: { endpoints: Endpoint[]; options: GenerateOptions }) {
  const queryEndpoints = endpoints.filter((endpoint) => endpoint.method === "get");
  const mutationEndpoints = endpoints.filter((endpoint) => endpoint.method !== "get");

  const filteredMutationEndpointParams = mutationEndpoints.filter((endpoint) => endpoint.parameters.length > 1);
  const endpointParams = [...queryEndpoints, ...filteredMutationEndpointParams].reduce(
    (prev, curr) => [...prev, ...curr.parameters],
    [] as EndpointParameter[],
  );
  const zodSchemaTypeImports = [
    ...new Set(
      endpointParams
        .map((param) => param.schema)
        .filter(isNamedZodSchema)
        .map((name) => getZodSchemaInferedTypeName(name, options.schemaSuffix)),
    ),
  ];

  const queryImport: Import = {
    ...QUERY_IMPORT,
    bindings: [
      ...(queryEndpoints.length > 0 ? [QUERY_HOOKS.query] : []),
      ...(mutationEndpoints.length > 0 ? [QUERY_HOOKS.mutation] : []),
    ],
  };

  const modelsImport: Import = {
    bindings: [...zodSchemaTypeImports],
    from: `./${options.modelsConfig.outputFileNameSuffix}`,
  };

  const endpointsImport: Import = {
    bindings: endpoints.map(getEndpointName),
    from: `./${options.endpointsConfig.outputFileNameSuffix}`,
  };

  const hbsTemplate = getHbsTemplateDelegate({ templateName: "queries", options });

  return hbsTemplate({
    queryImport,
    modelsImport,
    endpointsImport,
    endpoints,
    queryEndpoints,
  });
}
