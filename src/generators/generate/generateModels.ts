import { ZOD_IMPORT } from "@/generators/const/zod.const";
import { getZodSchemaRefs } from "@/generators/core/zod/getZodSchemaRefs";
import { GenerateType, GenerateTypeParams, GenerateZodSchemaData, Import } from "@/generators/types/generate";
import { getModelsImports } from "@/generators/utils/generate/generate.imports.utils";
import {
  getZodSchemaDescription,
  getZodSchemaInferedTypeName,
  getZodSchemaPropertyDescriptions,
  getZodSchemaType,
} from "@/generators/utils/generate/generate.zod.utils";
import { getNamespaceName } from "@/generators/utils/namespace.utils";
import { isEnumZodSchema } from "@/generators/utils/zod-schema.utils";

export function generateModels({ resolver, data, tag }: GenerateTypeParams) {
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
      isCiruclar: schemaRef ? resolver.isSchemaCircular(schemaRef) : false,
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
    lines.push(`export const ${name} = ${zodSchema.code};`);
    lines.push(`export type ${getZodSchemaInferedTypeName(name, resolver.options)} = z.infer<typeof ${name}>;`);
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

function renderImport(importData: Import) {
  const names = [
    ...(importData.defaultImport ? [importData.defaultImport] : []),
    ...(importData.bindings ? [`{ ${importData.bindings.join(", ")} }`] : []),
  ].join(", ");
  return `import ${names} from "${importData.from}";`;
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
