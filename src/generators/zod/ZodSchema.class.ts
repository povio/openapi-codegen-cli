import { OpenAPIV3 } from "openapi-types";
import { SchemaResolver } from "../SchemaResolver.class";
import { getOpenAPISchemaComplexity } from "../openapi/getOpenAPISchemaComplexity";
import { isReferenceObject } from "../utils/openapi.utils";

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

  get codeString(): string {
    if (this.code) {
      return this.code;
    }
    return this.resolver?.getZodSchemaNameByRef(this.ref!) ?? this.ref!;
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

  toString() {
    return this.codeString;
  }

  toJSON() {
    return this.codeString;
  }
}
