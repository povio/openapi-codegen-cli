import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const URL = process.env.OPENAPI_SNAPSHOT_URL ?? "http://localhost:4000/docs-json";
const OUTPUT = path.resolve(ROOT, process.env.OPENAPI_SNAPSHOT_OUTPUT ?? "test/benchmarks/openapi.localhost4000.json");

async function main() {
  const res = await fetch(URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch OpenAPI (${res.status} ${res.statusText}) from ${URL}`);
  }

  const json = await res.json();
  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, `${JSON.stringify(json, null, 2)}\n`, "utf-8");
  console.log(`Saved OpenAPI snapshot to ${OUTPUT}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
