import { describe, expect, test } from "vitest";

import { command as generateCommand } from "@/commands/generate.command";

import { CliUsageError, formatCliHelp, parseCliOptions } from "./cli-options.helper";

function parse(...args: string[]) {
  const parsed = parseCliOptions(generateCommand.options, args) as Record<string, unknown>;
  return Object.fromEntries(Object.entries(parsed).filter(([, value]) => value !== undefined));
}

describe("parseCliOptions", () => {
  test("applies declared defaults", () => {
    expect(parse()).toEqual({ verbose: false });
  });

  test("reads string values in both spellings", () => {
    expect(parse("--input", "a.json", "--output=out", "--tsPath=a=b")).toMatchObject({
      input: "a.json",
      output: "out",
      tsPath: "a=b",
    });
  });

  test("parses booleans like yargs", () => {
    expect(
      parse(
        "--clear-output",
        "--no-incremental",
        "--tsNamespaces=false",
        "--splitByTags",
        "false",
        "--verbose",
        "true",
      ),
    ).toMatchObject({ clearOutput: true, incremental: false, tsNamespaces: false, splitByTags: false, verbose: true });
    expect(parse("--acl=yes")).toMatchObject({ acl: false });
  });

  test("gives a string option without a value an empty string", () => {
    expect(parse("--input", "--output", "x")).toMatchObject({ input: "", output: "x" });
    expect(parse("--input")).toMatchObject({ input: "" });
  });

  test("accepts negative numbers as values", () => {
    expect(parse("--defaultTag", "-5")).toMatchObject({ defaultTag: "-5" });
  });

  test("keeps undeclared flags such as --no-prettier", () => {
    expect(parse("--no-prettier", "--foo", "bar")).toMatchObject({ prettier: false, foo: "bar" });
    expect(parse("--prettier")).toMatchObject({ prettier: true });
  });

  test("ignores positionals and everything after --", () => {
    expect(parse("extra", "--", "--input", "x")).toEqual({ verbose: false });
  });

  test("uses the last value of a repeated option", () => {
    expect(parse("--includeTags", "a", "--includeTags", "b")).toMatchObject({ includeTags: "b" });
  });

  test("validates choices", () => {
    expect(parse("--restClient", "axios")).toMatchObject({ restClient: "axios" });
    expect(() => parse("--restClient", "bad")).toThrow(CliUsageError);
  });
});

test("formatCliHelp lists command options with their types", () => {
  const help = formatCliHelp({ usage: "openapi-codegen generate", options: generateCommand.options });
  expect(help).toMatch(/--input +\[input\] +\[string\]/);
  expect(help).toMatch(/--verbose +\[verbose\] +\[boolean\] \[default: false\]/);
  expect(help).toMatch(/--restClient +\[restClient\] +\[string\] \[choices: "axios", "native"\]/);
});
