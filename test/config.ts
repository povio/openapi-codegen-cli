import { OpenAPICodegenConfig } from "../src/generators/types/config";

export const config: OpenAPICodegenConfig = {
  input: "http://127.0.0.1:4000/docs-json",
  output: "./output",
  excludeTags: ["auth"],
  replaceOptionalWithNullish: true,
};

export default config;
