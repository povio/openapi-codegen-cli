import { DEFAULT_GENERATE_OPTIONS } from "./generators/const/options.const";
import { getMetadataFromOpenAPIDoc } from "./generators/core/getMetadataFromOpenAPIDoc";
import { generateCodeFromOpenAPIDoc } from "./generators/generateCodeFromOpenAPIDoc";
import { getOpenApiDoc } from "./generators/run/generate.runner";
import { GenerateParams } from "./generators/types/metadata";
import { GenerateOptions } from "./generators/types/options";

export async function getGenerateMetadata({ input, options: genOptions }: GenerateParams) {
  const options = { ...DEFAULT_GENERATE_OPTIONS, ...genOptions } as GenerateOptions;

  const openApiDoc = await getOpenApiDoc(input);

  return await getMetadataFromOpenAPIDoc(openApiDoc, options);
}

export async function getGenerateFilesData({ input, options: genOptions }: GenerateParams) {
  const options = { ...DEFAULT_GENERATE_OPTIONS, ...genOptions } as GenerateOptions;

  const openApiDoc = await getOpenApiDoc(input);

  return generateCodeFromOpenAPIDoc(openApiDoc, options);
}
