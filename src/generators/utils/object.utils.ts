import { HasNestedPath, ObjectLiteral } from "@/generators/types/common";
import { Get } from "type-fest";

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

/**
 * Deep merge two or more objects/arrays recursively.
 * Arrays are concatenated, objects are merged recursively.
 * Later arguments take precedence over earlier ones.
 * Returns a new object/array without mutating the originals.
 */
export function deepMerge<T>(source: T, ...sources: Partial<T>[]): T {
  if (sources.length === 0) {
    return source;
  }

  let result = source;
  for (const source of sources) {
    result = mergeTwoValues(result, source) as T;
  }

  return result;
}

/**
 * Merge two values recursively
 */
function mergeTwoValues<T>(target: T, source: T): T {
  // Handle null/undefined sources
  if (source === null || source === undefined) {
    return target;
  }

  // If target is null/undefined, replace with source
  if (target === null || target === undefined) {
    return deepClone(source);
  }

  // Handle array merging
  if (Array.isArray(target) && Array.isArray(source)) {
    return [...target, ...source] as T;
  }

  // Handle object merging
  if (isPlainObject(target) && isPlainObject(source)) {
    const result = {} as ObjectLiteral;

    // First, deep clone all properties from target
    for (const [key, targetValue] of Object.entries(target)) {
      result[key] = deepClone(targetValue);
    }

    // Then merge in properties from source
    for (const [key, sourceValue] of Object.entries(source)) {
      const targetValue = result[key];

      if (sourceValue === undefined) {
        // Skip undefined values - don't override target
        continue;
      } else if (sourceValue === null) {
        result[key] = sourceValue;
      } else if (isPlainObject(targetValue) && isPlainObject(sourceValue)) {
        result[key] = mergeTwoValues(targetValue, sourceValue);
      } else if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
        result[key] = [...targetValue, ...sourceValue];
      } else {
        result[key] = deepClone(sourceValue);
      }
    }

    return result as T;
  }

  // For primitive types or type mismatches, source takes precedence
  return deepClone(source);
}

/**
 * Deep clone an object or array to avoid reference sharing.
 * Helper function for deepMerge.
 */
function deepClone<T>(obj: T): T {
  if (obj === null || obj === undefined || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item)) as T;
  }

  if (isPlainObject(obj)) {
    const result = {} as ObjectLiteral;
    for (const [key, value] of Object.entries(obj)) {
      result[key] = deepClone(value);
    }
    return result as T;
  }

  // For other object types (Date, RegExp, etc.), return as is
  return obj;
}

/**
 * Check if a value is a plain object (not an array, Date, etc.)
 */
function isPlainObject(obj: unknown): obj is ObjectLiteral {
  return (
    obj !== null &&
    typeof obj === "object" &&
    !Array.isArray(obj) &&
    Object.prototype.toString.call(obj) === "[object Object]"
  );
}
