import { OpenAPIV3 } from "openapi-types";
import { GenerateOptions } from "./options";

export interface GenerateMetadataParams {
  input: string;
  options?: Partial<GenerateOptions>;
}

export interface TsType {
  type: string;
  namespace?: string;
  filePath?: string;
}

export type TsNestedType = TsType & TsMetaType;

export type TsProperty = {
  name: string;
  isRequired: boolean;
} & TsType;

export type TsNestedProperty = TsProperty & TsMetaType;

export interface TsPrimitiveMetaType {
  metaType: "primitive";
}

export interface TsObjectMetaType {
  metaType: "object";
  objectProperties: TsNestedProperty[];
  isCircular?: boolean;
}

export interface TsArrayMetaType {
  metaType: "array";
  arrayType: TsNestedType;
}

export interface TsCompositeMetaType {
  metaType: "composite";
  allOf?: TsNestedType;
  oneOf?: TsNestedType;
  anyOf?: TsNestedType;
}

export type TsMetaType = TsPrimitiveMetaType | TsObjectMetaType | TsArrayMetaType | TsCompositeMetaType;

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
