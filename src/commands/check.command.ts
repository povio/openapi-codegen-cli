import { z } from "zod";

import { getArgs } from "../helpers/args";
import { Logger } from "../helpers/logger";
import { check } from "./check";

const commandSchema = z.object({
  config: z.string().optional(),
  input: z.string().optional(),
  splitByTags: z.boolean().optional(),
  defaultTag: z.string().optional(),
  excludeTags: z.string().optional(),
  excludePathRegex: z.string().optional(),
  excludeRedundantZodSchemas: z.boolean().optional(),
  verbose: z.boolean().optional(),
});

export async function checkCommand(argv: string[]) {
  const args = getArgs(argv, {
    config: commandSchema,
    envs: {
      verbose: "VERBOSE",
    },
  });
  const logger = new Logger(args.verbose ?? false);
  await check(args, logger);
}
