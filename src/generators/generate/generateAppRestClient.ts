import { APP_REST_CLIENT_NAME } from "@/generators/const/deps.const";
import { PACKAGE_IMPORT_PATH } from "@/generators/const/package.const";
import { SchemaResolver } from "@/generators/core/SchemaResolver.class";
import { getHbsTemplateDelegate } from "@/generators/utils/hbs/hbs-template.utils";

export function generateAppRestClient(resolver: SchemaResolver) {
  const hbsTemplate = getHbsTemplateDelegate(resolver, "app-rest-client");

  return hbsTemplate({
    appRestClientName: APP_REST_CLIENT_NAME,
    baseUrl: resolver.getBaseUrl(),
    restClientImportPath: PACKAGE_IMPORT_PATH,
  });
}
