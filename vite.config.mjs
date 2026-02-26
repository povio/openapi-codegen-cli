import { readFileSync } from "fs";
import { resolve } from "path";
import { builtinModules } from "module";

import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

import react from "@vitejs/plugin-react";

const pkg = JSON.parse(readFileSync("./package.json", "utf-8"));

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      tsconfigPath: "./tsconfig.json",
      entryRoot: "src",
      outDir: "dist",
      compilerOptions: {
        paths: {
          "@/*": ["./src/*"],
        },
      },
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(process.cwd(), "./src"),
    },
  },
  build: {
    sourcemap: false,
    emptyOutDir: false,
    lib: {
      formats: ["es"],
      entry: {
        index: "src/index.ts",
        vite: "src/vite.ts",
        acl: "src/acl.ts",
      },
    },
    minify: false,
    outDir: "dist",
    rollupOptions: {
      external: [
        // Externalize all dependencies and peerDependencies
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
        ...builtinModules,
        ...builtinModules.map((moduleName) => `node:${moduleName}`),
        /^react($|\/)/,
        /^react-dom($|\/)/,
        /^@[\w-]+\//,
      ],
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
