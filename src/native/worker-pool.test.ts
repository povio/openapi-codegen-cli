import { spawnSync } from "node:child_process";
import path from "node:path";
import { expect, test } from "vitest";

import { resolveConfig } from "@/generators/core/resolveConfig";

// Reuse keeps the parent addon loaded, as in a normal host process. Shutdown
// initializes only worker environments and releases the last one before exiting.
// Reload then loads the addon again after all original environments have exited.
test.each(["reuse", "shutdown", "reload"])(
  "native worker pool supports concurrent callers and %s",
  (mode) => {
    const binary = path.resolve("dist", `openapi-codegen-native-${process.platform}-${process.arch}.node`);
    const cases = Array.from({ length: 4 }, (_, index) => {
      const schemas = Object.fromEntries(
        Array.from({ length: 160 }, (_, schema) => [
          `Case${index}Item${schema}`,
          { type: "object", properties: { value: { type: "string" } }, required: ["value"] },
        ]),
      );
      const paths = Object.fromEntries(
        Object.keys(schemas).map((name, schema) => [
          `/items/${schema}`,
          {
            get: {
              operationId: `get${name}`,
              tags: [`Case${index}Group${Math.floor(schema / 10)}`],
              responses: {
                "200": {
                  description: "OK",
                  content: { "application/json": { schema: { $ref: `#/components/schemas/${name}` } } },
                },
              },
            },
          },
        ]),
      );
      return {
        source: JSON.stringify({
          openapi: "3.0.3",
          info: { title: `Worker ${index}`, version: "1" },
          paths,
          components: { schemas },
        }),
        options: JSON.stringify({
          ...resolveConfig({
            params: {},
            fileConfig: {
              modelsInCommon: index % 2 === 0,
              modelsInModules: index % 2 !== 0,
              lazySchemas: index < 2,
              tsNamespaces: true,
            },
          }),
          nativeCompact: true,
        }),
      };
    });
    const workerSource = `
    const { parentPort, workerData } = require("node:worker_threads");
    const { createHash } = require("node:crypto");
    const native = require(workerData.binary);
    const gate = new Int32Array(workerData.gate);
    parentPort.postMessage({ ready: true });
    Atomics.wait(gate, 0, 0);
    const result = native.compileData(workerData.source, false, workerData.options);
    if (!result.data.renderedComplete) throw new Error("Full native renderer did not run");
    parentPort.postMessage({ digest: createHash("sha256").update(JSON.stringify(result.data)).digest("hex") });
  `;
    const script = `
    const { Worker } = require("node:worker_threads");
    const { createHash } = require("node:crypto");
    const assert = require("node:assert/strict");
    const binary = ${JSON.stringify(binary)};
    const mode = ${JSON.stringify(mode)};
    if (mode === "reuse") require(binary);
    const cases = ${JSON.stringify(cases)};
    async function concurrentRound() {
      const gate = new SharedArrayBuffer(4);
      let ready = 0;
      return Promise.all(cases.map(testCase => new Promise((resolve, reject) => {
        let digest;
        const worker = new Worker(${JSON.stringify(workerSource)}, {
          eval: true, workerData: { binary, gate, ...testCase }
        });
        worker.on("error", reject);
        worker.on("message", message => {
          if (message.ready && ++ready === cases.length) {
            Atomics.store(new Int32Array(gate), 0, 1);
            Atomics.notify(new Int32Array(gate), 0);
          }
          if (message.digest) digest = message.digest;
        });
        worker.on("exit", code => {
          if (code !== 0 || !digest) reject(new Error("Worker failed: " + code));
          else resolve(digest);
        });
      })));
    }
    (async () => {
      const first = await concurrentRound();
      assert.equal(first.length, cases.length);
      assert.equal(new Set(first).size, cases.length);
      if (mode === "shutdown") {
        console.log("worker shutdown passed");
        return;
      }
      if (mode === "reload") {
        // Keep the parent unloaded across repeated worker-only lifecycles so
        // stale allocator or pool state cannot be hidden by a parent reference.
        for (let round = 0; round < 3; round++) {
          assert.deepEqual(await concurrentRound(), first);
        }
      }
      const native = require(binary);
      const expected = cases.map(testCase => {
        const result = native.compileData(testCase.source, false, testCase.options);
        assert.equal(result.data.renderedComplete, true);
        return createHash("sha256").update(JSON.stringify(result.data)).digest("hex");
      });
      assert.equal(new Set(expected).size, cases.length);
      assert.deepEqual(first, expected);
      assert.deepEqual(await concurrentRound(), expected);
      console.log("worker " + mode + " passed");
    })().catch(error => { console.error(error); process.exit(1); });
  `;
    const result = spawnSync("node", ["-"], { input: script, encoding: "utf8", timeout: 30_000 });
    expect(result.error).toBeUndefined();
    expect(result.signal, result.stderr).toBeNull();
    expect(result.status, result.stderr).toBe(0);
    expect(result.stdout).toContain(`worker ${mode} passed`);
  },
  35_000,
);
