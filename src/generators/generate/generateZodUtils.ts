import { ERROR_HANDLERS, ERROR_HANDLING_IMPORT, ZOD_UTILS } from "src/generators/const/deps.const";
import { ZOD_IMPORT } from "src/generators/const/zod.const";
import { SchemaResolver } from "src/generators/core/SchemaResolver.class";
import { getHbsTemplateDelegate } from "src/generators/utils/hbs/hbs-template.utils";

export function generateZodUtils(resolver: SchemaResolver) {
  const hbsTemplate = getHbsTemplateDelegate(resolver, "zod-utils");

  return hbsTemplate({
    zodImport: ZOD_IMPORT,
    zodUtilsNamespace: ZOD_UTILS.namespace,
    parse: ZOD_UTILS.exports.parse,
    sortExp: ZOD_UTILS.exports.sortExp,
    brand: ZOD_UTILS.exports.brand,
    branded: resolver.options.branded,
    errorHandler: ERROR_HANDLERS.ErrorHandler,
    sharedErrorHandler: ERROR_HANDLERS.SharedErrorHandler,
    errorHandlingImport: {
      ...ERROR_HANDLING_IMPORT,
      from: resolver.options.errorHandlingImportPath,
    },
  });
}
