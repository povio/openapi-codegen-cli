import { OpenAPIV3 } from "openapi-types";
import { GenerateType } from "src/generators/types/generate";
import { GenerateOptions } from "src/generators/types/options";
import { getNamespaceName } from "src/generators/utils/generate/generate.utils";
import { isReferenceObject } from "../../utils/openapi.utils";
import { SchemaResolver } from "../SchemaResolver.class";
import { getOpenAPISchemaComplexity } from "../openapi/getOpenAPISchemaComplexity";

export type ZodSchemaMetaData = {
  isRequired?: boolean;
  name?: string;
  parent?: ZodSchema;
  referencedBy?: ZodSchema[];
};

export class ZodSchema {
  private code?: string;

  ref?: string;
  children: ZodSchema[] = [];
  meta: ZodSchemaMetaData & Required<Pick<ZodSchemaMetaData, "referencedBy">>;

  constructor(
    public schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject,
    public resolver?: SchemaResolver,
    meta: ZodSchemaMetaData = { referencedBy: [] },
  ) {
    if (isReferenceObject(schema)) {
      this.ref = schema.$ref;
    }

    this.meta = {
      ...meta,
      referencedBy: [...(meta?.referencedBy ?? [])],
    };

    if (this.ref) {
      this.meta.referencedBy.push(this);
    }
  }

  getCodeString(tag?: string, options?: GenerateOptions): string {
    if ((!this.ref || !this.resolver) && this.code) {
      return this.code;
    }

    const zodSchemaName = this.resolver?.getZodSchemaNameByRef(this.ref!);
    if (!zodSchemaName) {
      return this.ref!;
    }

    const zodSchemaTag = this.resolver?.getTagByZodSchemaName(zodSchemaName);
    if (options?.includeNamespaces && zodSchemaTag !== tag) {
      return `${getNamespaceName({ type: GenerateType.Models, tag: zodSchemaTag, options })}.${zodSchemaName}`;
    }

    return zodSchemaName;
  }

  get complexity(): number {
    return getOpenAPISchemaComplexity({ current: 0, schema: this.schema });
  }

  assign(code: string) {
    this.code = code;
    return this;
  }

  inherit(parent?: ZodSchema) {
    if (parent) {
      parent.children.push(this);
    }
    return this;
  }
}
