import { Endpoint } from "./endpoint";

export interface Import {
  bindings: string[];
  from: string;
}

export enum GenerateType {
  Models = "models",
  Endpoints = "endpoints",
  Queries = "queries",
}

export interface TsFieldDescriptor {
  name: string;
  type: string;
  required: boolean;
}

export type GenerateData = Map<
  string,
  {
    endpoints: Endpoint[];
    zodSchemas: Record<string, string>;
  }
>;
