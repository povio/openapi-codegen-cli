import { APP_REST_CLIENT_NAME } from "@/generators/const/deps.const";
import { NATIVE_PACKAGE_IMPORT_PATH, PACKAGE_IMPORT_PATH } from "@/generators/const/package.const";
import { SchemaResolver } from "@/generators/core/SchemaResolver.class";

export function generateAppRestClient(resolver: SchemaResolver) {
  const clientName = resolver.options.restClient === "native" ? "NativeRestClient" : "RestClient";
  const importPath = resolver.options.restClient === "native" ? NATIVE_PACKAGE_IMPORT_PATH : PACKAGE_IMPORT_PATH;
  return `import { ${clientName} } from "${importPath}";

export const ${APP_REST_CLIENT_NAME} = new ${clientName}({
  config: {
    baseURL: "${resolver.getBaseUrl()}"
  },
});
`;
}
