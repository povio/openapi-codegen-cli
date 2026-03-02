import { z } from "zod";

export namespace ControlTowerSearchModels {
/** 
 * SearchItemTypeEnumSchema 
 * @type { enum }
 */
export const SearchItemTypeEnumSchema = z.enum(["Project", "Booking", "Container"]);
export type SearchItemTypeEnum = z.infer<typeof SearchItemTypeEnumSchema>;
export const SearchItemTypeEnum = SearchItemTypeEnumSchema.enum;

/** 
 * SearchItemDtoSchema 
 * @type { object }
 * @property { SearchItemTypeEnum } type  
 * @property { string } id  
 * @property { string } label  
 */
export const SearchItemDtoSchema = z.object({ type: SearchItemTypeEnumSchema, id: z.string(), label: z.string().nullable() });
export type SearchItemDto = z.infer<typeof SearchItemDtoSchema>;

/** 
 * SearchResponseDtoSchema 
 * @type { object }
 * @property { SearchItemDto[] } items  
 * @property { number } projectsCount  
 * @property { number } bookingsCount  
 * @property { number } containersCount  
 * @property { number } totalCount  
 */
export const SearchResponseDtoSchema = z.object({ items: z.array(SearchItemDtoSchema), projectsCount: z.number(), bookingsCount: z.number(), containersCount: z.number(), totalCount: z.number() });
export type SearchResponseDto = z.infer<typeof SearchResponseDtoSchema>;

/** 
 * SearchRequestDtoSchema 
 * @type { object }
 * @property { string } search  
 */
export const SearchRequestDtoSchema = z.object({ search: z.string() });
export type SearchRequestDto = z.infer<typeof SearchRequestDtoSchema>;

}
