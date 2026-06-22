import { AppRestClient } from "@/data/app-rest-client";
import { EmployeeAccountModels } from "./employeeAccount.models";

export namespace EmployeeAccountApi {
export const get = () => {
    return AppRestClient.get(
        { resSchema: EmployeeAccountModels.EmployeeAccountDtoSchema },
        `/employees/account`,
        
    )
};
}
