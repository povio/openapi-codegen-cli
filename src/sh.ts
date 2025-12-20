#!/usr/bin/env node

import { checkCommand } from "./commands/check.command";
import { generateCommand } from "./commands/generate.command";

const [command, ...args] = process.argv.slice(2);

if (!command) {
  console.log(`
NAME:
  openapi-codegen - OpenAPI CodeGen

USAGE:
  OpenAPI CodeGen

  Documentation is available at https://github.com/povio/openapi-codegen-cli
  
VERSION:
  ${process.env.OPENAPI_CODEGEN_VERSION} 

COMMANDS
  check - Check OpenAPI spec
  generate - Generate code from OpenAPI spec
  
COPYRIGHT:
  (c) 2026 Povio inc., All rights reserved.
`);
  process.exit(1);
}

switch (command) {
  case "check":
    checkCommand(args);
    break;

  case "generate":
    generateCommand(args);
    break;

  default:
    console.error(`Unknown command: ${command}`);
    process.exit(1);
}
