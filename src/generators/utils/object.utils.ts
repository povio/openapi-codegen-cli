import { Get } from "type-fest";
import { HasNestedPath, ObjectLiteral } from "../types/types";

/** Get a nested property value from a dot-delimited path. */
export function getNested<
  Path extends string,
  From extends ObjectLiteral,
  Return = HasNestedPath<Path> extends 1 ? From[Path] : Get<From, Path>,
>(obj: From, path: Path): Return {
  let target = obj || {};
  const props = path.split(".");
  for (let i = 0, len = props.length; i < len; ++i) {
    target = target[props[i] as keyof typeof target];
    if (target === undefined || target === null) {
      break;
    }
  }

  return target as unknown as Return;
}

/** Pick given properties in object */
export function pick<T extends ObjectLiteral, K extends keyof T>(obj: T, paths: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;

  Object.keys(obj).forEach((key) => {
    if (!paths.includes(key as K)) return;
    result[key as keyof Pick<T, K>] = obj[key];
  });

  return result;
}
