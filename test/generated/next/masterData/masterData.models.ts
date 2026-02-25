import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace MasterDataModels {
/** 
 * MasterDataTypeEnumSchema 
 * @type { enum }
 */
export const MasterDataTypeEnumSchema = z.enum(["BusinessPartner", "Depot", "City", "Warehouse", "ContainerYard", "PortTerminal", "AirportTerminal", "Port", "Airport"]);
export type MasterDataTypeEnum = z.infer<typeof MasterDataTypeEnumSchema>;
export const MasterDataTypeEnum = MasterDataTypeEnumSchema.enum;

/** 
 * MasterDataItemResponseDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier of the item 
 * @property { string } name Name of the item 
 * @property { MasterDataTypeEnum } type Type of the item 
 */
export const MasterDataItemResponseDTOSchema = z.object({ id: z.string(), name: z.string(), type: MasterDataTypeEnumSchema });
export type MasterDataItemResponseDTO = z.infer<typeof MasterDataItemResponseDTOSchema>;

/** 
 * MasterDataItemsResponseDTOSchema 
 * @type { object }
 * @property { MasterDataItemResponseDTO[] } items List of master data items 
 */
export const MasterDataItemsResponseDTOSchema = z.object({ items: z.array(MasterDataItemResponseDTOSchema) });
export type MasterDataItemsResponseDTO = z.infer<typeof MasterDataItemsResponseDTOSchema>;

/** 
 * MasterDataLabelResponseDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier of the item 
 * @property { string } label Label of the item 
 * @property { MasterDataTypeEnum } type Type of the item 
 */
export const MasterDataLabelResponseDTOSchema = z.object({ id: z.string(), label: z.string(), type: MasterDataTypeEnumSchema });
export type MasterDataLabelResponseDTO = z.infer<typeof MasterDataLabelResponseDTOSchema>;

/** 
 * MasterDataFindAllTypesParamSchema 
 * @type { array }
 */
export const MasterDataFindAllTypesParamSchema = z.array(MasterDataTypeEnumSchema);
export type MasterDataFindAllTypesParam = z.infer<typeof MasterDataFindAllTypesParamSchema>;

/** 
 * MasterDataPaginateTypesParamSchema 
 * @type { array }
 */
export const MasterDataPaginateTypesParamSchema = z.array(MasterDataTypeEnumSchema);
export type MasterDataPaginateTypesParam = z.infer<typeof MasterDataPaginateTypesParamSchema>;

/** 
 * MasterDataPaginateResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { MasterDataLabelResponseDTO[] } items  
 */
export const MasterDataPaginateResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(MasterDataLabelResponseDTOSchema).nullable() }).partial().shape });
export type MasterDataPaginateResponse = z.infer<typeof MasterDataPaginateResponseSchema>;

}
