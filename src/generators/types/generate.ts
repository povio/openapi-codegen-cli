import { OpenAPIV3 } from "openapi-types";
import { Endpoint } from "./endpoint";

export type Import = {
  bindings: string[];
  from: string;
};

export enum GenerateType {
  Models = "models",
  Endpoints = "endpoints",
  Queries = "queries",
}

export type GenerateData = Map<
  string,
  {
    endpoints: Endpoint[];
    zodSchemas: Record<string, string>;
  }
>;

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
}

export interface GenerateMetadata {
  models: ModelMetadata[];
  queries: QueryMetadata[];
}
