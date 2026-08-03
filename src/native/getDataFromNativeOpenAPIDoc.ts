import { OpenAPIV3 } from "openapi-types";

import { SchemaResolver } from "@/generators/core/SchemaResolver.class";
import { Endpoint } from "@/generators/types/endpoint";
import { GenerateData } from "@/generators/types/generate";
import { GenerateOptions } from "@/generators/types/options";
import { getEndpointTag } from "@/generators/utils/tag.utils";

import { compileNativeData } from "./native-bindings";

type NativeData = {
  endpoints: Endpoint[];
  schemas: Record<string, string>;
  schemaOwners: Record<string, string>;
  schemaRefs: Record<string, string>;
  circularSchemas: string[];
  topologyOrder: string[];
  baseUrl: string;
  generatedObjects: Record<string, OpenAPIV3.SchemaObject>;
  generatedDependencies: Record<string, string[]>;
  dependencies: Record<string, string[]>;
  renderedModels: Record<string, string>;
  renderedEndpoints: Record<string, string>;
  renderedQueries: Record<string, string>;
  renderedAcl: Record<string, string>;
  renderedShared: Record<string, string>;
  renderedComplete: boolean;
  renderedTags: string[];
  document: OpenAPIV3.Document | null;
};

class NativeSchemaResolver {
  readonly options: GenerateOptions;
  readonly openApiDoc: OpenAPIV3.Document;
  readonly dependencyGraph: SchemaResolver["dependencyGraph"];

  private readonly refByName: Map<string, string>;
  private readonly nameByRef: Map<string, string>;
  private readonly circularSchemas: Set<string>;
  private readonly referencedNames = new Map<string, string[]>();
  private enumObjectsByCode?: Map<string, OpenAPIV3.SchemaObject>;

  constructor(
    openApiDoc: OpenAPIV3.Document,
    options: GenerateOptions,
    private readonly nativeData: NativeData,
  ) {
    this.openApiDoc = openApiDoc;
    this.options = options;
    this.refByName = new Map(Object.entries(nativeData.schemaRefs));
    for (const name of Object.keys(nativeData.generatedObjects)) {
      if (!this.refByName.has(name)) this.refByName.set(name, `#/x-native-schemas/${encodeURIComponent(name)}`);
    }
    this.nameByRef = new Map([...this.refByName].map(([name, ref]) => [ref, name]));
    this.circularSchemas = new Set(nativeData.circularSchemas);
    const refsDependencyGraph = Object.fromEntries(
      Object.entries(nativeData.dependencies).map(([ref, dependencies]) => [ref, new Set(dependencies)]),
    );
    this.dependencyGraph = { refsDependencyGraph, deepDependencyGraph: {} };
    for (const name of Object.keys(nativeData.generatedObjects)) {
      const ref = this.refByName.get(name)!;
      const dependencies = new Set<string>();
      const addDependency = (dependency: string) => {
        if (dependency === ref || dependencies.has(dependency)) return;
        dependencies.add(dependency);
        for (const child of this.dependencyGraph.refsDependencyGraph[dependency] ?? []) addDependency(child);
      };
      for (const dependencyName of nativeData.generatedDependencies[name] ?? []) {
        const dependency = this.refByName.get(dependencyName);
        if (dependency) addDependency(dependency);
      }
      this.dependencyGraph.refsDependencyGraph[ref] = dependencies;
    }
  }

  getCodeByZodSchemaName(name: string) {
    return this.nativeData.schemas[name];
  }

  getNativeRenderedModels(tag: string) {
    return this.nativeData.renderedModels[tag];
  }

  getNativeRenderedEndpoints(tag: string) {
    return this.nativeData.renderedEndpoints[tag];
  }

  getNativeRenderedQueries(tag: string) {
    return this.nativeData.renderedQueries[tag];
  }

  getNativeRenderedAcl(tag: string) {
    return this.nativeData.renderedAcl[tag];
  }

  getNativeRenderedShared(name: string) {
    return this.nativeData.renderedShared[name];
  }

  getRefByZodSchemaName(name: string) {
    return this.refByName.get(name);
  }

  getZodSchemaNameByRef(ref: string) {
    return this.nameByRef.get(normalizeRef(ref));
  }

  getTagByZodSchemaName(name: string) {
    return this.options.modelsInCommon ? this.options.defaultTag : this.nativeData.schemaOwners[name];
  }

  isSchemaCircular(ref: string) {
    const name = this.nameByRef.get(normalizeRef(ref));
    return Boolean(name && this.circularSchemas.has(name));
  }

  getZodSchemaObj(name: string) {
    if (this.nativeData.generatedObjects[name]) return this.nativeData.generatedObjects[name];
    const ref = this.refByName.get(name);
    if (ref) return this.resolveRef(ref);
    const code = this.nativeData.schemas[name];
    if (!code?.startsWith("z.enum(")) return undefined;
    this.enumObjectsByCode ??= collectEnumObjects(this.openApiDoc);
    return this.enumObjectsByCode.get(code);
  }

