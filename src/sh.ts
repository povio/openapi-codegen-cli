#!/usr/bin/env bun

import { command as checkCommand } from "./commands/check.command";
import { command as generateCommand } from "./commands/generate.command";
import { logError, logInfo } from "./helpers/cli.helper";
import { CliUsageError, formatCliHelp, parseCliOptions, type CliCommand } from "./helpers/cli-options.helper";
import { getVersion } from "./helpers/version.helper";

const SCRIPT_NAME = "openapi-codegen";
const commands = [generateCommand, checkCommand] as CliCommand<object>[];

async function main(args: string[]) {
  const end = args.indexOf("--");
  const flags = end === -1 ? args : args.slice(0, end);
  const commandName = flags.find((arg) => !arg.startsWith("-"));
  const command = commands.find(({ command }) => command === commandName);

  if (flags.includes("--version")) {
    console.log(getVersion() || "unknown");
    return;
  }
  if (flags.includes("--help")) {
    console.log(
      command
        ? formatCliHelp({
            usage: `${SCRIPT_NAME} ${command.command}`,
            describe: command.describe,
            options: command.options,
          })
        : formatCliHelp({
            usage: `${SCRIPT_NAME} <command>`,
            commands: commands.map(({ command, describe }) => ({ name: `${SCRIPT_NAME} ${command}`, describe })),
          }),
    );
    return;
  }
  if (commandName === undefined) {
    throw new CliUsageError("Not enough non-option arguments: got 0, need at least 1");
  }
  if (!command) {
    throw new CliUsageError(`Unknown command: ${commandName}`);
  }
  const options = parseCliOptions(command.options, args) as { watch?: boolean; prettier?: boolean };
  await command.handler(options);
  // Nothing else is pending (watch keeps running; --prettier finishes in the background), so exit
  // now: letting the runtime tear down the native addon's threads and memory costs a few ms.
  if (!options.watch && !options.prettier) {
    process.exit(process.exitCode ?? 0);
  }
}

main(process.argv.slice(2)).catch((error: unknown) => {
  logError(error instanceof Error ? error : String(error));
  logInfo("Use '--help' for more info");
  process.exit(1);
});
