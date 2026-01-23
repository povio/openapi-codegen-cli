/* eslint-disable no-control-regex, no-useless-escape */
import { match, P } from "ts-pattern";
import { ALLOWED_PARAM_MEDIA_TYPES, PRIMITIVE_TYPE_LIST } from "src/generators/const/openapi.const";
import { ParameterObject, PrimitiveType, SingleType, SortingParameterObject } from "src/generators/types/openapi";
import { isSchemaObject } from "./openapi-schema.utils";
import { capitalize, kebabToCamel, snakeToCamel } from "./string.utils";

export const getSchemaRef = (schemaName: string) => `#/components/schemas/${schemaName}`;

export const autocorrectRef = (ref: string) => (ref[1] === "/" ? ref : "#/" + ref.slice(1));

export const getSchemaNameByRef = (ref: string) => autocorrectRef(ref).split("/").at(-1)!;

export function normalizeString(text: string) {
  const formatted = prefixStringStartingWithNumberIfNeeded(text)
    .normalize("NFKD") // The normalize() using NFKD method returns the Unicode Normalization Form of a given string.
    .trim() // Remove whitespace from both sides of a string (optional)
    .replace(/\s+/g, "_") // Replace spaces with _
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/-+/g, "_") // Replace - with _
    .replace(/[^\w-]+/g, "_"); // Remove all non-word chars
  return snakeToCamel(formatted);
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

export const isPrimitiveType = (type: SingleType | undefined): type is PrimitiveType =>
  PRIMITIVE_TYPE_LIST.includes(type as string);

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
    ALLOWED_PARAM_MEDIA_TYPES.includes(mediaType as string) ||
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
  return mediaType.startsWith("application/");
}

const PATH_PARAM_WITH_BRACKETS_REGEX = /({\w+})/g;
const WORD_PRECEDED_BY_NON_WORD_CHARACTER = /[^\w\-]+/g;
/** @example turns `/media-objects/{id}` into `MediaObjectsById` */
export function pathToVariableName(path: string) {
  path = capitalize(kebabToCamel(path.replaceAll("/", "-")).replaceAll("-", "")); // /media-objects/{id} -> MediaObjects{id}

  const pathParams = [...path.matchAll(PATH_PARAM_WITH_BRACKETS_REGEX)];
  if (pathParams.length > 0) {
    const lastPathParam = pathParams.toSorted((a, b) => a.index - b.index)[pathParams.length - 1][0];
    path = `${path.replace(PATH_PARAM_WITH_BRACKETS_REGEX, "")}By${capitalize(lastPathParam.slice(1, -1))}`; // MediaObjects{id} => MediaObjectsById
  }

  return path.replace(WORD_PRECEDED_BY_NON_WORD_CHARACTER, "_"); // "/robots.txt" -> "/robots_txt"
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

export const isSortingParameterObject = (param: ParameterObject): param is SortingParameterObject => {
  const enumNames = param["x-enumNames"];
  const hasEnumNames = Array.isArray(enumNames) && enumNames.length > 0;
  const isStringSchema = !!param.schema && isSchemaObject(param.schema) && param.schema.type === "string";
  return hasEnumNames && isStringSchema;
};

export const isPathExcluded = (path: string, options: { excludePathRegex: string }) => {
  if (!options.excludePathRegex) {
    return false;
  }
  const regex = new RegExp(options.excludePathRegex);
  return regex.test(path);
};
