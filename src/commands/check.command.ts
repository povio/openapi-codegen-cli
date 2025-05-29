import { DEFAULT_GENERATE_OPTIONS } from "src/generators/const/options.const";
import yargs from "yargs";
import { logBanner, logVariable } from "../helpers/cli.helper";
import { getVersion } from "../helpers/version.helper";
import { getBuilder, YargOption } from "../helpers/yargs.helper";
import { check, CheckParams } from "./check";

class CheckOptions implements CheckParams {
  @YargOption({ envAlias: "input", demandOption: true })
  input!: string;

  @YargOption({ envAlias: "splitByTags", default: DEFAULT_GENERATE_OPTIONS.splitByTags, type: "boolean" })
  splitByTags!: boolean;

  @YargOption({ envAlias: "defaultTag", default: DEFAULT_GENERATE_OPTIONS.defaultTag })
  defaultTag!: string;

  @YargOption({ envAlias: "excludeTags", default: DEFAULT_GENERATE_OPTIONS.excludeTags.join(",") })
  excludeTags!: string;

  @YargOption({ envAlias: "excludePathRegex", default: DEFAULT_GENERATE_OPTIONS.excludePathRegex })
  excludePathRegex!: string;

  @YargOption({
    envAlias: "excludeRedundantZodSchemas",
    default: DEFAULT_GENERATE_OPTIONS.excludeRedundantZodSchemas,
    type: "boolean",
  })
  excludeRedundantZodSchemas!: boolean;

  @YargOption({ envAlias: "verbose", default: false, type: "boolean" })
  verbose!: boolean;
}

export const command: yargs.CommandModule = {
  command: "check",
  describe: "Check OpenAPI spec",
  builder: getBuilder(CheckOptions),
  handler: async (_argv) => {
    const argv = (await _argv) as unknown as CheckOptions;
    if (argv.verbose) {
      logBanner(`OpenAPI CodeGen ${getVersion()}`);
      logVariable("input", argv.input);
    }
    return check(argv);
  },
};
