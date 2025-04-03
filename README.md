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
  --input                             Path/URL to OpenAPI/Swagger document as JSON/YAML
  --output                            Output path (default: 'output')
  --prettier                          Run the Prettier command on the output after code generation (default: true)
  --verbose                           Show log messages during execution

  --splitByTags                       Split output into directories based on tags in OpenAPI operations (default: true)
  --defaultTag                        (Requires `splitByTags`) Default tag name for code shared across multiple tags (default: 'Common')
  --excludeTags                       (Requires `splitByTags`) Comma-separated list of tags to exclude from the output

  --tsNamespaces                      Include Typescript namespaces inside generated files (default: true)
  --importPath                        Import path (default: 'ts', possible values: 'ts' | 'relative' | 'absolute')
  --removeOperationPrefixEndingWith   Remove prefixes that end with the specified value from operation names (default: 'Controller_')
  --extractEnums                      Extract enums as separate Zod schemas (default: true)
  --replaceOptionalWithNullish        Replace all `.optional()` zod chains wtih `.nullish()`

  --infiniteQueries                   Generates infinite queries for API definitions that support pagination (default: false)

  --standalone                        Add any missing classes or types—e.g., REST client class, React Query type extensions, etc. (default: false)
  --baseUrl                           (Requires `standalone`) Base URL for the REST client; falls back to the one defined in the OpenAPI spec
```

#### Check command (checks if OpenAPI spec is compliant)

```sh
  --input                             Path/URL to OpenAPI/Swagger document as JSON/YAML
  --verbose                           Show log messages during execution

  --splitByTags                       Split output into directories based on tags in OpenAPI operations (default: true)
  --defaultTag                        Default tag name for code shared across multiple tags (default: 'Common')
  --excludeTags                       Comma-separated list of tags to exclude from the output
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
