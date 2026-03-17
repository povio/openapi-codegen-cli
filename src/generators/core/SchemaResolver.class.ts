import { OpenAPIV3 } from "openapi-types";

import { ALLOWED_METHODS } from "@/generators/const/openapi.const";
import { Profiler } from "@/helpers/profile.helper";
import { OperationObject } from "@/generators/types/openapi";
import { GenerateOptions } from "@/generators/types/options";
import { ValidationError } from "@/generators/types/validation";
import { getUniqueArray } from "@/generators/utils/array.utils";
import { pick } from "@/generators/utils/object.utils";
import { isReferenceObject } from "@/generators/utils/openapi-schema.utils";
import {
  autocorrectRef,
  getSchemaNameByRef,
  getSchemaRef,
  isMediaTypeAllowed,
  isParamMediaTypeAllowed,
  isPathExcluded,
} from "@/generators/utils/openapi.utils";
import {
  getOperationsByTag,
  getUniqueOperationName,
  getUniqueOperationNamesWithoutSplitByTags,
  isOperationExcluded,
} from "@/generators/utils/operation.utils";
import { snakeToCamel } from "@/generators/utils/string.utils";
import { formatTag, getOperationTag } from "@/generators/utils/tag.utils";
import {
  getBodyZodSchemaName,
  getResponseZodSchemaName,
  getZodSchemaName,
  getZodSchemaOperationName,
} from "@/generators/utils/zod-schema.utils";

import { DependencyGraph, getOpenAPISchemaDependencyGraph } from "./openapi/getOpenAPISchemaDependencyGraph";
import { getDeepSchemaRefObjs, getSchemaRefObjs } from "./openapi/getSchemaRefObjs";
import { resolveExtractedEnumZodSchemaNames } from "./zod/enumExtraction/resolveExtractedEnumZodSchemaNames";
import { resolveExtractedEnumZodSchemaTags } from "./zod/enumExtraction/resolveExtractedEnumZodSchemaTags";
import { updateExtractedEnumZodSchemaData } from "./zod/enumExtraction/updateExtractedEnumZodSchemaData";
import { getEnumZodSchemasFromOpenAPIDoc } from "./zod/getZodSchemasFromOpenAPIDoc";
import { ZodSchema } from "./zod/ZodSchema.class";

interface SchemaData {
  ref: string;
  name: string;
  zodSchemaName: string;
  tags: string[];
  deepRefOperations: OperationObject[];
}

interface ZodSchemaData {
  zodSchemaName: string;
  code: string;
  tags: string[];
}

export interface OperationContext {
  path: string;
  method: OpenAPIV3.HttpMethods;
  operation: OperationObject;
  tag: string;
  operationName: string;
  isUniqueOperationName: boolean;
  parameters: OpenAPIV3.ParameterObject[];
  deepRefs: string[];
  responses: {
    statusCode: string;
    responseObj: OpenAPIV3.ResponseObject;
    matchingMediaType?: string;
    schema?: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject;
  }[];
}

interface CompositeZodSchemaData {
  code: string;
  zodSchemas: {
    zodSchemaName: string;
    zodSchema: ZodSchema;
    schema?: OpenAPIV3.SchemaObject;
  }[];
}

export interface EnumZodSchemaData {
  code: string;
  zodSchemaName: string;
  tag?: string;
}

export interface ExtractedEnumZodSchemaData {
  code: string;
  zodSchemaName?: string;
  tag?: string;
  meta: {
    zodSchemaNameSegments: string[][];
    tags: string[];
    schemaRefs: string[];
    schemas: (OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject)[];
  };
}

export class SchemaResolver {
  private readonly schemaData: SchemaData[] = [];
  private readonly zodSchemaData: ZodSchemaData[] = [];
  private readonly compositeZodSchemaData: CompositeZodSchemaData[] = [];
  private readonly schemaRefs: string[];
  private readonly schemaByRef = new Map<string, OpenAPIV3.SchemaObject>();
  private readonly schemaDataByRef = new Map<string, SchemaData>();
  private readonly schemaDataByName = new Map<string, SchemaData>();
  private readonly refByZodSchemaName = new Map<string, string>();
  private readonly zodSchemaDataByName = new Map<string, ZodSchemaData>();
  private readonly compositeByCode = new Map<string, CompositeZodSchemaData>();
  private readonly compositeSchemaByZodSchemaName = new Map<
    string,
    { zodSchema: ZodSchema; schema?: OpenAPIV3.SchemaObject }
  >();

