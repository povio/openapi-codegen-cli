import { defineConfig } from "tsdown";
import { version } from './package.json';

export default defineConfig({
  entry: ["./src/sh.ts", "./src/generator.ts", "./src/index.ts", "./src/vite.ts", "./src/acl.ts"],
  format: "esm",
  platform: "node",
  target: "esnext",
  dts: true,
  define: {
    "process.env.OPENAPI_CODEGEN_VERSION": JSON.stringify(version),
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
});
