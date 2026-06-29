import fs from "fs";
import { access, readdir } from "fs/promises";
import path, { join } from "path";
import { pathToFileURL } from "url";

export interface GenerateOpenApiFileOptions {
  argv?: readonly string[];
  cwd?: string;
  defaultOutput: string;
  env?: NodeJS.ProcessEnv;
}

export interface GenerateTinyOpenApiFileOptions extends GenerateOpenApiFileOptions {
  generateOpenApiSpec: () => Promise<unknown> | unknown;
}

export interface GenerateOpenApiFileResult {
  changed: boolean;
  outputPath: string;
}

export type GenerateOpenApiFile = (options: GenerateOpenApiFileOptions) => Promise<unknown> | unknown;

export type JsonObject = Record<string, unknown>;
export type AnySchema = unknown;
export type AnyContractRouter = unknown;
export type OpenApiSchemaRegistry = Record<string, { schema?: AnySchema; strategy?: "input" | "output" }>;
export type AclRule = `${string}:${string}`;
export type ZodSchema = AnySchema & { _zod: { def: JsonObject } };

export interface ProcedureMeta {
  bl: string;
  acl?: AclRule[];
}

export interface TinyOpenApiUserRole {
  description?: string;
  isDefault?: boolean;
  name: string;
}

export interface TinyOpenApiModule {
  extraSchemas?: OpenApiSchemaRegistry;
  openApiController?: string;
  openApiTag?: string;
  robodevHidden?: boolean;
  robodevOwnedTables?: readonly string[];
  robodevRoles?: readonly string[];
}

export interface GenerateORPCOpenAPISpecOptions {
  apiModules: Record<string, TinyOpenApiModule>;
  apiRoot?: string;
  contract: AnyContractRouter;
  dbTablesRoot?: string;
  getOpenApiSchemaName?: (schema: unknown) => string | undefined;
  info?: JsonObject;
  realBackendSortableSchemaNames?: ReadonlyMap<string, string> | Record<string, string>;
  servers?: JsonObject[];
  userRoles?: readonly TinyOpenApiUserRole[];
}

interface ModelSchemaExport {
  moduleName: string;
  name: string;
  schema: ZodSchema;
}

interface OperationContractInfo {
  meta: ProcedureMeta;
  path: string[];
  routeOperationId?: string;
}

interface OrpcContractProcedureData {
  inputSchema?: AnySchema;
  meta?: unknown;
  outputSchema?: AnySchema;
  route: {
    inputStructure?: string;
    method?: string;
    operationId?: string;
    path?: string;
    successStatus?: number;
  };
}

interface OpenAPIGeneratorRuntime {
  OpenAPIGenerator: new (options: { schemaConverters: unknown[] }) => {
    generate(contract: AnyContractRouter, options: JsonObject): Promise<unknown>;
  };
}

interface OrpcZodRuntime {
  ZodToJsonSchemaConverter: new () => unknown;
}

async function importRuntimeModule<TModule>(specifier: string): Promise<TModule> {
  const dynamicImport = new Function("specifier", "return import(specifier)") as (
    specifier: string,
  ) => Promise<TModule>;

  return dynamicImport(specifier);
}

const PAGINATED_OUTPUT_SUFFIX = "PaginateOutput";
const PAGINATED_RESPONSE_SUFFIX = "PaginateResponse";
const PAGINATION_RESPONSE_OUTPUT_SUFFIX = "PaginationResponseOutput";
const PAGINATED_ITEM_SUFFIX = "PaginateItem";
const PAGINATED_ITEM_OUTPUT_SUFFIX = "PaginateItemOutput";
const PAGINATION_DTO_SCHEMA_NAME = "PaginationDto";
const PAGINATION_PROPERTY_NAMES = ["page", "cursor", "nextCursor", "limit", "totalItems"] as const;

const OPENAPI_31_ONLY_KEYS = new Set([
  "$schema",
  "$id",
  "$vocabulary",
  "$dynamicAnchor",
  "$dynamicRef",
  "$defs",
  "jsonSchemaDialect",
  "unevaluatedItems",
  "unevaluatedProperties",
  "dependentRequired",
  "dependentSchemas",
  "prefixItems",
  "propertyNames",
  "contains",
  "minContains",
  "maxContains",
  "contentEncoding",
  "contentMediaType",
  "contentSchema",
]);

const openApiSchemaNames = new WeakMap<object, string>();

export function resolveOpenApiOutputPath({
  argv = process.argv,
  cwd = process.cwd(),
  defaultOutput,
  env = process.env,
}: GenerateOpenApiFileOptions): string {
  const outputFlagIndex = argv.indexOf("--output");
  const outputFromFlag = outputFlagIndex !== -1 ? argv[outputFlagIndex + 1] : undefined;
  const output = outputFromFlag ?? env.TINY_OPENAPI_OUTPUT ?? defaultOutput;

  return path.resolve(cwd, output);
}