  readonly dependencyGraph: DependencyGraph;
  readonly enumZodSchemas: EnumZodSchemaData[] = [];
  readonly extractedEnumZodSchemaData: ExtractedEnumZodSchemaData[] = [];
  readonly operationsByTag: Record<string, OperationObject[]> = {};
  readonly operationNames: string[] = [];
  private readonly operationNameCounts = new Map<string, number>();
  private readonly operationContexts: OperationContext[] = [];

  readonly validationErrors: ValidationError[] = [];

  private get docSchemas() {
    return this.openApiDoc.components?.schemas ?? {};
  }

  constructor(
    public readonly openApiDoc: OpenAPIV3.Document,
    public readonly options: GenerateOptions,
    private readonly profiler?: Profiler,
  ) {
    this.schemaRefs = Object.keys(this.docSchemas).map(getSchemaRef);
    this.dependencyGraph = getOpenAPISchemaDependencyGraph(this.schemaRefs, this.getSchemaByRef.bind(this));
    this.enumZodSchemas = getEnumZodSchemasFromOpenAPIDoc(this);
    this.operationsByTag = getOperationsByTag(openApiDoc, options);
    this.operationNames = getUniqueOperationNamesWithoutSplitByTags(openApiDoc, this.operationsByTag, options);
    for (const name of this.operationNames) {
      this.operationNameCounts.set(name, (this.operationNameCounts.get(name) ?? 0) + 1);
    }

    this.initialize();
  }

  getSchemaByRef(ref: string) {
    const correctRef = autocorrectRef(ref);
    const cachedSchema = this.schemaByRef.get(correctRef);
    if (cachedSchema) {
      return cachedSchema;
    }

    const schema = this.docSchemas[getSchemaNameByRef(correctRef)] as OpenAPIV3.SchemaObject;
    this.schemaByRef.set(correctRef, schema);
    return schema;
  }

  getSchemaDataByName(name: string) {
    return this.schemaDataByName.get(name);
  }

  getZodSchemaNameByRef(ref: string) {
    const zodSchemaName =
      this.getSchemaDataByRef(autocorrectRef(ref))?.zodSchemaName ??
      this.extractedEnumZodSchemaData.find((data) => data.zodSchemaName === ref)?.zodSchemaName;
    if (!zodSchemaName) {
      throw new Error(`Zod schema not found for ref: ${ref}`);
    }
    return zodSchemaName;
  }

  getRefByZodSchemaName(zodSchemaName: string) {
    return this.refByZodSchemaName.get(zodSchemaName);
  }

  getTagByZodSchemaName(zodSchemaName: string) {
    if (!this.options.splitByTags) {
      return this.options.defaultTag;
    }

    const extractedEnumZodSchema = this.extractedEnumZodSchemaData.find((data) => data.zodSchemaName === zodSchemaName);
    if (extractedEnumZodSchema) {
      return formatTag(extractedEnumZodSchema.tag ?? this.options.defaultTag);
    }

    const schemaRef = this.getRefByZodSchemaName(zodSchemaName);
    const schemaTags = schemaRef ? (this.getSchemaDataByRef(schemaRef)?.tags ?? []) : [];
    const zodSchemaTags = this.zodSchemaDataByName.get(zodSchemaName)?.tags ?? [];
    const tags = getUniqueArray(schemaTags, zodSchemaTags);
    const tag = tags.length === 1 ? tags[0] : this.options.defaultTag;

    return formatTag(tag ?? this.options.defaultTag);
  }

  getCodeByZodSchemaName(name: string) {
    return this.zodSchemaDataByName.get(name)?.code;
  }

  getZodSchemaNamesByCompositeCode(code: string) {
    return this.compositeByCode.get(code)?.zodSchemas.map((schema) => schema.zodSchemaName);
  }

  setZodSchema(name: string, code: string, tag: string) {
    const zodSchema = this.zodSchemaDataByName.get(name);
    if (zodSchema) {
      zodSchema.code = code;
      zodSchema.tags = (zodSchema.tags ?? []).concat(tag);
    } else {
      const newZodSchemaData = { zodSchemaName: name, code, tags: [tag] };
      this.zodSchemaData.push(newZodSchemaData);
      this.zodSchemaDataByName.set(name, newZodSchemaData);
    }
  }

