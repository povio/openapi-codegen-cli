import { OpenAPIV3 } from "openapi-types";

import { ZOD_IMPORT } from "@/generators/const/zod.const";
import { getZodSchemaRefs } from "@/generators/core/zod/getZodSchemaRefs";
import { Endpoint } from "@/generators/types/endpoint";
import { GenerateType, GenerateTypeParams, GenerateZodSchemaData, Import } from "@/generators/types/generate";
import { getModelsImports, getImportPath } from "@/generators/utils/generate/generate.imports.utils";
import {
  callLazySchemaReferences,
  getCircularSchemaDeclaration,
  getCodeSchemaReferences,
  ONCE_HELPER_LINES,
  stripModelNamespaceReferences,
} from "@/generators/utils/generate/generate.lazy.utils";
import { getTagImportPath } from "@/generators/utils/generate/generate.utils";
import {
  getZodSchemaDescription,
  getZodSchemaInferedTypeName,
  getZodSchemaPropertyDescriptions,
  getZodSchemaType,
} from "@/generators/utils/generate/generate.zod.utils";
import { getNamespaceName } from "@/generators/utils/namespace.utils";
import { isEnumZodSchema, isNamedZodSchema } from "@/generators/utils/zod-schema.utils";
import { getUniqueArray } from "@/generators/utils/array.utils";
import { getTupleSchemaParts, isReferenceObject } from "@/generators/utils/openapi-schema.utils";
import { wrapWithQuotesIfNeeded } from "@/generators/utils/openapi.utils";
import { escapeJsDocText } from "@/generators/utils/string.utils";

export function generateModels({ resolver, data, tag }: GenerateTypeParams) {
  const nativeContent = (
    resolver as GenerateTypeParams["resolver"] & { getNativeRenderedModels?: (tag: string) => string | undefined }
  ).getNativeRenderedModels?.(tag);
  if (nativeContent) return nativeContent;

  if (resolver.options.modelsInCommon && resolver.options.splitByTags && tag !== resolver.options.defaultTag) {
    return renderModelsProxy({ resolver, data, tag });
  }

  const zodSchemas = data.get(tag)?.zodSchemas;
  if (!zodSchemas || Object.keys(zodSchemas).length === 0) {
    return;
  }

  const refZodSchemas = [] as string[];
  for (const zodSchema of Object.keys(zodSchemas)) {
    const refs = getZodSchemaRefs(resolver, zodSchema);
    for (const ref of refs) {
      if (!zodSchemas[ref]) {
        refZodSchemas.push(ref);
      }
    }
  }
  // Generated schemas can reference schemas the dependency graph does not record (e.g. an inline
  // enum extracted to a shared enum owned by another tag), so the emitted code is the final source
  // of truth for which models need to be imported.
  if (!resolver.options.modelsInModules) {
    const knownSchemaNames = new Set(Array.from(data.values()).flatMap((tagData) => Object.keys(tagData.zodSchemas)));
    for (const code of Object.values(zodSchemas)) {
      for (const ref of getCodeSchemaReferences(code, knownSchemaNames)) {
        if (!zodSchemas[ref] && resolver.getTagByZodSchemaName(ref) !== tag) {
          refZodSchemas.push(ref);
        }
      }
    }
  }

  const modelsImports = getModelsImports({
    resolver,
    tag,
    zodSchemas: refZodSchemas,
  });

  const zodSchemasData: Record<string, GenerateZodSchemaData> = {};
  for (const [key, code] of Object.entries(zodSchemas)) {
    const schemaRef = resolver.getRefByZodSchemaName(key);
    zodSchemasData[key] = {
      code: resolver.options.modelsInModules
        ? stripModelNamespaceReferences(code, resolver.options.configs[GenerateType.Models].namespaceSuffix)
        : code,
      isCircular: schemaRef ? resolver.isSchemaCircular(schemaRef) : false,
      isEnum: isEnumZodSchema(code),
      schemaObj: resolver.getZodSchemaObj(key),
    };
  }

  const lines: string[] = [];
  lines.push(renderImport(ZOD_IMPORT));
  for (const modelsImport of modelsImports) {
    lines.push(renderImport(modelsImport));
  }
  lines.push("");

  if (resolver.options.lazySchemas && resolver.options.tsNamespaces) {
    return renderLazyModels({ resolver, tag, zodSchemasData, lines });
  }

  if (resolver.options.tsNamespaces) {
    lines.push(`export namespace ${getNamespaceName({ type: GenerateType.Models, tag, options: resolver.options })} {`);
  }

  for (const [name, zodSchema] of Object.entries(zodSchemasData)) {
    if (resolver.options.generateJsDoc === true) {
      lines.push(renderModelJsDocs({ name, zodSchema, tag, resolver }));
    }
    const inferredTypeName = getZodSchemaInferedTypeName(name, resolver.options);
    if (zodSchema.isCircular && zodSchema.schemaObj) {
      lines.push(`export type ${inferredTypeName} = ${renderSchemaType(zodSchema.schemaObj, resolver, tag)};`);
    }
    if (zodSchema.isCircular) {
      const circular = getCircularSchemaDeclaration(zodSchema.code, inferredTypeName);
      lines.push(`export const ${name}: ${circular.typeAnnotation} = ${circular.code};`);
    } else {
      const schemaCode = resolver.options.compileSchemas ? `z.compile(${zodSchema.code})` : zodSchema.code;
      lines.push(`export const ${name} = ${schemaCode};`);
    }
    if (!zodSchema.isCircular) {
      lines.push(`export type ${inferredTypeName} = z.infer<typeof ${name}>;`);
    }
    if (zodSchema.isEnum) {
      lines.push(`export const ${getZodSchemaInferedTypeName(name, resolver.options)} = ${name}.enum;`);
    }
    lines.push("");
  }

  if (resolver.options.tsNamespaces) {
    lines.push("}");
  }

  return lines.join("\n").trimEnd() + "\n";
}