export async function generateOpenApiFile(options: GenerateTinyOpenApiFileOptions): Promise<GenerateOpenApiFileResult> {
  const outputPath = resolveOpenApiOutputPath(options);
  const spec = await options.generateOpenApiSpec();
  const output = `${JSON.stringify(spec, null, 2)}\n`;

  if (fs.existsSync(outputPath) && fs.readFileSync(outputPath, "utf8") === output) {
    return { outputPath, changed: false };
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, output);

  return { outputPath, changed: true };
}

export function defineOpenApiSchemas<const TSchemas extends OpenApiSchemaRegistry>(schemas: TSchemas): TSchemas {
  return schemas;
}

export function collectExtraSchemas<TModules extends Record<string, { extraSchemas?: OpenApiSchemaRegistry }>>(
  modules: TModules,
): OpenApiSchemaRegistry {
  return Object.values(modules).reduce<OpenApiSchemaRegistry>((schemas, module) => {
    Object.assign(schemas, module.extraSchemas ?? {});
    return schemas;
  }, {});
}

export function namedOpenApiSchema<TSchema extends object>(schema: TSchema, name: string): TSchema {
  openApiSchemaNames.set(schema, name);
  return schema;
}

export function namedOpenApiRequestSchema<TSchema extends object>(schema: TSchema, name: string): TSchema {
  return namedOpenApiSchema(schema, `${name}Request`);
}

export function namedOpenApiResponseSchema<TSchema extends object>(schema: TSchema, name: string): TSchema {
  return namedOpenApiSchema(schema, `${name}Response`);
}

export function namedOpenApiOutputSchema<TSchema extends object>(schema: TSchema, name: string): TSchema {
  return namedOpenApiResponseSchema(schema, name);
}

export function namedControllerActionSchema<TSchema extends object>(
  schema: TSchema,
  controller: string,
  action: string,
  suffix: string,
): TSchema {
  return namedOpenApiSchema(schema, `${controller}Controller${toPascalCase(action)}${suffix}`);
}

export function namedControllerActionInputDtoSchema<TSchema extends object>(
  schema: TSchema,
  controller: string,
  action: string,
): TSchema {
  return namedControllerActionSchema(schema, controller, action, "Request");
}

export function getOpenApiSchemaName(schema: unknown): string | undefined {
  return typeof schema === "object" && schema !== null ? openApiSchemaNames.get(schema) : undefined;
}

export function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function getContractProcedureData(router: AnyContractRouter): OrpcContractProcedureData | undefined {
  if (!isObject(router) || !isObject(router["~orpc"])) {
    return undefined;
  }

  const data = router["~orpc"];
  if (!isObject(data.route)) {
    return undefined;
  }

  return {
    inputSchema: data.inputSchema,
    meta: data.meta,
    outputSchema: data.outputSchema,
    route: {
      inputStructure: typeof data.route.inputStructure === "string" ? data.route.inputStructure : undefined,
      method: typeof data.route.method === "string" ? data.route.method : undefined,
      operationId: typeof data.route.operationId === "string" ? data.route.operationId : undefined,
      path: typeof data.route.path === "string" ? data.route.path : undefined,
      successStatus: typeof data.route.successStatus === "number" ? data.route.successStatus : undefined,
    },
  };
}

export function isContractProcedure(router: AnyContractRouter): boolean {
  return Boolean(getContractProcedureData(router));
}

function routerEntries(router: AnyContractRouter): [string, AnyContractRouter][] {
  return isObject(router) ? Object.entries(router) : [];
}

export function asStringArray(value: unknown): string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string") ? value : [];
}

export function isNullSchema(value: unknown): boolean {
  return isObject(value) && value.type === "null";
}

export function isNullableOnlySchema(value: unknown): boolean {
  return isObject(value) && value.nullable === true && Object.keys(value).every((key) => key === "nullable");
}

