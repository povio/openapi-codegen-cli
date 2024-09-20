import { OpenAPIV3 } from "openapi-types";
import { getOpenAPISchemaDependencyGraph } from "./openapi/getOpenAPISchemaDependencyGraph";
import { autocorrectRef, getSchemaRef } from "./utils/openapi.utils";
import { getZodSchemaName } from "./utils/zod-schema.utils";

type SchemaInfo = {
  ref: string;
  name: string;
  zodSchemaName: string;
};

export class SchemaResolver {
  private schemaInfoByRef = new Map<string, SchemaInfo>();
  private schemaInfoByName = new Map<string, SchemaInfo>();

  dependencyGraph: ReturnType<typeof getOpenAPISchemaDependencyGraph>;

  private get docSchemas() {
    return this.openApiDoc.components?.schemas ?? {};
  }

  constructor(
    private openApiDoc: OpenAPIV3.Document,
    private schemaSuffix: string,
  ) {
    const schemaRefs = Object.keys(this.docSchemas).map(getSchemaRef);

    schemaRefs.forEach((ref) => {
      const info = this.getSchemaInfo(ref);
      this.schemaInfoByRef.set(info.ref, info);
      this.schemaInfoByName.set(info.zodSchemaName, info);
    });

    this.dependencyGraph = getOpenAPISchemaDependencyGraph(schemaRefs, this.getSchemaByRef.bind(this));
  }

  getSchemaByRef(ref: string) {
    return this.docSchemas[this.getSchemaInfo(ref).name] as OpenAPIV3.SchemaObject;
  }

  getZodSchemaNameByRef(ref: string) {
    return this.schemaInfoByRef.get(autocorrectRef(ref))!.zodSchemaName;
  }

  getRefByZodSchemaName(zodSchemaName: string) {
    return this.schemaInfoByName.get(zodSchemaName)?.ref;
  }

  private getSchemaInfo(ref: string) {
    const correctRef = autocorrectRef(ref);
    const name = correctRef.split("/").at(-1)!;
    const zodSchemaName = getZodSchemaName(name, this.schemaSuffix);
    return { ref: correctRef, name, zodSchemaName };
  }
}
