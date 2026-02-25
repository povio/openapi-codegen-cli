import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { EmployeeSettingsModels } from "./employeeSettings.models";

export namespace EmployeeSettingsApi {
  export const getAll = (config?: AxiosRequestConfig) => {
    return AppRestClient.get(
      { resSchema: EmployeeSettingsModels.EmployeeSettingsResponseDtoSchema },
      `/employees/settings`,
      config,
    );
  };

  export const update = (
    key: string,
    data: EmployeeSettingsModels.UpdateEmployeeSettingDto,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.patch(
      { resSchema: z.void() },
      `/employees/settings/${key}`,
      ZodExtended.parse(EmployeeSettingsModels.UpdateEmployeeSettingDtoSchema, data),
      config,
    );
  };
}
