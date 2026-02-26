import { AppRestClient } from "../app-rest-client";
import { z } from "zod";
import { ZodExtended } from "../zod.extended";
import { StoreModels } from "./store.models";

export namespace StoreApi {
export const getInventory = () => {
    return AppRestClient.get(
        { resSchema: StoreModels.GetInventoryResponseSchema },
        `/store/inventory`,
        
    )
};
export const placeOrder = (data: StoreModels.Order, ) => {
    return AppRestClient.post(
        { resSchema: StoreModels.OrderSchema },
        `/store/order`,
        ZodExtended.parse(StoreModels.OrderSchema.optional(), data),
        
    )
};
export const getOrderById = (orderId: number, ) => {
    return AppRestClient.get(
        { resSchema: StoreModels.OrderSchema },
        `/store/order/${orderId}`,
        
    )
};
export const deleteOrder = (orderId: number, ) => {
    return AppRestClient.delete(
        { resSchema: z.void() },
        `/store/order/${orderId}`,
        
    )
};
}
