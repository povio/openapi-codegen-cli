import { OpenAPIV3 } from "openapi-types";

export type EndpointParameter = {
  name: string;
  description?: string;
  type: "Query" | "Body" | "Header" | "Path";
  zodSchema: string;
  parameterObject?: OpenAPIV3.ParameterObject;
  bodyObject?: OpenAPIV3.RequestBodyObject;
};

export type EndpointResponse = {
  statusCode: string;
  description?: string;
  zodSchema: string;
};

type EndpointError = {
  status: number | "default";
  description?: string;
  zodSchema: string;
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
  errors: Array<EndpointError>;
};
