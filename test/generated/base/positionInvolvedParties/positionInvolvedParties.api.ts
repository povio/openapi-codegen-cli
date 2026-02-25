import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { PositionInvolvedPartiesModels } from "./positionInvolvedParties.models";
import { CommonModels } from "@/data/common/common.models";

export namespace PositionInvolvedPartiesApi {
export const findByPositionId = (officeId: string, positionId: string, ) => {
    return AppRestClient.get(
        { resSchema: PositionInvolvedPartiesModels.FindByPositionIdResponseSchema },
        `/offices/${officeId}/positions/${positionId}/involved-parties`,
        
    )
};
export const create = (officeId: string, positionId: string, data: CommonModels.CreateInvolvedPartyRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: CommonModels.InvolvedPartyResponseDtoSchema },
        `/offices/${officeId}/positions/${positionId}/involved-parties`,
        ZodExtended.parse(CommonModels.CreateInvolvedPartyRequestDtoSchema, data),
        
    )
};
export const update = (officeId: string, positionId: string, partyId: string, data: CommonModels.UpdateInvolvedPartyDto, ) => {
    return AppRestClient.patch(
        { resSchema: CommonModels.InvolvedPartyResponseDtoSchema },
        `/offices/${officeId}/positions/${positionId}/involved-parties/${partyId}`,
        ZodExtended.parse(CommonModels.UpdateInvolvedPartyDtoSchema, data),
        
    )
};
export const deleteOfficesPositionsInvolvedPartiesByPartyId = (officeId: string, positionId: string, partyId: string, ) => {
    return AppRestClient.delete(
        { resSchema: z.void() },
        `/offices/${officeId}/positions/${positionId}/involved-parties/${partyId}`,
        
    )
};
}
