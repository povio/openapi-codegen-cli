import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { PositionCargoModels } from "./positionCargo.models";
import { CommonModels } from "@/data/common/common.models";

export namespace PositionCargoApi {
export const listCargosByPositionId = (officeId: string, positionId: string, limit: number, order?: PositionCargoModels.ListCargosByPositionIdOrderParam, page?: number, cursor?: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: PositionCargoModels.ListCargosByPositionIdResponseSchema },
        `/offices/${officeId}/positions/${positionId}/cargos`,
        {
            ...config,
            params: {
                order: ZodExtended.parse(PositionCargoModels.ListCargosByPositionIdOrderParamSchema.optional(), order, { type: "query", name: "order" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).describe("Items per response").default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().describe("1-indexed page number to begin from").nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().describe("ID of item to start after").nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const createCargo = (officeId: string, positionId: string, data: CommonModels.CreatePositionCargoDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: CommonModels.PositionCargoResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/cargos`,
        ZodExtended.parse(CommonModels.CreatePositionCargoDTOSchema, data),
        config
    )
};
export const listCargoLabels = (officeId: string, positionId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: PositionCargoModels.PositionCargoListCargoLabelsResponseSchema },
        `/offices/${officeId}/positions/${positionId}/cargos/labels`,
        config
    )
};
export const getCargoSummary = (officeId: string, positionId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: PositionCargoModels.PositionCargoGetCargoSummaryResponseSchema },
        `/offices/${officeId}/positions/${positionId}/cargos/summary`,
        config
    )
};
export const getCargoById = (officeId: string, positionId: string, cargoId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: CommonModels.PositionCargoResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/cargos/${cargoId}`,
        config
    )
};
export const updateCargo = (officeId: string, positionId: string, cargoId: string, data: CommonModels.UpdatePositionCargoDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.patch(
        { resSchema: CommonModels.PositionCargoResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/cargos/${cargoId}`,
        ZodExtended.parse(CommonModels.UpdatePositionCargoDTOSchema, data),
        config
    )
};
export const deleteCargo = (officeId: string, positionId: string, cargoId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.delete(
        { resSchema: z.void() },
        `/offices/${officeId}/positions/${positionId}/cargos/${cargoId}`,
        undefined,
        config
    )
};
export const createBulkCargos = (numberOfCargos: number, officeId: string, positionId: string, data: CommonModels.CreatePositionCargoDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: PositionCargoModels.PositionCargoCreateBulkCargosResponseSchema },
        `/offices/${officeId}/positions/${positionId}/cargos/bulk/${numberOfCargos}`,
        ZodExtended.parse(CommonModels.CreatePositionCargoDTOSchema, data),
        config
    )
};
export const duplicateCargo = (officeId: string, positionId: string, cargoId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: CommonModels.PositionCargoResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/cargos/${cargoId}/duplicate`,
        undefined,
        config
    )
};
}
