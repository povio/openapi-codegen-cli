import fs from "node:fs";

const version = JSON.parse(fs.readFileSync("package.json", "utf-8")).version;

import { defineConfig } from "tsup";

export default defineConfig(() => {
  return [
    {
      entry: ["src/sh.ts"],
      splitting: false,
      sourcemap: false,
      clean: true,
      keepNames: true,
      platform: "node",
      format: "cjs",
      bundle: true,
      target: "node20",
      treeshake: true,

      minify: true,
      define: {
        "process.env.OPENAPI_CODEGEN_VERSION": `"${version}"`,
      },
    },
    {
      entry: ["src/index.ts"],
      splitting: false,
      sourcemap: false,
      clean: true,
      keepNames: true,
      platform: "node",
      format: "cjs",
      bundle: true,
      target: "node20",
      treeshake: true,
      minify: true,
      dts: true,
      define: {
        "process.env.OPENAPI_CODEGEN_VERSION": `"${version}"`,
      },
    },
  ];
});
