import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { PositionCargoModels } from "./positionCargo.models";
import { CommonModels } from "@/data/common/common.models";

export namespace PositionCargoApi {
export const listCargosByPositionId = (officeId: string, positionId: string, limit: number, order?: PositionCargoModels.ListCargosByPositionIdOrderParam, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: PositionCargoModels.ListCargosByPositionIdResponseSchema },
        `/offices/${officeId}/positions/${positionId}/cargos`,
        {
            params: {
                order: ZodExtended.parse(PositionCargoModels.ListCargosByPositionIdOrderParamSchema.optional(), order, { type: "query", name: "order" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const createCargo = (officeId: string, positionId: string, data: PositionCargoModels.CreatePositionCargoDTO, ) => {
    return AppRestClient.post(
        { resSchema: PositionCargoModels.PositionCargoResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/cargos`,
        ZodExtended.parse(PositionCargoModels.CreatePositionCargoDTOSchema, data),
        
    )
};
export const listCargoLabels = (officeId: string, positionId: string, ) => {
    return AppRestClient.get(
        { resSchema: PositionCargoModels.PositionCargoListCargoLabelsResponseSchema },
        `/offices/${officeId}/positions/${positionId}/cargos/labels`,
        
    )
};
export const getCargoSummary = (officeId: string, positionId: string, ) => {
    return AppRestClient.get(
        { resSchema: PositionCargoModels.PositionCargoGetCargoSummaryResponseSchema },
        `/offices/${officeId}/positions/${positionId}/cargos/summary`,
        
    )
};
export const getCargoById = (officeId: string, positionId: string, cargoId: string, ) => {
    return AppRestClient.get(
        { resSchema: PositionCargoModels.PositionCargoResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/cargos/${cargoId}`,
        
    )
};
export const updateCargo = (officeId: string, positionId: string, cargoId: string, data: PositionCargoModels.UpdatePositionCargoDTO, ) => {
    return AppRestClient.patch(
        { resSchema: PositionCargoModels.PositionCargoResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/cargos/${cargoId}`,
        ZodExtended.parse(PositionCargoModels.UpdatePositionCargoDTOSchema, data),
        
    )
};
export const deleteCargo = (officeId: string, positionId: string, cargoId: string, ) => {
    return AppRestClient.delete(
        { resSchema: z.void() },
        `/offices/${officeId}/positions/${positionId}/cargos/${cargoId}`,
        
    )
};
export const createBulkCargos = (numberOfCargos: number, officeId: string, positionId: string, data: PositionCargoModels.CreatePositionCargoDTO, ) => {
    return AppRestClient.post(
        { resSchema: PositionCargoModels.PositionCargoCreateBulkCargosResponseSchema },
        `/offices/${officeId}/positions/${positionId}/cargos/bulk/${numberOfCargos}`,
        ZodExtended.parse(PositionCargoModels.CreatePositionCargoDTOSchema, data),
        
    )
};
export const duplicateCargo = (officeId: string, positionId: string, cargoId: string, ) => {
    return AppRestClient.post(
        { resSchema: PositionCargoModels.PositionCargoResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/cargos/${cargoId}/duplicate`,
        
    )
};
}
