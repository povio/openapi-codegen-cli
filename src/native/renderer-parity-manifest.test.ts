import { createHash } from "node:crypto";
import { describe, expect, test } from "vitest";

import { compareManifests } from "../../scripts/renderer-parity";

const hash = (content: string) => createHash("sha256").update(content).digest("hex");

describe("renderer file hash comparison", () => {
  test("compares file contents regardless of manifest entry order", () => {
    const first = { "pet.ts": hash("pet"), "store.ts": hash("store") };
    const second = { "store.ts": hash("store"), "pet.ts": hash("pet") };
    expect(compareManifests(first, second)).toEqual([]);
  });

  test("detects even whitespace differences in file contents", () => {
    expect(compareManifests({ "pet.ts": hash("pet\n") }, { "pet.ts": hash("pet\r\n") })).toEqual(["pet.ts"]);
  });

  test("detects missing and additional files even when their contents match", () => {
    const same = hash("same");
    expect(compareManifests({ "pet.ts": same, "old.ts": same }, { "pet.ts": same, "new.ts": same })).toEqual([
      "new.ts",
      "old.ts",
    ]);
  });

  test.each([{}, null, [], { "pet.ts": "not a hash" }])("rejects an empty or invalid manifest: %j", (invalid) => {
    const valid = { "pet.ts": hash("pet") };
    expect(() => compareManifests(valid, invalid)).toThrow();
    expect(() => compareManifests(invalid, valid)).toThrow();
  });
});
