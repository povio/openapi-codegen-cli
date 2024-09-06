import { OpenAPIV3 } from "openapi-types";
import { OpenAPISchemaResolver } from "./openapi-schema-resolver.utils";
import { isReferenceObject } from "./openapi.utils";

export type OpenAPISchemaMetaData = {
  isRequired?: boolean;
  name?: string;
  parent?: OpenAPISchemaMeta;
  referencedBy?: OpenAPISchemaMeta[];
};

type DefinedOpenAPISchemaMetaProps = "referencedBy";
type DefinedOpenAPISchemaMetaData = Pick<Required<OpenAPISchemaMetaData>, DefinedOpenAPISchemaMetaProps> &
  Omit<OpenAPISchemaMetaData, DefinedOpenAPISchemaMetaProps>;

export class OpenAPISchemaMeta {
  private code?: string;
  ref?: string;

  children: OpenAPISchemaMeta[] = [];
  meta: DefinedOpenAPISchemaMetaData;

  constructor(
    public schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject,
    public resolver?: OpenAPISchemaResolver,
    meta: OpenAPISchemaMetaData = {},
  ) {
    if (isReferenceObject(schema)) {
      this.ref = schema.$ref;
    }

    // @ts-expect-error
    this.meta = { ...meta };
    this.meta.referencedBy = [...(meta?.referencedBy ?? [])];

    if (this.ref) {
      this.meta.referencedBy.push(this);
    }
  }

  get codeString(): string {
    if (this.code) return this.code;

    return this.resolver ? this.resolver.resolveRef(this.ref!).normalized : this.ref!;
  }

  assign(code: string) {
    this.code = code;

    return this;
  }

  inherit(parent?: OpenAPISchemaMeta) {
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
