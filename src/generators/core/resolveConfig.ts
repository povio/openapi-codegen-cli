import { DEFAULT_GENERATE_OPTIONS } from "@/generators/const/options.const";
import { GenerateOptions } from "@/generators/types/options";
import { deepMerge } from "@/generators/utils/object.utils";

export function resolveConfig({
  fileConfig = {},
  params: { includeTags, excludeTags, inlineEndpointsExcludeModules, workspaceContext, ...options },
}: {
  fileConfig?: Partial<GenerateOptions> | null;
  params: Partial<
    Omit<GenerateOptions, "includeTags" | "excludeTags" | "inlineEndpointsExcludeModules" | "workspaceContext"> & {
      includeTags: string;
      excludeTags: string;
      inlineEndpointsExcludeModules: string;
      workspaceContext: string;
    }
  >;
}) {
  const resolvedConfig = deepMerge(DEFAULT_GENERATE_OPTIONS, fileConfig ?? {}, {
    ...options,
    includeTags: includeTags?.split(","),
    excludeTags: excludeTags?.split(","),
    inlineEndpointsExcludeModules: inlineEndpointsExcludeModules?.split(","),
    workspaceContext: workspaceContext?.split(","),
  });
  resolvedConfig.checkAcl = resolvedConfig.acl && resolvedConfig.checkAcl;
  resolvedConfig.workspaceContext = Array.from(
    new Set((resolvedConfig.workspaceContext ?? []).map((value) => value.trim()).filter(Boolean)),
  );
  return resolvedConfig;
}
