import { GenerateFileData, GenerateType } from "@/generators/types/generate";
import { GenerateOptions } from "@/generators/types/options";
import { getOutputFileName } from "@/generators/utils/file.utils";
import { getTagFileName } from "@/generators/utils/generate/generate.utils";

import { compileNativeData } from "./native-bindings";

type CompleteNativeData = {
  baseUrl: string;
  renderedModels: Record<string, string>;
  renderedEndpoints: Record<string, string>;
  renderedQueries: Record<string, string>;
  renderedAcl: Record<string, string>;
  renderedShared: Record<string, string>;
  renderedComplete: boolean;
  renderedTags: string[];
};

export function generateFilesFromNativeOpenAPI(
  source: string,
  yaml: boolean,
  options: GenerateOptions,
): GenerateFileData[] | undefined {
  if (!supportsCompleteNativeRender(options)) {
    if (process.env.OPENAPI_CODEGEN_REQUIRE_FULL_NATIVE === "1") {
      throw new Error("The selected options are not supported by the full native renderer");
    }
    return undefined;
  }

  const nativeData = compileNativeData(source, yaml, JSON.stringify({ ...options, nativeCompact: true }))
    .data as CompleteNativeData;
  if (!nativeData.renderedComplete) {
    if (process.env.OPENAPI_CODEGEN_REQUIRE_FULL_NATIVE === "1") {
      throw new Error("The selected options are not supported by the full native renderer");
    }
    return undefined;
  }

  const files: GenerateFileData[] = [];
  const taggedRenderers: [GenerateType, Record<string, string>][] = options.modelsOnly
    ? [[GenerateType.Models, nativeData.renderedModels]]
    : [
        [GenerateType.Models, nativeData.renderedModels],
        [GenerateType.Endpoints, nativeData.renderedEndpoints],
        [GenerateType.Queries, nativeData.renderedQueries],
        ...(options.acl
          ? ([[GenerateType.Acl, nativeData.renderedAcl]] as [GenerateType, Record<string, string>][])
          : []),
      ];

  for (const tag of nativeData.renderedTags) {
    for (const [type, rendered] of taggedRenderers) {
      const content = rendered[tag];
      if (content) files.push(taggedFile(options, tag, type, content));
    }
  }

  if (!options.modelsOnly) {
    if (options.acl && nativeData.renderedShared.appAcl) {
      files.push(outputFile(options, "acl/app.ability.ts", nativeData.renderedShared.appAcl));
    }
    if (options.mutationEffects && nativeData.renderedShared.queryModules) {
      files.push(outputFile(options, "queryModules.ts", nativeData.renderedShared.queryModules));
    }
    if (!options.restClientImportPath) {
      files.push(
        outputFile(
          options,
          "app-rest-client.ts",
          `import { RestClient } from "@povio/openapi-codegen";\n\nexport const AppRestClient = new RestClient({\n  config: {\n    baseURL: "${nativeData.baseUrl}"\n  },\n});\n`,
        ),
      );
    }
    if (nativeData.renderedShared.domainErrors) {
      files.push(outputFile(options, "domain-errors.ts", nativeData.renderedShared.domainErrors));
    }
  }

  return files;
}

export function supportsCompleteNativeRender(options: GenerateOptions) {
  return (
    options.splitByTags &&
    ((options.modelsInCommon && options.tsNamespaces) || (!options.modelsInCommon && !options.tsNamespaces)) &&
    !options.inlineEndpoints &&
    !options.builderConfigs &&
    (options.workspaceContext?.length ?? 0) === 0
  );
}

function taggedFile(options: GenerateOptions, tag: string, type: GenerateType, content: string) {
  return outputFile(options, getTagFileName({ tag, type, options }), content);
}

function outputFile(options: GenerateOptions, fileName: string, content: string) {
  return { fileName: getOutputFileName({ output: options.output, fileName }), content };
}
