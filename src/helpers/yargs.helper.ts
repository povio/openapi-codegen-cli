/* eslint-disable @typescript-eslint/no-explicit-any */
import "reflect-metadata";
import type { Options } from "yargs";

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

export function getYargsOption<T>(target: any): Record<keyof T, IOptionProperties> {
  const options = Reflect.getMetadata(optionsKey, target.prototype);
  if (!options) {
    throw new Error(`Options for ${(target as any).name} were not defined`);
  }
  return options;
}

export function getBuilder(options: any) {
  return async (y: any) => {
    return y.options(getYargsOptions(options)).middleware(async (_argv: any) => {
      return (await loadYargsConfig(options, _argv as any)) as any;
    }, true);
  };
}

export function getYargsOptions<T>(target: any): Record<keyof T, Options> {
  return Object.entries(getYargsOption(target)).reduce(
    (a, [property, options]) => {
      a[property as keyof T] = Object.fromEntries(
        Object.entries(options).filter(([optionName]) => !["envAlias", "default"].includes(optionName)),
      );
      return a;
    },
    {} as Record<keyof T, Options>,
  );
}

export async function loadYargsConfig<T>(cls: new () => T, _argv: Record<string, unknown>): Promise<T> {
  const argv: T = new cls();

  for (const [name, o] of Object.entries(getYargsOption(cls))) {
    argv[name as keyof typeof argv] =
      // yargs is always right
      _argv[name] ??
      // fallback to default
      o.default;
  }

  return argv;
}
