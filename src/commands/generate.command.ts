import { logBanner } from "@/helpers/cli.helper";
import { getVersion } from "@/helpers/version.helper";
import { CliOption, type CliCommand } from "@/helpers/cli-options.helper";

import { generate, GenerateParams } from "./generate";

class GenerateOptions implements GenerateParams {
  @CliOption({ envAlias: "config" })
  config?: string;

  @CliOption({ envAlias: "input" })
  input?: string;

  @CliOption({ envAlias: "output" })
  output?: string;

  @CliOption({ envAlias: "clearOutput", type: "boolean" })
  clearOutput?: boolean;

  @CliOption({ envAlias: "incremental", type: "boolean" })
  incremental?: boolean;

  @CliOption({ envAlias: "tsNamespaces", type: "boolean" })
  tsNamespaces?: boolean;

  @CliOption({ envAlias: "treeShakeableNamespaces", type: "boolean" })
  treeShakeableNamespaces?: boolean;

  @CliOption({ envAlias: "tsPath" })
  tsPath?: string;

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

  @CliOption({ envAlias: "importPath" })
  importPath?: "ts" | "relative" | "absolute";

  @CliOption({ envAlias: "compileSchemas", type: "boolean" })
  compileSchemas?: boolean;

  @CliOption({ envAlias: "lazySchemas", type: "boolean" })
  lazySchemas?: boolean;

  @CliOption({ envAlias: "generateJsDoc", type: "boolean" })
  generateJsDoc?: boolean;

  @CliOption({ envAlias: "extractEnums", type: "boolean" })
  extractEnums?: boolean;

  @CliOption({ envAlias: "modelsInCommon", type: "boolean" })
  modelsInCommon?: boolean;

  @CliOption({ envAlias: "modelsInModules", type: "boolean" })
  modelsInModules?: boolean;

  @CliOption({ envAlias: "zodImportPath" })
  zodImportPath?: string;

  @CliOption({ envAlias: "restClient", choices: ["axios", "native"] })
  restClient?: "axios" | "native";

  @CliOption({ envAlias: "mutationEffectsImportPath" })
  mutationEffectsImportPath?: string;

  @CliOption({ envAlias: "aclCheckImportPath" })
  aclCheckImportPath?: string;

  @CliOption({ envAlias: "removeOperationPrefixEndingWith" })
  removeOperationPrefixEndingWith?: string;

  @CliOption({ envAlias: "acl", type: "boolean" })
  acl?: boolean;

  @CliOption({ envAlias: "checkAcl", type: "boolean" })
  checkAcl?: boolean;

  @CliOption({ envAlias: "baseUrl" })
  baseUrl?: string;

  @CliOption({ envAlias: "replaceOptionalWithNullish", type: "boolean" })
  replaceOptionalWithNullish?: boolean;

  @CliOption({ envAlias: "infiniteQueries", type: "boolean" })
  infiniteQueries?: boolean;

  @CliOption({ envAlias: "mutationEffects", type: "boolean" })
  mutationEffects?: boolean;

  @CliOption({ envAlias: "mutationDefaultOnError", type: "boolean" })
  mutationDefaultOnError?: boolean;

  @CliOption({ envAlias: "workspaceContext" })
  workspaceContext?: string;

  @CliOption({ envAlias: "mutationScope", type: "boolean" })
  mutationScope?: boolean;

  @CliOption({ envAlias: "parseRequestParams", type: "boolean" })
  parseRequestParams?: boolean;

  @CliOption({ envAlias: "inlineEndpoints", type: "boolean" })
  inlineEndpoints?: boolean;

  @CliOption({ envAlias: "inlineEndpointsExcludeModules" })
  inlineEndpointsExcludeModules?: string;

  @CliOption({ envAlias: "modelsOnly", type: "boolean" })
  modelsOnly?: boolean;

  @CliOption({ envAlias: "axiosRequestConfig", type: "boolean" })
  axiosRequestConfig?: boolean;

  @CliOption({ envAlias: "format", type: "boolean" })
  format?: boolean;

  @CliOption({ envAlias: "verbose", default: false, type: "boolean" })
  verbose?: boolean;

  @CliOption({ envAlias: "watch", default: false, type: "boolean" })
  watch?: boolean;
}

export const command: CliCommand<GenerateOptions> = {
  command: "generate",
  describe: "Generate code from OpenAPI spec",
  options: GenerateOptions,
  handler: async (argv) => {
    if (argv.verbose) {
      logBanner(`OpenAPI CodeGen ${getVersion()}`);
    }
    return generate(argv);
  },
};
