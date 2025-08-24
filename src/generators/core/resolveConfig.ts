import { DEFAULT_GENERATE_OPTIONS } from "src/generators/const/options.const";
import { deepMerge } from "src/generators/utils/object.utils";
import { GenerateOptions } from "src/generators/types/options";

export function resolveConfig({
  fileConfig = {},
  params: { excludeTags, ...options },
}: {
  fileConfig?: Partial<GenerateOptions> | null;
  params: Partial<Omit<GenerateOptions, "excludeTags"> & { excludeTags: string }>;
}) {
  const resolvedConfig = deepMerge(DEFAULT_GENERATE_OPTIONS, fileConfig ?? {}, {
    ...options,
    excludeTags: excludeTags?.split(","),
  });
  resolvedConfig.checkAcl = resolvedConfig.acl && resolvedConfig.checkAcl;
  return resolvedConfig;
}