export function toOpenAPI30Schema(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(toOpenAPI30Schema);
  }

  if (!isObject(value)) {
    return value;
  }

  const next: JsonObject = {};

  for (const [key, rawValue] of Object.entries(value)) {
    if (OPENAPI_31_ONLY_KEYS.has(key)) {
      continue;
    }

    if (key === "const") {
      next.enum = [rawValue];
      continue;
    }

    next[key] = toOpenAPI30Schema(rawValue);
  }

  if (Array.isArray(next.type)) {
    const types = next.type.filter((item) => item !== "null");
    if (types.length !== next.type.length) {
      next.nullable = true;
    }

    if (types.length === 1) {
      const [type] = types;
      next.type = type;
    } else if (types.length > 1) {
      delete next.type;
      next.anyOf = types.map((type) => ({ type }));
    } else {
      delete next.type;
    }
  }

  for (const keyword of ["anyOf", "oneOf"] as const) {
    const branches = next[keyword];
    if (Array.isArray(branches) && branches.some((item) => isNullSchema(item) || isNullableOnlySchema(item))) {
      const nonNullBranches = branches.filter((item) => !isNullSchema(item) && !isNullableOnlySchema(item));
      next.nullable = true;
      if (nonNullBranches.length === 1 && isObject(nonNullBranches[0])) {
        delete next[keyword];
        Object.assign(next, nonNullBranches[0]);
        next.nullable = true;
      } else {
        next[keyword] = nonNullBranches;
      }
    }
  }

  if (next.type === "null") {
    delete next.type;
    next.nullable = true;
  }

  if (typeof next.$ref === "string" && next.nullable === true) {
    const { $ref, ...rest } = next;
    return {
      ...rest,
      allOf: [{ $ref }],
    };
  }

  return next;
}

export function stripNoContentResponseBodies(spec: JsonObject) {
  if (!isObject(spec.paths)) {
    return;
  }

  for (const pathItem of Object.values(spec.paths)) {
    if (!isObject(pathItem)) {
      continue;
    }

    for (const operation of Object.values(pathItem)) {
      if (!isObject(operation) || !isObject(operation.responses)) {
        continue;
      }

      const noContentResponse = operation.responses["204"];
      if (isObject(noContentResponse)) {
        delete noContentResponse.content;
      }
    }
  }
}

export function isProcedureMeta(meta: unknown): meta is ProcedureMeta {
  return isObject(meta) && typeof meta.bl === "string";
}

export function operationKey(method: string, routePath: string): string {
  return `${method.toLowerCase()} ${routePath}`;
}

export function toPascalCase(value: string): string {
  return value.replace(/(^|[-_\s]+)([a-zA-Z0-9]?)/g, (_, _separator: string, next: string) => next.toUpperCase());
}

export function isZodSchema(value: unknown): value is ZodSchema {
  return (
    isObject(value) &&
    isObject(value["~standard"]) &&
    value["~standard"].vendor === "zod" &&
    isObject(value._zod) &&
    isObject(value._zod.def)
  );
}

export function schemaExportName(
  moduleName: string,
  exportName: string,
  schema: ZodSchema,
  getSchemaName = getOpenApiSchemaName,
): string {
  const explicitName = getSchemaName(schema);
  if (explicitName) {
    return explicitName;
  }

  const schemaName = exportName.replace(/Schema$/, "").replace(/DTO$/u, "");
  const modulePrefix = toPascalCase(moduleName);
  const singularModulePrefix = modulePrefix.endsWith("s") ? modulePrefix.slice(0, -1) : modulePrefix;
  const prefixedName =
    moduleName === "common" || schemaName.startsWith(modulePrefix) || schemaName.startsWith(singularModulePrefix)
      ? schemaName
      : `${modulePrefix}${schemaName}`;

  return prefixedName;
}

export function sharedSchemaExportName(exportName: string): string {
  return exportName.replace(/Schema$/, "");
}

export async function collectModelSchemaExports(options: {
  apiRoot?: string;
  dbTablesRoot?: string;
  getOpenApiSchemaName?: (schema: unknown) => string | undefined;
}): Promise<ModelSchemaExport[]> {
  const apiSchemaGroups = options.apiRoot ? await collectApiModelSchemaExports(options.apiRoot, options) : [];
  const dbSchemaExports = options.dbTablesRoot ? await collectDbTableModelSchemaExports(options.dbTablesRoot) : [];

  return [...apiSchemaGroups, ...dbSchemaExports];
}

export async function collectApiModelSchemaExports(
  apiRoot: string,
  options: { getOpenApiSchemaName?: (schema: unknown) => string | undefined } = {},
): Promise<ModelSchemaExport[]> {
  const entries = await readdir(apiRoot, { withFileTypes: true });
  const apiSchemaGroups = await Promise.all(
    entries
      .filter((item) => item.isDirectory())
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((entry) => collectModuleModelSchemaExports(apiRoot, entry.name, options)),
  );

  return apiSchemaGroups.flat();
}

