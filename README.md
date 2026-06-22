# OpenAPI code generation CLI

**NOTE:** This CLI tool is primarily designed for use within our organization. The generated code output aligns with our internal template.

**NOTE:** Version 1+ requires zod v4 and is not compatible with zod v3.

**NOTE:** Version 2+ includes supporting classes/types/components for the generated code as well as auth, therefore it has peerDependencies for @tanstack/react-query, axios, react and zod. @casl/ability and @casl/react are also required if you are generating ACL checks and/or using imports from "@povio/openapi-codegen-cli/acl"!

Use this tool to generate code (Zod schemas, TypeScript types, API definitions, and React queries) from an OpenAPI v3 specification. API definitions are generated to use a REST client wrapper that utilizes Axios. React queries are generated in alignment with our code standards, without the need for explicit types.

The tool partially leverages code from [openapi-zod-client](https://github.com/astahmer/openapi-zod-client) repository.

## Setup

```bash
yarn add @povio/openapi-codegen-cli
```

## Example

```bash
yarn openapi-codegen generate --input http://localhost:3001/docs-json
```

## Configuration Files

The CLI supports TypeScript configuration files to simplify command execution and provide consistent settings with full type safety. Configuration files are automatically discovered in your project root.

**Note:** Command-line arguments always take precedence over configuration file values, allowing you to override specific settings when needed.

### Quick Start

Create an `openapi-codegen.config.ts` file:

```typescript
import { OpenAPICodegenConfig } from "@povio/openapi-codegen-cli";

const config: OpenAPICodegenConfig = {
  input: "http://localhost:4000/docs-json/",
  output: "src/data",
};

export default config;
```

Then run without arguments:

```bash
yarn openapi-codegen generate
```

### Configuration File Discovery

The CLI automatically searches for the TypeScript configuration file:

- `openapi-codegen.config.ts`

You can also specify a custom configuration file:

```bash
yarn openapi-codegen generate --config my-config.ts
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

  --tsNamespaces                      Wrap generated files in TypeScript namespaces (default: true)
  --importPath                        Module import style for generated files (default: 'ts'; options: 'ts' | 'relative' | 'absolute')
  --tsPath                            (Requires `--importPath` to be 'ts') Typescript import path (default: '@/data')
  --removeOperationPrefixEndingWith   Remove operation name prefixes that end with the specified string (default: 'Controller_')
  --extractEnums                      Extract enums into separate Zod schemas (default: true)
  --modelsInCommon                    Keep all schema declarations in defaultTag models and emit per-module proxy exports (default: false)
  --replaceOptionalWithNullish        Replace `.optional()` chains with `.nullish()` in generated Zod schemas (default: false)

  --axiosRequestConfig                Include Axios request config parameters in query hooks (default: false)
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

  --builderConfigs                    Generate configs for builders (default: false)

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
```

## Development

#### Test locally

```bash
# prerequisites
corepack install
yarn

# run tests
yarn test

# run sources with tsx
yarn start --help
yarn start generate --input ./test/petstore.yaml --verbose

# build new version
yarn build

# test build
yarn start --help
yarn start:dist generate --input ./test/petstore.yaml --verbose
```

## Common Issues

### App REST Client Interceptors

In order to add interceptors to the used REST client, you must create your own instance of a RestClient and pass your implemented interceptors into the constructor. Make sure to set `restClientImportPath` in your openapi generation configuration too.

```ts
import { RestInterceptor } from "@povio/openapi-codegen-cli";

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
import { RestClient } from "@povio/openapi-codegen-cli";

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
import { ErrorHandler, OpenApiQueryConfig } from "@povio/openapi-codegen-cli";

<OpenApiQueryConfig.Provider
  onError={(error) => {
    errorToast({ text: ErrorHandler.getErrorMessage(error) });
  }}
>
  <App />
</OpenApiQueryConfig.Provider>;
```

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
import { OpenApiWorkspaceContext } from "@povio/openapi-codegen-cli";
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