// Lazy namespaces: every schema is a module-level memoized factory, the exported namespace
// object exposes them through getters, and a merged `declare namespace` keeps the inferred types.
// Nothing is built until a member is first read, so importing one schema no longer constructs
// every schema of the module.
function renderLazyModels({
  resolver,
  tag,
  zodSchemasData,
  lines,
}: {
  resolver: GenerateTypeParams["resolver"];
  tag: string;
  zodSchemasData: Record<string, GenerateZodSchemaData>;
  lines: string[];
}) {
  const namespace = getNamespaceName({ type: GenerateType.Models, tag, options: resolver.options });
  const schemaNames = new Set(Object.keys(zodSchemasData));
  const members: string[] = [];
  const types: string[] = [];

  lines.push(...ONCE_HELPER_LINES, "");

  for (const [name, zodSchema] of Object.entries(zodSchemasData)) {
    const inferredTypeName = getZodSchemaInferedTypeName(name, resolver.options);
    const circular = zodSchema.isCircular
      ? getCircularSchemaDeclaration(zodSchema.code, `${namespace}.${inferredTypeName}`)
      : undefined;
    const typeAnnotation = circular ? `: () => ${circular.typeAnnotation}` : "";
    const schemaCode = circular
      ? circular.code
      : resolver.options.compileSchemas
        ? `z.compile(${zodSchema.code})`
        : zodSchema.code;
    lines.push(`const ${name}${typeAnnotation} = once(() => ${callLazySchemaReferences(schemaCode, schemaNames)});`);
    if (resolver.options.generateJsDoc === true) {
      members.push(...indent(renderModelJsDocs({ name, zodSchema, tag, resolver }).split("\n")));
    }
    members.push(...renderLazyMember(name, `${name}()`));
    if (zodSchema.isCircular && zodSchema.schemaObj) {
      types.push(`  export type ${inferredTypeName} = ${renderSchemaType(zodSchema.schemaObj, resolver, tag)};`);
    } else {
      types.push(`  export type ${inferredTypeName} = z.infer<typeof ${namespace}.${name}>;`);
    }
    if (zodSchema.isEnum) {
      lines.push(`const ${inferredTypeName} = once(() => ${name}().enum);`);
      members.push(...renderLazyMember(inferredTypeName, `${inferredTypeName}()`));
    }
  }

  lines.push("");
  lines.push(`export const ${namespace} = {`, ...members, "};");
  lines.push(`export declare namespace ${namespace} {`, ...types, "}");

  return lines.join("\n") + "\n";
}

function renderLazyMember(name: string, value: string) {
  return [`  get ${name}() {`, `    return ${value};`, `  },`];
}

function indent(lines: string[]) {
  return lines.map((line) => `  ${line}`);
}

