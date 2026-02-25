import { ERROR_HANDLERS, ERROR_HANDLING_IMPORT, ZOD_EXTENDED } from "@/generators/const/deps.const";
import { ZOD_IMPORT } from "@/generators/const/zod.const";
import { SchemaResolver } from "@/generators/core/SchemaResolver.class";
import { Import } from "@/generators/types/generate";

export function generateZodExtended(resolver: SchemaResolver) {
  const errorHandlingImport: Import = {
    ...ERROR_HANDLING_IMPORT,
    from: resolver.options.errorHandlingImportPath ?? ERROR_HANDLING_IMPORT.from,
  };
  return `${renderImport(ZOD_IMPORT)}
${renderImport(errorHandlingImport)}

export namespace ZodExtended {
  interface ParseOptions {
    type: "body" | "query";
    name?: string;
    errorHandler?: ${ERROR_HANDLERS.ErrorHandler}<never>;
  }

  export function ${ZOD_EXTENDED.exports.parse}<ZOutput, ZInput>(
    schema: z.ZodType<ZOutput, ZInput>,
    data: unknown,
    { type, name, errorHandler }: ParseOptions = { type: "body" },
  ) {
    try {
      return schema.parse(data);
    } catch (e) {
      if (e instanceof z.ZodError) {
        e.name = \`FE Request \${type === "body" ? "body" : "query param"}\${name ? \` ("\${name}")\` : ""} schema mismatch - ZodError\`;
      }
      (errorHandler ?? ${ERROR_HANDLERS.SharedErrorHandler}).rethrowError(e);
      throw e;
    }
  }

  function isSortExpValid(enumSchema: z.ZodEnum, data?: string) {
    if (data === undefined || data === "" || enumSchema.options.length === 0) {
      return true;
    }

    const prefixedEnumOptions = \`([+-]?(\${enumSchema.options.join("|")}))\`;
    const commaSeparatedOptions = \`(\${prefixedEnumOptions})(\\s*,\\s*\${prefixedEnumOptions})*\`;
    return new RegExp(\`^\${commaSeparatedOptions}$\`).test(data);
  }

  export const ${ZOD_EXTENDED.exports.sortExp} = (enumSchema: z.ZodEnum) =>
    z.string().superRefine((arg, ctx) => {
      if (!isSortExpValid(enumSchema, arg)) {
        ctx.addIssue({
          code: "invalid_value",
          message: "Invalid sorting string.",
          values: [],
        });
      }
    });
}
`;
}

function renderImport(importData: Import) {
  const names = [
    ...(importData.defaultImport ? [importData.defaultImport] : []),
    ...(importData.bindings ? [`{ ${importData.bindings.join(", ")} }`] : []),
  ].join(", ");
  return `import ${names} from "${importData.from}";`;
}
