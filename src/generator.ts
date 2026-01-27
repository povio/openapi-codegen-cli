import { OpenAPIV3 } from "openapi-types";

import SwaggerParser from "@apidevtools/swagger-parser";

import { DEFAULT_GENERATE_OPTIONS } from "./generators/const/options.const";
import { getMetadataFromOpenAPIDoc } from "./generators/core/getMetadataFromOpenAPIDoc";
import { generateCodeFromOpenAPIDoc } from "./generators/generateCodeFromOpenAPIDoc";
import { GenerateParams } from "./generators/types/metadata";
import { GenerateOptions } from "./generators/types/options";

export async function getGenerateMetadata({ input, options: genOptions }: GenerateParams) {
  const options = { ...DEFAULT_GENERATE_OPTIONS, ...genOptions } as GenerateOptions;

  const openApiDoc = (await SwaggerParser.bundle(input)) as OpenAPIV3.Document;

  return await getMetadataFromOpenAPIDoc(openApiDoc, options);
}

export async function getGenerateFilesData({ input, options: genOptions }: GenerateParams) {
  const options = { ...DEFAULT_GENERATE_OPTIONS, ...genOptions } as GenerateOptions;

  const openApiDoc = (await SwaggerParser.bundle(input)) as OpenAPIV3.Document;

  return generateCodeFromOpenAPIDoc(openApiDoc, options);
}
