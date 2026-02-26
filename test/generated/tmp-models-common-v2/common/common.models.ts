import { z } from "zod";

export namespace CommonModels {
/** 
 * FindByStatusStatusEnumSchema 
 * @type { enum }
 * @description pet status in the store. Default: `available`
 */
export const FindByStatusStatusEnumSchema = z.enum(["available", "pending", "sold"]);
export type FindByStatusStatusEnum = z.infer<typeof FindByStatusStatusEnumSchema>;
export const FindByStatusStatusEnum = FindByStatusStatusEnumSchema.enum;

/** 
 * OrderStatusEnumSchema 
 * @type { enum }
 * @description Order Status. Example: `approved`
 */
export const OrderStatusEnumSchema = z.enum(["placed", "approved", "delivered"]);
export type OrderStatusEnum = z.infer<typeof OrderStatusEnumSchema>;
export const OrderStatusEnum = OrderStatusEnumSchema.enum;

/** 
 * CategorySchema 
 * @type { object }
 * @property { integer } id Example: `1` 
 * @property { string } name Example: `Dogs` 
 */
export const CategorySchema = z.object({ id: z.int().nullable(), name: z.string().nullable() }).partial();
export type Category = z.infer<typeof CategorySchema>;

/** 
 * TagSchema 
 * @type { object }
 * @property { integer } id  
 * @property { string } name  
 */
export const TagSchema = z.object({ id: z.int().nullable(), name: z.string().nullable() }).partial();
export type Tag = z.infer<typeof TagSchema>;

/** 
 * PetSchema 
 * @type { object }
 * @property { integer } id Example: `10` 
 * @property { string } name Example: `doggie` 
 * @property { PetModels.Category } category  
 * @property { string[] } photoUrls  
 * @property { PetModels.Tag[] } tags  
 * @property { string } status pet status in the store 
 */
export const PetSchema = z.object({ id: z.int().nullish(), name: z.string(), category: CategorySchema.nullish(), photoUrls: z.array(z.string()), tags: z.array(TagSchema).nullish(), status: FindByStatusStatusEnumSchema.nullish() });
export type Pet = z.infer<typeof PetSchema>;

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
 * UserSchema 
 * @type { object }
 * @property { integer } id Example: `10` 
 * @property { string } username Example: `theUser` 
 * @property { string } firstName Example: `John` 
 * @property { string } lastName Example: `James` 
 * @property { string } email Example: `john@email.com` 
 * @property { string } password Example: `12345` 
 * @property { string } phone Example: `12345` 
 * @property { integer } userStatus User Status. Example: `1` 
 */
export const UserSchema = z.object({ id: z.int().nullable(), username: z.string().nullable(), firstName: z.string().nullable(), lastName: z.string().nullable(), email: z.string().nullable(), password: z.string().nullable(), phone: z.string().nullable(), userStatus: z.int().nullable() }).partial();
export type User = z.infer<typeof UserSchema>;

/** 
 * ApiResponseSchema 
 * @type { object }
 * @property { integer } code  
 * @property { string } type  
 * @property { string } message  
 */
export const ApiResponseSchema = z.object({ code: z.int().nullable(), type: z.string().nullable(), message: z.string().nullable() }).partial();
export type ApiResponse = z.infer<typeof ApiResponseSchema>;

/** 
 * FindByStatusStatusParamSchema 
 * @type { string }
 * @description Default: `available`
 */
export const FindByStatusStatusParamSchema = FindByStatusStatusEnumSchema.nullish().default("available");
export type FindByStatusStatusParam = z.infer<typeof FindByStatusStatusParamSchema>;

/** 
 * FindByStatusResponseSchema 
 * @type { array }
 */
export const FindByStatusResponseSchema = z.array(PetSchema);
export type FindByStatusResponse = z.infer<typeof FindByStatusResponseSchema>;

/** 
 * FindByTagsTagsParamSchema 
 * @type { array }
 */
export const FindByTagsTagsParamSchema = z.array(z.string()).nullish();
export type FindByTagsTagsParam = z.infer<typeof FindByTagsTagsParamSchema>;

/** 
 * FindByTagsResponseSchema 
 * @type { array }
 */
export const FindByTagsResponseSchema = z.array(PetSchema);
export type FindByTagsResponse = z.infer<typeof FindByTagsResponseSchema>;

/** 
 * GetInventoryResponseSchema 
 * @type { object }
 * @property { integer } [key]  
 */
export const GetInventoryResponseSchema = z.object({}).catchall(z.int());
export type GetInventoryResponse = z.infer<typeof GetInventoryResponseSchema>;

/** 
 * CreateWithListInputBodySchema 
 * @type { array }
 */
export const CreateWithListInputBodySchema = z.array(UserSchema);
export type CreateWithListInputBody = z.infer<typeof CreateWithListInputBodySchema>;

}
