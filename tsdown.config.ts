import { defineConfig } from "tsdown";
import packageJson from "./package.json" with { type: "json" };

export default defineConfig({
  entry: ["./src/sh.ts", "./src/generator.ts", "./src/index.ts", "./src/vite.ts", "./src/acl.ts", "./src/zod.ts"],
  format: "esm",
  platform: "node",
  target: "esnext",
  dts: true,
  define: {
    "process.env.OPENAPI_CODEGEN_VERSION": JSON.stringify(packageJson.version),
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
});
