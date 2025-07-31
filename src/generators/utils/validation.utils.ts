import { HTTP_STATUS_CODES, HttpStatusCode } from "src/generators/const/validation.const";
import { Endpoint, EndpointParameter } from "src/generators/types/endpoint";
import { OperationObject } from "src/generators/types/openapi";
import { ValidationError, ValidationErrorType } from "src/generators/types/validation";

export function getInvalidSchemaError(message: string): ValidationError {
  return { type: "invalid-schema", message };
}

export function getInvalidOperationIdError(operationId: string): ValidationError {
  return { type: "invalid-operation-id", message: `Operation ${operationId}` };
}

export function getMissingPathParameterError(params: EndpointParameter[], path: string): ValidationError {
  return {
    type: "missing-path-parameter",
    message: `Path ${path} is missing [${params.map(({ name }) => name).join(", ")}]`,
  };
}

export function getNotAllowedInlineEnumError(enumProperty: string): ValidationError {
  return {
    type: "not-allowed-inline-enum",
    message: `${enumProperty} is missing @IsEnum() and @ApiProperty(enum:, enumName:)`,
  };
}

export function getNotAllowedCircularSchemaError(message: string): ValidationError {
  return { type: "not-allowed-circular-schema", message };
}

export function getMissingAclConditionPropertyError(
  propertyName: string,
  operation: OperationObject,
  endpoint: Endpoint,
): ValidationError {
  return {
    type: "missing-acl-condition-property",
    message: `Condition property ${propertyName} is not found in parameters or body in operation ${getOperationDescriptor(operation, endpoint)}`,
  };
}

export function getMissingStatusCodeError(
  statusCode: HttpStatusCode,
  operation: OperationObject,
  endpoint: Endpoint,
): ValidationError {
  return {
    type: "missing-status-code",
    message: `Missing HTTP status code ${getStatusCodeDescription(statusCode)} in operation ${getOperationDescriptor(operation, endpoint)}`,
  };
}

export function getInvalidStatusCodeError(
  statusCode: { expected: HttpStatusCode; received: HttpStatusCode },
  operation: OperationObject,
  endpoint: Endpoint,
): ValidationError {
  return {
    type: "invalid-status-code",
    message: `Operation ${getOperationDescriptor(operation, endpoint)} expected HTTP status code ${getStatusCodeDescription(statusCode.expected)} but received ${getStatusCodeDescription(statusCode.received)}`,
  };
}

export function getMultipleSuccessStatusCodesError(
  statusCodes: HttpStatusCode[],
  operation: OperationObject,
  endpoint: Endpoint,
): ValidationError {
  return {
    type: "multiple-success-status-codes",
    message: `Operation ${getOperationDescriptor(operation, endpoint)} has multiple success HTTP status codes: ${statusCodes.map(getStatusCodeDescription).join(", ")}`,
  };
}

function getOperationDescriptor(operation: OperationObject, endpoint: Endpoint) {
  return operation.operationId ?? `${endpoint.method} ${endpoint.path}`;
}

function getStatusCodeDescription(statusCode: keyof typeof HTTP_STATUS_CODES) {
  return `${statusCode} (${HTTP_STATUS_CODES[statusCode]})`;
}

export function groupByType(validationErrors: ValidationError[]): Record<ValidationErrorType, string[]> {
  return validationErrors.reduce(
    (acc, err) => ({ ...acc, [err.type]: [...(acc[err.type] ?? []), err.message] }),
    {} as Record<ValidationErrorType, string[]>,
  );
}
