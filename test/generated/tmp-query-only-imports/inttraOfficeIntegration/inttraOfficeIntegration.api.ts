import { AppRestClient } from "@/data/app-rest-client";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { InttraOfficeIntegrationModels } from "./inttraOfficeIntegration.models";

export namespace InttraOfficeIntegrationApi {
export const get = (officeId: string, ) => {
    return AppRestClient.get(
        { resSchema: InttraOfficeIntegrationModels.OfficeInttraCredentialsResponseDtoSchema },
        `/offices/${officeId}/inttra/credentials`,
        
    )
};
export const generate = (officeId: string, ) => {
    return AppRestClient.post(
        { resSchema: InttraOfficeIntegrationModels.GenerateInttraCredentialsResponseDtoSchema },
        `/offices/${officeId}/inttra/credentials`,
        
    )
};
export const update = (officeId: string, data: InttraOfficeIntegrationModels.UpdateInttraCredentialsRequestDto, ) => {
    return AppRestClient.patch(
        { resSchema: InttraOfficeIntegrationModels.UpdateInttraCredentialsResponseDtoSchema },
        `/offices/${officeId}/inttra/credentials`,
        ZodExtended.parse(InttraOfficeIntegrationModels.UpdateInttraCredentialsRequestDtoSchema, data),
        
    )
};
}
