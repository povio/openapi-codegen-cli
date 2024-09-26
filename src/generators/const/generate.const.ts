import { SCHEMA_SUFFIX } from "./zod-schemas.const";

export const TEMPLATE_DIR = "src/generators/templates";

export const DEFAULT_GENERATE_OPTIONS = {
  schemaSuffix: SCHEMA_SUFFIX,
  additionalPropertiesDefaultValue: false,
};
