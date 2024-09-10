import { OpenAPIV3 } from "openapi-types";
import { pathParamToVariableName } from "../openapi/openapi.utils";
import { capitalize, kebabToCamel } from "../string.utils";

export function isMainResponseStatus(status: number) {
  return status >= 200 && status < 300;
}

export function isErrorStatus(status: number) {
  return !(status >= 200 && status < 300);
}

export function isMediaTypeAllowed(mediaType: string) {
  return mediaType === "application/json";
}

export function getOperationAlias(path: string, method: string, operation: OpenAPIV3.OperationObject) {
  return operation.operationId ?? method + pathToVariableName(path);
}

const pathParamWithBracketsRegex = /({\w+})/g;
const wordPrecededByNonWordCharacter = /[^\w\-]+/g;
/** @example turns `/media-objects/{id}` into `MediaObjectsId` */
export function pathToVariableName(path: string) {
  return capitalize(kebabToCamel(path).replaceAll("/", "")) // /media-objects/{id} -> MediaObjects{id}
    .replace(pathParamWithBracketsRegex, (group) => capitalize(group.slice(1, -1))) // {id} -> Id
    .replace(wordPrecededByNonWordCharacter, "_"); // "/robots.txt" -> "/robots_txt"
}

const matcherRegex = /{(\b\w+(?:-\w+)*\b)}/g;
export function replaceHyphenatedPath(path: string) {
  const matches = path.match(matcherRegex);
  if (matches === null) {
    return path.replaceAll(matcherRegex, ":$1");
  }

  matches.forEach((match) => {
    const replacement = pathParamToVariableName(match.replaceAll(matcherRegex, ":$1"));
    path = path.replaceAll(match, replacement);
  });
  return path;
}
