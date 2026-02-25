import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { CustomersModels } from "./customers.models";

export namespace CustomersApi {
export const findProfile = (config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: CustomersModels.CustomerProfileResponseDTOSchema },
        `/customers/me`,
        config
    )
};
export const create = (data: CustomersModels.CreateCustomerDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: CustomersModels.CustomerResponseDTOSchema },
        `/customers`,
        ZodExtended.parse(CustomersModels.CreateCustomerDTOSchema, data),
        config
    )
};
export const list = (limit: number, order?: string, filter?: CustomersModels.CustomerPaginationFilterDto, page?: number, cursor?: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: CustomersModels.CustomersListResponseSchema },
        `/customers`,
        {
            ...config,
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(CustomersModels.CustomersListOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(CustomersModels.CustomerPaginationFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).describe("Items per response").default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().describe("1-indexed page number to begin from").nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().describe("ID of item to start after").nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const findById = (customerId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: CustomersModels.CustomerResponseDTOSchema },
        `/customers/${customerId}`,
        config
    )
};
export const update = (customerId: string, data: CustomersModels.UpdateCustomerDTO, config?: AxiosRequestConfig) => {
    return AppRestClient.put(
        { resSchema: CustomersModels.CustomerResponseDTOSchema },
        `/customers/${customerId}`,
        ZodExtended.parse(CustomersModels.UpdateCustomerDTOSchema, data),
        config
    )
};
export const deactivate = (id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: CustomersModels.CustomerResponseDTOSchema },
        `/customers/${id}/deactivate`,
        undefined,
        config
    )
};
export const reactivate = (id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: CustomersModels.CustomerResponseDTOSchema },
        `/customers/${id}/reactivate`,
        undefined,
        config
    )
};
}
