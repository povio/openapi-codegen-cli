import { Endpoint } from "./endpoint";

export interface DynamicInputsConfig {
  schema: string;
  options: {
    inputs: Record<string, boolean>;
  };
}

export interface DynamicColumnsConfig {
  schema: string;
  options: {
    columns: Record<string, boolean>;
    sortable?: string;
  };
}

export interface BuilderConfig {
  name: string;
  title: string;
  readAll: {
    acl?: string;
    paginated: string;
    infinite?: string;
    filters?: DynamicInputsConfig;
    columns: DynamicColumnsConfig;
  };
  read?: {
    acl?: string;
    schema: string;
    query: string;
  };
  create?: {
    acl?: string;
    schema: string;
    mutation: string | Endpoint;
    inputDefs?: DynamicInputsConfig;
  };
  update?: {
    acl?: string;
    schema: string;
    mutation: string | Endpoint;
    inputDefs?: DynamicInputsConfig;
  };
  delete?: {
    acl?: string;
    mutation: string | Endpoint;
  };
  bulkDelete?: {
    acl?: string;
    schema: string;
    mutation: string | Endpoint;
    inputDefs?: DynamicInputsConfig;
  };
}
