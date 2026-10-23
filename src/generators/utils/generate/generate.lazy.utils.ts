// Lazy model schemas: the models namespace becomes an object of getters backed by memoized
// factories, so a schema is built on first access instead of when the module is imported.
// The native renderer (native/src/render.rs) mirrors this output byte for byte.

export const ONCE_HELPER_LINES = [
  "const once = <T>(create: () => T) => {",
  "  let value: T | undefined;",
  "  return () => (value ??= create());",
  "};",
];

const isIdentifierChar = (char: string) => /[A-Za-z0-9_$]/.test(char);

const findLiteralEnd = (code: string, start: number, quote: string) => {
  let index = start + 1;
  while (index < code.length) {
    const char = code[index];
    if (char === "\\") {
      index += 2;
      continue;
    }
    index += 1;
    if (char === quote) break;
  }
  return Math.min(index, code.length);
};

const findRegexEnd = (code: string, start: number) => {
  let escaped = false;
  let characterClass = false;
  for (let index = start + 1; index < code.length; index += 1) {
    const char = code[index];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === "\\") {
      escaped = true;
      continue;
    }
    if (char === "[") characterClass = true;
    if (char === "]") characterClass = false;
    if (char === "/" && !characterClass) return index + 1;
  }
  return code.length;
};

/**
 * Rewrites bare references to sibling schemas (`PetSchema`) into factory calls (`PetSchema()`).
 * Member accesses (`CommonModels.PetSchema`, `.enum`), object keys and literal values are left alone.
 */
export function callLazySchemaReferences(code: string, schemaNames: ReadonlySet<string>) {
  let output = "";
  let index = 0;
  while (index < code.length) {
    const char = code[index]!;
    if (char === '"' || char === "'" || char === "`") {
      const end = findLiteralEnd(code, index, char);
      output += code.slice(index, end);
      index = end;
      continue;
    }
    if (char === "/" && output.trimEnd().endsWith(".regex(")) {
      const end = findRegexEnd(code, index);
      output += code.slice(index, end);
      index = end;
      continue;
    }
    if (isIdentifierChar(char)) {
      let end = index + 1;
      while (end < code.length && isIdentifierChar(code[end]!)) end += 1;
      const identifier = code.slice(index, end);
      const isMemberAccess = output.endsWith(".");
      const isObjectKey = code.slice(end).trimStart().startsWith(":");
      output += schemaNames.has(identifier) && !isMemberAccess && !isObjectKey ? `${identifier}()` : identifier;
      index = end;
      continue;
    }
    output += char;
    index += 1;
  }
  return output;
}
