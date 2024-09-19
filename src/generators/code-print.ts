import fs from "fs/promises";
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

export async function printZodSchemasToFile({
  zodSchemas,
  output,
  options,
}: {
  zodSchemas: Record<string, string>;
  output: string;
  options: GenerateOptions;
}) {
  const template = await fs.readFile(`${TEMPLATES_DIR}/zod-schemas.hbs`, "utf-8");

  setZodSchemaInferedTypeNameHelper(options.schemaSuffix);
  const hbsTemplate = Handlebars.compile(template);

  await fs.writeFile(`${output}/zod-schemas.ts`, hbsTemplate({ zodSchemas }));
}

export async function printEndpointsToFile({
  endpoints,
  output,
  options,
}: {
  endpoints: Endpoint[];
  output: string;
  options: GenerateOptions;
}) {
  const template = await fs.readFile(`${TEMPLATES_DIR}/endpoints.hbs`, "utf-8");

  const endpointResponseSchemas = endpoints.map((endpoint) => endpoint.response);
  const zodSchemaImports = [...new Set(endpointResponseSchemas.filter(isNamedZodSchema))];
  const hasZodImport = endpointResponseSchemas.some((response) => !isNamedZodSchema(response));
  const endpointParams = endpoints.reduce((prev, curr) => [...prev, ...curr.parameters], [] as EndpointParameter[]);
  const zodSchemaTypeImports = endpointParams
    .map((param) => param.schema)
    .filter(isNamedZodSchema)
    .map((name) => getZodSchemaInferedTypeName(name, options.schemaSuffix));

  setEndpointNameHelper();
  setEndpointParamsHelper(options.schemaSuffix);
  setEndpointPathHelper();
  setEndpointBodyHelper();
  setEndpointConfigHelper();
  const hbsTemplate = Handlebars.compile(template);

  await fs.writeFile(
    `${output}/endpoints.ts`,
    hbsTemplate({ zodSchemaImports, zodSchemaTypeImports, hasZodImport, endpoints }),
  );
}
