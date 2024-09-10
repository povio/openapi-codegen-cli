import { OpenAPIV3 } from "openapi-types";

export type EndpointParameter = {
  name: string;
  description?: string;
  type: "Query" | "Body" | "Header" | "Path";
  schema: string;
};

export type EndpointResponse = {
  statusCode: string;
  description?: string;
  schema: string;
};

export type Endpoint = {
  method: OpenAPIV3.HttpMethods;
  path: string;
  alias?: string;
  description?: string;
  requestFormat?: "json" | "form-data" | "form-url" | "binary" | "text";
  parameters: Array<EndpointParameter>;
  status?: number;
  response: string;
  responseDescription?: string;
  errors: Array<{ status: number | "default"; description?: string; schema: string }>;
};
