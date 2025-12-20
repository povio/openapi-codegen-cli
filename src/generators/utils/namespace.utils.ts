import type { GenerateType } from "../types/generate";
import type { GenerateOptions } from "../types/options";
import { capitalize } from "./string.utils";

export const getNamespaceName = ({
  type,
  tag,
  options,
}: {
  type: GenerateType;
  tag: string;
  options: GenerateOptions;
}) => `${capitalize(tag)}${options.configs[type].namespaceSuffix}`;
