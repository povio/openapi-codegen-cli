# OpenAPI code generation CLI

**NOTE:** This CLI tool is specifically designed for custom usage within our organization. The generated code output is in alignment with our internal templates.

Use this tool to generate code (Zod schemas, API definitions and React queries) from OpenAPI v3 specification. API definitions are customized to fit the REST client wrapper used in our Next.js template. React queries are generated in alignment with our code standards, without the need for explicit types.

The tool partially leverages code from [openapi-zod-client](https://github.com/astahmer/openapi-zod-client) repository.

## Setup

```bash
yarn add @povio/openapi-codegen-cli
```

## Example

```bash
yarn openapi-codegen generate --input http://localhost:3001/docs-json
```

## Options

### Generate command

```sh
  --input <path>                      Path/url to OpenAPI/Swagger document as json/yaml
  --output <path>                     Output path (default: 'output')
  --includeNamespaces                 Include namespaces inside generated files (default: true)
  --splitByTags                       Split output into directories based on tags in OpenAPI operations (default: true)
  --defaultTag                        Default tag name for code shared accross multiple tags (default: 'Common')
  --excludeTags                       Comma separated list of tags excluded from the output
  --removeOperationPrefixEndingWith   Removes prefix that ends with value from operation names (default: 'Controller_')
  --prettier                          Run prettier command on output after code generation (default: true)
  --verbose                           Show log messages during execution
```

## Development

### Test locally

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