  addZodSchemaForCompositeCode(
    code: string,
    zodSchema: ZodSchema,
    zodSchemaName: string,
    schema?: OpenAPIV3.SchemaObject,
  ) {
    const compositeZodSchema = { zodSchemaName, zodSchema, schema };
    const compositeData = this.compositeByCode.get(code);
    if (compositeData) {
      compositeData.zodSchemas.push(compositeZodSchema);
    } else {
      const newCompositeData = { code, zodSchemas: [compositeZodSchema] };
      this.compositeZodSchemaData.push(newCompositeData);
      this.compositeByCode.set(code, newCompositeData);
    }
    this.compositeSchemaByZodSchemaName.set(zodSchemaName, { zodSchema, schema });
  }

  getCompositeZodSchemaByZodSchemaName(zodSchemaName: string) {
    return this.compositeSchemaByZodSchemaName.get(zodSchemaName)?.zodSchema;
  }

  getSchemaByCompositeZodSchemaName(compositeZodSchemaName: string) {
    return this.compositeSchemaByZodSchemaName.get(compositeZodSchemaName)?.schema;
  }

  getEnumZodSchemaDataByCode(code: string) {
    return this.enumZodSchemas.find((data) => data.code === code);
  }

  getExtractedEnumZodSchemaDataByCode(code: string) {
    return this.extractedEnumZodSchemaData.find((data) => data.code === code);
  }

  getExtractedEnumZodSchemaNamesReferencedBySchemaRef(schemaRef: string) {
    return this.extractedEnumZodSchemaData.reduce((acc, { zodSchemaName, meta }) => {
      if (zodSchemaName && meta.schemaRefs.includes(schemaRef)) {
        return [...acc, zodSchemaName];
      }
      return acc;
    }, [] as string[]);
  }

  getZodSchemas() {
    const zodSchemas = {} as Record<string, string>;
    for (const { zodSchemaName, code } of this.zodSchemaData) {
      zodSchemas[zodSchemaName] = code;
    }
    return zodSchemas;
  }

  getExtractedEnumZodSchemas() {
    const zodSchemas = {} as Record<string, string>;
    for (const { zodSchemaName, code } of this.extractedEnumZodSchemaData) {
      if (zodSchemaName) {
        zodSchemas[zodSchemaName] = code;
      }
    }
    return zodSchemas;
  }

  resolveObject<T>(obj: OpenAPIV3.ReferenceObject | T): T {
    return isReferenceObject(obj) ? (this.getSchemaByRef(obj.$ref) as T) : obj;
  }

  isSchemaCircular(ref: string) {
    return this.dependencyGraph.deepDependencyGraph[ref]?.has(ref);
  }

  getCircularSchemaChain(ref: string, currentRef = ref, chain = [], visited = [] as string[]): string[] {
    if (visited.includes(currentRef)) {
      return [];
    }
    visited.push(currentRef);
    if (this.dependencyGraph.refsDependencyGraph[currentRef]?.has(ref)) {
      return [...chain, currentRef, ref];
    }
    return Array.from(this.dependencyGraph.refsDependencyGraph[currentRef]?.values() ?? []).flatMap((childRef) => {
      const childChain = this.getCircularSchemaChain(ref, childRef, chain, visited);
      return childChain.length > 0 ? [currentRef, ...childChain] : childChain;
    });
  }

  getBaseUrl() {
    const serverUrl = this.openApiDoc.servers?.[0]?.url;
    if (this.options.baseUrl === "" && serverUrl) {
      return serverUrl;
    }
    return this.options.baseUrl;
  }

  isOperationNameUnique(operationName: string) {
    return (this.operationNameCounts.get(operationName) ?? 0) <= 1;
  }

  getOperationContexts() {
    return this.operationContexts;
  }

  getZodSchemaObj(zodSchemaName: string) {
    const ref = this.getRefByZodSchemaName(zodSchemaName);
    if (ref) {
      return this.getSchemaByRef(ref);
    }

    const schema = this.getSchemaByCompositeZodSchemaName(zodSchemaName);
    if (schema) {
      return schema;
    }

    const enumZodSchemaData = this.getExtractedEnumZodSchemaDataByName(zodSchemaName);
    if (enumZodSchemaData) {
      const schemaObject = {} as OpenAPIV3.SchemaObject;
      for (const schema of enumZodSchemaData.meta.schemas) {
        Object.assign(schemaObject, this.resolveObject(schema));
      }
      return schemaObject;
    }
  }

