import Handlebars from "handlebars";
import { Endpoint, EndpointParameter } from "../types/endpoint";
import { GenerateOptions } from "../types/options";
import { readHbsTemplateSync } from "../utils/file.utils";
import { setEndpointNameHelper, setGenerateQueryHelper, setGenerateQueryKeysHelper } from "../utils/handlebars.utils";
import { getZodSchemaInferedTypeName, isNamedZodSchema } from "../utils/zod-schema.utils";

export function generateQueries({ endpoints, options }: { endpoints: Endpoint[]; options: GenerateOptions }) {
  const template = readHbsTemplateSync("queries");

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

  const reactQueryImports = [
    ...(queryEndpoints.length > 0 ? ["useQuery"] : []),
    ...(mutationEndpoints.length > 0 ? ["useMutation"] : []),
  ];

  setEndpointNameHelper();
  setGenerateQueryKeysHelper(options);
  setGenerateQueryHelper(options);

  const hbsTemplate = Handlebars.compile(template);

  return hbsTemplate({
    zodSchemaTypeImports,
    reactQueryImports,
    endpoints,
    queryEndpoints,
  });
}
