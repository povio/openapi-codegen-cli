import SwaggerParser from "@apidevtools/swagger-parser";
import { OpenAPIV3 } from "openapi-types";
import { DEFAULT_GENERATE_OPTIONS } from "./generators/const/options.const";
import { getMetadataFromOpenAPIDoc } from "./generators/core/getMetadataFromOpenAPIDoc";
import { GenerateOptions } from "./generators/types/options";

export async function getMetadata({
  input,
  options: genOptions,
}: {
  input: string;
  options?: Partial<GenerateOptions>;
}) {
  const options = { ...DEFAULT_GENERATE_OPTIONS, ...genOptions } as GenerateOptions;

  const openApiDoc = (await SwaggerParser.bundle(input)) as OpenAPIV3.Document;

  return await getMetadataFromOpenAPIDoc({ openApiDoc, options });
}