  private getSchemaDataByRef(ref: string) {
    return this.schemaDataByRef.get(ref);
  }

  private getExtractedEnumZodSchemaDataByName(enumZodSchemaName: string) {
    return this.extractedEnumZodSchemaData.find(({ zodSchemaName }) => zodSchemaName === enumZodSchemaName);
  }

  private initialize() {
    const p = this.profiler ?? new Profiler(false);

    p.runSync("resolver.init.seedSchemas", () => {
      this.schemaRefs.forEach((ref) => {
        const correctRef = autocorrectRef(ref);
        const name = getSchemaNameByRef(correctRef);
        const zodSchemaName = getZodSchemaName(name, this.options.schemaSuffix);
        const data = { ref: correctRef, name, zodSchemaName, tags: [], deepRefOperations: [] };
        this.schemaData.push(data);
        this.schemaDataByRef.set(correctRef, data);
        this.schemaDataByName.set(name, data);
        this.refByZodSchemaName.set(zodSchemaName, correctRef);
      });
    });

    p.runSync("resolver.init.operationsLoop", () => {
      for (const path in this.openApiDoc.paths) {
        if (isPathExcluded(path, this.options)) {
          continue;
        }

        const pathItemObj = this.openApiDoc.paths[path] as OpenAPIV3.PathItemObject;
        const pathParameters = this.getParameters(pathItemObj.parameters ?? []);

        const pathItem = pick(pathItemObj, ALLOWED_METHODS);
        for (const method in pathItem) {
          const operation = pathItem[method as keyof typeof pathItem] as OperationObject | undefined;
          if (!operation || isOperationExcluded(operation, this.options)) {
            continue;
          }

          const tag = getOperationTag(operation, this.options);
          const operationName = getUniqueOperationName({
            path,
            method,
            operation,
            operationsByTag: this.operationsByTag,
            options: this.options,
          });
          const isUniqueOperationName = this.isOperationNameUnique(operationName);
          const parameters = p.runSync("resolver.init.parameters.mergeResolve", () =>
            Object.entries({
              ...pathParameters,
              ...this.getParameters(operation.parameters ?? []),
            }).map(([, param]) => this.resolveObject(param as OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject)),
          );
          const responses = p.runSync("resolver.init.responses.prepare", () =>
            Object.entries(operation.responses).map(([statusCode, response]) => {
              const responseObj = this.resolveObject(response) as OpenAPIV3.ResponseObject;
              const mediaTypes = Object.keys(responseObj?.content ?? {});
              const matchingMediaType = mediaTypes.find(isMediaTypeAllowed);
              const schema = matchingMediaType ? responseObj.content?.[matchingMediaType]?.schema : undefined;
              return { statusCode, responseObj, matchingMediaType, schema };
            }),
          );
          const zodSchemaOperationName = snakeToCamel(
            getZodSchemaOperationName(operationName, isUniqueOperationName, tag),
          );
          const schemaRefObjs = [] as OpenAPIV3.ReferenceObject[];

          p.runSync("resolver.init.parameters.refs", () => {
            parameters.forEach((parameter) => {
              const parameterObject = this.resolveObject(
                parameter as OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject,
              );
              const parameterSchema = parameterObject.schema;
              const schemaInfo = `Operation ${operation.operationId ?? path} parameter ${parameterObject.name}`;

              schemaRefObjs.push(...getSchemaRefObjs(this, parameterSchema, schemaInfo));

              if (this.options.extractEnums) {
                updateExtractedEnumZodSchemaData({
                  resolver: this,
                  schema: parameterSchema,
                  schemaInfo,
                  tags: [tag],
                  nameSegments: [zodSchemaOperationName, parameterObject.name],
                  includeSelf: true,
                });
              }
            });
          });

          p.runSync("resolver.init.requestBody.refs", () => {
            if (operation.requestBody) {
              const requestBodyObj = this.resolveObject(operation.requestBody);
              const mediaTypes = Object.keys(requestBodyObj.content ?? {});
              const matchingMediaType = mediaTypes.find(isParamMediaTypeAllowed);
              if (matchingMediaType) {
                const matchingMediaSchema = requestBodyObj.content?.[matchingMediaType]?.schema;
                const schemaInfo = `Operation ${operation.operationId} request body`;

                schemaRefObjs.push(...getSchemaRefObjs(this, matchingMediaSchema, schemaInfo));

                if (this.options.extractEnums) {
                  updateExtractedEnumZodSchemaData({
                    resolver: this,
                    schema: matchingMediaSchema,
                    schemaInfo,
                    tags: [tag],
                    nameSegments: [getBodyZodSchemaName(zodSchemaOperationName)],
                  });
                }
              }
            }
          });

          p.runSync("resolver.init.responses.refs", () => {
            for (const responseData of responses) {
              if (!responseData.matchingMediaType) {
                continue;
              }

              const schemaInfo = `Operation ${operation.operationId} response body`;
              schemaRefObjs.push(...getSchemaRefObjs(this, responseData.schema, schemaInfo));

              if (this.options.extractEnums) {
                updateExtractedEnumZodSchemaData({
                  resolver: this,
                  schema: responseData.schema,
                  schemaInfo,
                  tags: [tag],
                  nameSegments: [
                    getResponseZodSchemaName({
                      statusCode: responseData.statusCode,
                      operationName,
                      isUniqueOperationName,
                      tag,
                    }),
                  ],
                });
              }
            }
          });

          const deepRefs = p.runSync("resolver.init.deepRefs", () => getDeepSchemaRefObjs(this, schemaRefObjs));
          const operationContext: OperationContext = {
            path,
            method: method as OpenAPIV3.HttpMethods,
            operation,
            tag,
            operationName,
            isUniqueOperationName,
            parameters,
            deepRefs,
            responses,
          };
          this.operationContexts.push(operationContext);
          deepRefs.forEach((schemaRef) => {
            const schemaData = this.getSchemaDataByRef(schemaRef);
            if (schemaData) {
              schemaData.tags.push(tag);
              schemaData.deepRefOperations.push(operation);
            }
          });
        }
      }
    });

    if (this.options.extractEnums) {
      p.runSync("resolver.init.enums.finalize", () => {
        this.schemaRefs.forEach((ref) => {
          const schemaRef = autocorrectRef(ref);

          updateExtractedEnumZodSchemaData({
            resolver: this,
            schema: this.getSchemaByRef(schemaRef),
            schemaRef,
            tags: this.getSchemaDataByRef(schemaRef)?.tags ?? [],
            nameSegments: [getSchemaNameByRef(schemaRef)],
          });
        });

        resolveExtractedEnumZodSchemaTags(this);
        this.handleDuplicateEnumZodSchemas();
        resolveExtractedEnumZodSchemaNames(this);
      });
    }
  }

