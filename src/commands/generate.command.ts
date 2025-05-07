import yargs from "yargs";
import { logBanner, logVariable } from "../helpers/cli.helper";
import { getVersion } from "../helpers/version.helper";
import { getBuilder, YargOption } from "../helpers/yargs.helper";
import { generate, GenerateParams } from "./generate";
import { DEFAULT_GENERATE_OPTIONS } from "src/generators/const/options.const";

class GenerateOptions implements GenerateParams {
  @YargOption({ envAlias: "input", demandOption: true })
  input!: string;

  @YargOption({ envAlias: "output", default: DEFAULT_GENERATE_OPTIONS.output })
  output!: string;

  @YargOption({ envAlias: "tsNamespaces", default: DEFAULT_GENERATE_OPTIONS.tsNamespaces, type: "boolean" })
  tsNamespaces!: boolean;

  @YargOption({ envAlias: "splitByTags", default: DEFAULT_GENERATE_OPTIONS.splitByTags, type: "boolean" })
  splitByTags!: boolean;

  @YargOption({ envAlias: "defaultTag", default: DEFAULT_GENERATE_OPTIONS.defaultTag })
  defaultTag!: string;

  @YargOption({ envAlias: "excludeTags", default: DEFAULT_GENERATE_OPTIONS.excludeTags.join(",") })
  excludeTags!: string;

  @YargOption({ envAlias: "importPath", default: DEFAULT_GENERATE_OPTIONS.importPath })
  importPath!: "ts" | "relative" | "absolute";

  @YargOption({ envAlias: "extractEnums", default: DEFAULT_GENERATE_OPTIONS.extractEnums, type: "boolean" })
  extractEnums!: boolean;

  @YargOption({
    envAlias: "removeOperationPrefixEndingWith",
    default: DEFAULT_GENERATE_OPTIONS.removeOperationPrefixEndingWith,
  })
  removeOperationPrefixEndingWith!: string;

  @YargOption({ envAlias: "standalone", default: DEFAULT_GENERATE_OPTIONS.standalone, type: "boolean" })
  standalone!: boolean;

  @YargOption({ envAlias: "baseUrl", default: DEFAULT_GENERATE_OPTIONS.baseUrl })
  baseUrl!: string;

  @YargOption({
    envAlias: "replaceOptionalWithNullish",
    default: DEFAULT_GENERATE_OPTIONS.replaceOptionalWithNullish,
    type: "boolean",
  })
  replaceOptionalWithNullish!: boolean;

  @YargOption({ envAlias: "infiniteQueries", default: DEFAULT_GENERATE_OPTIONS.infiniteQueries, type: "boolean" })
  infiniteQueries!: boolean;

  @YargOption({
    envAlias: "invalidateQueryOptions",
    default: DEFAULT_GENERATE_OPTIONS.invalidateQueryOptions,
    type: "boolean",
  })
  invalidateQueryOptions!: boolean;

  @YargOption({ envAlias: "axiosRequestConfig", default: DEFAULT_GENERATE_OPTIONS.axiosRequestConfig, type: "boolean" })
  axiosRequestConfig!: boolean;

  @YargOption({ envAlias: "prettier", default: true, type: "boolean" })
  prettier!: boolean;

  @YargOption({ envAlias: "verbose", default: false, type: "boolean" })
  verbose!: boolean;
}

export const command: yargs.CommandModule = {
  command: "generate",
  describe: "Generate code from OpenAPI spec",
  builder: getBuilder(GenerateOptions),
  handler: async (_argv) => {
    const argv = (await _argv) as unknown as GenerateOptions;
    if (argv.verbose) {
      logBanner(`OpenAPI CodeGen ${getVersion()}`);
      logVariable("input", argv.input);
      logVariable("output", argv.output);
    }
    return generate(argv);
  },
};
