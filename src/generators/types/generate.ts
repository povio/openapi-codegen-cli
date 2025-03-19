import { OpenAPIV3 } from "openapi-types";
import { SchemaResolver } from "../core/SchemaResolver.class";
import { Endpoint } from "./endpoint";

export interface Import {
  bindings: string[];
  from: string;
}

export interface GenerateFile {
  fileName: string;
  extension: string;
}

export interface GenerateZodSchemaData {
  code: string;
  isCiruclar: boolean;
  isEnum: boolean;
  schemaObj?: OpenAPIV3.SchemaObject;
}

export enum GenerateType {
  Models = "models",
  Endpoints = "endpoints",
  Queries = "queries",
  Acl = "acl",
}

export type GenerateData = Map<
  string,
  {
    endpoints: Endpoint[];
    zodSchemas: Record<string, string>;
  }
>;

export interface GenerateTypeParams {
  resolver: SchemaResolver;
  data: GenerateData;
  tag?: string;
}

export interface GenerateFileData {
  fileName: string;
  content: string;
}
