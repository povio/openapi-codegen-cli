import { APP_REST_CLIENT_NAME } from "../const/deps.const";
import { SchemaResolver } from "../core/SchemaResolver.class";
import { getHbsTemplateDelegate } from "../utils/hbs/hbs-template.utils";

export function generateAppRestClient(resolver: SchemaResolver) {
  const hbsTemplate = getHbsTemplateDelegate(resolver, "app-rest-client");

  return hbsTemplate({
    appRestClientName: APP_REST_CLIENT_NAME,
    baseUrl: resolver.getBaseUrl(),
  });
}
