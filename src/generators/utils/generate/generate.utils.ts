import { GenerateFile, GenerateType } from "../../types/generate";
import { GenerateOptions } from "../../types/options";
import { capitalize, decapitalize } from "../string.utils";

export function getFileNameWithExtension({ fileName, extension }: GenerateFile) {
  return `${fileName}.${extension}`;
}

function getTagFileNameWithoutExtension({
  type,
  tag,
  options,
  includeTagDir = true,
}: {
  type: GenerateType;
  tag: string;
  includeTagDir?: boolean;
  options: GenerateOptions;
}) {
  const outputFileNameSuffix = options.configs[type].outputFileNameSuffix;
  if (!tag) {
    return outputFileNameSuffix;
  }
  return `${includeTagDir ? `${decapitalize(tag)}/` : ""}${decapitalize(tag)}.${outputFileNameSuffix}`;
}

export function getTagImportPath(...args: Parameters<typeof getTagFileNameWithoutExtension>) {
  return getTagFileNameWithoutExtension(...args);
}

export function getTagFileName(...args: Parameters<typeof getTagFileNameWithoutExtension>) {
  return `${getTagFileNameWithoutExtension(...args)}.ts`;
}

export const getNamespaceName = ({
  type,
  tag,
  options,
}: {
  type: GenerateType;
  tag: string;
  options: GenerateOptions;
}) => `${capitalize(tag)}${options.configs[type].namespaceSuffix}`;
