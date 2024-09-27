import Handlebars from "handlebars";
import { GenerateOptions } from "../types/options";
import { getZodSchemaInferedTypeName } from "./generate.utils";

enum ZodHelpers {
  INFERED_TYPE = "zodInferedType",
}

export function registerZodHbsHelpers(options: GenerateOptions) {
  registerInferedTypeHelper(options);
}

function registerInferedTypeHelper({ schemaSuffix }: GenerateOptions) {
  Handlebars.registerHelper(ZodHelpers.INFERED_TYPE, (zodSchema: string) =>
    getZodSchemaInferedTypeName(zodSchema, schemaSuffix),
  );
}
