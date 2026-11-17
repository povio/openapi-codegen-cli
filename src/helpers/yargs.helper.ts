import "reflect-metadata";
import type { Argv, Options } from "yargs";

interface IOptionProperties extends Options {
  envAlias?: string;
}

const optionsKey = Symbol("options_key");

export function YargOption(properties: IOptionProperties) {
  return (target: object, propertyKey: string) => {
    if (properties !== undefined && properties !== null) {
      const newMetadata = {
        ...Reflect.getMetadata(optionsKey, target),
        [propertyKey]: {
          ...properties,
          describe: properties.envAlias ? `${properties.describe || ""} [${properties.envAlias}]` : properties.describe,
          type: properties.type || Reflect.getMetadata("design:type", target, propertyKey)?.name?.toLowerCase(),
        },
      };

      Reflect.defineMetadata(optionsKey, newMetadata, target);
    }
  };
}

export function getYargsOption<T>(target: new () => T): Record<keyof T, IOptionProperties> {
  const options: Record<keyof T, IOptionProperties> | undefined = Reflect.getMetadata(optionsKey, target.prototype);
  if (!options) {
    throw new Error(`Options for ${target.name} were not defined`);
  }
  return options;
}

export function getBuilder<T>(options: new () => T) {
  return async (y: Argv) => {
    return y.options(getYargsOptions(options)).middleware(async (argv) => {
      // yargs replaces argv with what async middleware resolves to.
      Object.assign(argv, await loadYargsConfig(options, argv));
    }, true);
  };
}

function getYargsOptionEntries<T>(target: new () => T): [string, IOptionProperties][] {
  return Object.entries(getYargsOption(target) as Record<string, IOptionProperties>);
}

export function getYargsOptions<T>(target: new () => T): Record<keyof T, Options> {
  return getYargsOptionEntries(target).reduce(
    (a, [property, options]) => {
      a[property as keyof T] = Object.fromEntries(
        Object.entries(options).filter(([optionName]) => !["envAlias", "default"].includes(optionName)),
      ) as Options;
      return a;
    },
    {} as Record<keyof T, Options>,
  );
}

export async function loadYargsConfig<T>(cls: new () => T, _argv: Record<string, unknown>): Promise<T> {
  const argv: T = new cls();

  for (const [name, o] of getYargsOptionEntries(cls)) {
    // yargs is always right; fall back to the default
    argv[name as keyof T] = (_argv[name] ?? o.default) as T[keyof T];
  }

  return argv;
}
