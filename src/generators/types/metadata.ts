import { OpenAPIV3 } from "openapi-types";
import { GenerateOptions } from "./options";

export interface GenerateMetadataParams {
  input: string;
  options?: Partial<GenerateOptions>;
}

export type TsFieldDescriptor = {
  name: string;
  type: string;
  required: boolean;
  namespace?: string;
  filePath?: string;
};

export interface BaseMetadata {
  name: string;
  filePath: string;
  namespace?: string;
}

export type ModelMetadata = BaseMetadata & {
  properties: TsFieldDescriptor[];
};

export type QueryMetadata = BaseMetadata & {
  params: TsFieldDescriptor[];
};

export interface GenerateMetadata {
  openApiDoc: OpenAPIV3.Document;
  models: ModelMetadata[];
  queries: QueryMetadata[];
}
