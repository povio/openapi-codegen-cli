# OpenAPI code generation CLI

Use this tool to generate code from OpenAPI v3 specification.

It generates Zod schemas (uses code from https://github.com/astahmer/openapi-zod-client v1.18.2), API definitions adjusted to the rest client wrapper inside nextjs-template and react queries.

# Setup

```bash
yarn add @povio/openapi-codegen-cli
```

###Example

```bash
yarn openapi-codegen generate --input http://localhost:3001/docs-json
```

# Development

## Test locally

```bash
# prerequisites
corepack install
yarn

# run tests
yarn test

# run sources with tsx
yarn start --help
yarn start generate --input http://localhost:3001/docs-json

# build new version
yarn build

# test build
yarn start --help
yarn start:dist generate --input http://localhost:3001/docs-json
```
