import { DEFAULT_GENERATE_OPTIONS } from "@/generators/const/options.const";
import { GenerateOptions } from "@/generators/types/options";
import { deepMerge } from "@/generators/utils/object.utils";

type ListParams =
  | "includeTags"
  | "excludeTags"
  | "includeSchemas"
  | "inlineEndpointsExcludeModules"
  | "workspaceContext";

/** CLI options, where list options are comma-separated strings. */
export type ConfigParams = Partial<Omit<GenerateOptions, ListParams> & Record<ListParams, string>>;

export function resolveConfig({
  fileConfig = {},
  params: { includeTags, excludeTags, includeSchemas, inlineEndpointsExcludeModules, workspaceContext, ...options },
}: {
  fileConfig?: Partial<GenerateOptions> | null;
  params: ConfigParams;
}) {
  const resolvedConfig = deepMerge(DEFAULT_GENERATE_OPTIONS, fileConfig ?? {}, {
    ...options,
    includeTags: includeTags?.split(","),
    excludeTags: excludeTags?.split(","),
    includeSchemas: includeSchemas?.split(","),
    inlineEndpointsExcludeModules: inlineEndpointsExcludeModules?.split(","),
    workspaceContext: workspaceContext?.split(","),
  });
  if (resolvedConfig.modelsInCommon && resolvedConfig.modelsInModules) {
    throw new Error("modelsInCommon and modelsInModules cannot both be enabled");
  }
  if (resolvedConfig.lazySchemas && !resolvedConfig.tsNamespaces) {
    throw new Error("lazySchemas requires tsNamespaces");
  }
  resolvedConfig.checkAcl = resolvedConfig.acl && resolvedConfig.checkAcl;
  resolvedConfig.workspaceContext = Array.from(
    new Set((resolvedConfig.workspaceContext ?? []).map((value) => value.trim()).filter(Boolean)),
  );
  return resolvedConfig;
}
