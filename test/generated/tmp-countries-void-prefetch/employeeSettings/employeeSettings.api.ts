import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { EmployeeSettingsModels } from "./employeeSettings.models";

export namespace EmployeeSettingsApi {
export const getAll = () => {
    return AppRestClient.get(
        { resSchema: EmployeeSettingsModels.EmployeeSettingsResponseDtoSchema },
        `/employees/settings`,
        
    )
};
export const update = (key: string, data: EmployeeSettingsModels.UpdateEmployeeSettingDto, ) => {
    return AppRestClient.patch(
        { resSchema: z.void() },
        `/employees/settings/${key}`,
        ZodExtended.parse(EmployeeSettingsModels.UpdateEmployeeSettingDtoSchema, data),
        
    )
};
}
