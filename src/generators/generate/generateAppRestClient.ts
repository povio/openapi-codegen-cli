import { APP_REST_CLIENT_NAME } from "@/generators/const/deps.const";
import { PACKAGE_IMPORT_PATH } from "@/generators/const/package.const";
import { SchemaResolver } from "@/generators/core/SchemaResolver.class";

export function generateAppRestClient(resolver: SchemaResolver) {
  return `import { RestClient } from "${PACKAGE_IMPORT_PATH}";

export const ${APP_REST_CLIENT_NAME} = new RestClient({
  config: {
    baseURL: "${resolver.getBaseUrl()}"
  },
});
`;
}
