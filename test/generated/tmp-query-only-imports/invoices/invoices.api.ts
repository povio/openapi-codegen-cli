import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { InvoicesModels } from "./invoices.models";
import { CommonModels } from "@/data/common/common.models";

export namespace InvoicesApi {
export const getInvoicesEml = (officeId: string, invoiceIds?: InvoicesModels.GetInvoicesEmlInvoiceIdsParam, ) => {
    return AppRestClient.get(
        { resSchema: z.instanceof(Blob) },
        `/offices/${officeId}/invoices/eml`,
        {
            params: {
                invoiceIds: ZodExtended.parse(InvoicesModels.GetInvoicesEmlInvoiceIdsParamSchema.optional(), invoiceIds, { type: "query", name: "invoiceIds" }),
            },
            headers: {
                'Accept': 'application/octet-stream',
            },
            responseType: "blob",
            rawResponse: true,
        }
    )
};
export const find = (officeId: string, positionId: string, limit: number, order?: string, filter?: InvoicesModels.InvoiceFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: InvoicesModels.InvoicesFindResponseSchema },
        `/offices/${officeId}/positions/${positionId}/invoices`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(InvoicesModels.InvoicesFindOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(InvoicesModels.InvoiceFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const changeIncomingCustomer = (officeId: string, invoiceId: string, data: InvoicesModels.ChangeInvoiceCustomerRequestDto, ) => {
    return AppRestClient.patch(
        { resSchema: InvoicesModels.InvoiceDetailDtoSchema },
        `/offices/${officeId}/invoices/${invoiceId}/customer`,
        ZodExtended.parse(InvoicesModels.ChangeInvoiceCustomerRequestDtoSchema, data),
        
    )
};
export const findByOffice = (officeId: string, limit: number, order?: string, filter?: InvoicesModels.OfficeInvoiceFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: InvoicesModels.FindByOfficeResponseSchema },
        `/offices/${officeId}/invoices`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(InvoicesModels.FindByOfficeOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(InvoicesModels.OfficeInvoiceFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const createDraft = (officeId: string, data: InvoicesModels.CreateDraftInvoiceRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: InvoicesModels.InvoiceDetailDtoSchema },
        `/offices/${officeId}/invoices`,
        ZodExtended.parse(InvoicesModels.CreateDraftInvoiceRequestDtoSchema, data),
        
    )
};
export const exportInvoices = (officeId: string, data: InvoicesModels.InvoiceExportRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: z.instanceof(Blob) },
        `/offices/${officeId}/invoices/exports`,
        ZodExtended.parse(InvoicesModels.InvoiceExportRequestDtoSchema, data),
        {
            headers: {
                'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            },
            responseType: "blob",
            rawResponse: true,
        }
    )
};
export const exportCharges = (officeId: string, data: InvoicesModels.InvoiceExportRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: z.instanceof(Blob) },
        `/offices/${officeId}/invoices/charges/exports`,
        ZodExtended.parse(InvoicesModels.InvoiceExportRequestDtoSchema, data),
        {
            headers: {
                'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            },
            responseType: "blob",
            rawResponse: true,
        }
    )
};
export const getUnCharges = (officeId: string, positionId: string, limit: number, order?: string, filter?: InvoicesModels.UninvoicedChargePaginationDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: InvoicesModels.GetUnChargesResponseSchema },
        `/offices/${officeId}/positions/${positionId}/uninvoiced-charges`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(InvoicesModels.GetUnChargesOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(InvoicesModels.UninvoicedChargePaginationDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const listAvailablePartnersFor = (officeId: string, invoiceId: string, search?: string, useCase?: InvoicesModels.PositionAvailablePartnersUseCase, ) => {
    return AppRestClient.get(
        { resSchema: InvoicesModels.InvoicesListAvailablePartnersForResponseSchema },
        `/offices/${officeId}/invoices/${invoiceId}/available-partners`,
        {
            params: {
                search: ZodExtended.parse(z.string().nullish(), search, { type: "query", name: "search" }),
                useCase: ZodExtended.parse(InvoicesModels.PositionAvailablePartnersUseCaseSchema.optional(), useCase, { type: "query", name: "useCase" }),
            },
        }
    )
};
export const getOfficeUnCharges = (officeId: string, limit: number, order?: string, filter?: InvoicesModels.UninvoicedChargesFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: InvoicesModels.GetOfficeUnChargesResponseSchema },
        `/offices/${officeId}/uninvoiced-charges`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(InvoicesModels.GetOfficeUnChargesOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(InvoicesModels.UninvoicedChargesFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const exportUnCharges = (officeId: string, data: InvoicesModels.UninvoicedChargesExportRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: z.instanceof(Blob) },
        `/offices/${officeId}/uninvoiced-charges/exports`,
        ZodExtended.parse(InvoicesModels.UninvoicedChargesExportRequestDtoSchema, data),
        {
            headers: {
                'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            },
            responseType: "blob",
            rawResponse: true,
        }
    )
};
export const createDirect = (officeId: string, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/direct-invoices`,
        
    )
};
export const addChargeToDirect = (officeId: string, invoiceId: string, data: InvoicesModels.CreateDirectInvoiceChargeRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: InvoicesModels.InvoiceDetailDtoSchema },
        `/offices/${officeId}/invoices/${invoiceId}/charges`,
        ZodExtended.parse(InvoicesModels.CreateDirectInvoiceChargeRequestDtoSchema, data),
        
    )
};
export const updateCharges = (officeId: string, invoiceId: string, data: InvoicesModels.UpdateInvoiceChargesRequestDto, ) => {
    return AppRestClient.patch(
        { resSchema: InvoicesModels.InvoiceDetailDtoSchema },
        `/offices/${officeId}/invoices/${invoiceId}/charges`,
        ZodExtended.parse(InvoicesModels.UpdateInvoiceChargesRequestDtoSchema, data),
        
    )
};
export const removeChargeFromDirect = (officeId: string, invoiceId: string, chargeId: string, ) => {
    return AppRestClient.delete(
        { resSchema: InvoicesModels.InvoiceDetailDtoSchema },
        `/offices/${officeId}/invoices/${invoiceId}/charges/${chargeId}`,
        
    )
};
export const getDetail = (officeId: string, invoiceId: string, ) => {
    return AppRestClient.get(
        { resSchema: InvoicesModels.InvoiceDetailDtoSchema },
        `/offices/${officeId}/invoices/${invoiceId}`,
        
    )
};
export const update = (officeId: string, invoiceId: string, data: InvoicesModels.UpdateInvoiceRequestDto, ) => {
    return AppRestClient.patch(
        { resSchema: InvoicesModels.InvoiceDetailDtoSchema },
        `/offices/${officeId}/invoices/${invoiceId}`,
        ZodExtended.parse(InvoicesModels.UpdateInvoiceRequestDtoSchema, data),
        
    )
};
export const deleteInvoice = (officeId: string, invoiceId: string, ) => {
    return AppRestClient.delete(
        { resSchema: z.void() },
        `/offices/${officeId}/invoices/${invoiceId}`,
        
    )
};
export const fix = (officeId: string, invoiceId: string, data: InvoicesModels.FixInvoiceRequestDto, ) => {
    return AppRestClient.patch(
        { resSchema: InvoicesModels.InvoiceDetailDtoSchema },
        `/offices/${officeId}/invoices/${invoiceId}/fix`,
        ZodExtended.parse(InvoicesModels.FixInvoiceRequestDtoSchema, data),
        
    )
};
export const generate = (officeId: string, invoiceId: string, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/invoices/${invoiceId}/document`,
        
    )
};
export const updateIssuedVatRules = (officeId: string, invoiceId: string, data: InvoicesModels.UpdateIssuedInvoiceVatRulesRequestDto, ) => {
    return AppRestClient.patch(
        { resSchema: InvoicesModels.InvoiceDetailDtoSchema },
        `/offices/${officeId}/invoices/${invoiceId}/fix/charges/vat-rules`,
        ZodExtended.parse(InvoicesModels.UpdateIssuedInvoiceVatRulesRequestDtoSchema, data),
        
    )
};
export const updateIssuedCharges = (officeId: string, invoiceId: string, data: InvoicesModels.UpdateIssuedInvoiceChargesRequestDto, ) => {
    return AppRestClient.patch(
        { resSchema: InvoicesModels.InvoiceDetailDtoSchema },
        `/offices/${officeId}/invoices/${invoiceId}/fix/charges`,
        ZodExtended.parse(InvoicesModels.UpdateIssuedInvoiceChargesRequestDtoSchema, data),
        
    )
};
export const issue = (officeId: string, invoiceId: string, ) => {
    return AppRestClient.post(
        { resSchema: z.instanceof(Blob) },
        `/offices/${officeId}/invoices/${invoiceId}/issue`,
        undefined,
        {
            headers: {
                'Accept': 'application/pdf',
            },
            responseType: "blob",
            rawResponse: true,
        }
    )
};
export const reportHungarian = (officeId: string, invoiceId: string, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/invoices/${invoiceId}/hungarian-report`,
        
    )
};
export const generateIncoming = (officeId: string, invoiceId: string, ) => {
    return AppRestClient.post(
        { resSchema: z.instanceof(Blob) },
        `/offices/${officeId}/invoices/${invoiceId}/generate-incoming`,
        undefined,
        {
            headers: {
                'Accept': 'application/pdf',
            },
            responseType: "blob",
            rawResponse: true,
        }
    )
};
export const register = (officeId: string, invoiceId: string, ) => {
    return AppRestClient.post(
        { resSchema: InvoicesModels.InvoiceDetailDtoSchema },
        `/offices/${officeId}/invoices/${invoiceId}/register`,
        
    )
};
export const getPreview = (officeId: string, invoiceId: string, ) => {
    return AppRestClient.get(
        { resSchema: z.instanceof(Blob) },
        `/offices/${officeId}/invoices/${invoiceId}/preview`,
        {
            headers: {
                'Accept': 'application/pdf',
            },
            responseType: "blob",
            rawResponse: true,
        }
    )
};
export const getInvoiceEml = (officeId: string, invoiceId: string, ) => {
    return AppRestClient.get(
        { resSchema: z.instanceof(Blob) },
        `/offices/${officeId}/invoices/${invoiceId}/eml`,
        {
            headers: {
                'Accept': 'application/octet-stream',
            },
            responseType: "blob",
            rawResponse: true,
        }
    )
};
export const prepareDocumentUpload = (officeId: string, invoiceId: string, data: InvoicesModels.PrepareUploadRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: InvoicesModels.InvoiceUploadInstructionsDtoSchema },
        `/offices/${officeId}/invoices/${invoiceId}/upload-document`,
        ZodExtended.parse(InvoicesModels.PrepareUploadRequestDtoSchema, data),
        
    )
};
export const cancel = (officeId: string, invoiceId: string, ) => {
    return AppRestClient.post(
        { resSchema: InvoicesModels.InvoiceDetailDtoSchema },
        `/offices/${officeId}/invoices/${invoiceId}/cancel`,
        
    )
};
export const issueCreditNote = (officeId: string, invoiceId: string, ) => {
    return AppRestClient.post(
        { resSchema: InvoicesModels.InvoiceDetailDtoSchema },
        `/offices/${officeId}/invoices/${invoiceId}/credit-note/issue`,
        
    )
};
}
