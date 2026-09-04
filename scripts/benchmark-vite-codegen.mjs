import fs from "fs";
import { spawnSync } from "child_process";
import path from "path";

const ROOT = process.cwd();
const EXAMPLE_ROOT = path.join(ROOT, "test/vite-example");
const DATA_DIR = path.join(EXAMPLE_ROOT, "src/data");
const DIST_INDEX = path.join(ROOT, "dist/index.mjs");
const DIST_VITE = path.join(ROOT, "dist/vite.mjs");
const SNAPSHOT_OPENAPI = path.join(ROOT, "test/benchmarks/openapi.localhost4000.json");
const OPENAPI_INPUT = fs.existsSync(SNAPSHOT_OPENAPI) ? SNAPSHOT_OPENAPI : path.join(ROOT, "test/petstore.yaml");
const ITERATIONS = Number.parseInt(process.env.OPENAPI_CODEGEN_BENCH_ITERATIONS ?? "5", 10);

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
    run("bun", ["run", "build"]);
  }
}

function ensureBaselineGeneratedData() {
  fs.rmSync(DATA_DIR, { recursive: true, force: true });
  run("bun", [
    "run",
    "start",
    "generate",
    "--input",
    OPENAPI_INPUT,
    "--output",
    "./test/vite-example/src/data",
    "--importPath",
    "relative",
    "--no-prettier",
  ]);
}

function buildBaseline() {
  return run("bun", ["x", "vite", "build", "--config", "test/vite-example/vite.base.config.ts"]);
}

function buildWithCodegen() {
  fs.rmSync(DATA_DIR, { recursive: true, force: true });
  return run("bun", ["x", "vite", "build", "--config", "test/vite-example/vite.codegen.config.ts"], {
    OPENAPI_CODEGEN_INCREMENTAL: "false",
    OPENAPI_CODEGEN_INPUT: OPENAPI_INPUT,
  });
}

function pctDiff(value, baseline) {
  return ((value - baseline) / baseline) * 100;
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
}

function printMeasurements(label, values) {
  console.log(
    `${label}: ${median(values).toFixed(1)}ms median (${values.map((value) => value.toFixed(1)).join(", ")})`,
  );
}

function main() {
  ensureBuiltPackage();
  ensureBaselineGeneratedData();

  const baselineMeasurements = [];
  const codegenColdMeasurements = [];
  for (let iteration = 0; iteration < ITERATIONS; iteration += 1) {
    ensureBaselineGeneratedData();
    baselineMeasurements.push(buildBaseline());
    codegenColdMeasurements.push(buildWithCodegen());
  }

  const baselineMs = median(baselineMeasurements);
  const codegenColdMs = median(codegenColdMeasurements);

  console.log("\nVite build benchmark (test/vite-example):");
  console.log(`OpenAPI input: ${path.relative(ROOT, OPENAPI_INPUT)}`);
  console.log(`Iterations: ${ITERATIONS}`);
  printMeasurements("baseline (same generated sources, no plugin)", baselineMeasurements);
  printMeasurements("with openApiCodegen (cold output)", codegenColdMeasurements);
  console.log(
    `\nCold codegen overhead: ${(codegenColdMs - baselineMs).toFixed(1)}ms (${pctDiff(codegenColdMs, baselineMs).toFixed(1)}%)`,
  );
}

main();
