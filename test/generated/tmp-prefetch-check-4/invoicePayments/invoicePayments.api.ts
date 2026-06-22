import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { InvoicePaymentsModels } from "./invoicePayments.models";

export namespace InvoicePaymentsApi {
export const listOfficePayments = (officeId: string, limit: number, order?: string, filter?: InvoicePaymentsModels.OfficeInvoicePaymentFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: InvoicePaymentsModels.ListOfficePaymentsResponseSchema },
        `/offices/${officeId}/payments`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(InvoicePaymentsModels.ListOfficePaymentsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(InvoicePaymentsModels.OfficeInvoicePaymentFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const bulkCreatePayments = (officeId: string, data: InvoicePaymentsModels.BulkCreatePaymentsRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: InvoicePaymentsModels.BulkCreatePaymentsResponseDtoSchema },
        `/offices/${officeId}/payments`,
        ZodExtended.parse(InvoicePaymentsModels.BulkCreatePaymentsRequestDtoSchema, data),
        
    )
};
export const calculatePayments = (officeId: string, data: InvoicePaymentsModels.CalculatePaymentsRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: InvoicePaymentsModels.CalculatePaymentsResponseDtoSchema },
        `/offices/${officeId}/payments/calculate`,
        ZodExtended.parse(InvoicePaymentsModels.CalculatePaymentsRequestDtoSchema, data),
        
    )
};
export const exportOfficePayments = (officeId: string, data: InvoicePaymentsModels.OfficeInvoicePaymentExportRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: z.instanceof(Blob) },
        `/offices/${officeId}/payments/exports`,
        ZodExtended.parse(InvoicePaymentsModels.OfficeInvoicePaymentExportRequestDtoSchema, data),
        {
            headers: {
                'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            },
            responseType: "blob",
            rawResponse: true,
        }
    )
};
export const list = (officeId: string, invoiceId: string, limit: number, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: InvoicePaymentsModels.InvoicePaymentsListResponseSchema },
        `/offices/${officeId}/invoices/${invoiceId}/payments`,
        {
            params: {
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const create = (officeId: string, invoiceId: string, data: InvoicePaymentsModels.CreateInvoicePaymentRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: InvoicePaymentsModels.PaymentResponseDtoSchema },
        `/offices/${officeId}/invoices/${invoiceId}/payments`,
        ZodExtended.parse(InvoicePaymentsModels.CreateInvoicePaymentRequestDtoSchema, data),
        
    )
};
export const getPaymentById = (officeId: string, invoiceId: string, paymentId: string, ) => {
    return AppRestClient.get(
        { resSchema: InvoicePaymentsModels.PaymentResponseDtoSchema },
        `/offices/${officeId}/invoices/${invoiceId}/payments/${paymentId}`,
        
    )
};
export const update = (officeId: string, invoiceId: string, paymentId: string, data: InvoicePaymentsModels.UpdateInvoicePaymentRequestDto, ) => {
    return AppRestClient.patch(
        { resSchema: InvoicePaymentsModels.PaymentResponseDtoSchema },
        `/offices/${officeId}/invoices/${invoiceId}/payments/${paymentId}`,
        ZodExtended.parse(InvoicePaymentsModels.UpdateInvoicePaymentRequestDtoSchema, data),
        
    )
};
export const deleteInvoicePayment = (officeId: string, invoiceId: string, paymentId: string, ) => {
    return AppRestClient.delete(
        { resSchema: z.void() },
        `/offices/${officeId}/invoices/${invoiceId}/payments/${paymentId}`,
        
    )
};
}
