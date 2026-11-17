import { logBanner } from "@/helpers/cli.helper";
import { getVersion } from "@/helpers/version.helper";
import { CliOption, type CliCommand } from "@/helpers/cli-options.helper";

import type { CheckParams } from "./check";

class CheckOptions implements CheckParams {
  @CliOption({ envAlias: "config" })
  config?: string;

  @CliOption({ envAlias: "input" })
  input?: string;

  @CliOption({ envAlias: "splitByTags", type: "boolean" })
  splitByTags?: boolean;

  @CliOption({ envAlias: "defaultTag" })
  defaultTag?: string;

  @CliOption({ envAlias: "includeTags" })
  includeTags?: string;

  @CliOption({ envAlias: "excludeTags" })
  excludeTags?: string;

  @CliOption({ envAlias: "excludePathRegex" })
  excludePathRegex?: string;

  @CliOption({ envAlias: "excludeRedundantZodSchemas", type: "boolean" })
  excludeRedundantZodSchemas?: boolean;

  @CliOption({ envAlias: "includeSchemas" })
  includeSchemas?: string;

  @CliOption({ envAlias: "verbose", default: false, type: "boolean" })
  verbose?: boolean;
}

export const command: CliCommand<CheckOptions> = {
  command: "check",
  describe: "Check OpenAPI spec",
  options: CheckOptions,
  handler: async (argv) => {
    if (argv.verbose) {
      logBanner(`OpenAPI CodeGen ${getVersion()}`);
    }
    // Loaded on demand: checking pulls in the TypeScript generator, which generate skips.
    const { check } = await import("./check");
    return check(argv);
  },
};
