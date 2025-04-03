import yargs from "yargs";
import { logBanner, logVariable } from "../helpers/cli.helper";
import { getVersion } from "../helpers/version.helper";
import { getBuilder, YargOption } from "../helpers/yargs.helper";
import { generate, GenerateParams } from "./generate";

class GenerateOptions implements GenerateParams {
  @YargOption({ envAlias: "input", demandOption: true })
  input!: string;

  @YargOption({ envAlias: "output", default: "output" })
  output!: string;

  @YargOption({ envAlias: "tsNamespaces", default: true, type: "boolean" })
  tsNamespaces!: boolean;

  @YargOption({ envAlias: "splitByTags", default: true, type: "boolean" })
  splitByTags!: boolean;

  @YargOption({ envAlias: "defaultTag", default: "Common" })
  defaultTag!: string;

  @YargOption({ envAlias: "excludeTags", default: "" })
  excludeTags!: string;

  @YargOption({ envAlias: "importPath", default: "ts", type: "string" })
  importPath!: "ts" | "relative" | "absolute";

  @YargOption({ envAlias: "extractEnums", default: true, type: "boolean" })
  extractEnums!: boolean;

  @YargOption({ envAlias: "removeOperationPrefixEndingWith", default: "Controller_" })
  removeOperationPrefixEndingWith!: string;

  @YargOption({ envAlias: "prettier", default: true, type: "boolean" })
  prettier!: boolean;

  @YargOption({ envAlias: "verbose", default: false, type: "boolean" })
  verbose!: boolean;

  @YargOption({ envAlias: "standalone", default: false, type: "boolean" })
  standalone!: boolean;

  @YargOption({ envAlias: "baseUrl", default: "" })
  baseUrl!: string;

  @YargOption({ envAlias: "replaceOptionalWithNullish", default: false, type: "boolean" })
  replaceOptionalWithNullish!: boolean;

  @YargOption({ envAlias: "infiniteQueries", default: false, type: "boolean" })
  infiniteQueries!: boolean;
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
