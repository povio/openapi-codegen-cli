import type { OpenAPICodegenConfig } from "../src/generators/types/config";

const config: OpenAPICodegenConfig = {
  input: "./test/petstore.yaml",
  output: ".tmp/output",
  replaceOptionalWithNullish: true,
  tsPath: "@/openapi",
  errorHandlingImportPath: "@povio/ui",
  abilityContextImportPath: "@povio/ui/auth",
  queryTypesImportPath: "@povio/ui",
  restClientImportPath: "@/clients/app-rest-client",
  abilityContextGenericAppAbilities: true,
  infiniteQueries: true,
  builderConfigs: true,
};

export default config;
