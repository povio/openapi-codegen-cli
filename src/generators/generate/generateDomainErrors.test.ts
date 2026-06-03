import { describe, expect, it } from "vitest";

import { Endpoint } from "@/generators/types/endpoint";
import { GenerateData } from "@/generators/types/generate";

import { generateDomainErrors } from "./generateDomainErrors";

function makeData(endpointGroups: Partial<Endpoint>[][]): GenerateData {
  const data: GenerateData = new Map();
  endpointGroups.forEach((endpoints, i) => {
    data.set(`tag${i}`, {
      endpoints: endpoints as Endpoint[],
      zodSchemas: {},
    });
  });
  return data;
}

function makeEndpointWithDomainError(domain: string, code: number, description?: string): Partial<Endpoint> {
  return {
    errors: [
      {
        status: 400,
        zodSchema: "z.void()",
        description,
        domainError: { domain, code },
      },
    ],
  };
}

const stubResolver = {} as never;

describe("generateDomainErrors", () => {
  it("returns undefined when no domain errors exist", () => {
    const data = makeData([[{ errors: [{ status: 400, zodSchema: "z.void()" }] }]]);
    expect(generateDomainErrors({ resolver: stubResolver, data })).toBeUndefined();
  });

  it("returns undefined for empty data", () => {
    const data: GenerateData = new Map();
    expect(generateDomainErrors({ resolver: stubResolver, data })).toBeUndefined();
  });

  it("generates const and type for a single domain error", () => {
    const data = makeData([[makeEndpointWithDomainError("rocket", 1001, "Rocket could not launch")]]);
    const result = generateDomainErrors({ resolver: stubResolver, data })!;

    expect(result).toContain("export const RocketDomainErrors = {");
    expect(result).toContain("/** Rocket could not launch */");
    expect(result).toContain("ERROR_1001: 1001");
    expect(result).toContain("} as const;");
    expect(result).toContain("export type RocketDomainErrorCode =");
    expect(result).toContain("(typeof RocketDomainErrors)[keyof typeof RocketDomainErrors]");
  });

  it("deduplicates the same domain/code appearing on multiple endpoints in the same tag", () => {
    const data = makeData([
      [
        makeEndpointWithDomainError("rocket", 1001, "Rocket could not launch"),
        makeEndpointWithDomainError("rocket", 1001, "Rocket could not launch"),
      ],
    ]);
    const result = generateDomainErrors({ resolver: stubResolver, data })!;

    const matches = result.match(/ERROR_1001/g) ?? [];
    expect(matches).toHaveLength(1);
  });

  it("deduplicates the same domain/code across different tags", () => {
    const data = makeData([
      [makeEndpointWithDomainError("rocket", 1001, "Rocket could not launch")],
      [makeEndpointWithDomainError("rocket", 1001, "Rocket could not launch")],
    ]);
    const result = generateDomainErrors({ resolver: stubResolver, data })!;

    const matches = result.match(/ERROR_1001/g) ?? [];
    expect(matches).toHaveLength(1);
  });

  it("groups multiple codes under the same domain", () => {
    const data = makeData([
      [
        makeEndpointWithDomainError("rocket", 1001, "Could not launch"),
        makeEndpointWithDomainError("rocket", 1002, "Out of fuel"),
      ],
    ]);
    const result = generateDomainErrors({ resolver: stubResolver, data })!;

    expect(result).toContain("ERROR_1001: 1001");
    expect(result).toContain("ERROR_1002: 1002");
    // only one const block for the domain
    const matches = result.match(/export const RocketDomainErrors/g) ?? [];
    expect(matches).toHaveLength(1);
  });

  it("generates separate const blocks for different domains", () => {
    const data = makeData([
      [
        makeEndpointWithDomainError("rocket", 1001),
        makeEndpointWithDomainError("user", 2001),
      ],
    ]);
    const result = generateDomainErrors({ resolver: stubResolver, data })!;

    expect(result).toContain("export const RocketDomainErrors = {");
    expect(result).toContain("export const UserDomainErrors = {");
  });

  it("sorts codes numerically within a domain", () => {
    const data = makeData([
      [
        makeEndpointWithDomainError("rocket", 1003),
        makeEndpointWithDomainError("rocket", 1001),
        makeEndpointWithDomainError("rocket", 1002),
      ],
    ]);
    const result = generateDomainErrors({ resolver: stubResolver, data })!;

    const pos1001 = result.indexOf("ERROR_1001");
    const pos1002 = result.indexOf("ERROR_1002");
    const pos1003 = result.indexOf("ERROR_1003");
    expect(pos1001).toBeLessThan(pos1002);
    expect(pos1002).toBeLessThan(pos1003);
  });

  it("sorts domain blocks alphabetically", () => {
    const data = makeData([
      [
        makeEndpointWithDomainError("zebra", 9001),
        makeEndpointWithDomainError("alpha", 1001),
      ],
    ]);
    const result = generateDomainErrors({ resolver: stubResolver, data })!;

    expect(result.indexOf("AlphaDomainErrors")).toBeLessThan(result.indexOf("ZebraDomainErrors"));
  });

  it("omits JSDoc comment when description is undefined", () => {
    const data = makeData([[makeEndpointWithDomainError("rocket", 1001)]]);
    const result = generateDomainErrors({ resolver: stubResolver, data })!;

    expect(result).not.toContain("/**");
    expect(result).toContain("ERROR_1001: 1001");
  });

  it("converts kebab-case domain to PascalCase", () => {
    const data = makeData([[makeEndpointWithDomainError("user-auth", 3001)]]);
    const result = generateDomainErrors({ resolver: stubResolver, data })!;

    expect(result).toContain("export const UserAuthDomainErrors = {");
    expect(result).toContain("export type UserAuthDomainErrorCode =");
  });

  it("converts underscore domain to PascalCase", () => {
    const data = makeData([[makeEndpointWithDomainError("push_notification", 4001)]]);
    const result = generateDomainErrors({ resolver: stubResolver, data })!;

    expect(result).toContain("export const PushNotificationDomainErrors = {");
  });
});