import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { InvoicesModels } from "./invoices.models";
import { CommonModels } from "@/data/common/common.models";

export namespace InvoicesApi {
export const getInvoicesEml = (officeId: string, invoiceIds?: InvoicesModels.GetInvoicesEmlInvoiceIdsParam, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: z.instanceof(Blob) },
        `/offices/${officeId}/invoices/eml`,
        {
            ...config,
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
export const find = (officeId: string, positionId: string, limit: number, order?: string, filter?: InvoicesModels.InvoiceFilterDto, page?: number, cursor?: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: InvoicesModels.InvoicesFindResponseSchema },
        `/offices/${officeId}/positions/${positionId}/invoices`,
        {
            ...config,
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(InvoicesModels.InvoicesFindOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(InvoicesModels.InvoiceFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).describe("Items per response").default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().describe("1-indexed page number to begin from").nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().describe("ID of item to start after").nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const changeIncomingCustomer = (officeId: string, invoiceId: string, data: InvoicesModels.ChangeInvoiceCustomerRequestDto, config?: AxiosRequestConfig) => {
    return AppRestClient.patch(
        { resSchema: InvoicesModels.InvoiceDetailDtoSchema },
        `/offices/${officeId}/invoices/${invoiceId}/customer`,
        ZodExtended.parse(InvoicesModels.ChangeInvoiceCustomerRequestDtoSchema, data),
        config
    )
};
export const findByOffice = (officeId: string, limit: number, order?: string, filter?: CommonModels.OfficeInvoiceFilterDto, page?: number, cursor?: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: InvoicesModels.FindByOfficeResponseSchema },
        `/offices/${officeId}/invoices`,
        {
            ...config,
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(InvoicesModels.FindByOfficeOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(CommonModels.OfficeInvoiceFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).describe("Items per response").default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().describe("1-indexed page number to begin from").nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().describe("ID of item to start after").nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const createDraft = (officeId: string, data: InvoicesModels.CreateDraftInvoiceRequestDto, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: InvoicesModels.InvoiceDetailDtoSchema },
        `/offices/${officeId}/invoices`,
        ZodExtended.parse(InvoicesModels.CreateDraftInvoiceRequestDtoSchema, data),
        config
    )
};
export const exportInvoices = (officeId: string, data: InvoicesModels.InvoiceExportRequestDto, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: z.instanceof(Blob) },
        `/offices/${officeId}/invoices/exports`,
        ZodExtended.parse(InvoicesModels.InvoiceExportRequestDtoSchema, data),
        {
            ...config,
            headers: {
                'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            },
            responseType: "blob",
            rawResponse: true,
        }
    )
};
export const exportCharges = (officeId: string, data: InvoicesModels.InvoiceExportRequestDto, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: z.instanceof(Blob) },
        `/offices/${officeId}/invoices/charges/exports`,
        ZodExtended.parse(InvoicesModels.InvoiceExportRequestDtoSchema, data),
        {
            ...config,
            headers: {
                'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            },
            responseType: "blob",
            rawResponse: true,
        }
    )
};
export const getUnCharges = (officeId: string, positionId: string, limit: number, order?: string, filter?: InvoicesModels.UninvoicedChargePaginationDto, page?: number, cursor?: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: InvoicesModels.GetUnChargesResponseSchema },
        `/offices/${officeId}/positions/${positionId}/uninvoiced-charges`,
        {
            ...config,
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(InvoicesModels.GetUnChargesOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(InvoicesModels.UninvoicedChargePaginationDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).describe("Items per response").default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().describe("1-indexed page number to begin from").nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().describe("ID of item to start after").nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const listAvailablePartnersFor = (officeId: string, invoiceId: string, search?: string, useCase?: CommonModels.PositionAvailablePartnersUseCase, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: InvoicesModels.InvoicesListAvailablePartnersForResponseSchema },
        `/offices/${officeId}/invoices/${invoiceId}/available-partners`,
        {
            ...config,
            params: {
                search: ZodExtended.parse(z.string().nullish(), search, { type: "query", name: "search" }),
                useCase: ZodExtended.parse(CommonModels.PositionAvailablePartnersUseCaseSchema.optional(), useCase, { type: "query", name: "useCase" }),
            },
        }
    )
};
export const getOfficeUnCharges = (officeId: string, limit: number, order?: string, filter?: InvoicesModels.UninvoicedChargesFilterDto, page?: number, cursor?: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: InvoicesModels.GetOfficeUnChargesResponseSchema },
        `/offices/${officeId}/uninvoiced-charges`,
        {
            ...config,
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(InvoicesModels.GetOfficeUnChargesOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(InvoicesModels.UninvoicedChargesFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).describe("Items per response").default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().describe("1-indexed page number to begin from").nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().describe("ID of item to start after").nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const exportUnCharges = (officeId: string, data: InvoicesModels.UninvoicedChargesExportRequestDto, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: z.instanceof(Blob) },
        `/offices/${officeId}/uninvoiced-charges/exports`,
        ZodExtended.parse(InvoicesModels.UninvoicedChargesExportRequestDtoSchema, data),
        {
            ...config,
            headers: {
                'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            },
            responseType: "blob",
            rawResponse: true,
        }
    )
};
export const createDirect = (officeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/direct-invoices`,
        undefined,
        config
    )
};
export const addChargeToDirect = (officeId: string, invoiceId: string, data: InvoicesModels.CreateDirectInvoiceChargeRequestDto, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: InvoicesModels.InvoiceDetailDtoSchema },
        `/offices/${officeId}/invoices/${invoiceId}/charges`,
        ZodExtended.parse(InvoicesModels.CreateDirectInvoiceChargeRequestDtoSchema, data),
        config
    )
};
export const updateCharges = (officeId: string, invoiceId: string, data: InvoicesModels.UpdateInvoiceChargesRequestDto, config?: AxiosRequestConfig) => {
    return AppRestClient.patch(
        { resSchema: InvoicesModels.InvoiceDetailDtoSchema },
        `/offices/${officeId}/invoices/${invoiceId}/charges`,
        ZodExtended.parse(InvoicesModels.UpdateInvoiceChargesRequestDtoSchema, data),
        config
    )
};
export const removeChargeFromDirect = (officeId: string, invoiceId: string, chargeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.delete(
        { resSchema: InvoicesModels.InvoiceDetailDtoSchema },
        `/offices/${officeId}/invoices/${invoiceId}/charges/${chargeId}`,
        undefined,
        config
    )
};
export const getDetail = (officeId: string, invoiceId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: InvoicesModels.InvoiceDetailDtoSchema },
        `/offices/${officeId}/invoices/${invoiceId}`,
        config
    )
};
export const update = (officeId: string, invoiceId: string, data: InvoicesModels.UpdateInvoiceRequestDto, config?: AxiosRequestConfig) => {
    return AppRestClient.patch(
        { resSchema: InvoicesModels.InvoiceDetailDtoSchema },
        `/offices/${officeId}/invoices/${invoiceId}`,
        ZodExtended.parse(InvoicesModels.UpdateInvoiceRequestDtoSchema, data),
        config
    )
};
export const deleteInvoice = (officeId: string, invoiceId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.delete(
        { resSchema: z.void() },
        `/offices/${officeId}/invoices/${invoiceId}`,
        undefined,
        config
    )
};
export const fix = (officeId: string, invoiceId: string, data: InvoicesModels.FixInvoiceRequestDto, config?: AxiosRequestConfig) => {
    return AppRestClient.patch(
        { resSchema: InvoicesModels.InvoiceDetailDtoSchema },
        `/offices/${officeId}/invoices/${invoiceId}/fix`,
        ZodExtended.parse(InvoicesModels.FixInvoiceRequestDtoSchema, data),
        config
    )
};
export const generate = (officeId: string, invoiceId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/invoices/${invoiceId}/document`,
        undefined,
        config
    )
};
export const updateIssuedVatRules = (officeId: string, invoiceId: string, data: InvoicesModels.UpdateIssuedInvoiceVatRulesRequestDto, config?: AxiosRequestConfig) => {
    return AppRestClient.patch(
        { resSchema: InvoicesModels.InvoiceDetailDtoSchema },
        `/offices/${officeId}/invoices/${invoiceId}/fix/charges/vat-rules`,
        ZodExtended.parse(InvoicesModels.UpdateIssuedInvoiceVatRulesRequestDtoSchema, data),
        config
    )
};
export const updateIssuedCharges = (officeId: string, invoiceId: string, data: InvoicesModels.UpdateIssuedInvoiceChargesRequestDto, config?: AxiosRequestConfig) => {
    return AppRestClient.patch(
        { resSchema: InvoicesModels.InvoiceDetailDtoSchema },
        `/offices/${officeId}/invoices/${invoiceId}/fix/charges`,
        ZodExtended.parse(InvoicesModels.UpdateIssuedInvoiceChargesRequestDtoSchema, data),
        config
    )
};
export const issue = (officeId: string, invoiceId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: z.instanceof(Blob) },
        `/offices/${officeId}/invoices/${invoiceId}/issue`,
        undefined,
        {
            ...config,
            headers: {
                'Accept': 'application/pdf',
            },
            responseType: "blob",
            rawResponse: true,
        }
    )
};
export const reportHungarian = (officeId: string, invoiceId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/invoices/${invoiceId}/hungarian-report`,
        undefined,
        config
    )
};
export const generateIncoming = (officeId: string, invoiceId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: z.instanceof(Blob) },
        `/offices/${officeId}/invoices/${invoiceId}/generate-incoming`,
        undefined,
        {
            ...config,
            headers: {
                'Accept': 'application/pdf',
            },
            responseType: "blob",
            rawResponse: true,
        }
    )
};
export const register = (officeId: string, invoiceId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: InvoicesModels.InvoiceDetailDtoSchema },
        `/offices/${officeId}/invoices/${invoiceId}/register`,
        undefined,
        config
    )
};
export const getPreview = (officeId: string, invoiceId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: z.instanceof(Blob) },
        `/offices/${officeId}/invoices/${invoiceId}/preview`,
        {
            ...config,
            headers: {
                'Accept': 'application/pdf',
            },
            responseType: "blob",
            rawResponse: true,
        }
    )
};
export const getInvoiceEml = (officeId: string, invoiceId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: z.instanceof(Blob) },
        `/offices/${officeId}/invoices/${invoiceId}/eml`,
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
export const prepareDocumentUpload = (officeId: string, invoiceId: string, data: InvoicesModels.PrepareUploadRequestDto, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: InvoicesModels.InvoiceUploadInstructionsDtoSchema },
        `/offices/${officeId}/invoices/${invoiceId}/upload-document`,
        ZodExtended.parse(InvoicesModels.PrepareUploadRequestDtoSchema, data),
        config
    )
};
export const cancel = (officeId: string, invoiceId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: InvoicesModels.InvoiceDetailDtoSchema },
        `/offices/${officeId}/invoices/${invoiceId}/cancel`,
        undefined,
        config
    )
};
export const issueCreditNote = (officeId: string, invoiceId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: InvoicesModels.InvoiceDetailDtoSchema },
        `/offices/${officeId}/invoices/${invoiceId}/credit-note/issue`,
        undefined,
        config
    )
};
}
