import { ERROR_HANDLERS, ERROR_HANDLING_IMPORT, ZOD_EXTENDED } from "../const/deps.const";
import { ZOD_IMPORT } from "../const/zod.const";
import { SchemaResolver } from "../core/SchemaResolver.class";
import { getHbsTemplateDelegate } from "../utils/hbs/hbs-template.utils";

export function generateZod(resolver: SchemaResolver) {
  const hbsTemplate = getHbsTemplateDelegate(resolver, "zod");

  return hbsTemplate({
    zodImport: ZOD_IMPORT,
    zodExtension: ZOD_EXTENDED.name,
    sortingString: ZOD_EXTENDED.properties.sortingString,
    parse: ZOD_EXTENDED.properties.parse,
    errorHandler: ERROR_HANDLERS.ErrorHandler,
    sharedErrorHandler: ERROR_HANDLERS.SharedErrorHandler,
    errorHandlingImport: {
      ...ERROR_HANDLING_IMPORT,
      from: resolver.options.errorHandlingImportPath,
    },
  });
}