export async function collectModuleModelSchemaExports(
  apiRoot: string,
  moduleName: string,
  options: { getOpenApiSchemaName?: (schema: unknown) => string | undefined } = {},
): Promise<ModelSchemaExport[]> {
  const modelsPath = join(apiRoot, moduleName, `${moduleName}.models.ts`);
  try {
    await access(modelsPath);
  } catch {
    return [];
  }

  const models = (await import(/* @vite-ignore */ pathToFileURL(modelsPath).href)) as Record<string, unknown>;
  const schemas: ModelSchemaExport[] = [];

  for (const [exportName, schema] of Object.entries(models)) {
    if (exportName.endsWith("Schema") && isZodSchema(schema)) {
      schemas.push({
        moduleName,
        name: schemaExportName(moduleName, exportName, schema, options.getOpenApiSchemaName),
        schema,
      });
    }
  }

  return schemas;
}

export async function collectDbTableModelSchemaExports(tablesRoot: string): Promise<ModelSchemaExport[]> {
  const tableEntries = await readdir(tablesRoot, { withFileTypes: true });
  const schemaGroups = await Promise.all(
    tableEntries
      .filter((item) => item.isDirectory())
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((entry) => collectDbTableModelSchemaExport(tablesRoot, entry.name)),
  );

  return schemaGroups.flat();
}

export async function collectDbTableModelSchemaExport(
  tablesRoot: string,
  tableName: string,
): Promise<ModelSchemaExport[]> {
  const schemaPath = join(tablesRoot, tableName, `${tableName}.schema.ts`);
  try {
    await access(schemaPath);
  } catch {
    return [];
  }

  const exports = (await import(/* @vite-ignore */ pathToFileURL(schemaPath).href)) as Record<string, unknown>;
  const schemas: ModelSchemaExport[] = [];

  for (const [exportName, schema] of Object.entries(exports)) {
    if (exportName.endsWith("TypeSchema") && isZodSchema(schema)) {
      schemas.push({ moduleName: "db", name: sharedSchemaExportName(exportName), schema });
    }
  }

  return schemas;
}

export function toOpenAPIAclRule(rule: string): JsonObject {
  const [subject, action] = rule.split(":");
  return {
    action,
    subject: toPascalCase(subject),
  };
}

export function collectOperationMeta(
  router: AnyContractRouter,
  routerPath: string[] = [],
  operationMeta = new Map<string, OperationContractInfo>(),
) {
  const procedure = getContractProcedureData(router);
  if (procedure) {
    const { meta, route } = procedure;
    if (route.method && route.path && isProcedureMeta(meta)) {
      operationMeta.set(operationKey(route.method, route.path), {
        meta,
        path: routerPath,
        routeOperationId: route.operationId,
      });
    }

    return operationMeta;
  }

  for (const [name, child] of routerEntries(router)) {
    collectOperationMeta(child, [...routerPath, name], operationMeta);
  }

  return operationMeta;
}

export function getObjectPropertySchema(schema: AnySchema, property: string): AnySchema | undefined {
  if (!isZodSchema(schema) || schema._zod.def.type !== "object") {
    return undefined;
  }

  const {
    _zod: {
      def: { shape },
    },
  } = schema;
  if (!isObject(shape)) {
    return undefined;
  }

  const propertySchema = shape[property];
  return isZodSchema(propertySchema) ? propertySchema : undefined;
}

export function routeHasPathParameters(routePath?: string): boolean {
  return typeof routePath === "string" && /\{[^}]+\}/u.test(routePath);
}

export function getProcedureInputSchemaRole(route: OrpcContractProcedureData["route"]): "Params" | "Query" | "Request" {
  if (routeHasPathParameters(route.path)) {
    return "Params";
  }

  return route.method?.toUpperCase() === "GET" ? "Query" : "Request";
}

export function procedureSchemaName(procedureName: string, role: "Params" | "Query" | "Request" | "Response"): string {
  if (procedureName.endsWith(role)) {
    return procedureName;
  }

  return `${procedureName}${role}`;
}

export function addContractSchema(
  schemas: OpenApiSchemaRegistry,
  schema: AnySchema | undefined,
  name: string,
  getSchemaName: (schema: unknown) => string | undefined,
  strategy?: "input" | "output",
) {
  if (!schema) {
    return;
  }

  schemas[getSchemaName(schema) ?? name] = {
    schema,
    ...(strategy ? { strategy } : {}),
  };
}

