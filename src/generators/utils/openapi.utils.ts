import { OpenAPIV3 } from "openapi-types";
import { match, P } from "ts-pattern";
import { ALLOWED_PARAM_MEDIA_TYPES, PRIMITIVE_TYPE_LIST } from "../const/openapi.const";
import { PrimitiveType, SingleType } from "../types/openapi";
import { GenerateOptions } from "../types/options";
import { capitalize, kebabToCamel, nonWordCharactersToCamel, snakeToCamel } from "./string.utils";

export const getSchemaRef = (schemaName: string) => `#/components/schemas/${schemaName}`;

export const autocorrectRef = (ref: string) => (ref[1] === "/" ? ref : "#/" + ref.slice(1));

export const getSchemaNameByRef = (ref: string) => autocorrectRef(ref).split("/").at(-1)!;

export function isReferenceObject(obj: any): obj is OpenAPIV3.ReferenceObject {
  return obj != null && Object.prototype.hasOwnProperty.call(obj, "$ref");
}

export function normalizeString(text: string) {
  const prefixed = prefixStringStartingWithNumberIfNeeded(text);
  return prefixed
    .normalize("NFKD") // The normalize() using NFKD method returns the Unicode Normalization Form of a given string.
    .trim() // Remove whitespace from both sides of a string (optional)
    .replace(/\s+/g, "_") // Replace spaces with _
    .replace(/-+/g, "_") // Replace - with _
    .replace(/[^\w\-]+/g, "_") // Remove all non-word chars
    .replace(/--+/g, "-"); // Replace multiple - with single -
}

export function wrapWithQuotesIfNeeded(str: string) {
  if (/^[a-zA-Z]\w*$/.test(str)) {
    return str;
  }

  return `"${str}"`;
}

// TODO OA prefixItems -> z.tuple
export function unwrapQuotesIfNeeded(value: string | number) {
  if (typeof value === "string" && value.startsWith('"') && value.endsWith('"')) {
    return value.slice(1, -1);
  }

  return value;
}

function prefixStringStartingWithNumberIfNeeded(str: string) {
  const firstAsNumber = Number(str[0]);
  if (typeof firstAsNumber === "number" && !Number.isNaN(firstAsNumber)) {
    return "_" + str;
  }

  return str;
}

export function pathParamToVariableName(name: string) {
  // Replace all underscores with # to preserve them when doing snakeToCamel
  const preserveUnderscore = name.replaceAll("_", "#");
  return snakeToCamel(preserveUnderscore.replaceAll("-", "_")).replaceAll("#", "_");
}

export const isPrimitiveType = (type: SingleType): type is PrimitiveType => PRIMITIVE_TYPE_LIST.includes(type as any);

export function primitiveTypeToTsType(type: PrimitiveType): string {
  return match(type)
    .with("string", () => "string")
    .with("number", () => "number")
    .with("integer", () => "number")
    .with("boolean", () => "boolean")
    .exhaustive();
}

export function escapeControlCharacters(str: string): string {
  return str
    .replace(/\t/g, "\\t") // U+0009
    .replace(/\n/g, "\\n") // U+000A
    .replace(/\r/g, "\\r") // U+000D
    .replace(/([\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F\uFFFE\uFFFF])/g, (_m, p1) => {
      const dec: number = p1.codePointAt();
      const hex: string = dec.toString(16);
      if (dec <= 0xff) return `\\x${`00${hex}`.slice(-2)}`;
      return `\\u${`0000${hex}`.slice(-4)}`;
    })
    .replace(/\//g, "\\/");
}

export const toBoolean = (value: undefined | string | boolean, defaultValue: boolean) =>
  match(value)
    .with(P.string.regex(/^false$/i), false, () => false)
    .with(P.string.regex(/^true$/i), true, () => true)
    .otherwise(() => defaultValue);

export function isParamMediaTypeAllowed(
  mediaType: string,
): mediaType is (typeof ALLOWED_PARAM_MEDIA_TYPES)[number] | `application/${string}json${string}` | `text/${string}` {
  return (
    (mediaType.includes("application/") && mediaType.includes("json")) ||
    ALLOWED_PARAM_MEDIA_TYPES.includes(mediaType as any) ||
    mediaType.includes("text/")
  );
}

export function isMainResponseStatus(status: number) {
  return status >= 200 && status < 300;
}

export function isErrorStatus(status: number) {
  return !(status >= 200 && status < 300);
}

export function isMediaTypeAllowed(mediaType: string) {
  return mediaType === "application/json";
}

export function getOperationName(path: string, method: string, operation: OpenAPIV3.OperationObject) {
  return operation.operationId ?? method + pathToVariableName(path);
}

export function formatTag(tag: string) {
  return nonWordCharactersToCamel(tag);
}

export function getOperationTag(operation: OpenAPIV3.OperationObject, options: GenerateOptions) {
  const tag = operation.tags?.[0];
  return formatTag(tag ?? options.defaultTag);
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
