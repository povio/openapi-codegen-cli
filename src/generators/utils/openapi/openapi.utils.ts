import { OpenAPIV3 } from "openapi-types";
import { match, P } from "ts-pattern";
import { snakeToCamel } from "../string.utils";

export const asComponentSchema = (name: string) => `#/components/schemas/${name}`;

export const autocorrectRef = (ref: string) => (ref[1] === "/" ? ref : "#/" + ref.slice(1));

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

export const wrapWithQuotesIfNeeded = (str: string) => {
  if (/^[a-zA-Z]\w*$/.test(str)) {
    return str;
  }

  return `"${str}"`;
};

const prefixStringStartingWithNumberIfNeeded = (str: string) => {
  const firstAsNumber = Number(str[0]);
  if (typeof firstAsNumber === "number" && !Number.isNaN(firstAsNumber)) {
    return "_" + str;
  }

  return str;
};

export const pathParamToVariableName = (name: string) => {
  // Replace all underscores with # to preserve them when doing snakeToCamel
  const preserveUnderscore = name.replaceAll("_", "#");
  return snakeToCamel(preserveUnderscore.replaceAll("-", "_")).replaceAll("#", "_");
};

type SingleType = Exclude<OpenAPIV3.SchemaObject["type"], any[] | undefined>;
export const isPrimitiveType = (type: SingleType): type is PrimitiveType => PRIMITIVE_TYPE_LIST.includes(type as any);

const PRIMITIVE_TYPE_LIST = ["string", "number", "integer", "boolean"] as const;
export type PrimitiveType = (typeof PRIMITIVE_TYPE_LIST)[number];

export const escapeControlCharacters = (str: string): string => {
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
};

export const toBoolean = (value: undefined | string | boolean, defaultValue: boolean) =>
  match(value)
    .with(P.string.regex(/^false$/i), false, () => false)
    .with(P.string.regex(/^true$/i), true, () => true)
    .otherwise(() => defaultValue);
