import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const manifest = path.join(root, "native", "Cargo.toml");
const userCargo = process.env.HOME ? path.join(process.env.HOME, ".cargo", "bin", "cargo") : undefined;
const brewRustup = "/opt/homebrew/opt/rustup/bin/rustup";
let command = userCargo && existsSync(userCargo) ? userCargo : "cargo";
let toolchainBin;
if (command === "cargo" && existsSync(brewRustup)) {
  const resolved = spawnSync(brewRustup, ["which", "cargo"], { encoding: "utf8" });
  if (resolved.status === 0) {
    command = resolved.stdout.trim();
    toolchainBin = path.dirname(command);
  }
}
const release = process.env.OPENAPI_NATIVE_FAST_BUILD !== "1";
const args = ["build", ...(release ? ["--release"] : []), "--manifest-path", manifest];
const result = spawnSync(command, args, {
  cwd: root,
  env: toolchainBin ? { ...process.env, PATH: `${toolchainBin}:${process.env.PATH ?? ""}` } : process.env,
  stdio: "inherit",
});
if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

const libraryName =
  process.platform === "win32"
    ? "openapi_codegen_native.dll"
    : process.platform === "darwin"
      ? "libopenapi_codegen_native.dylib"
      : "libopenapi_codegen_native.so";
const source = path.join(root, "native", "target", release ? "release" : "debug", libraryName);
const outputDir = path.join(root, "dist");
mkdirSync(outputDir, { recursive: true });
const output = path.join(outputDir, `openapi-codegen-native-${process.platform}-${process.arch}.node`);
copyFileSync(source, output);
if (process.platform === "darwin") {
  spawnSync("xattr", ["-d", "com.apple.provenance", output], { stdio: "ignore" });
}
