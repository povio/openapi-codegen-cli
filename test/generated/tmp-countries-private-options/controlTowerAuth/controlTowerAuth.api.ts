import { AppRestClient } from "@/data/app-rest-client";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { ControlTowerAuthModels } from "./controlTowerAuth.models";

export namespace ControlTowerAuthApi {
export const login = (data: ControlTowerAuthModels.LoginRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: ControlTowerAuthModels.LoginResponseDtoSchema },
        `/auth/move/login`,
        ZodExtended.parse(ControlTowerAuthModels.LoginRequestDtoSchema, data),
        
    )
};
export const resetPassword = (data: ControlTowerAuthModels.PasswordResetDto, ) => {
    return AppRestClient.post(
        { resSchema: ControlTowerAuthModels.LoginResponseDtoSchema },
        `/auth/reset-password`,
        ZodExtended.parse(ControlTowerAuthModels.PasswordResetDtoSchema, data),
        
    )
};
}
