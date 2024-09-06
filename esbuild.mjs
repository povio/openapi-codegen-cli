import { build } from "esbuild";
import fs from "fs";

const packageJson = JSON.parse(fs.readFileSync("package.json", "utf-8"));

await build({
  entryPoints: ["./src/sh.ts"],
  bundle: true,
  sourcemap: false,
  platform: "node",
  minify: true,
  metafile: false,
  format: "cjs",
  keepNames: true,
  external: packageJson.dependencies ? Object.keys(packageJson.dependencies) : [],
  banner: {
    // hacks to allow commonjs modules to be imported
    js: "import { createRequire } from 'module'; const require = createRequire(import.meta.url);import * as url from 'url';const __dirname = url.fileURLToPath(new URL('.', import.meta.url));",
  },
  target: "node14",
  logLevel: "info",
  outfile: "./dist/sh.js",
  define: {
    "process.env.OPENAPI_CODEGEN_VERSION": `"${packageJson.version}"`,
  },
});