  private handleDuplicateEnumZodSchemas() {
    const codes = new Set(this.enumZodSchemas.map(({ code }) => code));
    const duplicates = this.enumZodSchemas.filter(({ code }) => codes.has(code));

    this.schemaData.forEach((schemaData) => {
      const duplicateCode = duplicates.find(({ zodSchemaName }) => zodSchemaName === schemaData.zodSchemaName)?.code;
      if (!duplicateCode) {
        return;
      }

      const duplicate = this.extractedEnumZodSchemaData.find(({ code }) => code === duplicateCode);
      if (!duplicate || this.getEnumZodSchemaDataByCode(duplicate.code)?.zodSchemaName !== schemaData.zodSchemaName) {
        return;
      }

      schemaData.tags.push(...(duplicate.meta.tags ?? []));

      duplicate.meta.schemaRefs.forEach((ref) => {
        if (!this.dependencyGraph.refsDependencyGraph[ref]) {
          this.dependencyGraph.refsDependencyGraph[ref] = new Set();
        }
        this.dependencyGraph.refsDependencyGraph[ref].add(schemaData.ref);

        if (!this.dependencyGraph.deepDependencyGraph[ref]) {
          this.dependencyGraph.deepDependencyGraph[ref] = new Set();
        }
        this.dependencyGraph.deepDependencyGraph[ref].add(schemaData.ref);
      });
    });

    this.extractedEnumZodSchemaData.splice(
      0,
      this.extractedEnumZodSchemaData.length,
      ...this.extractedEnumZodSchemaData.filter(({ code }) => !codes.has(code)),
    );
  }

  private getParameters(parameters: NonNullable<OpenAPIV3.PathItemObject["parameters"]>) {
    return Object.fromEntries(
      (parameters ?? []).map((param) => [isReferenceObject(param) ? param.$ref : param.name, param] as const),
    );
  }
}
