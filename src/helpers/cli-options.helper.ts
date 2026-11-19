type CliOptionType = "string" | "boolean";

interface CliOptionProperties {
  /** Defaults to `"string"`; boolean options must say so. */
  type?: CliOptionType;
  describe?: string;
  envAlias?: string;
  default?: unknown;
  choices?: readonly string[];
}

type ResolvedCliOption = CliOptionProperties & { type: CliOptionType };

export type CliOptionsClass<T> = new () => T;

export class CliUsageError extends Error {}

// Plain storage instead of reflect-metadata, which costs several ms of CLI startup.
const optionsByPrototype = new WeakMap<object, Record<string, ResolvedCliOption>>();

export function CliOption(properties: CliOptionProperties) {
  return (target: object, propertyKey: string) => {
    optionsByPrototype.set(target, {
      ...optionsByPrototype.get(target),
      [propertyKey]: {
        ...properties,
        describe: properties.envAlias ? `${properties.describe || ""} [${properties.envAlias}]` : properties.describe,
        type: properties.type ?? "string",
      },
    });
  };
}

function getCliOptions<T>(target: CliOptionsClass<T>): Record<string, ResolvedCliOption> {
  const options = optionsByPrototype.get(target.prototype as object);
  if (!options) {
    throw new Error(`Options for ${target.name} were not defined`);
  }
  return options;
}

const kebabToCamel = (name: string) => name.replace(/-+([a-zA-Z0-9])/g, (_, char: string) => char.toUpperCase());

/**
 * Parses `--name value`, `--name=value`, `--no-name` and kebab-case spellings with yargs-parser
 * semantics. Undeclared flags are kept so callers can still read them, as with yargs.
 */
export function parseCliOptions<T>(target: CliOptionsClass<T>, args: readonly string[]): T {
  const options = getCliOptions(target);
  const parsed: Record<string, unknown> = {};

  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (arg === "--") break;
    if (!arg.startsWith("--") || arg.length === 2) continue;

    const equalsIndex = arg.indexOf("=");
    const rawName = arg.slice(2, equalsIndex === -1 ? undefined : equalsIndex);
    const inlineValue = equalsIndex === -1 ? undefined : arg.slice(equalsIndex + 1);
    let name = kebabToCamel(rawName);
    let negated = false;
    if (inlineValue === undefined && !options[name] && /^no[A-Z-]/.test(rawName.slice(0, 3))) {
      name = kebabToCamel(rawName.slice(3));
      name = name.charAt(0).toLowerCase() + name.slice(1);
      negated = true;
    }
    const option = options[name];
    const next = args[index + 1];

    let value: unknown;
    if (negated) {
      value = false;
    } else if (option?.type === "boolean" || (!option && inlineValue === undefined && !isValue(next))) {
      if (inlineValue !== undefined) {
        value = inlineValue === "true";
      } else if (next === "true" || next === "false") {
        value = next === "true";
        index++;
      } else {
        value = true;
      }
    } else if (inlineValue !== undefined) {
      value = inlineValue;
    } else if (isValue(next)) {
      value = next;
      index++;
    } else {
      value = "";
    }
    parsed[name] = value;
  }

  const result = new target() as Record<string, unknown>;
  for (const [name, value] of Object.entries(parsed)) {
    if (!options[name]) result[name] = value;
  }
  for (const [name, option] of Object.entries(options)) {
    const value = parsed[name] ?? option.default;
    if (option.choices && value !== undefined && !option.choices.includes(value as string)) {
      throw new CliUsageError(
        `Invalid values:\n  Argument: ${name}, Given: ${JSON.stringify(value)}, Choices: ${option.choices
          .map((choice) => JSON.stringify(choice))
          .join(", ")}`,
      );
    }
    result[name] = value;
  }
  return result as T;
}

function isValue(arg: string | undefined): arg is string {
  return arg !== undefined && (!arg.startsWith("-") || /^-\d/.test(arg));
}

const HELP_WIDTH = 80;

export function formatCliHelp({
  usage,
  describe,
  commands = [],
  options,
}: {
  usage: string;
  describe?: string;
  commands?: { name: string; describe: string }[];
  options?: CliOptionsClass<unknown>;
}) {
  const lines = [usage, ""];
  if (describe) lines.push(describe, "");
  if (commands.length > 0) {
    const width = Math.max(...commands.map(({ name }) => name.length));
    lines.push("Commands:", ...commands.map(({ name, describe }) => `  ${name.padEnd(width)}  ${describe}`), "");
  }
  const rows: [string, string, string][] = [
    ["--version", "Show version number", "[boolean]"],
    ["--help", "Show help", "[boolean]"],
    ...Object.entries(options ? getCliOptions(options) : {}).map(([name, option]): [string, string, string] => {
      const extras = [`[${option.type}]`];
      if (option.choices)
        extras.push(`[choices: ${option.choices.map((choice) => JSON.stringify(choice)).join(", ")}]`);
      if (option.default !== undefined) extras.push(`[default: ${JSON.stringify(option.default)}]`);
      return [`--${name}`, option.describe ?? "", extras.join(" ")];
    }),
  ];
  const nameWidth = Math.max(...rows.map(([name]) => name.length));
  lines.push("Options:");
  for (const [name, describe, extras] of rows) {
    const left = `  ${name.padEnd(nameWidth)}  ${describe}`;
    lines.push(`${left}${" ".repeat(Math.max(1, HELP_WIDTH - left.length - extras.length))}${extras}`);
  }
  return lines.join("\n");
}

export type CliCommand<T> = {
  command: string;
  describe: string;
  options: CliOptionsClass<T>;
  handler: (argv: T) => Promise<void>;
};
