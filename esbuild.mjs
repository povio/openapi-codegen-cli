import { build } from "esbuild";
import fs from "fs";

const packageJson = JSON.parse(fs.readFileSync("package.json", "utf-8"));

const external = [
  ...Object.keys(packageJson.dependencies || {}),
  ...Object.keys(packageJson.peerDependencies || {}),
];

const buildOptions = {
  bundle: true,
  sourcemap: false,
  platform: "node",
  minify: true,
  metafile: false,
  keepNames: true,
  external,
  target: "node14",
  logLevel: "info",
  define: {
    "process.env.OPENAPI_CODEGEN_VERSION": `"${packageJson.version}"`,
    "process.env.NODE_ENV": `"production"`,
  },
};

await build({ ...buildOptions, entryPoints: ["./src/sh.ts"], outfile: "./dist/sh.js" });
await build({ ...buildOptions, entryPoints: ["./src/index.ts"], outfile: "./dist/index.js" });
