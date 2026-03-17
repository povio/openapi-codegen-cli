/** @type {import('./src/generators/types/config').OpenAPICodegenConfig} */
const config = {
  input: "http://127.0.0.1:4000/docs-json",
  output: "./test/generated/next",
  excludeTags: ["auth"],
  replaceOptionalWithNullish: true,
  builderConfigs: true,
  infiniteQueries: true,
};

export default config;