// Explicit types of circular schemas (which cannot be inferred) describe the output type of the
// generated zod schema, so they follow the zod generation rules: a schema's own `nullable`, defaults
// and optionality are applied by the chain where it is used (object properties, array items,
// additional properties), never on the schema itself, matching `z.infer` of non-circular schemas.
// Mirrored by `render_schema_type` in native/src/render.rs.
function renderSchemaType(
  schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject,
  resolver: GenerateTypeParams["resolver"],
  tag: string,
): string {
  const { options } = resolver;
  if (isReferenceObject(schema)) {
    return renderReferenceType(schema.$ref, resolver, tag);
  }

  const composite = schema.allOf ?? schema.oneOf ?? schema.anyOf;
  if (composite?.length) {
    const separator = schema.allOf ? " & " : " | ";
    const parts = composite.map((part) => renderSchemaType(part, resolver, tag));
    return parts.map((part) => (parts.length > 1 && /[|&]/.test(part) ? `(${part})` : part)).join(separator);
  }

  if (schema.enum?.length) {
    return schema.enum.map((value) => JSON.stringify(value)).join(" | ");
  }

  // Type arrays (OpenAPI 3.1) are a union of their types; `null` makes the schema nullable.
  if (Array.isArray(schema.type)) {
    const types = (schema.type as string[]).filter((type) => type !== "null");
    const parts = types.map((type) => renderSchemaType({ ...schema, type } as OpenAPIV3.SchemaObject, resolver, tag));
    if (types.length < schema.type.length) {
      parts.push("null");
    }
    return parts.map((part) => (parts.length > 1 && /[|&]/.test(part) ? `(${part})` : part)).join(" | ");
  }

  if (schema.type === "array") {
    const tuple = getTupleSchemaParts(schema);
    if (tuple) {
      const required = schema.minItems ?? 0;
      const itemTypes = tuple.items.map((item) => addNullable(item, renderSchemaType(item, resolver, tag)));
      const restType =
        tuple.rest === false
          ? undefined
          : typeof tuple.rest === "object"
            ? addNullable(tuple.rest, renderSchemaType(tuple.rest, resolver, tag))
            : "unknown";
      // zod's readonly output keeps the tuple shape only when the first member is required;
      // otherwise it widens to a readonly array of the member types.
      if (options.allReadonly && !(itemTypes.length > 0 && required > 0)) {
        const elementTypes = [
          ...itemTypes.map((itemType, index) => (index < required ? itemType : `${itemType} | undefined`)),
          ...(restType ? [restType] : []),
        ];
        return `ReadonlyArray<${elementTypes.length ? elementTypes.join(" | ") : "never"}>`;
      }
      // Members after `minItems` are optional, matching the generated `.optional()` tuple members.
      const members = itemTypes.map((itemType, index) => {
        if (index < required) {
          return itemType;
        }
        return /[|&]/.test(itemType) ? `(${itemType})?` : `${itemType}?`;
      });
      if (restType) {
        members.push(`...${/[|&]/.test(restType) ? `(${restType})` : restType}[]`);
      }
      return `${options.allReadonly ? "readonly " : ""}[${members.join(", ")}]`;
    }
    const itemType = schema.items
      ? addNullable(schema.items, renderSchemaType(schema.items, resolver, tag))
      : "unknown";
    return options.allReadonly ? `ReadonlyArray<${itemType}>` : `Array<${itemType}>`;
  }

  if (schema.type === "object" || schema.properties || schema.additionalProperties) {
    const isPartial = !options.withImplicitRequiredProps && Boolean(schema.properties) && !schema.required?.length;
    const properties = Object.entries(schema.properties ?? {}).map(([name, property]) => {
      const isRequired = isPartial
        ? true
        : schema.required?.length
          ? schema.required.includes(name)
          : options.withImplicitRequiredProps;
      // `resolveObject` is also implemented by the native-extraction resolver (hybrid rendering).
      const resolved = resolver.resolveObject<OpenAPIV3.SchemaObject | undefined>(property);
      const hasDefault = options.withDefaultValues !== false && resolved?.default !== undefined;
      const isNullable =
        Boolean(resolved?.nullable) || (options.replaceOptionalWithNullish && (isPartial || !isRequired));
      const optional = isPartial || (!isRequired && !hasDefault) ? "?" : "";
      const propertyType = renderSchemaType(property, resolver, tag);
      const outputType = isNullable && propertyType !== "null" ? `${propertyType} | null` : propertyType;
      return `${wrapWithQuotesIfNeeded(name)}${optional}: ${outputType}`;
    });
    let indexType: string | undefined;
    if (schema.additionalProperties) {
      const valueType =
        typeof schema.additionalProperties === "object"
          ? addNullable(schema.additionalProperties, renderSchemaType(schema.additionalProperties, resolver, tag))
          : "unknown";
      indexType = `{ [key: string]: ${valueType} }`;
    }
    // Like zod's catchall output, properties and the index signature are intersected, so property
    // types need not be assignable to the additional properties type. Each part is made readonly
    // on its own: `Readonly<A & B>` of a recursive type would circularly reference itself.
    const readonly = (type: string) => (options.allReadonly ? `Readonly<${type}>` : type);
    if (indexType && properties.length > 0) {
      return `${readonly(`{ ${properties.join("; ")} }`)} & ${readonly(indexType)}`;
    }
    return readonly(indexType ?? `{ ${properties.join("; ")} }`);
  }

  switch (schema.type) {
    case "string":
      return schema.format === "binary" ? "Blob" : "string";
    case "number":
    case "integer":
      return "number";
    case "boolean":
      return "boolean";
    default:
      return (schema.type as string | undefined) === "null" ? "null" : "unknown";
  }
}

