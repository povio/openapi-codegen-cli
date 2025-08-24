import { ERROR_HANDLERS, ERROR_HANDLING_IMPORT, ZOD_EXTENDED } from "src/generators/const/deps.const";
import { ZOD_IMPORT } from "src/generators/const/zod.const";
import { SchemaResolver } from "src/generators/core/SchemaResolver.class";
import { getHbsTemplateDelegate } from "src/generators/utils/hbs/hbs-template.utils";

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
