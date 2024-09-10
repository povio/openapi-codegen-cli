import { OpenAPIV3 } from "openapi-types";

export type RefInfo = {
  ref: string;
  name: string;
  normalized: string;
};

export type OpenAPISchemaResolver = {
  getSchemaByRef: (ref: string) => OpenAPIV3.SchemaObject;
  resolveRef: (ref: string) => RefInfo;
  resolveSchemaName: (normalized: string) => RefInfo;
};

export type GenerateContext = {
  resolver: OpenAPISchemaResolver;
  zodSchemas: Record<string, string>;
  schemas: Record<string, string[]>;
};
