# OpenAPI code generation CLI

**NOTE:** This CLI tool is primarily designed for use within our organization. The generated code output aligns with our internal template. If you are using this tool without our internal template, make sure to use it in standalone mode.

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

#### Standalone mode

```bash
yarn openapi-codegen generate --input http://localhost:3001/docs-json --standalone
```

## Options

#### Generate command (generates Zod schemas, API definitions and React queries)

```sh
  --input                             Path/URL to OpenAPI JSON/YAML document
  --output                            Output directory path (default: 'output')
  --prettier                          Format the generated code using Prettier (default: true)
  --verbose                           Display detailed log messages during execution (default: false)

  --splitByTags                       Organize output into separate folders based on OpenAPI operation tags (default: true)
  --defaultTag                        (Requires `--splitByTags`) Default tag for shared code across multiple tags (default: 'Common')

  --excludeTags                       Comma-separated list of tags to exclude from generation
  --excludePathRegex                  Exclude operations whose paths match the given regular expression
  --excludeRedundantZodSchemas        Exclude any redundant Zod schemas (default: true)

  --tsNamespaces                      Wrap generated files in TypeScript namespaces (default: true)
  --importPath                        Module import style for generated files (default: 'ts'; options: 'ts' | 'relative' | 'absolute')
  --removeOperationPrefixEndingWith   Remove operation name prefixes that end with the specified string (Default: 'Controller_')
  --extractEnums                      Extract enums into separate Zod schemas (default: true)
  --replaceOptionalWithNullish        Replace `.optional()` chains with `.nullish()` in generated Zod schemas (default: false)

  --axiosRequestConfig                Include Axios request config parameters in query hooks (default: false)
  --infiniteQueries                   Generate infinite queries for paginated API endpoints (default: false)
  --invalidateQueryOptions            Add query invalidation options to mutation hooks (default: true)

  --standalone                        Generate any missing supporting classes/types, e.g., REST client class, React Query type extensions, etc. (default: false)
  --baseUrl                           (Requires `--standalone`) Base URL for the REST client; falls back to the OpenAPI spec if not provided
```

#### Check command (checks if OpenAPI spec is compliant)

```sh
  --input                             Path/URL to OpenAPI/Swagger document as JSON/YAML
  --verbose                           Show log messages during execution

  --splitByTags                       Organize output into separate folders based on OpenAPI operation tags (default: true)
  --defaultTag                        (Requires `--splitByTags`) Default tag for shared code across multiple tags (default: 'Common')

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

### Enums

If you're using Enums in your backend DTOs with `@Expose()` and `@IsEnum`, they may still not appear correctly in the OpenAPI schema unless you also provide both `enum` **and** `enumName` to `@ApiProperty`.

```ts
enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export class ExampleDto {
  @ApiProperty({ enum: Status, enumName: 'Status' })
  @Expose()
  @IsEnum(Status)
  status: Status;
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
