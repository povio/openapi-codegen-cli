import { OpenAPIV3 } from "openapi-types";
import { getOpenAPISchemaComplexity } from "../openapi/openapi-schema-complexity.utils";
import { OpenAPISchemaResolver } from "../openapi/openapi-schema-resolver.class";
import { isReferenceObject } from "../openapi/openapi.utils";

export type ZodSchemaMetaData = {
  isRequired?: boolean;
  name?: string;
  parent?: ZodSchema;
  referencedBy?: ZodSchema[];
};

type DefinedZodSchemaMetaDataProps = "referencedBy";
type DefinedZodSchemaMetaData = Pick<Required<ZodSchemaMetaData>, DefinedZodSchemaMetaDataProps> &
  Omit<ZodSchemaMetaData, DefinedZodSchemaMetaDataProps>;

export class ZodSchema {
  private code?: string;
  ref?: string;
  children: ZodSchema[] = [];
  meta: DefinedZodSchemaMetaData;

  constructor(
    public schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject,
    public resolver?: OpenAPISchemaResolver,
    meta: ZodSchemaMetaData = {},
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
    return this.resolver ? this.resolver.resolveRef(this.ref!).normalized : this.ref!;
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
