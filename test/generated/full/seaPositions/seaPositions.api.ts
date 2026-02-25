import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { ZodExtended } from "@/data/zod.extended";
import { SeaPositionsModels } from "./seaPositions.models";

export namespace SeaPositionsApi {
export const get = (officeId: string, positionId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: SeaPositionsModels.SeaPositionResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/sea-position`,
        config
    )
};
export const update = (officeId: string, positionId: string, data: SeaPositionsModels.UpdateSeaPositionRequestDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.patch(
        { resSchema: SeaPositionsModels.SeaPositionResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/sea-position`,
        ZodExtended.parse(SeaPositionsModels.UpdateSeaPositionRequestDTOSchema, data),
        config
    )
};
}
