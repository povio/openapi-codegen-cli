# OpenAPI code generation CLI

**NOTE:** This CLI tool is primarily designed for use within our organization. The generated code output aligns with our internal template.

**NOTE:** Version 1+ requires zod v4 and is not compatible with zod v3.

**NOTE:** The package includes supporting classes, types, components, and auth utilities. Zod is a required peer dependency. Axios, @tanstack/react-query, react, i18next, @casl/ability, @casl/react, and Vite are optional peers; install the ones used by your chosen features.

Axios is required when using the Axios transport (the default) or the `/axios` entry point. Projects using the native transport can omit Axios: generate with `--restClient native` and import `NativeRestClient` from `@povio/openapi-codegen-cli/native`. The root exports remain available for compatibility and support tree-shaking in consumer bundles. For direct runtime imports without bundling, use `/native` and `/errors` to avoid loading the Axios client. The `/axios` entry point is also available for Axios-specific imports. CLI-only usage and the `/generator`, `/tiny`, `/vite`, and `/metro` entry points do not require Axios.

ACL features require `@casl/ability@^7.1.1` and `@casl/react@^7.1.0`. When migrating to CASL 7, regenerate the client so `AppAbility` uses `Ability` instead of `PureAbility`, and update any handwritten CASL types. The runtime continues to use `createMongoAbility` for condition matching. CASL 7 treats empty conditions (`{}`) as matching everything. The `Can` helper keeps its `use` tuple and `(isAllowed, ability)` render callback.

Use this tool to generate code (Zod schemas, TypeScript types, API definitions, and React queries) from an OpenAPI v3 specification. API definitions use a REST client wrapper with either Axios or the native transport. React queries are generated in alignment with our code standards, without the need for explicit types.

