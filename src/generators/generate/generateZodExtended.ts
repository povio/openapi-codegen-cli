import { ERROR_HANDLERS, ERROR_HANDLING_IMPORT, ZOD_EXTENDED } from "../const/deps.const";
import { ZOD_IMPORT } from "../const/zod.const";
import type { SchemaResolver } from "../core/SchemaResolver.class";
import { getHbsTemplateDelegate } from "../utils/hbs/hbs-template.utils";

export function generateZodExtended(resolver: SchemaResolver) {
  const hbsTemplate = getHbsTemplateDelegate(resolver, "zod-extended");

  return hbsTemplate({
    zodImport: ZOD_IMPORT,
    zodExtendedNamespace: ZOD_EXTENDED.namespace,
    parse: ZOD_EXTENDED.exports.parse,
    sortExp: ZOD_EXTENDED.exports.sortExp,
    errorHandler: ERROR_HANDLERS.ErrorHandler,
    sharedErrorHandler: ERROR_HANDLERS.SharedErrorHandler,
    errorHandlingImport: {
      ...ERROR_HANDLING_IMPORT,
      from: resolver.options.errorHandlingImportPath,
    },
  });
}
