export class GenerateContext {
  private zodSchemas: Record<string, string> = {};
  private schemas: Record<string, string[]> = {};

  getZodSchemaByName(name: string) {
    return this.zodSchemas[name];
  }

  getSchemaNamesByCode(code: string) {
    return this.schemas[code];
  }

  setZodSchema(name: string, code: string) {
    this.zodSchemas[name] = code;
  }

  addSchemaName(code: string, zodSchemaName: string) {
    this.schemas[code] = (this.schemas[code] ?? []).concat(zodSchemaName);
  }

  getState() {
    return { zodSchemas: this.zodSchemas, schemas: this.schemas };
  }
}
