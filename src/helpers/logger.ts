import type { ZodError } from "zod";

export class Logger {
  constructor(private readonly verbose: boolean) {}

  public info(message: string) {
    console.log(message);
  }

  public warn(message: string) {
    console.warn(message);
  }

  public debug(message: string) {
    if (this.verbose) {
      console.debug(message);
    }
  }

  public error(message: string, error?: Error) {
    if (error) {
      if (error.name === "ZodError") {
        const zodError = error as ZodError;
        console.error(`Error: ${message}`, JSON.stringify(zodError.format(), null, 2));
      } else {
        console.error(`Error: ${message} -> ${error.message || error.toString()}`);
      }
      if (this.verbose) {
        console.error(error);
      }
    } else {
      console.error(`Error: ${message}`);
    }
  }
}
