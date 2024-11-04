import { OpenAPIV3 } from "openapi-types";
import { ALLOWED_METHODS } from "../const/openapi.const";
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

type DiscriminatorZodSchemaData = {
  code: string;
  zodSchemas: {
    zodSchemaName: string;
    zodSchema: ZodSchema;
  }[];
};

export class SchemaResolver {
  private schemaData: SchemaData[] = [];
  private zodSchemaData: ZodSchemaData[] = [];
  private discriminatorZodSchemaData: DiscriminatorZodSchemaData[] = [];

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

  getZodSchemaNamesByDiscriminatorCode(code: string) {
    return this.discriminatorZodSchemaData
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

  addZodSchemaForDiscriminatorCode(code: string, zodSchema: ZodSchema, zodSchemaName: string) {
    const discriminatorZodSchema = this.discriminatorZodSchemaData.find((data) => data.code === code);
    if (discriminatorZodSchema) {
      discriminatorZodSchema.zodSchemas.push({ zodSchemaName, zodSchema });
    } else {
      this.discriminatorZodSchemaData.push({ code, zodSchemas: [{ zodSchemaName, zodSchema }] });
    }
  }

  getDiscriminatorZodSchemaByZodSchemaName(zodSchemaName: string) {
    const discriminatorZodSchema = this.discriminatorZodSchemaData.find((data) =>
      data.zodSchemas.some((schema) => schema.zodSchemaName === zodSchemaName),
    );
    return discriminatorZodSchema?.zodSchemas.find((schema) => schema.zodSchemaName === zodSchemaName)?.zodSchema;
  }

  getZodSchemas() {
    return this.zodSchemaData.reduce((acc, { zodSchemaName, code }) => ({ ...acc, [zodSchemaName]: code }), {});
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
    const filterRefObjs = (objs?: unknown[]) => objs?.filter(isReferenceObject) ?? [];

    for (const path in this.openApiDoc.paths) {
      const pathItemObj = this.openApiDoc.paths[path] as OpenAPIV3.PathItemObject;

      const pathItem = pick(pathItemObj, ALLOWED_METHODS);
      for (const method in pathItem) {
        const operation = pathItem[method as keyof typeof pathItem] as OpenAPIV3.OperationObject | undefined;

        if (!operation || (operation.deprecated && !this.options?.withDeprecatedEndpoints)) {
          continue;
        }

        // Collect all parameter objects that are references
        const schemaRefObjs = [] as OpenAPIV3.ReferenceObject[];
        schemaRefObjs.push(
          ...filterRefObjs(operation.parameters?.map((param) => (param as OpenAPIV3.ParameterObject).schema)),
        );

        // Collect all requestBody objects that are references
        if (operation.requestBody) {
          const requestBodyObj = (
            isReferenceObject(operation.requestBody)
              ? this.getSchemaByRef(operation.requestBody.$ref)
              : operation.requestBody
          ) as OpenAPIV3.RequestBodyObject;

          const mediaTypes = Object.keys(requestBodyObj.content ?? {});
          const matchingMediaType = mediaTypes.find(isParamMediaTypeAllowed);
          if (matchingMediaType) {
            const schema = requestBodyObj.content?.[matchingMediaType]?.schema;
            if (isReferenceObject(schema)) {
              schemaRefObjs.push(schema);
            }
          }
        }

        // Collect all main response objects that are references
        for (const statusCode in operation.responses) {
          const responseObj = (
            isReferenceObject(operation.responses[statusCode])
              ? this.getSchemaByRef((operation.responses[statusCode] as OpenAPIV3.ReferenceObject).$ref)
              : operation.responses[statusCode]
          ) as OpenAPIV3.ResponseObject;

          const mediaTypes = Object.keys(responseObj.content ?? {});
          const matchingMediaType = mediaTypes.find(isMediaTypeAllowed);
          if (matchingMediaType) {
            const schema = responseObj.content?.[matchingMediaType]?.schema;
            if (isReferenceObject(schema)) {
              schemaRefObjs.push(schema);
            }
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
}
