import { OpenAPIV3 } from "openapi-types";
import { ALLOWED_METHODS } from "../const/openapi.const";
import { OperationObject } from "../types/openapi";
import { GenerateOptions } from "../types/options";
import { ValidationError } from "../types/validation";
import { getUniqueArray } from "../utils/array.utils";
import { pick } from "../utils/object.utils";
import { isReferenceObject } from "../utils/openapi-schema.utils";
import {
  autocorrectRef,
  getSchemaNameByRef,
  getSchemaRef,
  isMediaTypeAllowed,
  isParamMediaTypeAllowed,
  isPathExcluded,
} from "../utils/openapi.utils";
import {
  getOperationsByTag,
  getUniqueOperationName,
  getUniqueOperationNamesWithoutSplitByTags,
  isOperationExcluded,
} from "../utils/operation.utils";
import { snakeToCamel } from "../utils/string.utils";
import { formatTag, getOperationTag } from "../utils/tag.utils";
import {
  getBodyZodSchemaName,
  getResponseZodSchemaName,
  getZodSchemaName,
  getZodSchemaOperationName,
} from "../utils/zod-schema.utils";
import { DependencyGraph, getOpenAPISchemaDependencyGraph } from "./openapi/getOpenAPISchemaDependencyGraph";
import { getDeepSchemaRefObjs, getSchemaRefObjs } from "./openapi/getSchemaRefObjs";
import { ZodSchema } from "./zod/ZodSchema.class";
import { resolveExtractedEnumZodSchemaNames } from "./zod/enumExtraction/resolveExtractedEnumZodSchemaNames";
import { resolveExtractedEnumZodSchemaTags } from "./zod/enumExtraction/resolveExtractedEnumZodSchemaTags";
import { updateExtractedEnumZodSchemaData } from "./zod/enumExtraction/updateExtractedEnumZodSchemaData";
import { getEnumZodSchemasFromOpenAPIDoc } from "./zod/getZodSchemasFromOpenAPIDoc";

interface SchemaData {
  ref: string;
  name: string;
  zodSchemaName: string;
  tags: string[];
}

interface ZodSchemaData {
  zodSchemaName: string;
  code: string;
  tags: string[];
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

  readonly dependencyGraph: DependencyGraph;
  readonly enumZodSchemas: EnumZodSchemaData[] = [];
  readonly extractedEnumZodSchemaData: ExtractedEnumZodSchemaData[] = [];
  readonly operationsByTag: Record<string, OperationObject[]> = {};
  readonly operationNames: string[] = [];

  readonly validationErrors: ValidationError[] = [];

  private get docSchemas() {
    return this.openApiDoc.components?.schemas ?? {};
  }

  private get schemaRefs() {
    return Object.keys(this.docSchemas).map(getSchemaRef);
  }

  constructor(
    public readonly openApiDoc: OpenAPIV3.Document,
    public readonly options: GenerateOptions,
  ) {
    this.dependencyGraph = getOpenAPISchemaDependencyGraph(this.schemaRefs, this.getSchemaByRef.bind(this));
    this.enumZodSchemas = getEnumZodSchemasFromOpenAPIDoc(this);
    this.operationsByTag = getOperationsByTag(openApiDoc, options);
    this.operationNames = getUniqueOperationNamesWithoutSplitByTags(openApiDoc, this.operationsByTag, options);

    this.initialize();
  }

