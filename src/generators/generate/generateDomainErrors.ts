import { SchemaResolver } from "@/generators/core/SchemaResolver.class";
import { GenerateData } from "@/generators/types/generate";
import { capitalize } from "@/generators/utils/string.utils";

function domainToPascalCase(domain: string): string {
  return domain.split(/[-_]/).map(capitalize).join("");
}

const VALID_IDENTIFIER = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;

interface DomainErrorDef {
  code: number | string;
  name?: string;
  description?: string;
}

export function generateDomainErrors({ data }: { resolver: SchemaResolver; data: GenerateData }): string | undefined {
  const byDomain = new Map<string, Map<number | string, DomainErrorDef>>();

  for (const { endpoints } of data.values()) {
    for (const endpoint of endpoints) {
      for (const error of endpoint.errors) {
        if (!error.domainError) continue;
        const { domain, code } = error.domainError;

        if (!byDomain.has(domain)) {
          byDomain.set(domain, new Map());
        }

        const domainMap = byDomain.get(domain)!;
        if (!domainMap.has(code)) {
          domainMap.set(code, { code, name: error.domainError.name, description: error.description });
        }
      }
    }
  }

  if (byDomain.size === 0) return undefined;

  const blocks: string[] = [];

  for (const [domain, codes] of [...byDomain.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    const pascalName = domainToPascalCase(domain);
    const sortedCodes = [...codes.values()].sort((a, b) => {
      if (typeof a.code === "number" && typeof b.code === "number") return a.code - b.code;
      const sa = String(a.code);
      const sb = String(b.code);
      return sa < sb ? -1 : sa > sb ? 1 : 0;
    });

    const entries = sortedCodes
      .map(({ code, name, description }) => {
        const comment = description ? `  /** ${description} */\n  ` : "  ";
        const key = name ?? (typeof code === "string" ? code : `ERROR_${code}`);
        if (!VALID_IDENTIFIER.test(key)) {
          throw new Error(
            `Domain error code "${code}" produces an invalid identifier "${key}". ` +
              `Use the 'name' field on @ApiDomainErrorResponse to provide a valid identifier.`,
          );
        }
        const value = typeof code === "string" ? `"${code}"` : String(code);
        return `${comment}${key}: ${value}`;
      })
      .join(",\n");

    blocks.push(`export const ${pascalName}DomainErrors = {\n${entries},\n} as const;`);
    blocks.push(
      `export type ${pascalName}DomainErrorCode = (typeof ${pascalName}DomainErrors)[keyof typeof ${pascalName}DomainErrors];`,
    );
  }

  return blocks.join("\n\n") + "\n";
}
