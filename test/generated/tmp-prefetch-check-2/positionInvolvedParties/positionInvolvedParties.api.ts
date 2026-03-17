import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { PositionInvolvedPartiesModels } from "./positionInvolvedParties.models";
import { CommonModels } from "@/data/common/common.models";

export namespace PositionInvolvedPartiesApi {
export const findByPositionId = (officeId: string, positionId: string, ) => {
    return AppRestClient.get(
        { resSchema: PositionInvolvedPartiesModels.FindByPositionIdResponseSchema },
        `/offices/${officeId}/positions/${positionId}/involved-parties`,
        
    )
};
export const create = (officeId: string, positionId: string, data: PositionInvolvedPartiesModels.CreateInvolvedPartyRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: PositionInvolvedPartiesModels.InvolvedPartyResponseDtoSchema },
        `/offices/${officeId}/positions/${positionId}/involved-parties`,
        ZodExtended.parse(PositionInvolvedPartiesModels.CreateInvolvedPartyRequestDtoSchema, data),
        
    )
};
export const update = (officeId: string, positionId: string, partyId: string, data: PositionInvolvedPartiesModels.UpdateInvolvedPartyDto, ) => {
    return AppRestClient.patch(
        { resSchema: PositionInvolvedPartiesModels.InvolvedPartyResponseDtoSchema },
        `/offices/${officeId}/positions/${positionId}/involved-parties/${partyId}`,
        ZodExtended.parse(PositionInvolvedPartiesModels.UpdateInvolvedPartyDtoSchema, data),
        
    )
};
export const deleteOfficesPositionsInvolvedPartiesByPartyId = (officeId: string, positionId: string, partyId: string, ) => {
    return AppRestClient.delete(
        { resSchema: z.void() },
        `/offices/${officeId}/positions/${positionId}/involved-parties/${partyId}`,
        
    )
};
}