export function collectContractSchemas(
  router: AnyContractRouter,
  routerPath: string[] = [],
  schemas: OpenApiSchemaRegistry = {},
  getSchemaName = getOpenApiSchemaName,
): OpenApiSchemaRegistry {
  const procedure = getContractProcedureData(router);
  if (procedure) {
    const procedureName = routerPath.map(toPascalCase).join("");
    const { inputSchema, outputSchema, route } = procedure;

    if (inputSchema) {
      if (route.inputStructure === "detailed") {
        addContractSchema(
          schemas,
          getObjectPropertySchema(inputSchema, "params"),
          procedureSchemaName(procedureName, "Params"),
          getSchemaName,
        );
        addContractSchema(
          schemas,
          getObjectPropertySchema(inputSchema, "query"),
          procedureSchemaName(procedureName, "Query"),
          getSchemaName,
        );
        addContractSchema(
          schemas,
          getObjectPropertySchema(inputSchema, "body") ?? inputSchema,
          procedureSchemaName(procedureName, "Request"),
          getSchemaName,
        );
      } else {
        addContractSchema(
          schemas,
          inputSchema,
          procedureSchemaName(procedureName, getProcedureInputSchemaRole(route)),
          getSchemaName,
        );
      }
    }
    if (outputSchema && route.successStatus !== 204) {
      addContractSchema(schemas, outputSchema, procedureSchemaName(procedureName, "Response"), getSchemaName, "output");
    }

    return schemas;
  }

  for (const [name, child] of routerEntries(router)) {
    collectContractSchemas(child, [...routerPath, name], schemas, getSchemaName);
  }

  return schemas;
}

export function collectContractSchemaRoots(router: AnyContractRouter, roots = new Set<AnySchema>()): Set<AnySchema> {
  const procedure = getContractProcedureData(router);
  if (procedure) {
    const { inputSchema, outputSchema, route } = procedure;

    if (inputSchema) {
      roots.add(inputSchema);
    }
    if (outputSchema && route.successStatus !== 204) {
      roots.add(outputSchema);
    }

    return roots;
  }

  for (const [, child] of routerEntries(router)) {
    collectContractSchemaRoots(child, roots);
  }

  return roots;
}

export function visitZodSchema(schema: ZodSchema, visit: (schema: ZodSchema) => void, seen = new Set<ZodSchema>()) {
  if (seen.has(schema)) {
    return;
  }

  seen.add(schema);
  visit(schema);

  const visitValue = (value: unknown) => {
    if (isZodSchema(value)) {
      visitZodSchema(value, visit, seen);
      return;
    }

    if (Array.isArray(value)) {
      value.forEach(visitValue);
      return;
    }

    if (isObject(value)) {
      Object.values(value).forEach(visitValue);
    }
  };

  const { def } = schema._zod;
  Object.values(def).forEach(visitValue);

  if (typeof def.getter === "function") {
    const lazyValue = def.getter();
    if (isZodSchema(lazyValue)) {
      visitZodSchema(lazyValue, visit, seen);
    }
  }
}

export function collectSchemaRegistryRoots(registry: OpenApiSchemaRegistry): Set<AnySchema> {
  return Object.values(registry).reduce<Set<AnySchema>>((schemas, entry) => {
    if ("schema" in entry && entry.schema) {
      schemas.add(entry.schema);
    }

    return schemas;
  }, new Set());
}

export async function collectReachableModelSchemas(
  router: AnyContractRouter,
  options: {
    apiRoot?: string;
    dbTablesRoot?: string;
    excludedSchemas?: Set<AnySchema>;
    getOpenApiSchemaName?: (schema: unknown) => string | undefined;
  } = {},
): Promise<OpenApiSchemaRegistry> {
  const excludedSchemas = options.excludedSchemas ?? new Set<AnySchema>();
  const modelSchemas = await collectModelSchemaExports(options);
  const schemaNameBySchema = new Map<ZodSchema, string>();
  const routeRoots = collectContractSchemaRoots(router);
  const reachableSchemas: OpenApiSchemaRegistry = {};

  for (const { moduleName, name, schema } of modelSchemas) {
    if (
      (moduleName === "common" || name.endsWith("SortableKey") || name.endsWith("OrderParamEnum")) &&
      !excludedSchemas.has(schema)
    ) {
      reachableSchemas[name] = { schema };
    }
  }

  for (const { name, schema } of modelSchemas) {
    const existingName = schemaNameBySchema.get(schema);

    if (!existingName) {
      schemaNameBySchema.set(schema, name);
    } else if (existingName !== name) {
      schemaNameBySchema.set(schema, existingName.length <= name.length ? existingName : name);
    }
  }

  for (const root of routeRoots) {
    if (!isZodSchema(root)) {
      continue;
    }

    visitZodSchema(root, (schema) => {
      if (routeRoots.has(schema) || excludedSchemas.has(schema)) {
        return;
      }

      const name = schemaNameBySchema.get(schema);
      if (name) {
        reachableSchemas[name] = { schema };
      }
    });
  }

  return reachableSchemas;
}

export function compactTagName(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, "");
}

export function getModuleOpenApiController(apiModules: Record<string, TinyOpenApiModule>, moduleName: string): string {
  const module = apiModules[moduleName];
  return module?.openApiController ?? `${compactTagName(module?.openApiTag ?? toPascalCase(moduleName))}Controller`;
}

