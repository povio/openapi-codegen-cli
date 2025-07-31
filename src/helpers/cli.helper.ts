/* eslint-disable no-console, @typescript-eslint/no-explicit-any */
import type { Prompt as PromptSyncPrompt } from "prompt-sync";
import { chk } from "./chalk.helper";

/**
 * Wraps prop in a dynamic import
 * @param args
 */
async function prompt(...args: Parameters<PromptSyncPrompt>) {
  const { default: Prompt } = await import("prompt-sync");
  const _prompt = Prompt({ sigint: true });
  return _prompt(...args);
}

/**
 * Print a variable, color it magenta if it's different from the default
 * @param name
 * @param value
 * @param defaultValue
 */
export function logVariable(name: string, value: any, defaultValue?: string | number) {
  if (defaultValue !== undefined && defaultValue !== value) {
    console.log(`${chk.yellow(`${name}:`.padEnd(20))}${chk.magenta(value)}`);
  } else {
    console.log(`${`${name}:`.padEnd(20)}${value}`);
  }
}

export function log(message: string) {
  console.log(message);
}

export function logInfo(message: string) {
  console.log(`[INFO] ${message}`);
}

export function logVerbose(message: string) {
  if (process.env.VERBOSE) {
    console.log(`[VERBOSE] ${message}`);
  }
}

export function logNotice(message: string) {
  console.log(chk.magenta(`[NOTICE] ${message}`));
}

export function logSuccess(message: string) {
  console.log(chk.green(`[SUCCESS] ${message}`));
}

export function logWarning(message: string) {
  console.log(chk.red(`[WARNING] ${message}`));
}

export function logError(error: Error | string, message?: string) {
  if (error instanceof Error) {
    console.log(chk.red(`[ERROR] ${message || error.message}`));
    if (process.env.VERBOSE) {
      console.error(error); // print stack trace
    }
  } else {
    console.log(chk.red(`[ERROR] ${error}`));
  }
}

export function logBanner(message: string) {
  console.log(chk.bgYellow(`==== ${message} ====`));
}

/**
 * Request a ENV variable from the user if not set
 * @param name
 * @param value
 * @param suggested - the value the scripts expects and suggest
 */
export async function promptVar(name: string, value: string, suggested?: string) {
  if (value !== undefined) {
    logVariable(name, value, suggested);
    return value;
  }

  if (suggested !== undefined) {
    // take suggestion on CI
    logVariable(name, value, suggested);
    return suggested;
  } else {
    throw new Error(`Missing Environment: ${name}`);
  }
}

export async function confirm(message: string): Promise<boolean> {
  return (await prompt(message, "yes", {})) === "yes";
}
