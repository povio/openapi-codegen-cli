import { OpenAPIV3 } from "openapi-types";
import { ALLOWED_METHODS, COMPOSITE_KEYWORDS } from "../const/openapi.const";
import { GenerateOptions } from "../types/options";
import { pick } from "../utils/object.utils";
import {
  autocorrectRef,
  formatTag,
  getOperationTag,
  getSchemaNameByRef,
  getSchemaRef,
  isMediaTypeAllowed,
  isParamMediaTypeAllowed,
  isReferenceObject,
} from "../utils/openapi.utils";
import { getZodSchemaName } from "../utils/zod-schema.utils";
import { getOpenAPISchemaDependencyGraph } from "./openapi/getOpenAPISchemaDependencyGraph";
import { ZodSchema } from "./zod/ZodSchema.class";

type SchemaData = {
  ref: string;
  name: string;
  zodSchemaName: string;
  tags: string[];
};

type ZodSchemaData = {
  zodSchemaName: string;
  code: string;
  tags: string[];
};

type CompositeZodSchemaData = {
  code: string;
  zodSchemas: {
    zodSchemaName: string;
    zodSchema: ZodSchema;
    schema?: OpenAPIV3.SchemaObject;
  }[];
};

export class SchemaResolver {
  private schemaData: SchemaData[] = [];
  private zodSchemaData: ZodSchemaData[] = [];
  private compositeZodSchemaData: CompositeZodSchemaData[] = [];

  readonly dependencyGraph: ReturnType<typeof getOpenAPISchemaDependencyGraph>;

  private get docSchemas() {
    return this.openApiDoc.components?.schemas ?? {};
  }

  private get schemaRefs() {
    return Object.keys(this.docSchemas).map(getSchemaRef);
  }

  constructor(
    private openApiDoc: OpenAPIV3.Document,
    private options: GenerateOptions,
  ) {
    this.dependencyGraph = getOpenAPISchemaDependencyGraph(this.schemaRefs, this.getSchemaByRef.bind(this));

    this.intializeSchemaInfo();
    this.initializeSchemaTags();
  }

  getSchemaByRef(ref: string) {
    return this.docSchemas[getSchemaNameByRef(ref)] as OpenAPIV3.SchemaObject;
  }

  getZodSchemaNameByRef(ref: string) {
    return this.schemaData.find((data) => data.ref === autocorrectRef(ref))!.zodSchemaName;
  }

  getRefByZodSchemaName(zodSchemaName: string) {
    return this.schemaData.find((data) => data.zodSchemaName === zodSchemaName)?.ref;
  }

  getTagByZodSchemaName(zodSchemaName: string) {
    let tag: string | undefined;

    if (this.options.splitByTags) {
      const schemaRef = this.getRefByZodSchemaName(zodSchemaName);
      const schemaTags = this.schemaData.find((data) => data.ref === schemaRef)?.tags ?? [];
      const zodSchemaTags = this.zodSchemaData.find((data) => data.zodSchemaName === zodSchemaName)?.tags ?? [];
      const tags = new Set([...schemaTags, ...zodSchemaTags]);
      tag = tags.size === 1 ? tags.values().next().value : this.options.defaultTag;
    }

    return formatTag(tag ?? this.options.defaultTag);
  }

  getCodeByZodSchemaName(name: string) {
    return this.zodSchemaData.find((data) => data.zodSchemaName === name)?.code;
  }

  getZodSchemaNamesByCompositeCode(code: string) {
    return this.compositeZodSchemaData
      .find((data) => data.code === code)
      ?.zodSchemas.map((schema) => schema.zodSchemaName);
  }

  setZodSchema(name: string, code: string, tag: string) {
    const zodSchema = this.zodSchemaData.find((data) => data.zodSchemaName === name);
    if (zodSchema) {
      zodSchema.code = code;
      zodSchema.tags = (zodSchema.tags ?? []).concat(tag);
    } else {
      this.zodSchemaData.push({ zodSchemaName: name, code, tags: [tag] });
    }
  }

  addZodSchemaForCompositeCode(
    code: string,
    zodSchema: ZodSchema,
    zodSchemaName: string,
    schema?: OpenAPIV3.SchemaObject,
  ) {
    const compositeZodSchema = { zodSchemaName, zodSchema, schema };
    const compositeData = this.compositeZodSchemaData.find((data) => data.code === code);
    if (compositeData) {
      compositeData.zodSchemas.push(compositeZodSchema);
    } else {
      this.compositeZodSchemaData.push({ code, zodSchemas: [compositeZodSchema] });
    }
  }

  getCompositeZodSchemaByZodSchemaName(zodSchemaName: string) {
    const compositeZodSchema = this.compositeZodSchemaData.find((data) =>
      data.zodSchemas.some((schema) => schema.zodSchemaName === zodSchemaName),
    );
    return compositeZodSchema?.zodSchemas.find((schema) => schema.zodSchemaName === zodSchemaName)?.zodSchema;
  }

