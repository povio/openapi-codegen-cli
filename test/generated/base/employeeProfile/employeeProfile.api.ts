import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { ZodExtended } from "@/data/zod.extended";
import { EmployeeProfileModels } from "./employeeProfile.models";

export namespace EmployeeProfileApi {
  export const getProfile = (config?: AxiosRequestConfig) => {
    return AppRestClient.get(
      { resSchema: EmployeeProfileModels.EmployeeProfileResponseDTOSchema },
      `/employee-profile`,
      config,
    );
  };

  export const updateProfile = (
    data: EmployeeProfileModels.UpdateEmployeeProfileRequestDTO,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.patch(
      { resSchema: EmployeeProfileModels.EmployeeProfileResponseDTOSchema },
      `/employee-profile`,
      ZodExtended.parse(EmployeeProfileModels.UpdateEmployeeProfileRequestDTOSchema, data),
      config,
    );
  };
}
