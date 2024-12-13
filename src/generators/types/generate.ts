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

export type GenerateData = Map<
  string,
  {
    endpoints: Endpoint[];
    zodSchemas: Record<string, string>;
  }
>;
