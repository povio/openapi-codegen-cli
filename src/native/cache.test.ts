import { spawnSync } from "node:child_process";
import path from "node:path";
import { expect, test } from "vitest";

import { resolveConfig } from "@/generators/core/resolveConfig";

test.each([
  ["node", false],
  ["node", true],
  ["bun", false],
  ["bun", true],
] as const)("native cache isolates results and invalidates exact inputs (%s, compact=%s)", (runtime, nativeCompact) => {
  const binary = path.resolve("dist", `openapi-codegen-native-${process.platform}-${process.arch}.node`);
  const options = JSON.stringify({ ...resolveConfig({ fileConfig: {}, params: {} }), nativeCompact });
  const document = {
    openapi: "3.0.3",
    info: { title: "Cache", version: "1" },
    paths: {
      "/item": {
        get: {
          operationId: "getItem",
          tags: ["Items"],
          responses: {
            "200": {
              description: "OK",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Item" } } },
            },
          },
        },
      },
    },
    components: { schemas: { Item: { type: "object", properties: { value: { type: "string" } } } } },
  };
  const script = `
    const assert = require('node:assert/strict');
    const native = require(${JSON.stringify(binary)});
    const options = ${JSON.stringify(options)};
    const source = ${JSON.stringify(JSON.stringify(document))};
    const compile = (s=source,y=false,o=options) => native.compileData(s,y,o);
    const first = compile();
    assert.equal(first.cacheHit,false);
    if (${nativeCompact}) assert.equal(first.data.renderedComplete,true);
    const expected = JSON.stringify(first.data);
    assert.ok(Object.values(first.data.renderedModels).some(code=>code.includes('value: z.string()')));
    const changedDocument = JSON.parse(source);
    changedDocument.components.schemas.Item.properties.value.type = 'number';
    const changedSource = JSON.stringify(changedDocument);
    const changedSchema = compile(changedSource);
    assert.equal(changedSchema.cacheHit,false);
    assert.ok(Object.values(changedSchema.data.renderedModels).some(code=>code.includes('value: z.number()')));
    assert.equal(compile(changedSource).cacheHit,true);
    first.data.renderedModels = {changed:'changed'};
    if (first.data.document) first.data.document.components.schemas.Item.type = 'null';
    const second = compile();
    assert.equal(second.cacheHit,true);
    assert.equal(JSON.stringify(second.data),expected);
    assert.equal(compile(source+' ').cacheHit,false);
    assert.equal(compile(source+' ').cacheHit,true);
    assert.equal(compile(source,true).cacheHit,false);
    assert.equal(compile(source,true).cacheHit,true);
    const changedOptions = JSON.stringify({...JSON.parse(options),baseUrl:'https://changed.example'});
    const changed = compile(source,false,changedOptions);
    assert.equal(changed.cacheHit,false);
    assert.equal(changed.data.baseUrl,'https://changed.example');
    assert.equal(compile(source,false,changedOptions).cacheHit,true);
    assert.equal(compile().cacheHit,false); // original entry was evicted
    assert.equal(compile(source,false,options+' ').cacheHit,false);
    assert.equal(compile(source,false,options+' ').cacheHit,true);
    for(let i=0;i<2;i++) assert.throws(()=>compile('{'));
    for(let i=0;i<2;i++) assert.throws(()=>compile(source,false,'{'));
    assert.equal(compile().cacheHit,true); // errors do not evict successful entries
    process.env.OPENAPI_CODEGEN_NATIVE_CACHE='0';
    const uncached = compile();
    assert.equal(uncached.cacheHit,false);
    assert.equal(JSON.stringify(uncached.data),expected);
    assert.equal(compile().cacheHit,false);
    process.env.OPENAPI_CODEGEN_NATIVE_CACHE='1';
    const suffixOptions = JSON.stringify({...JSON.parse(options),configs:{...JSON.parse(options).configs,models:{...JSON.parse(options).configs.models,namespaceSuffix:'Definitions'}}});
    const renamed = compile(source,false,suffixOptions);
    assert.equal(renamed.cacheHit,false);
    assert.ok(Object.values(renamed.data.renderedModels).some(code=>code.includes('namespace ItemsDefinitions')));
    assert.equal(compile(source,false,suffixOptions).cacheHit,true);
    assert.equal(JSON.stringify(compile().data),expected);
    if (${nativeCompact}) {
      const oversized = ' '.repeat(33 * 1024 * 1024) + source;
      for (let i=0;i<2;i++) {
        const large = compile(oversized);
        assert.equal(large.cacheHit,false);
        assert.equal(JSON.stringify(large.data),expected);
      }
      assert.equal(compile().cacheHit,true); // oversized inputs do not evict a usable result
    }
    if (${JSON.stringify(runtime)} === 'bun') { console.log('passed'); process.exit(0); }
    compile();
    const { Worker } = require('node:worker_threads');
    let received = false;
    const worker = new Worker(\`
      const {parentPort,workerData} = require('node:worker_threads');
      const native = require(workerData.binary);
      const result = native.compileData(workerData.source,false,workerData.options);
      process.env.OPENAPI_CODEGEN_NATIVE_CACHE='0';
      if (native.compileData(workerData.source,false,workerData.options).cacheHit) throw new Error('Worker-local disable ignored');
      process.env.OPENAPI_CODEGEN_NATIVE_CACHE='1';
      if (!native.compileData(workerData.source,false,workerData.options).cacheHit) throw new Error('Worker-local re-enable ignored');
      parentPort.postMessage({hit:result.cacheHit,data:JSON.stringify(result.data)});
    \`, {eval:true,workerData:{binary:${JSON.stringify(binary)},source,options}});
    worker.on('message',result=>{
      received = true;
      assert.equal(result.hit,true);
      assert.equal(result.data,expected);
    });
    worker.on('error',error=>{throw error;});
    worker.on('exit',code=>{
      assert.equal(code,0);
      assert.equal(received,true);
      assert.equal(compile().cacheHit,true);
      console.log('passed');
    });
  `;
  const result = spawnSync(runtime, ["-"], {
    input: script,
    encoding: "utf8",
    timeout: 30_000,
    env: { ...process.env, OPENAPI_CODEGEN_NATIVE_CACHE: "1" },
  });
  expect(result.error).toBeUndefined();
  expect(result.signal, result.stderr).toBeNull();
  expect(result.status, result.stderr).toBe(0);
  expect(result.stdout.trim()).toBe("passed");
});
