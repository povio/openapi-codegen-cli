import { OpenAPIV3 } from "openapi-types";
import { OperationAclInfo, ParameterObject } from "./openapi";

export interface EndpointParameter {
  name: string;
  description?: string;
  type: "Query" | "Body" | "Header" | "Path";
  zodSchema: string;
  parameterObject?: ParameterObject;
  parameterSortingEnumSchemaName?: string;
  bodyObject?: OpenAPIV3.RequestBodyObject;
}

interface EndpointError {
  status: number | "default";
  description?: string;
  zodSchema: string;
}

export interface AclConditionsPropertyType {
  name: string;
  type?: string;
  zodSchemaName?: string;
  required?: boolean;
  info?: string;
}

export type EndpointAclInfo = OperationAclInfo & {
  conditionsTypes?: AclConditionsPropertyType[];
};

export interface Endpoint {
  method: OpenAPIV3.HttpMethods;
  path: string;
  operationName: string;
  description?: string;
  summary?: string;
  tags?: string[];
  requestFormat: string;
  responseFormat?: string;
  parameters: Array<EndpointParameter>;
  status?: number;
  response: string;
  responseObject?: OpenAPIV3.ResponseObject;
  responseDescription?: string;
  errors: Array<EndpointError>;
  responseStatusCodes: string[];
  acl?: EndpointAclInfo[];
  mediaUpload?: boolean;
  mediaDownload?: boolean;
}
