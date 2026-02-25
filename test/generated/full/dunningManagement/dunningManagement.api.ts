import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { DunningManagementModels } from "./dunningManagement.models";

export namespace DunningManagementApi {
export const listDunnings = (officeId: string, limit: number, order?: string, filter?: DunningManagementModels.DunningFilterDto, page?: number, cursor?: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: DunningManagementModels.ListDunningsResponseSchema },
        `/offices/${officeId}/dunnings`,
        {
            ...config,
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(DunningManagementModels.ListDunningsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(DunningManagementModels.DunningFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).describe("Items per response").default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().describe("1-indexed page number to begin from").nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().describe("ID of item to start after").nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const createDunningWithInvoices = (partnerId: string, officeId: string, data: DunningManagementModels.CreateDunningWithInvoicesRequestDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: DunningManagementModels.DunningResponseDtoSchema },
        `/offices/${officeId}/partners/${partnerId}/dunnings`,
        ZodExtended.parse(DunningManagementModels.CreateDunningWithInvoicesRequestDTOSchema, data),
        config
    )
};
export const dataGenFake = (config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: DunningManagementModels.DunningPdfPayloadDTOSchema },
        `/data-gen-fake`,
        config
    )
};
export const getDunningEml = (officeId: string, dunningId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: z.instanceof(Blob) },
        `/offices/${officeId}/dunnings/${dunningId}/eml`,
        {
            ...config,
            headers: {
                'Accept': 'application/octet-stream',
            },
            responseType: "blob",
            rawResponse: true,
        }
    )
};
}
