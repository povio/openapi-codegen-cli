import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { DunningAccountStatementModels } from "./dunningAccountStatement.models";
import { CommonModels } from "@/data/common/common.models";

export namespace DunningAccountStatementApi {
export const dataGenFake = () => {
    return AppRestClient.get(
        { resSchema: DunningAccountStatementModels.AccountStatementPdfPayloadDTOSchema },
        `/data-gen-fake/account-statement`,
        
    )
};
export const generateAccountStatement = (officeId: string, limit: number, order?: string, filter?: DunningAccountStatementModels.OfficeInvoiceFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: z.instanceof(Blob) },
        `/offices/${officeId}/invoices/account-statement`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(DunningAccountStatementModels.GenerateAccountStatementOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(DunningAccountStatementModels.OfficeInvoiceFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
            headers: {
                'Accept': 'application/pdf',
            },
            responseType: "blob",
            rawResponse: true,
        }
    )
};
export const getAccountStatementEml = (officeId: string, data: DunningAccountStatementModels.OfficeInvoiceListQueryDto, ) => {
    return AppRestClient.post(
        { resSchema: z.instanceof(Blob) },
        `/offices/${officeId}/invoices/account-statement/eml`,
        ZodExtended.parse(DunningAccountStatementModels.OfficeInvoiceListQueryDtoSchema, data),
        {
            headers: {
                'Accept': 'application/octet-stream',
            },
            responseType: "blob",
            rawResponse: true,
        }
    )
};
}
