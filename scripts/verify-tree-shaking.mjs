import { rolldown } from "rolldown";
import { gzipSync } from "node:zlib";

const cases = [
  {
    name: "native subpath",
    source: 'import { NativeRestClient } from "@povio/openapi-codegen-cli/native"; export { NativeRestClient };',
    forbidden: ["axios", "react", "ErrorHandler"],
  },
  {
    name: "native root export",
    source: 'import { NativeRestClient } from "@povio/openapi-codegen-cli"; export { NativeRestClient };',
    forbidden: ["axios", "react", "ErrorHandler"],
  },
  {
    name: "transport types runtime",
    source: 'import { HttpError } from "@povio/openapi-codegen-cli/rest"; export { HttpError };',
    forbidden: ["axios", "react", "zod", "NativeRestClient"],
  },
];

for (const testCase of cases) {
  const build = await rolldown({
    input: "virtual:entry",
    cwd: process.cwd(),
    platform: "browser",
    external: ["zod"],
    plugins: [
      {
        name: "tree-shaking-entry",
        resolveId(id) {
          if (id === "virtual:entry") return id;
        },
        load(id) {
          if (id === "virtual:entry") return testCase.source;
        },
      },
    ],
  });
  const { output } = await build.generate({ format: "esm", minify: true });
  const code = output.find(({ type }) => type === "chunk")?.code ?? "";
  for (const forbidden of testCase.forbidden) {
    if (code.includes(forbidden)) throw new Error(`${testCase.name} retained ${forbidden}`);
  }
  console.log(`${testCase.name}: ${code.length} B (${gzipSync(code).length} B gzip)`);
  await build.close();
}
