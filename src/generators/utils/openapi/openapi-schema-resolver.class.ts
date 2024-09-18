import { OpenAPIV3 } from "openapi-types";
import { getOpenAPISchemaDependencyGraph } from "./openapi-schema-dependency-graph.utils";
import { asComponentSchema, autocorrectRef, normalizeString } from "./openapi.utils";

type SchemaRefInfo = {
  ref: string;
  name: string;
  normalized: string;
};

export class OpenAPISchemaResolver {
  private schemasRefInfoByRef = new Map<string, SchemaRefInfo>();
  private schemasRefInfoByName = new Map<string, SchemaRefInfo>();

  dependencyGraph: ReturnType<typeof getOpenAPISchemaDependencyGraph>;

  private get docSchemas() {
    return this.openApiDoc.components?.schemas ?? {};
  }

  constructor(private openApiDoc: OpenAPIV3.Document) {
    this.dependencyGraph = getOpenAPISchemaDependencyGraph(
      Object.keys(this.docSchemas).map((name) => asComponentSchema(name)),
      this.getSchemaByRef.bind(this),
    );
  }

  getSchemaByRef(ref: string) {
    const correctRef = autocorrectRef(ref);
    const name = correctRef.split("/").at(-1)!;
    const normalized = normalizeString(name);
    const info = { ref: correctRef, name, normalized };

    this.schemasRefInfoByRef.set(info.ref, info);
    this.schemasRefInfoByName.set(info.normalized, info);

    return this.docSchemas[name] as OpenAPIV3.SchemaObject;
  }

  resolveRef(ref: string) {
    return this.schemasRefInfoByRef.get(autocorrectRef(ref))!;
  }

  resolveSchemaName(normalized: string) {
    return this.schemasRefInfoByName.get(normalized)!;
  }
}
