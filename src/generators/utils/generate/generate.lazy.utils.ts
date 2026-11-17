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

interface CodeIdentifier {
  identifier: string;
  /** The identifier follows a `.` (`CommonModels.PetSchema`, `.enum`). */
  isMemberAccess: boolean;
  /** The identifier is an object key (`{ PetSchema: ... }`). */
  isObjectKey: boolean;
  /** The first character after the identifier. */
  nextChar: string | undefined;
}

/**
 * Walks generated schema code and rewrites its identifiers through `replace`. String, template and
 * regex literals are copied unchanged, so literal data (enum values, defaults, patterns) is never
 * mistaken for a symbol reference. `replace` may also consume the character following the
 * identifier (e.g. the `.` of a namespace prefix). The native renderer mirrors this scanner.
 */
export function rewriteCodeIdentifiers(
  code: string,
  replace: (identifier: CodeIdentifier) => { text: string; consumeNextChar?: boolean },
) {
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
      const { text, consumeNextChar } = replace({
        identifier: code.slice(index, end),
        // A spread (`...PetSchema.shape`) is not a member access.
        isMemberAccess: output.endsWith(".") && !output.endsWith("..."),
        isObjectKey: code.slice(end).trimStart().startsWith(":"),
        nextChar: code[end],
      });
      output += text;
      index = consumeNextChar ? end + 1 : end;
      continue;
    }
    output += char;
    index += 1;
  }
  return output;
}

/**
 * Rewrites bare references to sibling schemas (`PetSchema`) into factory calls (`PetSchema()`).
 * Member accesses (`CommonModels.PetSchema`, `.enum`), object keys and literal values are left alone.
 */
export function callLazySchemaReferences(code: string, schemaNames: ReadonlySet<string>) {
  return rewriteCodeIdentifiers(code, ({ identifier, isMemberAccess, isObjectKey }) => ({
    text: schemaNames.has(identifier) && !isMemberAccess && !isObjectKey ? `${identifier}()` : identifier,
  }));
}

const isModelNamespace = (identifier: string, namespaceSuffix: string) =>
  identifier.length > namespaceSuffix.length && identifier.endsWith(namespaceSuffix) && /^[A-Z]/.test(identifier);

/**
 * Removes model namespace qualifiers (`CommonModels.PetSchema` -> `PetSchema`) from symbol
 * references, leaving literal values untouched. Used when every referenced model is emitted
 * into the module itself (`modelsInModules`).
 */
export function stripModelNamespaceReferences(code: string, namespaceSuffix: string) {
  return rewriteCodeIdentifiers(code, ({ identifier, isMemberAccess, isObjectKey, nextChar }) =>
    !isMemberAccess && !isObjectKey && nextChar === "." && isModelNamespace(identifier, namespaceSuffix)
      ? { text: "", consumeNextChar: true }
      : { text: identifier },
  );
}

/**
 * Returns the schema names a piece of generated code refers to, bare (`PetSchema`) or namespace
 * qualified (`CommonModels.PetSchema`), in order of first appearance. Literals and object keys
 * are ignored.
 */
export function getCodeSchemaReferences(code: string, schemaNames: ReadonlySet<string>) {
  const references = new Set<string>();
  rewriteCodeIdentifiers(code, ({ identifier, isObjectKey }) => {
    if (!isObjectKey && schemaNames.has(identifier)) references.add(identifier);
    return { text: identifier };
  });
  return Array.from(references);
}

const OBJECT_PRESERVING_METHODS = new Set([
  "partial",
  "required",
  "catchall",
  "strict",
  "strip",
  "passthrough",
  "extend",
]);

/** Returns the index just past the `)` that closes the call opened at `openIndex`, or -1. */
const findCallEnd = (code: string, openIndex: number) => {
  let depth = 0;
  let index = openIndex;
  while (index < code.length) {
    const char = code[index]!;
    if (char === '"' || char === "'" || char === "`") {
      index = findLiteralEnd(code, index, char);
      continue;
    }
    if (char === "/" && code.slice(0, index).trimEnd().endsWith(".regex(")) {
      index = findRegexEnd(code, index);
      continue;
    }
    if (char === "(" || char === "[" || char === "{") depth += 1;
    if (char === ")" || char === "]" || char === "}") {
      depth -= 1;
      if (depth === 0) return index + 1;
    }
    index += 1;
  }
  return -1;
};

/**
 * Whether generated schema code evaluates to a `z.ZodObject`: a `z.object(...)` call followed only
 * by methods that return an object schema again (`.partial()`, `.catchall(...)`, ...).
 */
export function isZodObjectCode(code: string) {
  const prefix = "z.object(";
  if (!code.startsWith(prefix)) return false;
  let index = findCallEnd(code, prefix.length - 1);
  while (index !== -1 && index < code.length) {
    const method = /^\.([A-Za-z]+)\(/.exec(code.slice(index));
    if (!method || !OBJECT_PRESERVING_METHODS.has(method[1]!)) return false;
    index = findCallEnd(code, index + method[0].length - 1);
  }
  return index === code.length;
}

/**
 * Circular schemas need an explicit type annotation and must not read their own binding while
 * it is being initialized. Object schemas already defer recursive members with `z.lazy`, so
 * they keep their `ZodObject` type (`ZodReadonly<ZodObject>` with `allReadonly`, so that allOf
 * members can unwrap it); any other schema (unions, arrays, intersections, ...) is wrapped in
 * `z.lazy` as a whole and typed as a plain `ZodType`.
 */
export function getCircularSchemaDeclaration(code: string, typeName: string) {
  if (isZodObjectCode(code)) {
    return { typeAnnotation: `z.ZodObject<z.ZodRawShape> & z.ZodType<${typeName}>`, code };
  }
  if (code.endsWith(READONLY_SUFFIX) && isZodObjectCode(code.slice(0, -READONLY_SUFFIX.length))) {
    return { typeAnnotation: `z.ZodReadonly<z.ZodObject<z.ZodRawShape>> & z.ZodType<${typeName}>`, code };
  }
  return { typeAnnotation: `z.ZodType<${typeName}>`, code: `z.lazy(() => ${code})` };
}

const READONLY_SUFFIX = ".readonly()";
