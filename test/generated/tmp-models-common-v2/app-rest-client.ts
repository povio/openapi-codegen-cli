import { RestClient } from "@povio/openapi-codegen-cli";

export const AppRestClient = new RestClient({
  config: {
    baseURL: "https://petstore3.swagger.io/api/v3"
  },
});
