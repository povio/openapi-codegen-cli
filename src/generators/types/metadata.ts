import { OpenAPIV3 } from "openapi-types";
import { GenerateOptions } from "./options";

export interface GenerateParams {
  input: string;
  options?: Partial<GenerateOptions>;
}

export interface TsTypeBase {
  type: string;
  namespace?: string;
  importPath?: string;
}

export type TsType = TsTypeBase & TsMetaType;

export type TsPropertyBase = {
  name: string;
  isRequired: boolean;
} & TsTypeBase;

export type TsProperty = TsPropertyBase & TsMetaType;

export interface TsPrimitiveMetaType {
  metaType: "primitive";
}

export interface TsObjectMetaType {
  metaType: "object";
  objectProperties: TsProperty[];
  isCircular?: boolean;
}

export interface TsArrayMetaType {
  metaType: "array";
  arrayType: TsType;
}

export interface TsCompositeMetaType {
  metaType: "composite";
  allOf?: TsType[];
  oneOf?: TsType[];
  anyOf?: TsType[];
}

export type TsMetaType = TsPrimitiveMetaType | TsObjectMetaType | TsArrayMetaType | TsCompositeMetaType;

export type ModelMetadata = TsType;

export type QueryMetadata = {
  name: string;
  importPath: string;
  namespace?: string;
  isQuery: boolean;
  isMutation: boolean;
  params: TsProperty[];
  response: TsType;
};

export interface GenerateMetadata {
  openApiDoc: OpenAPIV3.Document;
  models: ModelMetadata[];
  queries: QueryMetadata[];
}
