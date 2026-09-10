import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { parse } from "yaml";
import type { OpenAPIV3 } from "openapi-types";

import { resolveConfig } from "../src/generators/core/resolveConfig";
import { generateCodeFromOpenAPIDoc } from "../src/generators/generateCodeFromOpenAPIDoc";
import { generateFilesFromNativeOpenAPI } from "../src/native/generateFilesFromNativeOpenAPI";
import { getNativeBindings } from "../src/native/native-bindings";
import { GenerateType, type GenerateFileData } from "../src/generators/types/generate";
import { getTagFileName } from "../src/generators/utils/generate/generate.utils";

export type Manifest = Record<string, string>;

function validateManifest(manifest: unknown): asserts manifest is Manifest {
  if (!manifest || typeof manifest !== "object" || Array.isArray(manifest) || Object.keys(manifest).length === 0) {
    throw new Error("Renderer manifests must contain generated files");
  }
  if (
    Object.entries(manifest).some(([file, hash]) => !file || typeof hash !== "string" || !/^[a-f0-9]{64}$/.test(hash))
  ) {
    throw new Error("Invalid file name or SHA-256 hash in renderer manifest");
  }
}

export function compareManifests(expected: unknown, actual: unknown): string[] {
  validateManifest(expected);
  validateManifest(actual);
  return [...new Set([...Object.keys(expected), ...Object.keys(actual)])]
    .sort()
    .filter((file) => expected[file] !== actual[file]);
}

async function generate(renderer: string, output: string) {
  if (renderer !== "js" && renderer !== "native") throw new Error(`Unknown renderer: ${renderer}`);
  // Explicit selection also protects against accidentally adding automatic fallback here.
  process.env.OPENAPI_CODEGEN_NATIVE = renderer === "js" ? "0" : "1";
  process.env.OPENAPI_CODEGEN_REQUIRE_FULL_NATIVE = "1";
  const source = await readFile("test/petstore.yaml", "utf8");
  const document = parse(source) as OpenAPIV3.Document;
  // Refuse stale output: every uploaded file must belong to this generation.
  await mkdir(path.dirname(output), { recursive: true });
  await mkdir(output);
  const manifest: Manifest = {};
  const scenarios = [
    { name: "namespaces", tsNamespaces: true, modelsInCommon: true, modelsOnly: false },
    { name: "modules", tsNamespaces: false, modelsInCommon: false, modelsOnly: false },
    { name: "local-model-namespaces", tsNamespaces: true, modelsInCommon: false, modelsOnly: true },
  ];
  for (const { name: scenario, tsNamespaces, modelsInCommon, modelsOnly } of scenarios) {
    const options = resolveConfig({
      fileConfig: {
        input: "test/petstore.yaml",
        output: "generated",
        tsNamespaces,
        modelsInCommon,
        modelsOnly,
        acl: false,
        restClientImportPath: "@test/app-rest-client",
      },
      params: {},
    });
    let files: GenerateFileData[] | undefined;
    if (renderer === "js") {
      files = generateCodeFromOpenAPIDoc(document, options);
    } else if (modelsOnly) {
      // This configuration uses native model rendering through the hybrid pipeline.
      // Read native output directly so JS fallback cannot mask a regression.
      const { renderedModels } = getNativeBindings().compileData(source, true, JSON.stringify(options)).data as {
        renderedModels: Record<string, string>;
      };
      files = Object.entries(renderedModels).map(([tag, content]) => ({
        fileName: path.join(options.output, getTagFileName({ tag, type: GenerateType.Models, options })),
        content,
      }));
    } else {
      files = generateFilesFromNativeOpenAPI(source, true, options);
    }
    if (!files?.length) throw new Error(`${renderer} did not generate files for ${scenario}`);
    for (const file of files) {
      const relative = path.relative(options.output, file.fileName);
      if (relative.startsWith("..") || path.isAbsolute(relative))
        throw new Error(`Unexpected output: ${file.fileName}`);
      const name = `${scenario}/${relative.split(path.sep).join("/")}`;
      if (name in manifest) throw new Error(`Duplicate generated file: ${name}`);
      const destination = path.join(output, "files", name);
      await mkdir(path.dirname(destination), { recursive: true });
      await writeFile(destination, file.content);
      // Hash exact bytes on disk; do not normalize whitespace or generated code.
      manifest[name] = createHash("sha256")
        .update(await readFile(destination))
        .digest("hex");
    }
  }
  const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));
  await writeFile(path.join(output, "manifest.json"), `${JSON.stringify(sorted, null, 2)}\n`);
  console.log(`${renderer}: hashed ${Object.keys(manifest).length} generated files`);
}

async function compare(directory: string, artifacts: string[]) {
  if (artifacts.length < 2) throw new Error("Specify a baseline and at least one comparison artifact");
  const manifests = await Promise.all(
    artifacts.map(
      async (artifact) =>
        JSON.parse(await readFile(path.join(directory, artifact, "manifest.json"), "utf8")) as Manifest,
    ),
  );
  let failed = false;
  for (let index = 1; index < artifacts.length; index++) {
    const differences = compareManifests(manifests[0], manifests[index]);
    if (differences.length) {
      failed = true;
      console.error(`${artifacts[index]} differs from ${artifacts[0]}:\n${differences.join("\n")}`);
    }
  }
  if (failed) throw new Error("Generated file lists or SHA-256 hashes differ");
  console.log(`All ${artifacts.length} renderers/platforms match (${Object.keys(manifests[0]).length} files each)`);
}

if (import.meta.main) {
  const [command, ...args] = process.argv.slice(2);
  if (command === "generate" && args.length === 2) await generate(args[0], args[1]);
  else if (command === "compare" && args.length >= 3) await compare(args[0], args.slice(1));
  else
    throw new Error(
      "Usage: renderer-parity.ts generate <js|native> <output> | compare <directory> <artifact> <artifact> [...]",
    );
}