// A referenced schema's type as seen from `tag`'s models file. The schema code references the same
// model, so its namespace (or, without namespaces, its schema) is already imported.
function renderReferenceType(ref: string, resolver: GenerateTypeParams["resolver"], tag: string) {
  const schemaName = resolver.getZodSchemaNameByRef(ref);
  const typeName = getZodSchemaInferedTypeName(schemaName, resolver.options);
  if (resolver.options.modelsInModules) {
    return typeName;
  }
  const owner = resolver.getTagByZodSchemaName(schemaName);
  if (owner === tag) {
    return typeName;
  }
  return resolver.options.tsNamespaces
    ? `${getNamespaceName({ type: GenerateType.Models, tag: owner, options: resolver.options })}.${typeName}`
    : `z.infer<typeof ${schemaName}>`;
}

// Nullability added by the zod chain of an (unresolved) array item or additional properties schema.
function addNullable(schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject, type: string) {
  return !isReferenceObject(schema) && schema.nullable && type !== "null" ? `${type} | null` : type;
}

function renderModelsProxy({ resolver, data, tag }: GenerateTypeParams) {
  const commonZodSchemas = data.get(resolver.options.defaultTag)?.zodSchemas ?? {};
  const endpoints = data.get(tag)?.endpoints ?? [];
  const schemaNames = getUsedSchemaNames({ resolver, endpoints }).filter((schemaName) =>
    Boolean(commonZodSchemas[schemaName]),
  );
  if (schemaNames.length === 0) {
    return;
  }

  const modelsNamespace = getNamespaceName({ type: GenerateType.Models, tag, options: resolver.options });
  const commonNamespace = getNamespaceName({
    type: GenerateType.Models,
    tag: resolver.options.defaultTag,
    options: resolver.options,
  });
  const commonModelsPath = `${getImportPath(resolver.options)}${getTagImportPath({
    type: GenerateType.Models,
    tag: resolver.options.defaultTag,
    includeTagDir: true,
    options: resolver.options,
  })}`;
  const inferredTypeNames = schemaNames.map((schemaName) => getZodSchemaInferedTypeName(schemaName, resolver.options));
  const enumInferredTypeNames = schemaNames
    .filter((schemaName) => isEnumZodSchema(commonZodSchemas[schemaName] ?? ""))
    .map((schemaName) => getZodSchemaInferedTypeName(schemaName, resolver.options));

  if (resolver.options.tsNamespaces && resolver.options.lazySchemas) {
    const lines: string[] = [];
    lines.push(`import { ${commonNamespace} } from "${commonModelsPath}";`);
    lines.push("");
    lines.push(`export const ${modelsNamespace} = {`);
    for (const schemaName of schemaNames) {
      lines.push(...renderLazyMember(schemaName, `${commonNamespace}.${schemaName}`));
    }
    for (const enumName of enumInferredTypeNames) {
      lines.push(...renderLazyMember(enumName, `${commonNamespace}.${enumName}`));
    }
    lines.push("};");
    lines.push(`export declare namespace ${modelsNamespace} {`);
    for (const typeName of inferredTypeNames) {
      lines.push(`  export type ${typeName} = ${commonNamespace}.${typeName};`);
    }
    lines.push("}");
    lines.push("");
    return lines.join("\n");
  }

  if (resolver.options.tsNamespaces) {
    const lines: string[] = [];
    lines.push(`import { ${commonNamespace} } from "${commonModelsPath}";`);
    lines.push("");
    lines.push(`export namespace ${modelsNamespace} {`);
    for (const schemaName of schemaNames) {
      lines.push(`  export const ${schemaName} = ${commonNamespace}.${schemaName};`);
    }
    for (const typeName of inferredTypeNames) {
      lines.push(`  export type ${typeName} = ${commonNamespace}.${typeName};`);
    }
    for (const enumName of enumInferredTypeNames) {
      lines.push(`  export const ${enumName} = ${commonNamespace}.${enumName};`);
    }
    lines.push("}");
    lines.push("");
    return lines.join("\n");
  }

  const valueExports = getUniqueArray([...schemaNames, ...enumInferredTypeNames]);

  const lines: string[] = [];
  if (valueExports.length > 0) {
    lines.push(`export { ${valueExports.join(", ")} } from "${commonModelsPath}";`);
  }
  if (inferredTypeNames.length > 0) {
    lines.push(`export type { ${inferredTypeNames.join(", ")} } from "${commonModelsPath}";`);
  }

  return lines.join("\n") + "\n";
}

