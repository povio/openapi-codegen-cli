import SwaggerParser from "@apidevtools/swagger-parser";
import { OpenAPIV3 } from "openapi-types";
import { DEFAULT_GENERATE_OPTIONS } from "./generators/const/options.const";
import { getMetadataFromOpenAPIDoc } from "./generators/core/getMetadataFromOpenAPIDoc";
import { GenerateMetadataParams } from "./generators/types/metadata";
import { GenerateOptions } from "./generators/types/options";

export async function getGenerateMetadata({ input, options: genOptions }: GenerateMetadataParams) {
  const options = { ...DEFAULT_GENERATE_OPTIONS, ...genOptions } as GenerateOptions;

  const openApiDoc = (await SwaggerParser.bundle(input)) as OpenAPIV3.Document;

  return await getMetadataFromOpenAPIDoc(openApiDoc, options);
}

export * from "./generators/types/metadata";
