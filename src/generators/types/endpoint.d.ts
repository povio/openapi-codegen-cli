import { OpenAPIV3 } from "openapi-types";

export type EndpointParameter = {
  name: string;
  description?: string;
  type: "Query" | "Body" | "Header" | "Path";
  schema: string;
  parameterObject?: OpenAPIV3.ParameterObject;
  bodyObject?: OpenAPIV3.RequestBodyObject;
};

export type EndpointResponse = {
  statusCode: string;
  description?: string;
  schema: string;
};

export type Endpoint = {
  method: OpenAPIV3.HttpMethods;
  path: string;
  operationName: string;
  description?: string;
  tags?: string[];
  requestFormat: string;
  responseFormat?: string;
  parameters: Array<EndpointParameter>;
  status?: number;
  response: string;
  responseObject?: OpenAPIV3.ResponseObject;
  responseDescription?: string;
  errors: Array<{ status: number | "default"; description?: string; schema: string }>;
};
