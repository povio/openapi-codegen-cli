import { DEFAULT_GENERATE_OPTIONS } from "../const/options.const";
import type { GenerateOptions } from "../types/options";
import { deepMerge } from "../utils/object.utils";

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
