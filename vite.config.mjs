import react from "@vitejs/plugin-react";
import { readFileSync } from "fs";
import { defineConfig } from "vite";

const pkg = JSON.parse(readFileSync("./package.json", "utf-8"));

export default defineConfig({
  plugins: [
    react(),
  ],
  build: {
    sourcemap: false,
    emptyOutDir: false,
    lib: {
      formats: ["es"],
      entry: {
        index: "src/index.ts",
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
