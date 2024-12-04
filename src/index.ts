import SwaggerParser from "@apidevtools/swagger-parser";
import { OpenAPIV3 } from "openapi-types";
import { DEFAULT_GENERATE_OPTIONS } from "./generators/const/options.const";
import { getDataFromOpenAPIDoc } from "./generators/core/getDataFromOpenAPIDoc";
import { GenerateOptions } from "./generators/types/options";

export async function getOpenAPIDocCodegenData({
  input,
  options: genOptions,
}: {
  input: string;
  options?: Partial<GenerateOptions>;
}) {
  const options = { ...DEFAULT_GENERATE_OPTIONS, ...genOptions } as GenerateOptions;

  const openApiDoc = (await SwaggerParser.bundle(input)) as OpenAPIV3.Document;

  const data = await getDataFromOpenAPIDoc({ openApiDoc, options });

  return data;
}
