import { parseArgs } from "node:util";
import type * as z from "zod";

import { Logger } from "./logger";

const logger = new Logger(process.env.VERBOSE === "true");

/**
 * Parse command line arguments into a validated object
 */
export function getArgs<T extends z.ZodType<any, any, any>>(
  argv: string[],
  options: {
    config: T;
    envs: Partial<Record<keyof z.output<T>, string>>;
    shorthand?: RegExp;
    verbose?: boolean;
  },
): z.output<T> {
  const {
    values,
    positionals,
  }: {
    values: { [x: string]: string | boolean | undefined };
    positionals: string[];
  } = parseArgs({
    allowPositionals: true,
    args: argv,
    // convert zod types to parseArgs option
    options: Object.fromEntries(
      Object.entries((options.config as any).shape).map(([key, value]) => {
        const def = (value as any).def as any;
        let type = def.type;
        let node = def;
        while (!["boolean", "string", "number"].includes(type)) {
          if (node.innerType?.def?.type) {
            node = node.innerType.def;
            type = node.type;
          } else {
            break;
          }
        }
        return [
          key,
          {
            type: type === "boolean" ? "boolean" : "string",
            default: def.default,
          },
        ];
      }),
    ),
  });

  const env = process.env;

  if (options.envs) {
    for (const [key, name] of Object.entries(options.envs)) {
      if (name && name in env) {
        values[key] = env[name];
      }
    }
  }

  if (options.shorthand && positionals.length > 0) {
    const match = options.shorthand.exec(positionals[0]);
    if (!match) {
      throw new Error(`Invalid shorthand, use syntax: ${options.shorthand}`);
    } else {
      for (const [key, value] of Object.entries(match.groups ?? {})) {
        if (value) {
          values[key] = value;
        }
      }
    }
  }

  try {
    return options.config.parse(values);
  } catch (error: any) {
    logger.error("Error parsing arguments", error);
    process.exit(1);
  }
}