The tool partially leverages code from [openapi-zod-client](https://github.com/astahmer/openapi-zod-client) repository.

## Migrating to v4

v4 contains breaking changes. Regenerate your clients after upgrading and check the following:

- **Runtime requirements.** Node.js 22 or newer (or Bun 1.4.4 or newer) is required. Node 18 and 20 are no longer supported.
- **Native renderer by default.** The CLI, Vite plugin and Metro plugin use the bundled Rust renderer when a native binary for the platform is available, and fall back to the TypeScript renderer otherwise. Output is byte-identical between the two. Set `OPENAPI_CODEGEN_NATIVE=0` to force the TypeScript renderer.
- **Builder configs removed.** The `builderConfigs` option (`--builderConfigs`) and the related `filterParamName`, `dataResponseParamNames`, `dynamicInputsImportPath` and `dynamicColumnsImportPath` options were removed, along with the generated `*.configs.ts` files. Remove these options from your configuration; a typed configuration that still sets them no longer compiles. There is no replacement in the generator, so keep any builder configuration you still need in application code.
- **No `any` in generated schemas.** Free-form values (`additionalProperties: true`, arrays without `items`, untyped schemas) are generated as `z.unknown()` instead of `z.any()`, so their inferred type is `unknown`. Narrow these values before use.
- **Typed invalidation maps.** Generated clients no longer augment a global type registry, so several clients can be compiled together. `InvalidationMap` takes the query module enum and its mutations (`InvalidationMap<QueryModule, QueryModuleMutations>`), and each generated `queryModules.ts` exports a ready-made `QueryModuleInvalidationMap` alias. `RegisteredQueryModule` and the global `OpenApiCodegenQueryModules` / `OpenApiCodegenQueryModuleMutations` interfaces were removed. See [Typed invalidation maps](#typed-invalidation-maps).
- **Optional request bodies.** A request body is optional unless the spec sets `requestBody.required: true` (the OpenAPI default is `false`). Such endpoints now take `data?: T` instead of `data: T`, validate it with `.optional()`, and the same applies to the variables of their query and mutation hooks. Because optional parameters follow required ones, `data` moves behind the required path, query and header parameters in the generated endpoint function, so positional calls such as `ExportsApi.note(id, data, count)` become `ExportsApi.note(id, count, data)`. Hook calls, which take an object, are unaffected by the order. Mark bodies your API always expects as `required: true` to keep `data` required.
- **Optional query and header parameters.** Query, header and cookie parameters are optional unless the spec sets `required: true` (the OpenAPI default is `false`); path parameters are always required. They were already validated with `.optional()`, but were typed as required, so endpoint functions and hook variables now take `name?: T`. As with bodies, optional parameters sort behind required ones, so positional calls to endpoint functions may need reordering; hook calls are unaffected. Mark parameters your API always expects as `required: true` to keep them required.
- **Inlined `$ref` parameters.** A parameter whose schema is a `$ref` to a simple component (for example `{ type: integer, minimum: 0 }`) is typed and validated like the component: it keeps the component's validations (`.gte(0)`, `.min(2)`, ...) and an integer or number component is typed `number` instead of `string`.
- **CASL 7.** ACL output targets CASL 7 (see the note above).
- **Cursor paginated infinite queries.** With `infiniteQueries`, GET endpoints with an optional string `cursor` query parameter and a `nextCursor` response field get cursor infinite queries (see [Infinite queries](#infinite-queries)), even without a `page` parameter. If such an endpoint also has a `page` parameter, its infinite hook, prefetch and `<name>Infinite` query key no longer take `cursor`, its pages are requested by cursor instead of page number, and its hook options are `AppCursorInfiniteQueryOptions`. Infinite query data is typed with its page params (`InfiniteData<T, number>` instead of `InfiniteData<T, unknown>`).
- **New options.** `includeSchemas`, `lazySchemas`, `generateJsDoc` (JSDoc generation is off by default), `infiniteQueryParamNames.cursor` and `infiniteQueryResponseParamNames.nextCursor` were added.

## Setup

```bash
bun add @povio/openapi-codegen-cli
```

## Example

```bash
bunx openapi-codegen generate --input http://localhost:3001/docs-json
```

## Schema compilation

Generated models use ordinary Zod schemas by default, preserving validation without the startup work of explicit `z.compile(...)` calls. Regenerate existing clients to remove previously emitted compilation calls. A frontend entry-point `import "zod/compile"` used solely for these generated models can then be removed.

Set `compileSchemas: true` in your generator configuration (or pass `--compileSchemas`) to opt into eager compilation for non-recursive schemas. This trades initialization time for potential validation throughput improvements. Recursive schemas remain uncompiled. Both the TypeScript and native generators honor this option.

```typescript
export default {
  compileSchemas: false, // Default; normal Zod validation stays enabled.
};
```

## JSDoc generation

JSDoc comments are omitted by default while schemas, inferred types, and runtime behavior are preserved. Set `generateJsDoc: true` in your generator configuration or pass `--generateJsDoc` to include comments. This applies to both TypeScript and native generation. Combine with `modelsOnly: true` if you only want model files.

## Lazy schemas

With `tsNamespaces` enabled, every schema of a models namespace is built the moment the module is imported, even when the importer only needs one of them. Set `lazySchemas: true` (or pass `--lazySchemas`) to build each schema on first access instead:

```typescript
// Generated with lazySchemas: true
const once = <T>(create: () => T) => {
  let value: T | undefined;
  return () => (value ??= create());
};

const PetSchema = once(() => z.object({ id: z.int(), category: CategorySchema() }));

export const PetModels = {
  get PetSchema() {
    return PetSchema();
  },
};
export declare namespace PetModels {
  export type Pet = z.infer<typeof PetModels.PetSchema>;
}
```

`PetModels.PetSchema` stays a regular Zod schema (`.extend`, `.shape`, `.pick` all work and return the same instance on every access), `PetModels.Pet` keeps resolving as a type, and `modelsInCommon` proxies forward to the shared namespace lazily as well. The option requires `tsNamespaces` and is honored by both the TypeScript and native generators. It helps cold starts of apps that import large model modules but render only a slice of them.

## Configuration Files

The CLI supports TypeScript configuration files to simplify command execution and provide consistent settings with full type safety. Configuration files are automatically discovered in your project root.

**Note:** Command-line arguments always take precedence over configuration file values, allowing you to override specific settings when needed.

### Quick Start

Create an `openapi-codegen.config.ts` file:

```typescript
import type { OpenAPICodegenConfig } from "@povio/openapi-codegen-cli";

const config: OpenAPICodegenConfig = {
  input: "http://localhost:4000/docs-json/",
  output: "src/data",
};

export default config;
```

Then run without arguments:

```bash
bunx openapi-codegen generate
```

### Configuration File Discovery

The CLI automatically searches for the TypeScript configuration file:

- `openapi-codegen.config.ts`

You can also specify a custom configuration file:

```bash
bunx openapi-codegen generate --config my-config.ts
```

## Options

#### Generate command (generates Zod schemas, API definitions and React queries)

```sh
  --config                            Path to TS config file (default: 'openapi-codegen.config.ts')
  --input                             Path/URL to OpenAPI JSON/YAML document
  --output                            Output directory path (default: 'output')
  --incremental                       Skip generation when OpenAPI and config are unchanged (default: true)
  --format                            Format the generated code using Oxfmt (default: true)
  --verbose                           Display detailed log messages during execution (default: false)

  --splitByTags                       Organize output into separate folders based on OpenAPI operation tags (default: true)
  --defaultTag                        (Requires `--splitByTags`) Default tag for shared code across multiple tags (default: 'Common')

  --includeTags                       Comma-separated list of tags to include in generation
  --excludeTags                       Comma-separated list of tags to exclude from generation
  --excludePathRegex                  Exclude operations whose paths match the given regular expression
  --excludeRedundantZodSchemas        Exclude any redundant Zod schemas (default: true)
  --includeSchemas                    Comma-separated component schemas to generate even when no operation uses them

  --tsNamespaces                      Wrap generated files in TypeScript namespaces (default: true)
  --importPath                        Module import style for generated files (default: 'ts'; options: 'ts' | 'relative' | 'absolute')
  --tsPath                            (Requires `--importPath` to be 'ts') Typescript import path (default: '@/data')
  --removeOperationPrefixEndingWith   Remove operation name prefixes that end with the specified string (default: 'Controller_')
  --compileSchemas                    Eagerly compile non-recursive Zod schemas (default: false)
  --generateJsDoc                     Emit JSDoc comments (default: false; enable with --generateJsDoc)
  --lazySchemas                       Build namespace model schemas on first access instead of at import; requires `--tsNamespaces` (default: false)
  --extractEnums                      Extract enums into separate Zod schemas (default: true)
  --modelsInCommon                    Keep all schema declarations in defaultTag models and emit per-module proxy exports (default: false)
  --replaceOptionalWithNullish        Replace `.optional()` chains with `.nullish()` in generated Zod schemas (default: false)

  --restClient                        REST transport to generate: 'axios' or 'native' (default: 'axios')
  --axiosRequestConfig                Include transport request config parameters in query hooks (default: false)
  --infiniteQueries                   Generate infinite queries for paginated API endpoints (default: false)
  --mutationEffects                   Add mutation effects options to mutation hooks (default: true)
  --mutationScope                     Serialize mutations for the same path-param resource via TanStack scope.id (default: false).
                                      In config files also accepts { include: string[] } or { exclude: string[] } to opt specific
                                      operations in/out of scoping. Use "Tag/operationId" format for precision (e.g. "EmployeeSettings/update")
                                      or just "operationId" to match across all tags. Cannot specify both include and exclude.
  --mutationDefaultOnError            Use OpenApiQueryConfig.onError as the default onError for mutation hooks (default: false)
  --workspaceContext                  Comma-separated list of path/ACL params that generated hooks may resolve from OpenApiWorkspaceContext
  --inlineEndpoints                   Inline endpoint implementations into generated query files (default: false)
  --inlineEndpointsExcludeModules     Comma-separated modules/tags to keep as separate API files while inlineEndpoints=true
  --modelsOnly                        Generate only model files (default: false)
  --parseRequestParams                Add Zod parsing to API endpoints (default: true)

  --acl                               Generate ACL related files (default: true)
  --checkAcl                          Add ACL check to queries (default: true)


  --baseUrl                           (Requires `--restClientImportPath` to NOT be set) Base URL for the generated REST client; falls back to the OpenAPI spec if not provided
```

#### Check command (checks if OpenAPI spec is compliant)

```sh
  --config                            Path to TS config file (default: 'openapi-codegen.config.ts')
  --input                             Path/URL to OpenAPI/Swagger document as JSON/YAML
  --verbose                           Show log messages during execution

  --splitByTags                       Organize output into separate folders based on OpenAPI operation tags (default: true)
  --defaultTag                        (Requires `--splitByTags`) Default tag for shared code across multiple tags (default: 'Common')

  --includeTags                       Comma-separated list of tags to include in generation
  --excludeTags                       Comma-separated list of tags to exclude from generation
  --excludePathRegex                  Exclude operations whose paths match the given regular expression
  --excludeRedundantZodSchemas        Exclude any redundant Zod schemas (default: true)
  --includeSchemas                    Comma-separated component schemas to generate even when no operation uses them
```

## Development

#### Test locally

```bash
# install dependencies
bun install

# run tests
bun run test

# run TypeScript sources directly with Bun
bun run start --help
bun run start generate --input ./test/petstore.yaml --verbose

# build new version
bun run build

# test build
bun run start --help
bun run start:dist generate --input ./test/petstore.yaml --verbose
```

### Native Bun code generation

The Bun and Node.js CLIs and the Vite plugin automatically use the bundled Rust code-generation core when a compatible native binary is available. Generated files remain byte-for-byte compatible with the TypeScript implementation, which is retained as the fallback when the addon cannot be loaded.

Set `OPENAPI_CODEGEN_NATIVE=0` to force the TypeScript path, or `OPENAPI_CODEGEN_NATIVE=1` to require the native path and fail when its binary is unavailable.

The native core caches up to two successful compilations per process within a 32 MiB estimated retained-memory budget. Reuse requires identical source text, YAML mode, and complete options JSON; returned objects remain independent. The cache is shared across Node workers and cleared when the last addon environment closes. It benefits repeated generation in long-running hosts such as Vite, not separate CLI processes. Set `OPENAPI_CODEGEN_NATIVE_CACHE=0` to disable it for profiling. Concurrent misses may compile independently; failures and oversized results are not retained.

Release packages include native binaries for Linux x64, macOS arm64, and Windows x64. Build a binary for the current platform with `bun run build:native`.

Run `bun run test:parity` after building the addon to compare every generated file across 64 layout combinations and representative values for every other renderer option. The matrix uses both `test/petstore.yaml` and `test/configuration.yaml`, exercises complete native and hybrid native generation, and loads generated models to check runtime references. The contradictory combination `modelsInCommon: true` with `modelsInModules: true` is rejected explicitly. Arbitrary strings and lists are covered by representative cases, not every possible value.

The separate Renderer parity workflow generates this matrix with JavaScript and native on Linux and macOS, then compares exact file lists and SHA-256 hashes. Artifacts include route reports identifying complete versus hybrid native generation. Runner integration tests cover input/output, stale-file cleanup, unchanged files, and incremental runs.

With `incremental` (the default), the generator records what it produced for each output directory in `node_modules/.cache/openapi-codegen` (or the system temp directory when there is no `node_modules`). A run whose OpenAPI source, resolved config, and generator build are unchanged, and whose files all still exist, is skipped. Otherwise only files whose generated content changed are written, so files rewritten afterwards by a formatter or post-processing script are left alone. Edits to generated files are therefore kept until that file's generated content changes; pass `--no-incremental` to rewrite every file.

With `format` (the default), generated files are formatted in-process using the nearest `.oxfmtrc.json` above the output directory and the project's installed `oxfmt` package, exactly as `oxfmt` or `bun fmt` would format them, so no separate formatting step is needed after generation. Only files whose generated content changed are formatted. Without an oxfmt config nothing is formatted; if a config exists but `oxfmt` is not installed, a warning is printed. Set `format: false` (or `--no-format`) to turn it off.

## Common Issues

### App REST Client Interceptors

Select the fetch-based client without changing endpoint and query APIs:

```ts
import type { OpenAPICodegenConfig } from "@povio/openapi-codegen-cli";

export default {
  restClient: "native",
} satisfies OpenAPICodegenConfig;
```

Native mode imports common request/response contracts from `@povio/openapi-codegen-cli/rest` and the concrete
`NativeRestClient` from `@povio/openapi-codegen-cli/native`. It uses `fetch` for normal requests and uploads, switching
to `XMLHttpRequest` in browsers only when an upload progress callback is provided.

Native interceptors use the common transport interface:

```ts
import { NativeRestClient } from "@povio/openapi-codegen-cli/native";
import type { RestTransportInterceptor } from "@povio/openapi-codegen-cli/rest";

const authorizationInterceptor: RestTransportInterceptor = {
  onRequest(request) {
    request.headers.set("Authorization", `Bearer ${localStorage.getItem("accessToken")}`);
    return request;
  },
};

export const AppRestClient = new NativeRestClient({
  config: { baseURL: "https://api.example.com" },
  interceptors: [authorizationInterceptor],
});
```

Axios remains the default for backward compatibility. The existing Axios interceptor API remains available in Axios
mode.

Native mode does not run the library `ErrorHandler` or create `ApplicationException` values. It throws `HttpError` for
non-success HTTP responses and preserves Zod, network, cancellation, and timeout errors so applications can handle them
directly in query callbacks, error boundaries, or their own normalization layer.

In order to add interceptors to the used REST client, you must create your own instance of a RestClient and pass your implemented interceptors into the constructor. Make sure to set `restClientImportPath` in your openapi generation configuration too.

```ts
import { RestInterceptor } from "@povio/openapi-codegen-cli/axios";

import { ACCESS_TOKEN_KEY } from "@/config/jwt.config";

export const AuthorizationHeaderInterceptor = new RestInterceptor((client) => {
  return client.interceptors.request.use(async (config) => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (accessToken != null) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  });
});
```

```ts
import { RestClient } from "@povio/openapi-codegen-cli/axios";

import { AuthorizationHeaderInterceptor } from "@/clients/rest/interceptors/authorization-header.interceptor";
import { AppConfig } from "@/config/app.config";

export const AppRestClient = new RestClient({
  config: {
    baseURL: AppConfig.api.url,
  },
  interceptors: [AuthorizationHeaderInterceptor],
});
```

```ts
import type { OpenAPICodegenConfig } from "@povio/openapi-codegen-cli";

const config: OpenAPICodegenConfig = {
  restClientImportPath: "@/clients/app-rest-client",
  // ...
};

export default config;
```

### Default mutation errors

Set `mutationDefaultOnError: true` in codegen config (or pass `--mutationDefaultOnError`) to let generated mutation hooks fall back to `OpenApiQueryConfig.Provider` when a mutation call does not define its own `onError`.

```tsx
import { ErrorHandler } from "@povio/openapi-codegen-cli/errors";
import { OpenApiQueryConfig } from "@povio/openapi-codegen-cli/query";

<OpenApiQueryConfig.Provider
  onError={(error) => {
    errorToast({ text: ErrorHandler.getErrorMessage(error) });
  }}
>
  <App />
</OpenApiQueryConfig.Provider>;
```

### Typed invalidation maps

With `mutationEffects` (the default), `queryModules.ts` exports `QueryModuleMutations` (for each module, the `data` and `variables` of its mutation hooks) and `QueryModuleInvalidationMap`, an alias for `InvalidationMap<QueryModule, QueryModuleMutations>` that types each module's callback from the spec:

```ts
import { QueryModule, type QueryModuleInvalidationMap } from "@/data/queryModules";

export const invalidationMap: QueryModuleInvalidationMap = {
  // `data` is any of the module's mutation responses; variables that only some
  // of its mutations take (here `id`) are optional.
  [QueryModule.Items]: (data, { officeId, id }) => [["items", officeId, id]],
};
```

The types are exported per client rather than registered globally, so several generated clients can be used in one
program; import each client's `QueryModuleInvalidationMap` from its own `queryModules.ts`.
`InvalidationMap<QueryModule>` (without mutation types) is still accepted, but its callbacks receive `unknown`.

Migrating from earlier v4 release candidates: generated code no longer augments the global
`OpenApiCodegenQueryModules` / `OpenApiCodegenQueryModuleMutations` interfaces, and `RegisteredQueryModule` is
removed. Replace a bare `InvalidationMap` or `InvalidationMap<QueryModule>` with the generated
`QueryModuleInvalidationMap`.

### Infinite queries

With `infiniteQueries: true`, paginated GET endpoints also get `use<Name>Infinite` and `prefetch<Name>Infinite`
(and a `<name>Infinite` query key). The pagination parameter and response field names are set in the config file:

```ts
const config: OpenAPICodegenConfig = {
  infiniteQueries: true,
  infiniteQueryParamNames: { page: "page", cursor: "cursor" }, // defaults
  infiniteQueryResponseParamNames: { page: "page", totalItems: "totalItems", limit: "limit", nextCursor: "nextCursor" }, // defaults
};
```

- **Page-number pagination.** An endpoint with a `page` query parameter starts at page `1` and requests the next
  page while `page * limit < totalItems` in the response.
- **Cursor pagination.** An endpoint with an optional string `cursor` query parameter whose response has a string
  (optionally nullable) `nextCursor` property, directly or through `allOf`, starts without a cursor and requests the
  next page with the returned `nextCursor` until it is `null` or missing. Cursor pagination takes precedence over
  page-number pagination; a `page` parameter of the same endpoint must be optional and is left unset. The hooks take
  `AppCursorInfiniteQueryOptions` (page params are `string | undefined`), and their query keys end with
  `"cursor-v1"`. An endpoint whose response has no next cursor field, or whose `cursor` or `page` parameter is
  required, is not cursor paginated (it is page-number paginated if it has a `page` parameter, otherwise it gets no
  infinite query). Set `infiniteQueryParamNames.cursor` to `""` to turn cursor pagination off.

### Runtime response validation

Use `OpenApiQueryConfig.Provider` to allow generated GET query hooks to return invalid response data while still logging the response Zod error to the console. Non-GET requests still throw on invalid response data.

```tsx
<OpenApiQueryConfig.Provider allowInvalidResponseData={import.meta.env.DEV}>
  <App />
</OpenApiQueryConfig.Provider>
```

### OpenApiWorkspaceContext (Path + ACL defaults)

Set `workspaceContext` to a list of param names in codegen config (or pass `--workspaceContext officeId,projectId`) and wrap your app subtree with `OpenApiWorkspaceContext.Provider` if generated hooks frequently repeat workspace-scoped params.

```tsx
import { OpenApiWorkspaceContext } from "@povio/openapi-codegen-cli/config";
// openapi-codegen.config.ts -> { workspaceContext: ["officeId", "projectId"] }

<OpenApiWorkspaceContext.Provider values={{ officeId: "office_123" }}>
  <MyWorkspacePages />
</OpenApiWorkspaceContext.Provider>;
```

Generated query/mutation hooks can then omit only those matching path/ACL params and resolve them from `OpenApiWorkspaceContext`. Params not listed in `workspaceContext` remain explicit and required.

### Generation Modes

You can control whether API endpoint files are emitted, inlined into query files, or skipped entirely.

```ts
import type { OpenAPICodegenConfig } from "@povio/openapi-codegen-cli";

const config: OpenAPICodegenConfig = {
  // 1) Default mode: separate *.api.ts files are generated
  // 2) Inline mode: endpoint logic is generated inside *.queries.ts
  // and can be used without separate api files:
  // inlineEndpoints: true,
  // inlineEndpointsExcludeModules: ["Users", "Billing"],
  // 3) Models-only mode: generate only *.models.ts files
  // modelsOnly: true,
  // 4) Keep all model declarations in common.models and generate per-module model proxies
  // modelsInCommon: true,
  // 5) Build each namespace schema on first access instead of at import (requires tsNamespaces)
  // lazySchemas: true,
};
```

### Vite Plugin

You can run codegen directly from Vite config (without CLI config file):

```ts
import { defineConfig } from "vite";
import { openApiCodegen } from "@povio/openapi-codegen-cli/vite";

export default defineConfig({
  plugins: [
    openApiCodegen({
      input: "./openapi.yaml",
      output: "./src/data",
      inlineEndpoints: true,
      incremental: true,
      formatGeneratedFile: async ({ fileName, content }) => {
        void fileName;
        return content;
      },
    }),
  ],
});
```

The plugin runs on both `vite serve` and `vite build`, and watches local OpenAPI files in dev mode.
If you provide `formatGeneratedFile`, the plugin formats each generated file in memory before comparing and writing it, which helps avoid unnecessary HMR when the formatted output is unchanged.

For Tiny projects that generate the OpenAPI JSON from ORPC before client codegen, use the wrapper plugin:

```ts
import { defineConfig } from "vite";
import { generateOpenApiFile as writeOpenApiFile, generateORPCOpenAPISpec } from "@povio/openapi-codegen-cli/tiny";
import { tinyOpenApiCodegen } from "@povio/openapi-codegen-cli/vite";
import { apiModules } from "../packages/fake-be/src/orpc/api/modules";
import { contract } from "../packages/fake-be/src/orpc/api/contract";
import { getOpenApiSchemaName } from "../packages/fake-be/src/orpc/spec";
import { userRoles } from "../packages/fake-be/src/roles";

const generateOpenApiFile = (options) =>
  writeOpenApiFile({
    ...options,
    generateOpenApiSpec: () =>
      generateORPCOpenAPISpec({
        contract,
        apiModules,
        userRoles,
        apiRoot: "../packages/fake-be/src/orpc/api",
        dbTablesRoot: "../packages/fake-be/src/db/tables",
        getOpenApiSchemaName,
      }),
  });

export default defineConfig({
  plugins: [
    tinyOpenApiCodegen(
      {
        input: "./openapi.generated.json",
        output: "./src/data",
        inlineEndpoints: true,
        incremental: true,
      },
      {
        generateOpenApiFile,
        watchFolders: ["../packages/fake-be/src/orpc", "../packages/fake-be/src/db"],
      },
    ),
  ],
});
```

When `VITE_PUBLIC_API_MODE` or `EXPO_PUBLIC_API_MODE` is `real`, the Tiny wrapper skips ORPC OpenAPI generation and behaves like `openApiCodegen`.

### Metro Plugin

You can run codegen directly from React Native Metro config:

```ts
import { fileURLToPath } from "url";
import { getDefaultConfig } from "@react-native/metro-config";
import { withOpenApiCodegen } from "@povio/openapi-codegen-cli/metro";

const root = fileURLToPath(new URL("./", import.meta.url));
const config = getDefaultConfig(root);

export default withOpenApiCodegen(
  config,
  {
    input: "./openapi.yaml",
    output: "./src/data",
    inlineEndpoints: true,
    incremental: true,
    formatGeneratedFile: async ({ fileName, content }) => {
      void fileName;
      return content;
    },
  },
  { root },
);
```

The Metro wrapper runs generation when the config is loaded, waits for it before Metro transforms or serves the first request, and watches local OpenAPI files while the dev server is running.
If you provide `formatGeneratedFile`, it behaves the same way as the Vite plugin.

For Tiny projects, use the Metro wrapper:

```ts
import { getDefaultConfig } from "@react-native/metro-config";
import { generateOpenApiFile as writeOpenApiFile, generateORPCOpenAPISpec } from "@povio/openapi-codegen-cli/tiny";
import { tinyOpenApiCodegenMetro } from "@povio/openapi-codegen-cli/metro";
import { apiModules } from "../../packages/fake-be/src/orpc/api/modules";
import { contract } from "../../packages/fake-be/src/orpc/api/contract";
import { getOpenApiSchemaName } from "../../packages/fake-be/src/orpc/spec";
import { userRoles } from "../../packages/fake-be/src/roles";

const root = __dirname;
const config = getDefaultConfig(root);
const generateOpenApiFile = (options) =>
  writeOpenApiFile({
    ...options,
    generateOpenApiSpec: () =>
      generateORPCOpenAPISpec({
        contract,
        apiModules,
        userRoles,
        apiRoot: "../../packages/fake-be/src/orpc/api",
        dbTablesRoot: "../../packages/fake-be/src/db/tables",
        getOpenApiSchemaName,
      }),
  });

export default tinyOpenApiCodegenMetro(
  config,
  {
    input: "./assets/openapi/main.json",
    output: "./utils/rest/openapi",
    inlineEndpoints: true,
    incremental: true,
  },
  {
    root,
    generateOpenApiFile,
    watchFolders: ["../../packages/fake-be/src/orpc", "../../packages/fake-be/src/db"],
  },
);
```

### Enums

If you're using Enums in your backend DTOs with `@Expose()` and `@IsEnum`, they may still not appear correctly in the OpenAPI schema unless you also provide both `enum` **and** `enumName` to `@ApiProperty`.

```ts
enum Status {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export class ExampleDto {
  @ApiProperty({ enum: Status, enumName: "Status" })
  @Expose()
  @IsEnum(Status)
  status: Status;
}
```

```ts
enum Status {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export class ExampleDto {
  @ApiProperty({ enum: Status, enumName: "Status", isArray: true })
  @Expose()
  @IsEnum(Status, { each: true })
  @IsArray()
  status: Status[];
}
```

---

### Nested objects

When using nested DTOs, ensure you explicitly specify the type using `@ApiProperty({ type: NestedDto })`:

```ts
export class NestedDto {
  @ApiProperty()
  @Expose()
  name: string;
}

export class ParentDto {
  @ApiProperty({ type: NestedDto })
  @Expose()
  @ValidateNested()
  @Type(() => NestedDto)
  @IsObject()
  nested: NestedDto;
}
```

```ts
export class NestedDto {
  @ApiProperty()
  @Expose()
  name: string;
}

export class ParentDto {
  @ApiProperty({ type: NestedDto, isArray: true })
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => NestedDto)
  @IsArray()
  nestedList: NestedDto[];
}
```

---

### JSON

When using JSON or Objects types, ensure you explicitly specify additional properties types as any otherwise FE ZOD will strip out everything: `@ApiProperty({ additionalProperties: { type: 'any' } })`:

```ts
export class JSONDto {
  @ApiProperty()
  @Expose()
  @IsObject()
  nested: NestedDto;
}
```

```ts
export class JSONDto {
  @ApiProperty({ additionalProperties: { type: "any" } })
  @Expose()
  @IsObject()
  nested: NestedDto;
}
```

### Runtime import paths

Use package subpaths for runtime imports. Pure `import type` imports may use the package root.

| Runtime exports                                                                              | Subpath   |
| -------------------------------------------------------------------------------------------- | --------- |
| `AuthContext`, `AuthGuard`                                                                   | `/auth`   |
| `AbilityContext`, `useAclCheck`, `Can`, `createAclGuard`                                     | `/acl`    |
| `ErrorHandler`, `SharedErrorHandler`, `ApplicationException`, `DomainErrorRegistry`          | `/errors` |
| `useMutationEffects`, `OpenApiQueryConfig`                                                   | `/query`  |
| `OpenApiRouter`, `OpenApiWorkspaceContext`, `useWorkspaceContext`, translation configuration | `/config` |
| `ZodExtended`                                                                                | `/zod`    |
| `HttpError`, transport types                                                                 | `/rest`   |
| `NativeRestClient`                                                                           | `/native` |
| `RestClient`, `RestInterceptor` (Axios transport)                                            | `/axios`  |

For example: `import { AuthContext, AuthGuard } from "@povio/openapi-codegen-cli/auth"`.
Custom application helpers should import error helpers from `/errors`, `AbilityContext` from `/acl`, and mutation effects from `/query`.

`AbilityContext.Provider` accepts an optional `resolveAction` (CASL's `resolveAction` option) to expand action aliases when the ability is built, for example `resolveAction={createAliasResolver({ modify: ["read", "update"] })}`. Pass a stable function, since a new one rebuilds the ability.
