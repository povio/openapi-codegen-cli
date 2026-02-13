/// <reference types="vitest" />

import { defineConfig } from "vitest/config";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    snapshotFormat: { indent: 4, escapeString: false },
  },
  resolve: {
    alias: {
      "@": resolve(process.cwd(), "./src"),
    },
  },
});
