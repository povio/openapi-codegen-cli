import yargs from "yargs";
import { logBanner, logVariable } from "../helpers/cli.helper";
import { getVersion } from "../helpers/version.helper";
import { getBuilder, YargOption } from "../helpers/yargs.helper";
import { check, CheckParams } from "./check";

class CheckOptions implements CheckParams {
  @YargOption({ envAlias: "input", demandOption: true })
  input!: string;

  @YargOption({ envAlias: "splitByTags", default: true, type: "boolean" })
  splitByTags!: boolean;

  @YargOption({ envAlias: "defaultTag", default: "Common" })
  defaultTag!: string;

  @YargOption({ envAlias: "excludeTags", default: "" })
  excludeTags!: string;

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