export function getOperationController(
  apiModules: Record<string, TinyOpenApiModule>,
  operationPath: string[],
): string | undefined {
  const [moduleName, controllerSegment] = operationPath;
  if (!moduleName) {
    return undefined;
  }

  if (!controllerSegment || operationPath.length === 2) {
    return getModuleOpenApiController(apiModules, moduleName);
  }

  return `${getModuleOpenApiController(apiModules, moduleName).replace(/Controller$/, "")}${toPascalCase(controllerSegment)}Controller`;
}

export function getOperationAction(operationPath: string[]): string | undefined {
  return operationPath.at(-1);
}

export function getDerivedOperationId(
  apiModules: Record<string, TinyOpenApiModule>,
  info: OperationContractInfo,
): string | undefined {
  const controller = getOperationController(apiModules, info.path);
  const action = getOperationAction(info.path);
  return controller && action ? `${controller}_${action}` : undefined;
}

export function applyOperationMeta(
  spec: JsonObject,
  operationMeta: Map<string, OperationContractInfo>,
  apiModules: Record<string, TinyOpenApiModule>,
) {
  if (!isObject(spec.paths)) {
    return;
  }

  for (const [routePath, pathItem] of Object.entries(spec.paths)) {
    if (!isObject(pathItem)) {
      continue;
    }

    for (const [method, operation] of Object.entries(pathItem)) {
      if (!isObject(operation)) {
        continue;
      }

      const info = operationMeta.get(operationKey(method, routePath));
      if (!info) {
        continue;
      }

      operation.operationId = info.routeOperationId ?? getDerivedOperationId(apiModules, info) ?? operation.operationId;
      const { meta } = info;
      operation["x-bl"] = meta.bl;
      if (meta.acl) {
        operation["x-acl"] = meta.acl.map(toOpenAPIAclRule);
        operation.responses = {
          ...(isObject(operation.responses) ? operation.responses : {}),
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" },
        };
      }
    }
  }
}

export function findEnumNames(value: unknown): string[] | undefined {
  if (!isObject(value)) {
    return undefined;
  }

  const enumNames = value["x-enumNames"];
  if (Array.isArray(enumNames) && enumNames.every((item) => typeof item === "string")) {
    return enumNames;
  }

  for (const keyword of ["allOf", "anyOf", "oneOf"] as const) {
    const schemas = value[keyword];
    if (!Array.isArray(schemas)) {
      continue;
    }

    for (const schema of schemas) {
      const nestedEnumNames = findEnumNames(schema);
      if (nestedEnumNames) {
        return nestedEnumNames;
      }
    }
  }

  return undefined;
}

export function getStringEnumValues(schema: JsonObject): string[] | undefined {
  const { enum: enumValues } = schema;
  if (!Array.isArray(enumValues) || enumValues.length === 0) {
    return undefined;
  }

  return enumValues.every((item) => typeof item === "string") ? enumValues : undefined;
}

export function applyEnumExtensions(value: unknown) {
  if (Array.isArray(value)) {
    value.forEach(applyEnumExtensions);
    return;
  }

  if (!isObject(value)) {
    return;
  }

  const enumNames = getStringEnumValues(value);
  if (enumNames && !Array.isArray(value["x-enumNames"])) {
    value["x-enumNames"] = enumNames;
  }

  Object.values(value).forEach(applyEnumExtensions);
}

export function findComponentEnumNames(spec: JsonObject, name: string): string[] | undefined {
  const { components } = spec;
  if (!isObject(components) || !isObject(components.schemas)) {
    return undefined;
  }

  const schema = components.schemas[name];
  if (!isObject(schema)) {
    return undefined;
  }

  return findEnumNames(schema) ?? getStringEnumValues(schema);
}

export function applyParameterExtensions(
  spec: JsonObject,
  realBackendSortableSchemaNames: ReadonlyMap<string, string> = new Map(),
) {
  if (!isObject(spec.paths)) {
    return;
  }

  for (const pathItem of Object.values(spec.paths)) {
    if (!isObject(pathItem)) {
      continue;
    }

    for (const operation of Object.values(pathItem)) {
      if (!isObject(operation) || !Array.isArray(operation.parameters)) {
        continue;
      }

      const [tag] = Array.isArray(operation.tags) ? operation.tags : [];
      const sortableSchemaName =
        typeof tag === "string"
          ? (realBackendSortableSchemaNames.get(tag) ?? `${toPascalCase(tag)}SortableKey`)
          : undefined;
      const sortableEnumNames = sortableSchemaName ? findComponentEnumNames(spec, sortableSchemaName) : undefined;

      for (const parameter of operation.parameters) {
        if (!isObject(parameter) || parameter.in !== "query") {
          continue;
        }

        if (parameter.name === "filter" && parameter.required !== true) {
          parameter.required = false;
        }

        const enumNames =
          findEnumNames(parameter.schema) ?? (parameter.name === "order" ? sortableEnumNames : undefined);
        if (enumNames) {
          parameter["x-enumNames"] = enumNames;
        }
      }
    }
  }
}

