import yargs from "yargs";
import { logBanner } from "src/helpers/cli.helper";
import { getVersion } from "src/helpers/version.helper";
import { getBuilder, YargOption } from "src/helpers/yargs.helper";
import { check, CheckParams } from "./check";

class CheckOptions implements CheckParams {
  @YargOption({ envAlias: "config" })
  config?: string;

  @YargOption({ envAlias: "input" })
  input?: string;

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

  @YargOption({ envAlias: "verbose", default: false, type: "boolean" })
  verbose?: boolean;
}

export const command: yargs.CommandModule = {
  command: "check",
  describe: "Check OpenAPI spec",
  builder: getBuilder(CheckOptions),
  handler: async (_argv) => {
    const argv = (await _argv) as unknown as CheckOptions;
    if (argv.verbose) {
      logBanner(`OpenAPI CodeGen ${getVersion()}`);
    }
    return check(argv);
  },
};