  getSchemaByRef(ref: string) {
    return this.docSchemas[getSchemaNameByRef(ref)] as OpenAPIV3.SchemaObject;
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
    return this.schemaData.find((data) => data.zodSchemaName === zodSchemaName)?.ref;
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
    const schemaTags = schemaRef ? this.getSchemaDataByRef(schemaRef)?.tags ?? [] : [];
    const zodSchemaTags = this.zodSchemaData.find((data) => data.zodSchemaName === zodSchemaName)?.tags ?? [];
    const tags = getUniqueArray(schemaTags, zodSchemaTags);
    const tag = tags.length === 1 ? tags[0] : this.options.defaultTag;

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

  getEnumZodSchemaDataByCode(code: string) {
    return this.enumZodSchemas.find((data) => data.code === code);
  }

  getExtractedEnumZodSchemaDataByCode(code: string) {
    return this.extractedEnumZodSchemaData.find((data) => data.code === code);
  }

  getExtractedEnumZodSchemaNamesReferencedBySchemaRef(schemaRef: string) {
    return this.extractedEnumZodSchemaData.reduce((acc, { zodSchemaName, meta }) => {
      if (zodSchemaName && meta.schemaRefs.includes(schemaRef)) {
        acc.push(zodSchemaName);
      }
      return acc;
    }, [] as string[]);
  }

  getZodSchemas() {
    return this.zodSchemaData.reduce((acc, { zodSchemaName, code }) => ({ ...acc, [zodSchemaName]: code }), {});
  }

  getExtractedEnumZodSchemas() {
    return this.extractedEnumZodSchemaData.reduce(
      (acc, { zodSchemaName, code }) => (zodSchemaName ? { ...acc, [zodSchemaName]: code } : acc),
      {},
    );
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
    return Array.from(this.dependencyGraph.refsDependencyGraph[currentRef]?.values() ?? [])
      .map((childRef) => {
        const childChain = this.getCircularSchemaChain(ref, childRef, chain, visited);
        return childChain.length > 0 ? [currentRef, ...childChain] : childChain;
      })
      .flat();
  }

  getBaseUrl() {
    const serverUrl = this.openApiDoc.servers?.[0]?.url;
    if (this.options.baseUrl === "" && serverUrl) {
      return serverUrl;
    }
    return this.options.baseUrl;
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
      return enumZodSchemaData.meta.schemas.reduce(
        (acc, curr) => ({ ...acc, ...this.resolveObject(curr) }),
        {} as OpenAPIV3.SchemaObject,
      );
    }
  }

  private getSchemaDataByRef(ref: string) {
    return this.schemaData.find((data) => data.ref === ref);
  }

  private getExtractedEnumZodSchemaDataByName(enumZodSchemaName: string) {
    return this.extractedEnumZodSchemaData.find(({ zodSchemaName }) => zodSchemaName === enumZodSchemaName);
  }

  private initialize() {
    this.schemaRefs.forEach((ref) => {
      const correctRef = autocorrectRef(ref);
      const name = getSchemaNameByRef(correctRef);
      const zodSchemaName = getZodSchemaName(name, this.options.schemaSuffix);
      this.schemaData.push({ ref: correctRef, name, zodSchemaName, tags: [] });
    });

    for (const path in this.openApiDoc.paths) {
      if (isPathExcluded(path, this.options)) {
        continue;
      }

      const pathItemObj = this.openApiDoc.paths[path] as OpenAPIV3.PathItemObject;

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
        const isUniqueOperationName = this.operationNames.filter((name) => name === operationName).length <= 1;
        const zodSchemaOperationName = snakeToCamel(
          getZodSchemaOperationName(operationName, isUniqueOperationName, tag),
        );
        const schemaRefObjs = [] as OpenAPIV3.ReferenceObject[];

        operation.parameters?.map((parameter) => {
          const parameterObject = parameter as OpenAPIV3.ParameterObject;
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

        for (const statusCode in operation.responses) {
          const responseObj = <OpenAPIV3.ResponseObject>this.resolveObject(operation.responses[statusCode]);
          const mediaTypes = Object.keys(responseObj.content ?? {});
          const matchingMediaType = mediaTypes.find(isMediaTypeAllowed);
          if (matchingMediaType) {
            const matchingMediaSchema = responseObj.content?.[matchingMediaType]?.schema;
            const schemaInfo = `Operation ${operation.operationId} response body`;

            schemaRefObjs.push(...getSchemaRefObjs(this, matchingMediaSchema, schemaInfo));

            if (this.options.extractEnums) {
              updateExtractedEnumZodSchemaData({
                resolver: this,
                schema: matchingMediaSchema,
                schemaInfo,
                tags: [tag],
                nameSegments: [getResponseZodSchemaName({ statusCode, operationName, isUniqueOperationName, tag })],
              });
            }
          }
        }

        const deepRefs = getDeepSchemaRefObjs(this, schemaRefObjs);
        deepRefs.forEach((schemaRef) => {
          const schemaData = this.getSchemaDataByRef(schemaRef);
          if (schemaData) {
            schemaData.tags.push(tag);
          }
        });
      }
    }

    if (this.options.extractEnums) {
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
    }
  }

  private handleDuplicateEnumZodSchemas() {
    const codes = this.enumZodSchemas.map(({ code }) => code);
    const duplicates = this.enumZodSchemas.filter(({ code }) => codes.includes(code));

    this.schemaData.forEach((schemaData) => {
      const duplicateCode = duplicates.find(({ zodSchemaName }) => zodSchemaName === schemaData.zodSchemaName)?.code;
      if (!duplicateCode) {
        return;
      }

      const duplicate = this.extractedEnumZodSchemaData.find(({ code }) => code === duplicateCode);
      if (!duplicate) {
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
      ...this.extractedEnumZodSchemaData.filter(({ code }) => !codes.includes(code)),
    );
  }
}
