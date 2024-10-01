import { OpenAPIV3 } from "openapi-types";
import { ALLOWED_METHODS } from "../const/openapi.const";
import { GenerateOptions } from "../types/options";
import { pick } from "../utils/object.utils";
import {
  autocorrectRef,
  getOperationTag,
  getSchemaNameByRef,
  getSchemaRef,
  isMediaTypeAllowed,
  isParamMediaTypeAllowed,
  isReferenceObject,
} from "../utils/openapi.utils";
import { getZodSchemaName } from "../utils/zod-schema.utils";
import { getOpenAPISchemaDependencyGraph } from "./openapi/getOpenAPISchemaDependencyGraph";

type SchemaInfo = {
  ref: string;
  name: string;
  zodSchemaName: string;
};

export class SchemaResolver {
  private schemaInfoByRef = new Map<string, SchemaInfo>();
  private schemaInfoByName = new Map<string, SchemaInfo>();
  private schemaTagsByRef = new Map<string, string[]>();

  private zodSchemaCodeByName: Record<string, string> = {};
  private zodSchemaTagsByName: Record<string, string[]> = {};
  private zodSchemaNamesByDiscriminatorCode: Record<string, string[]> = {};

  dependencyGraph: ReturnType<typeof getOpenAPISchemaDependencyGraph>;

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
    return this.schemaInfoByRef.get(autocorrectRef(ref))!.zodSchemaName;
  }

  getRefByZodSchemaName(zodSchemaName: string) {
    return this.schemaInfoByName.get(zodSchemaName)?.ref;
  }

  getTagByZodSchemaName(zodSchemaName: string) {
    const schemaRef = this.getRefByZodSchemaName(zodSchemaName);
    const schemaTags = schemaRef ? this.schemaTagsByRef.get(schemaRef) ?? [] : [];
    const tags = new Set([...schemaTags, ...(this.zodSchemaTagsByName[zodSchemaName] ?? [])]);
    return tags.size === 1 ? tags.values().next().value : this.options.defaultTag;
  }

  getCodeByZodSchemaName(name: string) {
    return this.zodSchemaCodeByName[name];
  }

  getZodSchemaNamesByDiscriminatorCode(code: string) {
    return this.zodSchemaNamesByDiscriminatorCode[code];
  }

  setZodSchema(name: string, code: string, tag: string) {
    this.zodSchemaCodeByName[name] = code;
    this.zodSchemaTagsByName[name] = (this.zodSchemaTagsByName[name] ?? []).concat(tag);
  }

  addZodSchemaNameForDiscriminatorCode(code: string, zodSchemaName: string) {
    this.zodSchemaNamesByDiscriminatorCode[code] = (this.zodSchemaNamesByDiscriminatorCode[code] ?? []).concat(
      zodSchemaName,
    );
  }

  getZodSchemas() {
    return this.zodSchemaCodeByName;
  }

  private intializeSchemaInfo() {
    this.schemaRefs.forEach((ref) => {
      const correctRef = autocorrectRef(ref);
      const name = getSchemaNameByRef(correctRef);
      const zodSchemaName = getZodSchemaName(name, this.options.schemaSuffix);
      const info = { ref: correctRef, name, zodSchemaName };

      this.schemaInfoByRef.set(info.ref, info);
      this.schemaInfoByName.set(info.zodSchemaName, info);
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
          if (this.schemaTagsByRef.has(schemaRef)) {
            this.schemaTagsByRef.get(schemaRef)!.push(tag);
          } else {
            this.schemaTagsByRef.set(schemaRef, [tag]);
          }
        });
      }
    }
  }
}
