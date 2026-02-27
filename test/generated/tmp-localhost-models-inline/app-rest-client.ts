import { RestClient } from "@povio/openapi-codegen-cli";

export const AppRestClient = new RestClient({
  config: {
    baseURL: "http://localhost:4000"
  },
});
