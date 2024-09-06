/**
 * Fetch the version from package.json
 */
export function getVersion(): string | undefined {
  return process.env.OPENAPI_CODEGEN_VERSION;
}
