import { defineConfig } from "tsdown";
import packageJson from "./package.json" with { type: "json" };

const define = {
  "process.env.OPENAPI_CODEGEN_VERSION": JSON.stringify(packageJson.version ?? "0.0.0"),
  "process.env.NODE_ENV": JSON.stringify("production"),
};

export default defineConfig([
  {
    entry: [
      "./src/sh.ts",
      "./src/generator.ts",
      "./src/index.ts",
      "./src/vite.ts",
      "./src/metro.ts",
      "./src/tiny.ts",
      "./src/acl.ts",
      "./src/zod.ts",
    ],
    format: "esm",
    platform: "node",
    target: "esnext",
    dts: true,
    define,
  },
  {
    entry: ["./src/metro.ts"],
    format: "cjs",
    platform: "node",
    target: "esnext",
    dts: false,
    define,
    clean: false,
  },
]);
