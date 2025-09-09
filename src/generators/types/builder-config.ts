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
    schema: string;
    paginated: string;
    infinite: string;
    filters?: DynamicInputsConfig;
    columns?: DynamicColumnsConfig;
  };
  read?: {
    acl?: string;
    schema: string;
    query: string;
  };
  create?: {
    acl?: string;
    mutation: string;
    inputDefs?: DynamicInputsConfig;
  };
  update?: {
    acl?: string;
    mutation: string;
    inputDefs?: DynamicInputsConfig;
  };
  delete?: {
    acl?: string;
    mutation: string;
  };
  bulkDelete?: {
    acl?: string;
    mutation: string;
    inputDefs?: DynamicInputsConfig;
  };
}
