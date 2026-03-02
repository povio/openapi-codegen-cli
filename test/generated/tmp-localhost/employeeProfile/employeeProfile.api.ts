import { AppRestClient } from "@/data/app-rest-client";
import { ZodExtended } from "@/data/zod.extended";
import { EmployeeProfileModels } from "./employeeProfile.models";

export namespace EmployeeProfileApi {
export const getProfile = () => {
    return AppRestClient.get(
        { resSchema: EmployeeProfileModels.EmployeeProfileResponseDTOSchema },
        `/employee-profile`,
        
    )
};
export const updateProfile = (data: EmployeeProfileModels.UpdateEmployeeProfileRequestDTO, ) => {
    return AppRestClient.patch(
        { resSchema: EmployeeProfileModels.EmployeeProfileResponseDTOSchema },
        `/employee-profile`,
        ZodExtended.parse(EmployeeProfileModels.UpdateEmployeeProfileRequestDTOSchema, data),
        
    )
};
}
