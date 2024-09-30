import { GenerateData } from "../types/generate";
import { removeSuffix } from "./string.utils";

export const getZodSchemaInferedTypeName = (zodSchemaName: string, suffix: string) =>
  removeSuffix(zodSchemaName, suffix);

export function getZodSchemaTag({ data, zodSchema }: { data: GenerateData; zodSchema: string }) {
  for (const [tag, { zodSchemas }] of data) {
    if (Object.keys(zodSchemas).includes(zodSchema)) {
      return tag;
    }
  }
  return "";
}
