import fs from "fs";
import { spawnSync } from "child_process";
import path from "path";

const ROOT = process.cwd();
const EXAMPLE_ROOT = path.join(ROOT, "test/vite-example");
const DATA_DIR = path.join(EXAMPLE_ROOT, "src/data");
const DIST_INDEX = path.join(ROOT, "dist/index.mjs");
const DIST_VITE = path.join(ROOT, "dist/vite.mjs");
const SNAPSHOT_OPENAPI = path.join(ROOT, "test/benchmarks/openapi.localhost4000.json");

function run(command, args, env = {}) {
  const start = process.hrtime.bigint();
  const result = spawnSync(command, args, {
    cwd: ROOT,
    stdio: "pipe",
    shell: process.platform === "win32",
    env: { ...process.env, ...env },
    encoding: "utf-8",
  });
  const elapsedMs = Number(process.hrtime.bigint() - start) / 1_000_000;

  if (result.status !== 0) {
    const stdout = result.stdout?.toString() ?? "";
    const stderr = result.stderr?.toString() ?? "";
    throw new Error(`Command failed: ${command} ${args.join(" ")}\n${stdout}\n${stderr}`);
  }

  return elapsedMs;
}

function ensureBuiltPackage() {
  if (!fs.existsSync(DIST_INDEX) || !fs.existsSync(DIST_VITE)) {
    console.log("Building package (dist)...");
    run("yarn", ["build"]);
  }
}

function ensureBaselineGeneratedData() {
  fs.rmSync(DATA_DIR, { recursive: true, force: true });
  run("yarn", [
    "start",
    "generate",
    "--input",
    "./test/petstore.yaml",
    "--output",
    "./test/vite-example/src/data",
    "--importPath",
    "relative",
    "--no-prettier",
  ]);
}

function buildBaseline() {
  return run("yarn", ["vite", "build", "--config", "test/vite-example/vite.base.config.ts"]);
}

function buildWithCodegen(incremental) {
  if (!incremental) {
    fs.rmSync(DATA_DIR, { recursive: true, force: true });
  }
  const openApiInput = fs.existsSync(SNAPSHOT_OPENAPI) ? SNAPSHOT_OPENAPI : path.join(ROOT, "test/petstore.yaml");
  return run("yarn", ["vite", "build", "--config", "test/vite-example/vite.codegen.config.ts"], {
    OPENAPI_CODEGEN_INCREMENTAL: incremental ? "true" : "false",
    OPENAPI_CODEGEN_INPUT: openApiInput,
  });
}

function pctDiff(value, baseline) {
  return ((value - baseline) / baseline) * 100;
}

function printMs(label, ms) {
  console.log(`${label}: ${ms.toFixed(1)}ms`);
}

function main() {
  ensureBuiltPackage();
  ensureBaselineGeneratedData();

  const baselineMs = buildBaseline();
  const codegenColdMs = buildWithCodegen(false);

  // Prime cache once; measure second incremental run.
  buildWithCodegen(true);
  const codegenWarmMs = buildWithCodegen(true);

  console.log("\nVite build benchmark (test/vite-example):");
  console.log(
    `OpenAPI input: ${fs.existsSync(SNAPSHOT_OPENAPI) ? "test/benchmarks/openapi.localhost4000.json" : "test/petstore.yaml (fallback)"}`,
  );
  printMs("baseline (no plugin)", baselineMs);
  printMs("with openApiCodegen (incremental=false)", codegenColdMs);
  printMs("with openApiCodegen (incremental=true, warm)", codegenWarmMs);
  console.log(
    `\nOverhead vs baseline:\n` +
      `cold: ${pctDiff(codegenColdMs, baselineMs).toFixed(1)}%\n` +
      `warm: ${pctDiff(codegenWarmMs, baselineMs).toFixed(1)}%`,
  );
}

main();
