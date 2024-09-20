import fs from "fs";
import Handlebars from "handlebars";
import { Endpoint, EndpointParameter } from "./types/endpoint";
import { GenerateOptions } from "./types/options";
import {
  setEndpointBodyHelper,
  setEndpointConfigHelper,
  setEndpointNameHelper,
  setEndpointParamsHelper,
  setEndpointPathHelper,
  setZodSchemaInferedTypeNameHelper,
} from "./utils/handlebars.utils";
import { getZodSchemaInferedTypeName, isNamedZodSchema } from "./utils/zod/zod-schema.utils";

const TEMPLATES_DIR = "src/generators/templates";

export function printZodSchemasToFile({
  zodSchemas,
  output,
  options,
}: {
  zodSchemas: Record<string, string>;
  output: string;
  options: GenerateOptions;
}) {
  const template = fs.readFileSync(`${TEMPLATES_DIR}/zod-schemas.hbs`, "utf-8");

  setZodSchemaInferedTypeNameHelper(options.schemaSuffix);
  const hbsTemplate = Handlebars.compile(template);

  fs.writeFileSync(`${output}/zod-schemas.ts`, hbsTemplate({ zodSchemas }));
}

export function printEndpointsToFile({
  endpoints,
  output,
  options,
}: {
  endpoints: Endpoint[];
  output: string;
  options: GenerateOptions;
}) {
  const template = fs.readFileSync(`${TEMPLATES_DIR}/endpoints.hbs`, "utf-8");

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

  setEndpointNameHelper();
  setEndpointParamsHelper(options.schemaSuffix);
  setEndpointPathHelper();
  setEndpointBodyHelper();
  setEndpointConfigHelper();
  const hbsTemplate = Handlebars.compile(template);

  fs.writeFileSync(
    `${output}/endpoints.ts`,
    hbsTemplate({ zodSchemaImports, zodSchemaTypeImports, hasZodImport, endpoints }),
  );
}
