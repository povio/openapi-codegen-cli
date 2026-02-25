import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { EmployeeAccountModels } from "./employeeAccount.models";

export namespace EmployeeAccountApi {
  export const get = (config?: AxiosRequestConfig) => {
    return AppRestClient.get(
      { resSchema: EmployeeAccountModels.EmployeeAccountDtoSchema },
      `/employees/account`,
      config,
    );
  };
}
