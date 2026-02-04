import { logBanner } from "@/helpers/cli.helper";
import { getVersion } from "@/helpers/version.helper";
import { getBuilder, YargOption } from "@/helpers/yargs.helper";
import yargs from "yargs";

import { generate, GenerateParams } from "./generate";

class GenerateOptions implements GenerateParams {
  @YargOption({ envAlias: "config" })
  config?: string;

  @YargOption({ envAlias: "input" })
  input?: string;

  @YargOption({ envAlias: "output" })
  output?: string;

  @YargOption({ envAlias: "tsNamespaces", type: "boolean" })
  tsNamespaces?: boolean;

  @YargOption({ envAlias: "tsPath" })
  tsPath?: string;

  @YargOption({ envAlias: "splitByTags", type: "boolean" })
  splitByTags?: boolean;

  @YargOption({ envAlias: "defaultTag" })
  defaultTag?: string;

  @YargOption({ envAlias: "excludeTags" })
  excludeTags?: string;

  @YargOption({ envAlias: "excludePathRegex" })
  excludePathRegex?: string;

  @YargOption({ envAlias: "excludeRedundantZodSchemas", type: "boolean" })
  excludeRedundantZodSchemas?: boolean;

  @YargOption({ envAlias: "importPath" })
  importPath?: "ts" | "relative" | "absolute";

  @YargOption({ envAlias: "extractEnums", type: "boolean" })
  extractEnums?: boolean;

  @YargOption({ envAlias: "removeOperationPrefixEndingWith" })
  removeOperationPrefixEndingWith?: string;

  @YargOption({ envAlias: "acl", type: "boolean" })
  acl?: boolean;

  @YargOption({ envAlias: "checkAcl", type: "boolean" })
  checkAcl?: boolean;

  @YargOption({ envAlias: "baseUrl" })
  baseUrl?: string;

  @YargOption({ envAlias: "replaceOptionalWithNullish", type: "boolean" })
  replaceOptionalWithNullish?: boolean;

  @YargOption({ envAlias: "infiniteQueries", type: "boolean" })
  infiniteQueries?: boolean;

  @YargOption({ envAlias: "mutationEffects", type: "boolean" })
  mutationEffects?: boolean;

  @YargOption({ envAlias: "parseRequestParams", type: "boolean" })
  parseRequestParams?: boolean;

  @YargOption({ envAlias: "axiosRequestConfig", type: "boolean" })
  axiosRequestConfig?: boolean;

  @YargOption({ envAlias: "builderConfigs", type: "boolean" })
  builderConfigs?: boolean;

  @YargOption({ envAlias: "format", default: true, type: "boolean" })
  format?: boolean;

  @YargOption({ envAlias: "verbose", default: false, type: "boolean" })
  verbose?: boolean;
}

export const command: yargs.CommandModule = {
  command: "generate",
  describe: "Generate code from OpenAPI spec",
  builder: getBuilder(GenerateOptions),
  handler: async (_argv) => {
    const argv = (await _argv) as unknown as GenerateOptions;
    if (argv.verbose) {
      logBanner(`OpenAPI CodeGen ${getVersion()}`);
    }
    return generate(argv);
  },
};
