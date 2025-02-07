import { OpenAPIV3 } from "openapi-types";
import { ALLOWED_METHODS } from "../const/openapi.const";
import { GenerateOptions } from "../types/options";
import { pick } from "../utils/object.utils";
import {
  autocorrectRef,
  getSchemaNameByRef,
  getSchemaRef,
  getUniqueOperationName,
  getUniqueOperationNamesWithoutSplitByTags,
  isMediaTypeAllowed,
  isParamMediaTypeAllowed,
  isReferenceObject,
} from "../utils/openapi.utils";
import { snakeToCamel } from "../utils/string.utils";
import { formatTag, getOperationsByTag, getOperationTag } from "../utils/tag.utils";
import {
  getBodyZodSchemaName,
  getResponseZodSchemaName,
  getZodSchemaName,
  getZodSchemaOperationName,
} from "../utils/zod-schema.utils";
import { DependencyGraph, getOpenAPISchemaDependencyGraph } from "./openapi/getOpenAPISchemaDependencyGraph";
import { getDeepSchemaRefObjs, getSchemaRefObjs } from "./openapi/getSchemaRefObjs";
import { ZodSchema } from "./zod/ZodSchema.class";
import { resolveEnumZodSchemaNames, updateEnumZodSchemaData } from "./zod/updateEnumZodSchemaData";

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
  name?: string;
  tag?: string;
  tags: string[];
  zodSchemaNameSegments: string[][];
}

export class SchemaResolver {
  private readonly schemaData: SchemaData[] = [];
  private readonly zodSchemaData: ZodSchemaData[] = [];
  private readonly compositeZodSchemaData: CompositeZodSchemaData[] = [];
  readonly enumZodSchemaData: EnumZodSchemaData[] = [];
  readonly dependencyGraph: DependencyGraph;

  readonly operationsByTag: Record<string, OpenAPIV3.OperationObject[]> = {};
  readonly operationNames: string[] = [];

  readonly validationErrorMessages: string[] = [];

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
    this.operationsByTag = getOperationsByTag(openApiDoc, options);
    this.operationNames = getUniqueOperationNamesWithoutSplitByTags(openApiDoc, this.operationsByTag, options);

    this.initialize();
  }

  getSchemaByRef(ref: string) {
    return this.docSchemas[getSchemaNameByRef(ref)] as OpenAPIV3.SchemaObject;
  }

  getSchemaDataByRef(ref: string) {
    return this.schemaData.find((data) => data.ref === ref);
  }

  getZodSchemaNameByRef(ref: string) {
    const zodSchemaName = this.getSchemaDataByRef(autocorrectRef(ref))?.zodSchemaName;
    if (!zodSchemaName) {
      throw new Error(`Zod schema not found for ref: ${ref}`);
    }
    return zodSchemaName;
  }

  getRefByZodSchemaName(zodSchemaName: string) {
    return this.schemaData.find((data) => data.zodSchemaName === zodSchemaName)?.ref;
  }

  getTagByZodSchemaName(zodSchemaName: string) {
    let tag: string | undefined;

    if (this.options.splitByTags) {
      const schemaRef = this.getRefByZodSchemaName(zodSchemaName);
      const schemaTags = schemaRef ? this.getSchemaDataByRef(schemaRef)?.tags ?? [] : [];
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

  isSchemaCircular(ref: string) {
    return this.dependencyGraph.deepDependencyGraph[ref]?.has(ref);
  }

  private initialize() {
    this.schemaRefs.forEach((ref) => {
      const correctRef = autocorrectRef(ref);
      const name = getSchemaNameByRef(correctRef);
      const zodSchemaName = getZodSchemaName(name, this.options.schemaSuffix);
      this.schemaData.push({ ref: correctRef, name, zodSchemaName, tags: [] });
    });

    for (const path in this.openApiDoc.paths) {
      const pathItemObj = this.openApiDoc.paths[path] as OpenAPIV3.PathItemObject;

      const pathItem = pick(pathItemObj, ALLOWED_METHODS);
      for (const method in pathItem) {
        const operation = pathItem[method as keyof typeof pathItem] as OpenAPIV3.OperationObject | undefined;

        if (!operation || (operation.deprecated && !this.options?.withDeprecatedEndpoints)) {
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

          schemaRefObjs.push(
            ...getSchemaRefObjs(
              this,
              parameterSchema,
              `${operation.operationId ?? path} parameter ${parameterObject.name}`,
            ),
          );

          updateEnumZodSchemaData({
            resolver: this,
            schema: parameterSchema,
            tags: [tag],
            nameSegments: [zodSchemaOperationName, parameterObject.name],
            includeSelf: true,
          });
        });

        if (operation.requestBody) {
          const requestBodyObj = this.resolveObject(operation.requestBody);
          const mediaTypes = Object.keys(requestBodyObj.content ?? {});
          const matchingMediaType = mediaTypes.find(isParamMediaTypeAllowed);
          if (matchingMediaType) {
            const matchingMediaSchema = requestBodyObj.content?.[matchingMediaType]?.schema;

            schemaRefObjs.push(...getSchemaRefObjs(this, matchingMediaSchema, `${operation.operationId} request body`));

            updateEnumZodSchemaData({
              resolver: this,
              schema: matchingMediaSchema,
              tags: [tag],
              nameSegments: [getBodyZodSchemaName(zodSchemaOperationName)],
            });
          }
        }

        for (const statusCode in operation.responses) {
          const responseObj = <OpenAPIV3.ResponseObject>this.resolveObject(operation.responses[statusCode]);
          const mediaTypes = Object.keys(responseObj.content ?? {});
          const matchingMediaType = mediaTypes.find(isMediaTypeAllowed);
          if (matchingMediaType) {
            const matchingMediaSchema = responseObj.content?.[matchingMediaType]?.schema;

            schemaRefObjs.push(
              ...getSchemaRefObjs(this, matchingMediaSchema, `${operation.operationId} response body`),
            );

            updateEnumZodSchemaData({
              resolver: this,
              schema: matchingMediaSchema,
              tags: [tag],
              nameSegments: [getResponseZodSchemaName({ statusCode, operationName, isUniqueOperationName, tag })],
            });
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

    this.schemaRefs.forEach((ref) => {
      const schemaRef = autocorrectRef(ref);

      updateEnumZodSchemaData({
        resolver: this,
        schema: this.getSchemaByRef(schemaRef),
        tags: this.getSchemaDataByRef(schemaRef)?.tags ?? [],
        nameSegments: [getSchemaNameByRef(schemaRef)],
      });
    });

    resolveEnumZodSchemaNames(this);
  }
}
