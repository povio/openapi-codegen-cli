import { OpenAPIV3 } from "openapi-types";

import { ZOD_IMPORT } from "@/generators/const/zod.const";
import { getZodSchemaRefs } from "@/generators/core/zod/getZodSchemaRefs";
import { Endpoint } from "@/generators/types/endpoint";
import { GenerateType, GenerateTypeParams, GenerateZodSchemaData, Import } from "@/generators/types/generate";
import { getModelsImports, getImportPath } from "@/generators/utils/generate/generate.imports.utils";
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
import { isReferenceObject } from "@/generators/utils/openapi-schema.utils";
import { wrapWithQuotesIfNeeded } from "@/generators/utils/openapi.utils";

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

  const modelsImports = getModelsImports({
    resolver,
    tag,
    zodSchemas: refZodSchemas,
  });

  const zodSchemasData: Record<string, GenerateZodSchemaData> = {};
  for (const [key, code] of Object.entries(zodSchemas)) {
    const schemaRef = resolver.getRefByZodSchemaName(key);
    zodSchemasData[key] = {
      code,
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

  if (resolver.options.tsNamespaces) {
    lines.push(`export namespace ${getNamespaceName({ type: GenerateType.Models, tag, options: resolver.options })} {`);
  }

  for (const [name, zodSchema] of Object.entries(zodSchemasData)) {
    lines.push(renderModelJsDocs({ name, zodSchema, tag, resolver }));
    const inferredTypeName = getZodSchemaInferedTypeName(name, resolver.options);
    if (zodSchema.isCircular && zodSchema.schemaObj) {
      lines.push(`export type ${inferredTypeName} = ${renderSchemaType(zodSchema.schemaObj, resolver)};`);
    }
    const typeAnnotation = zodSchema.isCircular ? `: z.ZodObject<z.ZodRawShape> & z.ZodType<${inferredTypeName}>` : "";
    lines.push(`export const ${name}${typeAnnotation} = ${zodSchema.code};`);
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

function renderSchemaType(
  schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject,
  resolver: GenerateTypeParams["resolver"],
): string {
  if (isReferenceObject(schema)) {
    const schemaName = resolver.getZodSchemaNameByRef(schema.$ref);
    return schemaName ? getZodSchemaInferedTypeName(schemaName, resolver.options) : "unknown";
  }

  const composite = schema.allOf ?? schema.oneOf ?? schema.anyOf;
  if (composite?.length) {
    const separator = schema.allOf ? " & " : " | ";
    return addNullable(schema, composite.map((part) => renderSchemaType(part, resolver)).join(separator));
  }

  if (schema.enum?.length) {
    return addNullable(schema, schema.enum.map((value) => JSON.stringify(value)).join(" | "));
  }

  if (schema.type === "array") {
    const itemType = schema.items ? renderSchemaType(schema.items, resolver) : "unknown";
    return addNullable(schema, `Array<${itemType}>`);
  }

  if (schema.type === "object" || schema.properties || schema.additionalProperties) {
    const properties = Object.entries(schema.properties ?? {}).map(([name, property]) => {
      const isRequired = resolver.options.withImplicitRequiredProps || schema.required?.includes(name);
      const hasDefault = !isReferenceObject(property) && property.default !== undefined;
      const optional = isRequired || hasDefault ? "" : "?";
      const propertyType = renderSchemaType(property, resolver);
      const outputType =
        resolver.options.replaceOptionalWithNullish && optional && (isReferenceObject(property) || !property.nullable)
          ? `${propertyType} | null`
          : propertyType;
      return `${wrapWithQuotesIfNeeded(name)}${optional}: ${outputType}`;
    });
    if (schema.additionalProperties) {
      const valueType =
        typeof schema.additionalProperties === "object"
          ? renderSchemaType(schema.additionalProperties, resolver)
          : "unknown";
      properties.push(`[key: string]: ${valueType}`);
    }
    return addNullable(schema, `{ ${properties.join("; ")} }`);
  }

  const primitiveType = schema.type;
  const type =
    primitiveType === "string"
      ? "string"
      : primitiveType === "number" || primitiveType === "integer"
        ? "number"
        : primitiveType === "boolean"
          ? "boolean"
          : primitiveType === "null"
            ? "null"
            : "unknown";
  return addNullable(schema, type);
}

function addNullable(schema: OpenAPIV3.SchemaObject, type: string) {
  return schema.nullable && type !== "null" ? `${type} | null` : type;
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

  lines.push(" */");
  return lines.join("\n");
}
