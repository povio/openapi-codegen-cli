import { APP_REST_CLIENT_NAME } from "src/generators/const/deps.const";
import { SchemaResolver } from "src/generators/core/SchemaResolver.class";
import { getHbsTemplateDelegate } from "src/generators/utils/hbs/hbs-template.utils";
import { PACKAGE_IMPORT_PATH } from "src/generators/const/package.const";

export function generateAppRestClient(resolver: SchemaResolver) {
  const hbsTemplate = getHbsTemplateDelegate(resolver, "app-rest-client");

  return hbsTemplate({
    appRestClientName: APP_REST_CLIENT_NAME,
    baseUrl: resolver.getBaseUrl(),
    restClientImportPath: PACKAGE_IMPORT_PATH,
  });
}
