import { OpenAPIV3 } from "openapi-types";
import { GenerateOptions } from "./options";

export interface GenerateMetadataParams {
  input: string;
  options?: Partial<GenerateOptions>;
}

export type TsType = {
  type: string;
  isRequired: boolean;
  namespace?: string;
  filePath?: string;
};

export type TsNestedType = Omit<TsType, "isRequired"> & TsNestedDataType;

export type TsProperty = {
  name: string;
} & TsType;

export type TsNestedProperty = TsProperty & TsNestedDataType;

export type TsNestedDataType =
  | { dataType: "primitive" }
  | { dataType: "object"; objectProperties: TsNestedProperty[] }
  | { dataType: "array"; arrayType: TsNestedType };

export type ModelMetadata = TsNestedType;

export type QueryMetadata = {
  name: string;
  filePath: string;
  namespace?: string;
  isQuery: boolean;
  isMutation: boolean;
  params: TsNestedProperty[];
  response: TsNestedType;
};

export interface GenerateMetadata {
  openApiDoc: OpenAPIV3.Document;
  models: ModelMetadata[];
  queries: QueryMetadata[];
}
