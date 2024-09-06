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

  @YargOption({ envAlias: "verbose", default: false })
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
