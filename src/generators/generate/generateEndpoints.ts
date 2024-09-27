import { REST_CLIENT_NAME } from "../const/endpoints.const";
import { REST_CLIENT_IMPORT, ZOD_IMPORT } from "../const/imports.const";
import { Endpoint, EndpointParameter } from "../types/endpoint";
import { Import } from "../types/import";
import { GenerateOptions } from "../types/options";
import { getZodSchemaInferedTypeName } from "../utils/generate.utils";
import { getHbsTemplateDelegate } from "../utils/hbs-template.utils";
import { isNamedZodSchema } from "../utils/zod-schema.utils";

export function generateEndpoints({ endpoints, options }: { endpoints: Endpoint[]; options: GenerateOptions }) {
  const endpointResponseSchemas = endpoints.map((endpoint) => endpoint.response);
  const zodSchemaImports = [...new Set(endpointResponseSchemas.filter(isNamedZodSchema))];
  const hasZodImport = endpointResponseSchemas.some((response) => !isNamedZodSchema(response));

  const endpointParams = endpoints.reduce((prev, curr) => [...prev, ...curr.parameters], [] as EndpointParameter[]);
  const zodSchemaTypeImports = [
    ...new Set(
      endpointParams
        .map((param) => param.schema)
        .filter(isNamedZodSchema)
        .map((name) => getZodSchemaInferedTypeName(name, options.schemaSuffix)),
    ),
  ];

  const modelsImport: Import = {
    bindings: [...zodSchemaImports, ...zodSchemaTypeImports],
    from: `./${options.modelsConfig.outputFileNameSuffix}`,
  };

  const hbsTemplate = getHbsTemplateDelegate({ templateName: "endpoints", options });

  return hbsTemplate({
    restClientImport: REST_CLIENT_IMPORT,
    hasZodImport,
    zodImport: ZOD_IMPORT,
    restClientName: REST_CLIENT_NAME,
    modelsImport,
    endpoints,
  });
}
