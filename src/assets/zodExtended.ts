/* eslint-disable no-useless-escape */
import { z } from "zod";

export const zodExtended = {
  sortingString: (enumSchema: z.ZodEnum<[string, ...string[]]>) =>
    z.string().superRefine((val, ctx) => {
      if (!isSortingStringValid(val, enumSchema)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid order string.",
        });
      }
    }),
};

function isSortingStringValid(val: string, enumSchema: z.ZodEnum<[string, ...string[]]>) {
  if (val === "" || enumSchema.options.length === 0) {
    return true;
  }

  const prefixedEnumOptions = `([+-]?(${enumSchema.options.join("|")}))`;
  const commaSeparatedOptions = `(${prefixedEnumOptions})(\s*,\s*${prefixedEnumOptions})*`;
  return new RegExp(`^${commaSeparatedOptions}$`).test(val);
}
