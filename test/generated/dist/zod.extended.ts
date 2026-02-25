import { z } from "zod";
import { ErrorHandler, SharedErrorHandler } from "@povio/openapi-codegen-cli";

export namespace ZodExtended {
  interface ParseOptions {
    type: "body" | "query";
    name?: string;
    errorHandler?: ErrorHandler<never>;
  }

  export function parse<ZOutput, ZInput>(
    schema: z.ZodType<ZOutput, ZInput>,
    data: unknown,
    { type, name, errorHandler }: ParseOptions = { type: "body" },
  ) {
    try {
      return schema.parse(data);
    } catch (e) {
      if (e instanceof z.ZodError) {
        e.name = `FE Request ${type === "body" ? "body" : "query param"}${name ? ` ("${name}")` : ""} schema mismatch - ZodError`;
      }
      (errorHandler ?? SharedErrorHandler).rethrowError(e);
      throw e;
    }
  }

  function isSortExpValid(enumSchema: z.ZodEnum, data?: string) {
    if (data === undefined || data === "" || enumSchema.options.length === 0) {
      return true;
    }

    const prefixedEnumOptions = `([+-]?(${enumSchema.options.join("|")}))`;
    const commaSeparatedOptions = `(${prefixedEnumOptions})(\s*,\s*${prefixedEnumOptions})*`;
    return new RegExp(`^${commaSeparatedOptions}$`).test(data);
  }

  export const sortExp = (enumSchema: z.ZodEnum) =>
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
