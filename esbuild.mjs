import { build } from "esbuild";
import fs from "fs";

const packageJson = JSON.parse(fs.readFileSync("package.json", "utf-8"));

const external = [
  ...Object.keys(packageJson.dependencies || {}),
  ...Object.keys(packageJson.peerDependencies || {}),
];

// CLI and Node.js builds - run in Node.js
const nodeBuildOptions = {
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

// Client/Browser build - runs in React/React-Native apps
const clientBuildOptions = {
  bundle: true,
  sourcemap: false,
  platform: "browser",
  format: "esm",
  minify: true,
  metafile: false,
  keepNames: true,
  external,
  target: ["es2020"],
  logLevel: "info",
  define: {
    "process.env.NODE_ENV": `"production"`,
  },
};

await build({ ...nodeBuildOptions, entryPoints: ["./src/sh.ts"], outfile: "./dist/sh.js" });
await build({ ...nodeBuildOptions, entryPoints: ["./src/generator.ts"], outfile: "./dist/generator.js" });
await build({ ...clientBuildOptions, entryPoints: ["./src/index.ts"], outfile: "./dist/index.js" });