export function getModuleOpenApiTag(apiModules: Record<string, TinyOpenApiModule>, moduleName: string): string {
  const module = apiModules[moduleName];
  return module?.openApiTag ?? moduleName;
}

export function applyRobodevModuleExtensions(
  spec: JsonObject,
  moduleExtensions: Map<string, { hidden: boolean; tables: string[]; roles: string[] }>,
  apiModules: Record<string, TinyOpenApiModule>,
) {
  if (moduleExtensions.size === 0) {
    return;
  }

  const existingTags = Array.isArray(spec.tags) ? spec.tags.filter(isObject) : [];
  const tagsByName = new Map<string, JsonObject>();

  for (const tag of existingTags) {
    if (typeof tag.name === "string") {
      tagsByName.set(tag.name, tag);
    }
  }

  for (const [moduleName, metadata] of moduleExtensions) {
    const tagName = getModuleOpenApiTag(apiModules, moduleName);
    const tag: JsonObject = tagsByName.get(tagName) ?? { name: tagName };

    if (metadata.hidden) {
      tag["x-robodev-hidden"] = true;
    }
    if (metadata.tables.length > 0) {
      tag["x-robodev-owned-tables"] = metadata.tables;
    }
    if (metadata.roles.length > 0) {
      tag["x-robodev-roles"] = metadata.roles;
    }

    tagsByName.set(tagName, tag);
  }

  spec.tags = [...tagsByName.values()];
}

export function applyRobodevUserRolesExtension(spec: JsonObject, userRoles: readonly TinyOpenApiUserRole[] = []) {
  spec["x-robodev-user-roles"] = userRoles.map((role) => ({
    name: role.name,
    description: role.description,
    ...(role.isDefault ? { isDefault: true } : {}),
  }));
}

export function collectOperationTags(spec: JsonObject): Set<string> {
  const tags = new Set<string>();
  if (!isObject(spec.paths)) {
    return tags;
  }

  for (const pathItem of Object.values(spec.paths)) {
    if (!isObject(pathItem)) {
      continue;
    }

    for (const operation of Object.values(pathItem)) {
      if (!isObject(operation)) {
        continue;
      }

      asStringArray(operation.tags).forEach((tag) => tags.add(tag));
    }
  }

  return tags;
}

export function getRobodevModuleRoles(
  hidden: boolean,
  explicitRoles: readonly string[] | null,
  moduleHasOperations: boolean,
  defaultRoles: readonly string[],
): string[] {
  if (hidden) {
    return [];
  }

  if (explicitRoles) {
    return [...explicitRoles];
  }

  return moduleHasOperations ? [...defaultRoles] : [];
}

export function schemaComponentRef(name: string): JsonObject {
  return { $ref: `#/components/schemas/${name}` };
}

export function getComponentSchemas(spec: JsonObject): JsonObject | null {
  const { components } = spec;

  if (!isObject(components) || !isObject(components.schemas)) {
    return null;
  }

  return components.schemas;
}

export function getPaginatedItemSchema(schema: JsonObject): unknown {
  const { properties } = schema;

  if (!isObject(properties) || !PAGINATION_PROPERTY_NAMES.every((name) => name in properties)) {
    return null;
  }

  const { items } = properties;
  if (!isObject(items) || items.type !== "array" || !isObject(items.items)) {
    return null;
  }

  return items.items;
}

export function applyPaginatedItemSchemas(spec: JsonObject) {
  const schemas = getComponentSchemas(spec);
  if (!schemas) {
    return;
  }

  for (const [name, schema] of Object.entries(schemas)) {
    if (
      !(
        name.endsWith(PAGINATED_OUTPUT_SUFFIX) ||
        name.endsWith(PAGINATED_RESPONSE_SUFFIX) ||
        name.endsWith(PAGINATION_RESPONSE_OUTPUT_SUFFIX)
      ) ||
      !isObject(schema)
    ) {
      continue;
    }

    const itemSchema = getPaginatedItemSchema(schema);
    if (!itemSchema) {
      continue;
    }

    const itemName = name.endsWith(PAGINATION_RESPONSE_OUTPUT_SUFFIX)
      ? name.replace(new RegExp(`${PAGINATION_RESPONSE_OUTPUT_SUFFIX}$`), PAGINATED_ITEM_OUTPUT_SUFFIX)
      : name
          .replace(new RegExp(`${PAGINATED_OUTPUT_SUFFIX}$`), PAGINATED_ITEM_SUFFIX)
          .replace(new RegExp(`${PAGINATED_RESPONSE_SUFFIX}$`), PAGINATED_ITEM_SUFFIX);
    schemas[itemName] = { allOf: [itemSchema] };
    schemas[name] = {
      allOf: [
        schemaComponentRef(PAGINATION_DTO_SCHEMA_NAME),
        {
          type: "object",
          properties: {
            items: {
              type: "array",
              items: schemaComponentRef(itemName),
            },
          },
          required: ["items"],
        },
      ],
    };
  }
}