  getSchemaByCompositeZodSchemaName(compositeZodSchemaName: string) {
    return this.compositeZodSchemaData
      .find((data) => data.zodSchemas.some((schema) => schema.zodSchemaName === compositeZodSchemaName))
      ?.zodSchemas.find((schema) => schema.zodSchemaName === compositeZodSchemaName)?.schema;
  }

  getZodSchemas() {
    return this.zodSchemaData.reduce((acc, { zodSchemaName, code }) => ({ ...acc, [zodSchemaName]: code }), {});
  }

  resolveObject<T>(obj: OpenAPIV3.ReferenceObject | T): T {
    return isReferenceObject(obj) ? (this.getSchemaByRef(obj.$ref) as T) : obj;
  }

  private intializeSchemaInfo() {
    this.schemaRefs.forEach((ref) => {
      const correctRef = autocorrectRef(ref);
      const name = getSchemaNameByRef(correctRef);
      const zodSchemaName = getZodSchemaName(name, this.options.schemaSuffix);
      this.schemaData.push({ ref: correctRef, name, zodSchemaName, tags: [] });
    });
  }

  private initializeSchemaTags() {
    for (const path in this.openApiDoc.paths) {
      const pathItemObj = this.openApiDoc.paths[path] as OpenAPIV3.PathItemObject;

      const pathItem = pick(pathItemObj, ALLOWED_METHODS);
      for (const method in pathItem) {
        const operation = pathItem[method as keyof typeof pathItem] as OpenAPIV3.OperationObject | undefined;

        if (!operation || (operation.deprecated && !this.options?.withDeprecatedEndpoints)) {
          continue;
        }

        const schemaRefObjs = [] as OpenAPIV3.ReferenceObject[];

        // Collect all referenced schemas in parameter objects
        operation.parameters?.map((param) => {
          schemaRefObjs.push(...this.getOperationSchemaRefs((param as OpenAPIV3.ParameterObject).schema));
        });

        // Collect all referenced schemas in requestBody objects
        if (operation.requestBody) {
          const requestBodyObj = this.resolveObject(operation.requestBody);
          const mediaTypes = Object.keys(requestBodyObj.content ?? {});
          const matchingMediaType = mediaTypes.find(isParamMediaTypeAllowed);
          if (matchingMediaType) {
            schemaRefObjs.push(...this.getOperationSchemaRefs(requestBodyObj.content?.[matchingMediaType]?.schema));
          }
        }

        // Collect all referenced schemas in main response objects
        for (const statusCode in operation.responses) {
          const responseObj = <OpenAPIV3.ResponseObject>this.resolveObject(operation.responses[statusCode]);
          const mediaTypes = Object.keys(responseObj.content ?? {});
          const matchingMediaType = mediaTypes.find(isMediaTypeAllowed);
          if (matchingMediaType) {
            schemaRefObjs.push(...this.getOperationSchemaRefs(responseObj.content?.[matchingMediaType]?.schema));
          }
        }

        // Get deep references for all schema references
        const allRefs = schemaRefObjs.map((schemaRef) => autocorrectRef(schemaRef.$ref));
        const deepRefs = allRefs.reduce((acc, schemaRef) => {
          const refs = this.dependencyGraph.deepDependencyGraph[schemaRef];
          return [...acc, schemaRef, ...Array.from(refs ?? [])];
        }, [] as string[]);

        // Assign tags to the schema references
        const tag = getOperationTag(operation, this.options);
        deepRefs.forEach((schemaRef) => {
          const schemaData = this.schemaData.find((data) => data.ref === schemaRef);
          if (schemaData) {
            schemaData.tags.push(tag);
          }
        });
      }
    }
  }

  private getOperationSchemaRefs(
    schema: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject | undefined,
  ): OpenAPIV3.ReferenceObject[] {
    if (!schema) {
      return [];
    }

    const schemaRefObjs: OpenAPIV3.ReferenceObject[] = [];

    if (isReferenceObject(schema)) {
      schemaRefObjs.push(schema);
    }

    const schemaObj = schema as OpenAPIV3.SchemaObject;
    if (COMPOSITE_KEYWORDS.some((prop) => prop in schemaObj && schemaObj[prop])) {
      const schemaObjs = schemaObj.allOf ?? schemaObj.anyOf ?? schemaObj.oneOf ?? [];
      schemaObjs.forEach((schema) => schemaRefObjs.push(...this.getOperationSchemaRefs(schema)));
    }
    if (schemaObj.properties) {
      Object.values(schemaObj.properties).forEach((schema) =>
        schemaRefObjs.push(...this.getOperationSchemaRefs(schema)),
      );
    }
    if (schemaObj.type === "array") {
      schemaRefObjs.push(...this.getOperationSchemaRefs((schema as OpenAPIV3.ArraySchemaObject).items));
    }

    return schemaRefObjs;
  }
}
