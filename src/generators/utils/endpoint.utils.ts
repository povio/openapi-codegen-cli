import { OpenAPIV3 } from "openapi-types";
import { pathParamToVariableName } from "./openapi.utils";
import { capitalize, kebabToCamel } from "./string.utils";

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

const PATH_PARAM_WITH_BRACKETS_REGEX = /({\w+})/g;
const WORD_PRECEDED_BY_NON_WORD_CHARACTER = /[^\w\-]+/g;
/** @example turns `/media-objects/{id}` into `MediaObjectsId` */
export function pathToVariableName(path: string) {
  return capitalize(kebabToCamel(path.replaceAll("/", "-")).replaceAll("-", "")) // /media-objects/{id} -> MediaObjects{id}
    .replace(PATH_PARAM_WITH_BRACKETS_REGEX, (group) => capitalize(group.slice(1, -1))) // {id} -> Id
    .replace(WORD_PRECEDED_BY_NON_WORD_CHARACTER, "_"); // "/robots.txt" -> "/robots_txt"
}

const MATCHER_REGEX = /{(\b\w+(?:-\w+)*\b)}/g;
export function replaceHyphenatedPath(path: string) {
  const matches = path.match(MATCHER_REGEX);
  if (matches === null) {
    return path.replaceAll(MATCHER_REGEX, ":$1");
  }

  matches.forEach((match) => {
    const replacement = pathParamToVariableName(match.replaceAll(MATCHER_REGEX, ":$1"));
    path = path.replaceAll(match, replacement);
  });
  return path;
}