function getUsedSchemaNames({
  resolver,
  endpoints,
}: {
  resolver: GenerateTypeParams["resolver"];
  endpoints: Endpoint[];
}) {
  const usedSchemaNames = new Set<string>();
  const queue: string[] = [];

  const enqueue = (schemaName?: string) => {
    if (!schemaName || !isNamedZodSchema(schemaName) || usedSchemaNames.has(schemaName)) {
      return;
    }
    usedSchemaNames.add(schemaName);
    queue.push(schemaName);
  };

  for (const endpoint of endpoints) {
    enqueue(endpoint.response);
    for (const error of endpoint.errors) {
      enqueue(error.zodSchema);
    }
    for (const param of endpoint.parameters) {
      enqueue(param.zodSchema);
      enqueue(param.parameterSortingEnumSchemaName);
    }
  }

  let queueIndex = 0;
  while (queueIndex < queue.length) {
    const schemaName = queue[queueIndex++];
    if (!schemaName) {
      continue;
    }
    const refs = getZodSchemaRefs(resolver, schemaName);
    for (const ref of refs) {
      enqueue(ref);
    }
  }

  return Array.from(usedSchemaNames);
}

function renderImport(importData: Import) {
  const namedImports = [
    ...importData.bindings,
    ...(importData.typeBindings ?? []).map((binding) => (importData.typeOnly ? binding : `type ${binding}`)),
  ];
  const names = [
    ...(importData.defaultImport ? [importData.defaultImport] : []),
    ...(namedImports.length > 0 ? [`{ ${namedImports.join(", ")} }`] : []),
  ].join(", ");
  return `import${importData.typeOnly ? " type" : ""} ${names} from "${importData.from}";`;
}

function renderModelJsDocs({
  name,
  zodSchema,
  tag,
  resolver,
}: {
  name: string;
  zodSchema: GenerateZodSchemaData;
  tag: string;
  resolver: GenerateTypeParams["resolver"];
}) {
  if (resolver.options.generateJsDoc !== true) return "";
  const lines = [`/** `, ` * ${name} `, ` * @type { ${getZodSchemaType(zodSchema)} }`];

  const description = getZodSchemaDescription(zodSchema);
  if (description) {
    lines.push(` * @description ${description.replace(/\n/g, "\n *")}`);
  }

  const propertyDescriptions = getZodSchemaPropertyDescriptions(resolver, zodSchema, tag);
  if (propertyDescriptions) {
    for (const [property, info] of Object.entries(propertyDescriptions)) {
      lines.push(` * @property { ${info.type} } ${property} ${info.description.replace(/\n/g, "\n *")} `);
    }
  }

  return [...lines.map(escapeJsDocText), " */"].join("\n");
}
