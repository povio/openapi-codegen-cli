import { readFileSync } from "node:fs";

import { defineConfig } from "tsdown";

const pkg = JSON.parse(readFileSync("./package.json", "utf-8")) as {
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  version?: string;
};

const external = [...Object.keys(pkg.dependencies ?? {}), ...Object.keys(pkg.peerDependencies ?? {})];

export default defineConfig({
  entry: ["./src/sh.ts", "./src/generator.ts"],
  format: "esm",
  outDir: "dist",
  platform: "node",
  target: "node14",
  minify: true,
  clean: false,
  dts: false,
  deps: {
    neverBundle: external,
    onlyAllowBundle: false,
  },
  define: {
    "process.env.OPENAPI_CODEGEN_VERSION": JSON.stringify(pkg.version ?? "unknown"),
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
});
