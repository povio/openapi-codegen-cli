import { AppRestClient } from "@/data/app-rest-client";
import { CustomerAccountModels } from "./customerAccount.models";

export namespace CustomerAccountApi {
export const get = () => {
    return AppRestClient.get(
        { resSchema: CustomerAccountModels.CustomerAccountDtoSchema },
        `/customers/account`,
        
    )
};
}
