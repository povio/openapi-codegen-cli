import { OpenAPIV3 } from "openapi-types";
import { FunctionParam } from "./generate";
import { GenerateOptions } from "./options";

export interface GenerateMetadataParams {
  input: string;
  options?: Partial<GenerateOptions>;
}

export interface ModelMetadata {
  name: string;
  zodSchemaName: string;
  filePath: string;
  namespace?: string;
  openApiSchema?: OpenAPIV3.SchemaObject;
}

export interface QueryMetadata {
  name: string;
  filePath: string;
  namespace?: string;
  params: FunctionParam[];
}

export interface GenerateMetadata {
  openApiDoc: OpenAPIV3.Document;
  models: ModelMetadata[];
  queries: QueryMetadata[];
}
