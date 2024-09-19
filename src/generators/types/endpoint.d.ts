import { OpenAPIV3 } from "openapi-types";

export type EndpointParameter = {
  name: string;
  description?: string;
  type: "Query" | "Body" | "Header" | "Path";
  schema: string;
  openApiObject?: OpenAPIV3.ParameterObject;
};

export type EndpointResponse = {
  statusCode: string;
  description?: string;
  schema: string;
};

export type Endpoint = {
  method: OpenAPIV3.HttpMethods;
  path: string;
  alias: string;
  description?: string;
  requestFormat?: string;
  responseFormat?: string;
  parameters: Array<EndpointParameter>;
  status?: number;
  response: string;
  responseDescription?: string;
  errors: Array<{ status: number | "default"; description?: string; schema: string }>;
};
