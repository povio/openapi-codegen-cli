import fs from "fs";

/**
 * Fetch the version from package.json
 */
export function getVersion(): string | undefined {
  if (process.env.OPENAPI_CODEGEN_VERSION) {
    return process.env.OPENAPI_CODEGEN_VERSION;
  }

  const packageJson = JSON.parse(fs.readFileSync("package.json", "utf-8"));
  return packageJson.version;
}
