import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { CustomerAccountModels } from "./customerAccount.models";

export namespace CustomerAccountApi {
export const get = (config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: CustomerAccountModels.CustomerAccountDtoSchema },
        `/customers/account`,
        config
    )
};
}
