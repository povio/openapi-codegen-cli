import fs from "node:fs";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { GenerateFileData } from "@/generators/types/generate";

const MANIFEST_VERSION = 1;

type IncrementalManifest = {
  version: typeof MANIFEST_VERSION;
  /** Hash of the generator build, renderer, resolved config and OpenAPI source. */
  key: string;
  /** Absolute file name -> hash of the content the generator produced for it. */
  files: Record<string, string>;
  stats: { generatedFilesCount: number; generatedModulesCount: number };
};

/**
 * Remembers what the last run generated for an output directory, outside the output so
 * nothing extra gets committed. Files are compared with what was generated, not what is
 * on disk, so formatters and post-processing scripts can rewrite them without forcing
 * every file to be written again.
 */
export class IncrementalCache {
  private readonly manifestPath: string;
  private manifest: IncrementalManifest | undefined;

  /** `salt` identifies how files are post-processed (the formatter), so changing it rewrites them. */
  constructor(
    output: string,
    private readonly salt = "",
  ) {
    const outputPath = path.resolve(output);
    this.manifestPath = path.join(findCacheDirectory(outputPath), `${hash(outputPath).slice(0, 32)}.json`);
    this.manifest = readManifest(this.manifestPath);
  }

  static key(parts: readonly string[]) {
    return hash([getBuildStamp(), ...parts].join("\0"));
  }

  /** Stats of the previous run when nothing it would generate can have changed. */
  unchangedStats(key: string) {
    const manifest = this.manifest;
    if (manifest?.key !== key) return undefined;
    return Object.keys(manifest.files).every((fileName) => fs.existsSync(fileName)) ? manifest.stats : undefined;
  }

  /** Files whose generated content differs from the previous run, or that are missing. */
  changedFiles(filesData: GenerateFileData[]) {
    const previous = this.manifest?.files;
    if (!previous) return filesData;
    return filesData.filter(
      ({ fileName, content }) =>
        previous[path.resolve(fileName)] !== hash(this.salt + content) || !fs.existsSync(fileName),
    );
  }

  save(key: string, filesData: GenerateFileData[], stats: IncrementalManifest["stats"]) {
    const manifest: IncrementalManifest = {
      version: MANIFEST_VERSION,
      key,
      files: Object.fromEntries(
        filesData.map(({ fileName, content }) => [path.resolve(fileName), hash(this.salt + content)]),
      ),
      stats,
    };
    try {
      fs.mkdirSync(path.dirname(this.manifestPath), { recursive: true });
      const temporaryPath = `${this.manifestPath}.${process.pid}.tmp`;
      fs.writeFileSync(temporaryPath, JSON.stringify(manifest));
      fs.renameSync(temporaryPath, this.manifestPath);
      this.manifest = manifest;
    } catch {
      // The cache only saves time; a read-only location must not fail generation.
    }
  }
}

/** Change detection only. Bun.hash avoids loading node:crypto, which slows CLI startup. */
function hash(value: string) {
  if (typeof Bun !== "undefined") return Bun.hash(value).toString(16);
  const { createHash } = createRequire(import.meta.url)("node:crypto") as typeof import("node:crypto");
  return createHash("sha256").update(value).digest("hex");
}

function readManifest(manifestPath: string): IncrementalManifest | undefined {
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8")) as IncrementalManifest;
    return manifest.version === MANIFEST_VERSION ? manifest : undefined;
  } catch {
    return undefined;
  }
}

/** `node_modules/.cache/openapi-codegen` of the nearest package, else the system temp directory. */
function findCacheDirectory(outputPath: string) {
  for (let directory = outputPath; ; directory = path.dirname(directory)) {
    const nodeModules = path.join(directory, "node_modules");
    if (fs.existsSync(nodeModules)) return path.join(nodeModules, ".cache", "openapi-codegen");
    if (path.dirname(directory) === directory) break;
  }
  return path.join(os.tmpdir(), "openapi-codegen-cache");
}

let buildStamp: string | undefined;

/** Changes whenever the installed or locally rebuilt generator changes. */
function getBuildStamp() {
  if (buildStamp !== undefined) return buildStamp;
  const moduleDir = path.dirname(fileURLToPath(import.meta.url));
  const binaryName = `openapi-codegen-native-${process.platform}-${process.arch}.node`;
  // The bundled CLI keeps the native addon next to this module; source runs use ../../../dist.
  const files = [
    fileURLToPath(import.meta.url),
    path.join(moduleDir, binaryName),
    path.resolve(moduleDir, "../../../dist", binaryName),
  ];
  const stamps = files.map((file) => {
    try {
      const { mtimeMs, size } = fs.statSync(file);
      return `${mtimeMs}:${size}`;
    } catch {
      return "";
    }
  });
  buildStamp = [process.env.OPENAPI_CODEGEN_VERSION ?? "", ...stamps].join("|");
  return buildStamp;
}
