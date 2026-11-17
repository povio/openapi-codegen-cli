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
  await command.handler(parseCliOptions(command.options, args));
}

main(process.argv.slice(2)).catch((error: unknown) => {
  logError(error instanceof Error ? error : String(error));
  logInfo("Use '--help' for more info");
  process.exit(1);
});
