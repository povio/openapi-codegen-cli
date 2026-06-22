import { AppRestClient } from "@/data/app-rest-client";
import { PositionAccountModels } from "./positionAccount.models";

export namespace PositionAccountApi {
export const get = (positionId: string, officeId: string, ) => {
    return AppRestClient.get(
        { resSchema: PositionAccountModels.PositionAccountResponseDtoSchema },
        `/offices/${officeId}/positions/${positionId}/account`,
        
    )
};
}
