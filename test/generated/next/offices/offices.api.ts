import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { OfficesModels } from "./offices.models";

export namespace OfficesApi {
export const paginate = (limit: number, order?: string, filter?: OfficesModels.OfficeFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: OfficesModels.OfficesPaginateResponseSchema },
        `/offices`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(OfficesModels.OfficesPaginateOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(OfficesModels.OfficeFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const create = (data: OfficesModels.CreateOfficeRequest, ) => {
    return AppRestClient.post(
        { resSchema: OfficesModels.OfficeResponseDtoSchema },
        `/offices`,
        ZodExtended.parse(OfficesModels.CreateOfficeRequestSchema, data),
        
    )
};
export const findAllLabels = (search?: string, ) => {
    return AppRestClient.get(
        { resSchema: OfficesModels.FindAllLabelsResponseSchema },
        `/offices/labels`,
        {
            params: {
                search: ZodExtended.parse(z.string().nullish(), search, { type: "query", name: "search" }),
            },
        }
    )
};
export const paginateLabels = (limit: number, order?: string, filter?: OfficesModels.OfficeLabelFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: OfficesModels.OfficesPaginateLabelsResponseSchema },
        `/offices/labels/paginate`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(OfficesModels.OfficesPaginateLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(OfficesModels.OfficeLabelFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const get = (id: string, ) => {
    return AppRestClient.get(
        { resSchema: OfficesModels.OfficeDetailResponseDtoSchema },
        `/offices/${id}`,
        
    )
};
export const update = (id: string, data: OfficesModels.UpdateOfficeRequest, ) => {
    return AppRestClient.put(
        { resSchema: OfficesModels.OfficeResponseDtoSchema },
        `/offices/${id}`,
        ZodExtended.parse(OfficesModels.UpdateOfficeRequestSchema, data),
        
    )
};
export const uploadDocumentImage = (officeId: string, data: OfficesModels.UploadOfficeDocumentRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: OfficesModels.DocumentImageUploadInstructionsDtoSchema },
        `/offices/${officeId}/document-image`,
        ZodExtended.parse(OfficesModels.UploadOfficeDocumentRequestDtoSchema, data),
        
    )
};
export const createBankAccount = (officeId: string, data: OfficesModels.CreateOfficeBankAccountDto, ) => {
    return AppRestClient.post(
        { resSchema: OfficesModels.OfficeBankAccountResponseDtoSchema },
        `/offices/${officeId}/bank-accounts`,
        ZodExtended.parse(OfficesModels.CreateOfficeBankAccountDtoSchema, data),
        
    )
};
export const updateBankAccount = (accountId: string, officeId: string, data: OfficesModels.UpdateOfficeBankAccountDto, ) => {
    return AppRestClient.patch(
        { resSchema: OfficesModels.OfficeBankAccountResponseDtoSchema },
        `/offices/${officeId}/bank-accounts/${accountId}`,
        ZodExtended.parse(OfficesModels.UpdateOfficeBankAccountDtoSchema, data),
        
    )
};
export const deleteBankAccount = (accountId: string, officeId: string, ) => {
    return AppRestClient.delete(
        { resSchema: z.void() },
        `/offices/${officeId}/bank-accounts/${accountId}`,
        
    )
};
export const uploadBankAccountFooter = (accountId: string, officeId: string, data: OfficesModels.UploadOfficeBankAccountFooterRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: OfficesModels.DocumentImageUploadInstructionsDtoSchema },
        `/offices/${officeId}/bank-accounts/${accountId}/footer`,
        ZodExtended.parse(OfficesModels.UploadOfficeBankAccountFooterRequestDtoSchema, data),
        
    )
};
}
