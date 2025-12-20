import { z } from "zod";

import { getArgs } from "../helpers/args";
import { Logger } from "../helpers/logger";
import { generate } from "./generate";

const commandSchema = z.object({
  config: z.string().optional(),
  input: z.string().optional(),
  output: z.string().optional(),
  tsNamespaces: z.boolean().optional(),
  tsPath: z.string().optional(),
  splitByTags: z.boolean().optional(),
  defaultTag: z.string().optional(),
  excludeTags: z.string().optional(),
  excludePathRegex: z.string().optional(),
  excludeRedundantZodSchemas: z.boolean().optional(),
  importPath: z.enum(["ts", "relative", "absolute"]).optional(),
  extractEnums: z.boolean().optional(),
  removeOperationPrefixEndingWith: z.string().optional(),
  acl: z.boolean().optional(),
  checkAcl: z.boolean().optional(),
  standalone: z.boolean().optional(),
  baseUrl: z.string().optional(),
  replaceOptionalWithNullish: z.boolean().optional(),
  infiniteQueries: z.boolean().optional(),
  mutationEffects: z.boolean().optional(),
  parseRequestParams: z.boolean().optional(),
  axiosRequestConfig: z.boolean().optional(),
  builderConfigs: z.boolean().optional(),
  prettier: z.boolean().optional(),
  verbose: z.boolean().optional(),
  cwd: z.string().optional(),
});

export async function generateCommand(argv: string[]) {
  const args = getArgs(argv, {
    config: commandSchema,
    envs: {
      verbose: "VERBOSE",
    },
  });
  const cwd = args.cwd ?? process.cwd();
  const logger = new Logger(args.verbose ?? false);
  await generate(args, cwd, logger);
}
