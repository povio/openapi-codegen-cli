/* eslint-disable no-console */
import type { Prompt as PromptSyncPrompt } from "prompt-sync";

// Plain ANSI codes: importing node:util for styleText costs several ms of CLI startup.
const STYLES = {
  red: [31, 39],
  green: [32, 39],
  yellow: [33, 39],
  magenta: [35, 39],
  bgYellow: [43, 49],
} as const;

let colorEnabled: boolean | undefined;

/** Same rules as util.styleText: colour on a TTY unless NO_COLOR or TERM=dumb; FORCE_COLOR wins. */
function useColor() {
  if (colorEnabled === undefined) {
    const { FORCE_COLOR, NO_COLOR, TERM } = process.env;
    colorEnabled =
      FORCE_COLOR !== undefined
        ? FORCE_COLOR !== "0" && FORCE_COLOR !== "false"
        : NO_COLOR === undefined && TERM !== "dumb" && process.stdout.isTTY === true;
  }
  return colorEnabled;
}

function styleText(style: keyof typeof STYLES, text: string) {
  if (!useColor()) return text;
  const [open, close] = STYLES[style];
  return `\u001b[${open}m${text}\u001b[${close}m`;
}

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
export function logVariable(name: string, value: unknown, defaultValue?: string | number) {
  if (defaultValue !== undefined && defaultValue !== value) {
    console.log(`${styleText("yellow", `${name}:`.padEnd(20))}${styleText("magenta", String(value))}`);
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

export function logNotice(message: string) {
  console.log(styleText("magenta", `[NOTICE] ${message}`));
}

export function logSuccess(message: string) {
  console.log(styleText("green", `[SUCCESS] ${message}`));
}

export function logWarning(message: string) {
  console.log(styleText("red", `[WARNING] ${message}`));
}

export function logError(error: Error | string, message?: string) {
  if (error instanceof Error) {
    console.log(styleText("red", `[ERROR] ${message || error.message}`));
  } else {
    console.log(styleText("red", `[ERROR] ${error}`));
  }
}

export function logBanner(message: string) {
  console.log(styleText("bgYellow", `==== ${message} ====`));
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
