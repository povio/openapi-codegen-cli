import { DEFAULT_GENERATE_OPTIONS } from "@/generators/const/options.const";
import { GenerateOptions } from "@/generators/types/options";
import { deepMerge } from "@/generators/utils/object.utils";

export function resolveConfig({
  fileConfig = {},
  params: { excludeTags, inlineEndpointsExcludeModules, ...options },
}: {
  fileConfig?: Partial<GenerateOptions> | null;
  params: Partial<
    Omit<GenerateOptions, "excludeTags" | "inlineEndpointsExcludeModules"> & {
      excludeTags: string;
      inlineEndpointsExcludeModules: string;
    }
  >;
}) {
  const resolvedConfig = deepMerge(DEFAULT_GENERATE_OPTIONS, fileConfig ?? {}, {
    ...options,
    excludeTags: excludeTags?.split(","),
    inlineEndpointsExcludeModules: inlineEndpointsExcludeModules?.split(","),
  });
  resolvedConfig.checkAcl = resolvedConfig.acl && resolvedConfig.checkAcl;
  return resolvedConfig;
}