export function toOpenAPI30Document(spec: JsonObject): JsonObject {
  const converted = toOpenAPI30Schema(spec) as JsonObject;
  converted.openapi = "3.0.3";

  const components = (isObject(converted.components) ? converted.components : {}) as JsonObject;
  components.securitySchemes = {
    ...(isObject(components.securitySchemes) ? components.securitySchemes : {}),
    bearerAuth: {
      type: "http",
      scheme: "bearer",
    },
  };
  converted.components = components;
  stripNoContentResponseBodies(converted);

  return converted;
}

export async function generateORPCOpenAPISpec(options: GenerateORPCOpenAPISpecOptions): Promise<JsonObject> {
  const [{ OpenAPIGenerator }, { ZodToJsonSchemaConverter }] = await Promise.all([
    importRuntimeModule<OpenAPIGeneratorRuntime>("@orpc/openapi"),
    importRuntimeModule<OrpcZodRuntime>("@orpc/zod/zod4"),
  ]);
  const generator = new OpenAPIGenerator({
    schemaConverters: [new ZodToJsonSchemaConverter()],
  });
  const getSchemaName = options.getOpenApiSchemaName ?? getOpenApiSchemaName;
  const operationMeta = collectOperationMeta(options.contract);
  const extraSchemas = collectExtraSchemas(options.apiModules);
  const reachableModelSchemas = await collectReachableModelSchemas(options.contract, {
    apiRoot: options.apiRoot,
    dbTablesRoot: options.dbTablesRoot,
    excludedSchemas: collectSchemaRegistryRoots(extraSchemas),
    getOpenApiSchemaName: getSchemaName,
  });
  const commonSchemas = {
    ...collectContractSchemas(options.contract, [], {}, getSchemaName),
    ...extraSchemas,
    ...reachableModelSchemas,
  };

  const spec = await generator.generate(options.contract, {
    info: options.info ?? {
      title: "Tiny Template Fake API",
      description: "OpenAPI spec generated from the oRPC fake backend contract.",
      version: "3.0.0",
    },
    servers: options.servers ?? [{ url: "/", description: "Current origin" }],
    ...(Object.keys(commonSchemas).length > 0 ? { commonSchemas } : {}),
  });
  const jsonSpec = spec as JsonObject;
  const sortableSchemaNames =
    options.realBackendSortableSchemaNames instanceof Map
      ? options.realBackendSortableSchemaNames
      : new Map(Object.entries(options.realBackendSortableSchemaNames ?? {}));

  applyOperationMeta(jsonSpec, operationMeta, options.apiModules);
  applyEnumExtensions(spec);
  applyParameterExtensions(jsonSpec, sortableSchemaNames);
  applyPaginatedItemSchemas(jsonSpec);

  const userRoles = options.userRoles ?? [];
  const defaultRobodevRoles = userRoles.filter((role) => role.isDefault).map((role) => role.name);
  const operationTags = collectOperationTags(jsonSpec);
  const robodevModuleExtensions = new Map<string, { hidden: boolean; tables: string[]; roles: string[] }>();

  for (const [name, module] of Object.entries(options.apiModules)) {
    const tagName = getModuleOpenApiTag(options.apiModules, name);
    const hidden = module.robodevHidden === true;
    const explicitRobodevRoles = Array.isArray(module.robodevRoles) ? [...module.robodevRoles] : null;
    const metadata = {
      hidden,
      tables: Array.isArray(module.robodevOwnedTables) ? [...module.robodevOwnedTables] : [],
      roles: getRobodevModuleRoles(hidden, explicitRobodevRoles, operationTags.has(tagName), defaultRobodevRoles),
    };

    if (metadata.hidden || metadata.tables.length > 0 || metadata.roles.length > 0) {
      robodevModuleExtensions.set(name, metadata);
    }
  }

  applyRobodevModuleExtensions(jsonSpec, robodevModuleExtensions, options.apiModules);
  applyRobodevUserRolesExtension(jsonSpec, userRoles);

  return toOpenAPI30Document(jsonSpec);
}
