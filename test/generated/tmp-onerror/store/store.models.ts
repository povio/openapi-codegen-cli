import { z } from "zod";

export namespace StoreModels {
/** 
 * OrderStatusEnumSchema 
 * @type { enum }
 * @description Order Status. Example: `approved`
 */
export const OrderStatusEnumSchema = z.enum(["placed", "approved", "delivered"]);
export type OrderStatusEnum = z.infer<typeof OrderStatusEnumSchema>;
export const OrderStatusEnum = OrderStatusEnumSchema.enum;

/** 
 * OrderSchema 
 * @type { object }
 * @property { integer } id Example: `10` 
 * @property { integer } petId Example: `198772` 
 * @property { integer } quantity Example: `7` 
 * @property { string } shipDate  
 * @property { string } status Order Status. Example: `approved` 
 * @property { boolean } complete  
 */
export const OrderSchema = z.object({ id: z.int().nullable(), petId: z.int().nullable(), quantity: z.int().nullable(), shipDate: z.iso.datetime({ offset: true }).nullable(), status: OrderStatusEnumSchema.nullable(), complete: z.boolean().nullable() }).partial();
export type Order = z.infer<typeof OrderSchema>;

/** 
 * GetInventoryResponseSchema 
 * @type { object }
 * @property { integer } [key]  
 */
export const GetInventoryResponseSchema = z.object({}).catchall(z.int());
export type GetInventoryResponse = z.infer<typeof GetInventoryResponseSchema>;

}
