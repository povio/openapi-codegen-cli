import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { InvoicePaymentsModels } from "./invoicePayments.models";

export namespace InvoicePaymentsApi {
export const listOfficePayments = (officeId: string, limit: number, order?: string, filter?: InvoicePaymentsModels.OfficeInvoicePaymentFilterDto, page?: number, cursor?: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: InvoicePaymentsModels.ListOfficePaymentsResponseSchema },
        `/offices/${officeId}/payments`,
        {
            ...config,
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(InvoicePaymentsModels.ListOfficePaymentsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(InvoicePaymentsModels.OfficeInvoicePaymentFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).describe("Items per response").default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().describe("1-indexed page number to begin from").nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().describe("ID of item to start after").nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const bulkCreatePayments = (officeId: string, data: InvoicePaymentsModels.BulkCreatePaymentsRequestDto, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: InvoicePaymentsModels.BulkCreatePaymentsResponseDtoSchema },
        `/offices/${officeId}/payments`,
        ZodExtended.parse(InvoicePaymentsModels.BulkCreatePaymentsRequestDtoSchema, data),
        config
    )
};
export const calculatePayments = (officeId: string, data: InvoicePaymentsModels.CalculatePaymentsRequestDto, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: InvoicePaymentsModels.CalculatePaymentsResponseDtoSchema },
        `/offices/${officeId}/payments/calculate`,
        ZodExtended.parse(InvoicePaymentsModels.CalculatePaymentsRequestDtoSchema, data),
        config
    )
};
export const exportOfficePayments = (officeId: string, data: InvoicePaymentsModels.OfficeInvoicePaymentExportRequestDto, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: z.instanceof(Blob) },
        `/offices/${officeId}/payments/exports`,
        ZodExtended.parse(InvoicePaymentsModels.OfficeInvoicePaymentExportRequestDtoSchema, data),
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
export const list = (officeId: string, invoiceId: string, limit: number, page?: number, cursor?: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: InvoicePaymentsModels.InvoicePaymentsListResponseSchema },
        `/offices/${officeId}/invoices/${invoiceId}/payments`,
        {
            ...config,
            params: {
                limit: ZodExtended.parse(z.number().gte(1).lte(100).describe("Items per response").default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().describe("1-indexed page number to begin from").nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().describe("ID of item to start after").nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const create = (officeId: string, invoiceId: string, data: InvoicePaymentsModels.CreateInvoicePaymentRequestDto, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: InvoicePaymentsModels.PaymentResponseDtoSchema },
        `/offices/${officeId}/invoices/${invoiceId}/payments`,
        ZodExtended.parse(InvoicePaymentsModels.CreateInvoicePaymentRequestDtoSchema, data),
        config
    )
};
export const getPaymentById = (officeId: string, invoiceId: string, paymentId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: InvoicePaymentsModels.PaymentResponseDtoSchema },
        `/offices/${officeId}/invoices/${invoiceId}/payments/${paymentId}`,
        config
    )
};
export const update = (officeId: string, invoiceId: string, paymentId: string, data: InvoicePaymentsModels.UpdateInvoicePaymentRequestDto, config?: AxiosRequestConfig) => {
    return AppRestClient.patch(
        { resSchema: InvoicePaymentsModels.PaymentResponseDtoSchema },
        `/offices/${officeId}/invoices/${invoiceId}/payments/${paymentId}`,
        ZodExtended.parse(InvoicePaymentsModels.UpdateInvoicePaymentRequestDtoSchema, data),
        config
    )
};
export const deleteInvoicePayment = (officeId: string, invoiceId: string, paymentId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.delete(
        { resSchema: z.void() },
        `/offices/${officeId}/invoices/${invoiceId}/payments/${paymentId}`,
        undefined,
        config
    )
};
}