  getExtractedEnumZodSchemaNamesReferencedBySchemaRef(ref: string) {
    const normalizedRef = normalizeRef(ref);
    const cached = this.referencedNames.get(normalizedRef);
    if (cached) return cached;
    const name = this.nameByRef.get(normalizedRef);
    const code = name ? this.nativeData.schemas[name] : undefined;
    const directNames = new Set(
      [...(this.dependencyGraph.refsDependencyGraph[normalizedRef] ?? [])]
        .map((dependency) => this.nameByRef.get(dependency))
        .filter((value): value is string => Boolean(value)),
    );
    const references = [
      ...(code
        ? [...code.matchAll(/\b[A-Za-z_$][\w$]*Schema\b/g)]
            .map(([match]) => match)
            .filter(
              (match, index, values) =>
                match !== name &&
                values.indexOf(match) === index &&
                match in this.nativeData.schemas &&
                !directNames.has(match),
            )
        : []),
    ].filter((value, index, values) => values.indexOf(value) === index);
    this.referencedNames.set(normalizedRef, references);
    return references;
  }

  getCompositeZodSchemaByZodSchemaName() {
    return undefined;
  }

  resolveObject<T>(value: OpenAPIV3.ReferenceObject | T): T {
    if (value && typeof value === "object" && "$ref" in value) {
      return this.resolveRef((value as OpenAPIV3.ReferenceObject).$ref) as T;
    }
    return value as T;
  }

  getBaseUrl() {
    return this.nativeData.baseUrl;
  }

  private resolveRef(ref: string) {
    const segments = normalizeRef(ref)
      .slice(2)
      .split("/")
      .map((segment) => segment.replace(/~1/g, "/").replace(/~0/g, "~"));
    let value: unknown = this.openApiDoc;
    for (const segment of segments) {
      value = (value as Record<string, unknown> | undefined)?.[segment];
    }
    return value;
  }
}

function collectEnumObjects(document: OpenAPIV3.Document) {
  const enums = new Map<string, OpenAPIV3.SchemaObject>();
  const visit = (value: unknown) => {
    if (!value || typeof value !== "object") return;
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    const object = value as Record<string, unknown>;
    if (Array.isArray(object.enum)) {
      const code = `z.enum(${JSON.stringify(object.enum)})`.replaceAll(",", ", ");
      Object.assign(enums.get(code) ?? {}, object);
      enums.set(code, { ...(enums.get(code) ?? {}), ...(object as OpenAPIV3.SchemaObject) });
    }
    Object.values(object).forEach(visit);
  };
  visit(document.components?.schemas ?? {});
  return enums;
}

function normalizeRef(ref: string) {
  if (ref.startsWith("#/")) return ref;
  if (ref.startsWith("#")) return `#/${ref.slice(1).replace(/^\//, "")}`;
  return ref;
}

function getTagElement(tag: string, data: GenerateData) {
  let value = data.get(tag);
  if (!value) {
    value = { endpoints: [], zodSchemas: {} };
    data.set(tag, value);
  }
  return value;
}

export function getDataFromNativeOpenAPIDoc(
  openApiDoc: OpenAPIV3.Document,
  options: GenerateOptions,
  nativeSource?: { source: string; yaml: boolean },
) {
  const started = performance.now();
  const source = nativeSource?.source ?? JSON.stringify(openApiDoc);
  const afterLoad = performance.now();
  const nativeResult = compileNativeData(
    source,
    nativeSource?.yaml ?? false,
    JSON.stringify({ ...options, nativeCompact: true }),
  );
  const afterNative = performance.now();
  const nativeData = nativeResult.data as NativeData;
  const afterParse = performance.now();
  const resolverDocument = nativeData.document ?? openApiDoc;
  const resolver = new NativeSchemaResolver(resolverDocument, options, nativeData) as unknown as SchemaResolver;
  const afterResolver = performance.now();
  const data: GenerateData = new Map();

  if (nativeData.renderedComplete) {
    for (const tag of nativeData.renderedTags) data.set(tag, { endpoints: [], zodSchemas: {} });
    if (process.env.OPENAPI_NATIVE_PROFILE === "1") {
      console.error(
        `native bridge load=${(afterLoad - started).toFixed(1)}ms call=${(afterNative - afterLoad).toFixed(1)}ms parse=${(afterParse - afterNative).toFixed(1)}ms facade=${(performance.now() - afterParse).toFixed(1)}ms compact=true`,
      );
    }
    return { resolver, data };
  }

  if (!options.splitByTags) {
    data.set(options.defaultTag, { endpoints: nativeData.endpoints, zodSchemas: nativeData.schemas });
    return { resolver, data };
  }

  for (const endpoint of nativeData.endpoints) {
    getTagElement(getEndpointTag(endpoint, options), data).endpoints.push(endpoint);
  }
  for (const [name, code] of Object.entries(nativeData.schemas)) {
    const tag = options.modelsInCommon ? options.defaultTag : nativeData.schemaOwners[name];
    if (tag) getTagElement(tag, data).zodSchemas[name] = code;
  }

  if (process.env.OPENAPI_NATIVE_PROFILE === "1") {
    console.error(
      `native bridge load=${(afterLoad - started).toFixed(1)}ms call=${(afterNative - afterLoad).toFixed(1)}ms parse=${(afterParse - afterNative).toFixed(1)}ms facade=${(afterResolver - afterParse).toFixed(1)}ms split=${(performance.now() - afterResolver).toFixed(1)}ms`,
    );
  }

  return { resolver, data };
}
