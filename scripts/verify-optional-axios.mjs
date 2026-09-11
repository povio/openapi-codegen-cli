import { rolldown } from "rolldown";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { cpSync, mkdtempSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

// Copy published artifacts outside the repository so its development Axios cannot
// satisfy imports or declarations accidentally. Keep all other peers available.
const fixture = mkdtempSync(path.join(tmpdir(), "openapi-without-axios-"));
const manifest = JSON.parse(readFileSync("package.json", "utf8"));
const run = (args) => {
  const result = spawnSync(process.execPath, args, { cwd: fixture, encoding: "utf8" });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
};
try {
  const packageDir = path.join(fixture, "node_modules", manifest.name);
  mkdirSync(packageDir, { recursive: true });
  cpSync("dist", path.join(packageDir, "dist"), { recursive: true });
  writeFileSync(path.join(packageDir, "package.json"), JSON.stringify(manifest));
  for (const dependency of new Set([
    ...Object.keys(manifest.dependencies),
    ...Object.keys(manifest.peerDependencies),
    "@types/react",
  ])) {
    if (dependency === "axios") continue;
    const destination = path.join(fixture, "node_modules", dependency);
    mkdirSync(path.dirname(destination), { recursive: true });
    symlinkSync(path.resolve("node_modules", dependency), destination, "dir");
  }
  writeFileSync(path.join(fixture, "package.json"), '{"type":"module"}');
  writeFileSync(
    path.join(fixture, "runtime.mjs"),
    `
    import assert from "node:assert/strict";
    import { registerHooks } from "node:module";
    registerHooks({ resolve(id, context, next) {
      if (id === "axios" || id.startsWith("axios/")) throw new Error("AXIOS_UNAVAILABLE");
      return next(id, context);
    }});
    for (const entry of ["/native", "/rest", "/errors", "/query", "/config", "/auth", "/generator", "/tiny", "/vite", "/metro", "/zod", "/acl"]) {
      await import("${manifest.name}" + entry);
    }
    const { RestUtils } = await import("${manifest.name}/errors");
    assert.equal(RestUtils.extractContentDispositionFilename(new Headers({"content-disposition": 'attachment; filename="report.csv"'})), "report.csv");
    await assert.rejects(import("${manifest.name}/axios"), /AXIOS_UNAVAILABLE/);
  `,
  );
  run(["runtime.mjs"]);
  // A root barrel needs a bundler to remove unused peer-dependent exports.
  // Resolve against the isolated consumer, where Axios is actually absent.
  writeFileSync(
    path.join(fixture, "entry.mjs"),
    `
    import { NativeRestClient, RestUtils } from "${manifest.name}";
    export { NativeRestClient, RestUtils };
  `,
  );
  const bundle = await rolldown({
    input: path.join(fixture, "entry.mjs"),
    platform: "browser",
    external: ["zod"],
  });
  try {
    const { output } = await bundle.generate({ format: "esm" });
    const code = output
      .filter((item) => item.type === "chunk")
      .map((item) => item.code)
      .join("\n");
    assert.doesNotMatch(code, /from\s+["']axios["']|import\(["']axios["']\)|require\(["']axios["']\)/);
    writeFileSync(path.join(fixture, "bundle.mjs"), code);
    run([
      "--input-type=module",
      "-e",
      'const m = await import("./bundle.mjs"); if (typeof m.NativeRestClient !== "function" || !m.RestUtils) process.exit(1)',
    ]);
  } finally {
    await bundle.close();
  }
  writeFileSync(
    path.join(fixture, "consumer.ts"),
    `
    import { NativeRestClient } from "${manifest.name}/native";
    import { ErrorHandler, RestUtils } from "${manifest.name}/errors";
    import { NativeHttpError } from "${manifest.name}/native";
    import { SharedErrorHandler } from "${manifest.name}/errors";
    export { NativeRestClient, NativeHttpError, ErrorHandler, SharedErrorHandler };
    RestUtils.doesServerErrorMessageContain(new Error("failure"), "failure");
    RestUtils.extractContentDispositionFilename(new Headers());
  `,
  );
  writeFileSync(
    path.join(fixture, "tsconfig.json"),
    JSON.stringify({
      compilerOptions: {
        target: "ESNext",
        module: "NodeNext",
        moduleResolution: "NodeNext",
        strict: true,
        skipLibCheck: false,
        noEmit: true,
        types: [],
        lib: ["ESNext", "DOM"],
      },
      files: ["consumer.ts"],
    }),
  );
  run([path.resolve("node_modules/typescript/bin/tsc"), "-p", "tsconfig.json"]);
  // Existing Axios consumers retain the dedicated entry point and can pass
  // Axios headers to the shared utilities without a type adapter.
  symlinkSync(path.resolve("node_modules/axios"), path.join(fixture, "node_modules/axios"), "dir");
  writeFileSync(
    path.join(fixture, "consumer.ts"),
    `
    import { RestClient, RestInterceptor } from "${manifest.name}";
    import type { RequestInfo, RequestConfig, Response, IRestClient } from "${manifest.name}";
    export type { RequestInfo, RequestConfig, Response, IRestClient };
    import { RestUtils } from "${manifest.name}/errors";
    import { AxiosHeaders } from "axios";
    export { RestClient, RestInterceptor };
    RestUtils.extractContentDispositionFilename(new AxiosHeaders());
  `,
  );
  run([path.resolve("node_modules/typescript/bin/tsc"), "-p", "tsconfig.json"]);
  run(["--input-type=module", "-e", `await import("${manifest.name}/axios")`]);
  console.log(
    "Native subpaths and tree-shaken root work without Axios; legacy root exports type-check with Axios installed.",
  );
} finally {
  rmSync(fixture, { recursive: true, force: true });
}
