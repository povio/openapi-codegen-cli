import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { BankAccountsModels } from "./bankAccounts.models";

export namespace BankAccountsApi {
export const findAll = (search?: string, officeId?: string, ) => {
    return AppRestClient.get(
        { resSchema: BankAccountsModels.BankAccountsFindAllResponseSchema },
        `/bank-accounts/labels`,
        {
            params: {
                search: ZodExtended.parse(z.string().nullish(), search, { type: "query", name: "search" }),
                officeId: ZodExtended.parse(z.string().nullish(), officeId, { type: "query", name: "officeId" }),
            },
        }
    )
};
export const paginateLabels = (limit: number, order?: string, filter?: BankAccountsModels.BankAccountFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: BankAccountsModels.BankAccountsPaginateLabelsResponseSchema },
        `/bank-accounts/labels/paginate`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(BankAccountsModels.BankAccountsPaginateLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(BankAccountsModels.BankAccountFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
}
