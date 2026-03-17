import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { CustomersModels } from "./customers.models";

export namespace CustomersApi {
export const findProfile = () => {
    return AppRestClient.get(
        { resSchema: CustomersModels.CustomerProfileResponseDTOSchema },
        `/customers/me`,
        
    )
};
export const create = (data: CustomersModels.CreateCustomerDTO, ) => {
    return AppRestClient.post(
        { resSchema: CustomersModels.CustomerResponseDTOSchema },
        `/customers`,
        ZodExtended.parse(CustomersModels.CreateCustomerDTOSchema, data),
        
    )
};
export const list = (limit: number, order?: string, filter?: CustomersModels.CustomerPaginationFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: CustomersModels.CustomersListResponseSchema },
        `/customers`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(CustomersModels.CustomersListOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(CustomersModels.CustomerPaginationFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const findById = (customerId: string, ) => {
    return AppRestClient.get(
        { resSchema: CustomersModels.CustomerResponseDTOSchema },
        `/customers/${customerId}`,
        
    )
};
export const update = (customerId: string, data: CustomersModels.UpdateCustomerDTO, ) => {
    return AppRestClient.put(
        { resSchema: CustomersModels.CustomerResponseDTOSchema },
        `/customers/${customerId}`,
        ZodExtended.parse(CustomersModels.UpdateCustomerDTOSchema, data),
        
    )
};
export const deactivate = (id: string, ) => {
    return AppRestClient.post(
        { resSchema: CustomersModels.CustomerResponseDTOSchema },
        `/customers/${id}/deactivate`,
        
    )
};
export const reactivate = (id: string, ) => {
    return AppRestClient.post(
        { resSchema: CustomersModels.CustomerResponseDTOSchema },
        `/customers/${id}/reactivate`,
        
    )
};
}
