import { Endpoint } from "./endpoint";

export type GenerateData = Map<
  string,
  {
    endpoints: Endpoint[];
    zodSchemas: Record<string, string>;
  }
>;

export type Import = {
  bindings: string[];
  from: string;
};
