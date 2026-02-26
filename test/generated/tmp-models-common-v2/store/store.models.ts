import { CommonModels } from "../common/common.models";

export namespace StoreModels {
  export const GetInventoryResponseSchema = CommonModels.GetInventoryResponseSchema;
  export const OrderSchema = CommonModels.OrderSchema;
  export const OrderStatusEnumSchema = CommonModels.OrderStatusEnumSchema;
  export type GetInventoryResponse = CommonModels.GetInventoryResponse;
  export type Order = CommonModels.Order;
  export type OrderStatusEnum = CommonModels.OrderStatusEnum;
  export const OrderStatusEnum = CommonModels.OrderStatusEnum;
}
