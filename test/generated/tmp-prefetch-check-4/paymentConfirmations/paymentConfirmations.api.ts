import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { PaymentConfirmationsModels } from "./paymentConfirmations.models";

export namespace PaymentConfirmationsApi {
export const get = (officeId: string, filter: PaymentConfirmationsModels.PaymentConfirmationItemFilterDto, limit: number, order?: string, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: PaymentConfirmationsModels.PaymentConfirmationsGetResponseSchema },
        `/offices/${officeId}/payment-confirmations`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(PaymentConfirmationsModels.PaymentConfirmationsGetOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(PaymentConfirmationsModels.PaymentConfirmationItemFilterDtoSchema, filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const generate = (officeId: string, data: PaymentConfirmationsModels.GeneratePaymentConfirmationRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: z.instanceof(Blob) },
        `/offices/${officeId}/payment-confirmations/generate`,
        ZodExtended.parse(PaymentConfirmationsModels.GeneratePaymentConfirmationRequestDtoSchema, data),
        {
            headers: {
                'Accept': 'application/pdf',
            },
            responseType: "blob",
            rawResponse: true,
        }
    )
};
export const getEml = (officeId: string, data: PaymentConfirmationsModels.GeneratePaymentConfirmationRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: z.instanceof(Blob) },
        `/offices/${officeId}/payment-confirmations/eml`,
        ZodExtended.parse(PaymentConfirmationsModels.GeneratePaymentConfirmationRequestDtoSchema, data),
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
