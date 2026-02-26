import { readFileSync } from "node:fs";
import { defineConfig } from "tsdown";

const pkg = JSON.parse(readFileSync("./package.json", "utf-8")) as {
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  version?: string;
};

const external = [
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
  "vite",
  "postcss",
];

export default defineConfig({
  entry: ["./src/sh.ts", "./src/generator.ts", "./src/index.ts", "./src/vite.ts", "./src/acl.ts"],
  format: "esm",
  platform: "node",
  target: "esnext",
  dts: true,
  deps: {
    neverBundle: external,
    onlyAllowBundle: false,
  },
  define: {
    "process.env.OPENAPI_CODEGEN_VERSION": JSON.stringify(pkg.version ?? "unknown"),
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
});
