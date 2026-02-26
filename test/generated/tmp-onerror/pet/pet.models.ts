import { z } from "zod";

export namespace PetModels {
/** 
 * FindByStatusStatusEnumSchema 
 * @type { enum }
 * @description pet status in the store. Default: `available`
 */
export const FindByStatusStatusEnumSchema = z.enum(["available", "pending", "sold"]);
export type FindByStatusStatusEnum = z.infer<typeof FindByStatusStatusEnumSchema>;
export const FindByStatusStatusEnum = FindByStatusStatusEnumSchema.enum;

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
 * @property { Category } category  
 * @property { string[] } photoUrls  
 * @property { Tag[] } tags  
 * @property { string } status pet status in the store 
 */
export const PetSchema = z.object({ id: z.int().nullish(), name: z.string(), category: CategorySchema.nullish(), photoUrls: z.array(z.string()), tags: z.array(TagSchema).nullish(), status: FindByStatusStatusEnumSchema.nullish() });
export type Pet = z.infer<typeof PetSchema>;

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

}
