import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import readline from "readline";

function exec(command) {
  try {
    return execSync(command, { encoding: "utf8", stdio: ["inherit", "pipe", "inherit"] }).trim();
  } catch (error) {
    process.exit(1);
  }
}

function main() {
  // check if the working directory is clean
  const status = execSync("git status --porcelain", { encoding: "utf8" }).trim();
  if (status) {
    console.error("Working directory not clean. Please commit all changes before publishing.");
    process.exit(1);
  }

  // build, just in case
  console.log("Building...");
  execSync("pnpm build", { stdio: "inherit" });

  // read version from package.json
  const pkg = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "package.json"), "utf8"));
  const version = pkg.version;

  // create a new git tag
  console.log(`Creating tag v${version}...`);
  try {
    execSync(`git tag -a v${version} -m "v${version}"`, { stdio: "inherit" });
  } catch (error) {
    console.error(`Failed to create tag v${version}. It might already exist.`);
    process.exit(1);
  }

  console.log(`Publishing version: v${version}`);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question("Press enter to continue (or Ctrl+C to cancel)", () => {
    rl.close();
    console.log("Pushing tag...");
    execSync(`git push origin "v${version}"`, { stdio: "inherit" });
  });
}

main();
