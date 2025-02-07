import { OpenAPIV3 } from "openapi-types";
import { WithRequired } from "src/generators/types/common";
import { GenerateType } from "src/generators/types/generate";
import { GenerateOptions } from "src/generators/types/options";
import { getNamespaceName } from "src/generators/utils/generate/generate.utils";
import { isReferenceObject } from "../../utils/openapi.utils";
import { SchemaResolver } from "../SchemaResolver.class";
import { getOpenAPISchemaComplexity } from "../openapi/getOpenAPISchemaComplexity";

export interface ZodSchemaMetaData {
  isRequired?: boolean;
  name?: string;
  parent?: ZodSchema;
  referencedBy?: ZodSchema[];
}

export class ZodSchema {
  private code?: string;

  ref?: string;
  enumRef?: string;
  children: ZodSchema[] = [];
  meta: WithRequired<ZodSchemaMetaData, "referencedBy">;

  constructor(
    public schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject,
    public resolver: SchemaResolver,
    meta: ZodSchemaMetaData = { referencedBy: [] },
    enumRef?: string,
  ) {
    if (isReferenceObject(schema)) {
      this.ref = schema.$ref;
    }

    if (enumRef) {
      this.enumRef = enumRef;
    }

    this.meta = { ...meta, referencedBy: [...(meta?.referencedBy ?? [])] };

    if (this.ref) {
      this.meta.referencedBy.push(this);
    }
  }

  getCodeString(tag?: string, options?: GenerateOptions): string {
    if (!this.ref && this.code) {
      return this.code;
    }

    if (!this.ref) {
      throw new Error("Zod schema is missing both ref and code");
    }

    const zodSchemaName = this.resolver?.getZodSchemaNameByRef(this.ref);
    if (!zodSchemaName) {
      return this.ref;
    }

    const zodSchemaTag = this.resolver?.getTagByZodSchemaName(zodSchemaName);
    if (options?.includeNamespaces && zodSchemaTag && zodSchemaTag !== tag) {
      return `${getNamespaceName({ type: GenerateType.Models, tag: zodSchemaTag, options })}.${zodSchemaName}`;
    }

    return zodSchemaName;
  }

  get complexity() {
    return getOpenAPISchemaComplexity(0, this.schema);
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
