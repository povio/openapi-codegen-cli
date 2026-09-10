import { describe, expect, test } from "vitest";
import type { OpenAPIV3 } from "openapi-types";
import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile, symlink } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { parse } from "yaml";

import { DEFAULT_GENERATE_OPTIONS } from "@/generators/const/options.const";
import { getDataFromOpenAPIDoc } from "@/generators/core/getDataFromOpenAPIDoc";
import { resolveConfig } from "@/generators/core/resolveConfig";
import { generateModels } from "@/generators/generate/generateModels";
import { GenerateType } from "@/generators/types/generate";
import { getTagFileName } from "@/generators/utils/generate/generate.utils";
import { getNativeBindings } from "./native-bindings";

describe("native module-local model imports", () => {
  test.each([
    [true, "Models"],
    [false, "Models"],
    [true, "Schemas"],
  ] as const)(
    "imports shared schemas consistently with namespaces=%s and suffix=%s",
    async (tsNamespaces, namespaceSuffix) => {
      const source = await readFile("test/petstore.yaml", "utf8");
      const document = parse(source) as OpenAPIV3.Document;
      const options = resolveConfig({
        fileConfig: {
          input: "fixture",
          output: "output",
          modelsInCommon: false,
          tsNamespaces,
          acl: false,
          importPath: "relative",
          includeTags: ["EmailAdmin", "PushNotificationAdmin"],
          configs: {
            ...DEFAULT_GENERATE_OPTIONS.configs,
            models: { ...DEFAULT_GENERATE_OPTIONS.configs.models, namespaceSuffix },
          },
        },
        params: {},
      });
      const expected = getDataFromOpenAPIDoc(document, options);
      const { renderedModels } = getNativeBindings().compileData(source, true, JSON.stringify(options)).data as {
        renderedModels: Record<string, string>;
      };
      const email = renderedModels.EmailAdmin;
      expect(email).toContain(
        tsNamespaces ? `import { Common${namespaceSuffix} }` : "import { BaseLogLevelEnumSchema, LabelResponseSchema }",
      );
      // Load the generated TypeScript itself to catch undefined namespace references.
      const directory = await mkdtemp(path.join(os.tmpdir(), "native-model-imports-"));
      try {
        await symlink(path.join(process.cwd(), "node_modules"), path.join(directory, "node_modules"), "dir");
        for (const [tag, content] of Object.entries(renderedModels)) {
          const file = path.join(directory, getTagFileName({ tag, type: GenerateType.Models, options }));
          await mkdir(path.dirname(file), { recursive: true });
          await writeFile(file, content);
        }
        const exported = tsNamespaces ? `EmailAdmin${namespaceSuffix}` : "EmailActivityAdminResponseSchema";
        const schema = tsNamespaces ? `${exported}.EmailActivityAdminResponseSchema` : exported;
        await writeFile(
          path.join(directory, "check.ts"),
          `
        import { ${exported} } from "./emailAdmin/emailAdmin.models";
        if (${schema}.parse({ level: "info" }).level !== "info") throw new Error("Expected valid log level");
        if (${schema}.safeParse({ level: "invalid" }).success) throw new Error("Expected invalid log level rejection");
      `,
        );
        execFileSync("bun", [path.join(directory, "check.ts")], { stdio: "pipe" });
      } finally {
        await rm(directory, { recursive: true, force: true });
      }
      for (const tag of expected.data.keys()) {
        expect(renderedModels[tag], tag).toBe(generateModels({ ...expected, tag }));
      }
    },
  );
});
