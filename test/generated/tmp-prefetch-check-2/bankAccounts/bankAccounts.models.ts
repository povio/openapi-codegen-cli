import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace BankAccountsModels {
/** 
 * BankAccountFilterDtoSchema 
 * @type { object }
 * @property { string } search Search by name or bank name 
 * @property { string } officeId Office ID to filter by 
 */
export const BankAccountFilterDtoSchema = z.object({ search: z.string().nullable(), officeId: z.string().nullable() }).partial();
export type BankAccountFilterDto = z.infer<typeof BankAccountFilterDtoSchema>;

/** 
 * BankAccountsFindAllResponseSchema 
 * @type { array }
 */
export const BankAccountsFindAllResponseSchema = z.array(CommonModels.LabelResponseDTOSchema);
export type BankAccountsFindAllResponse = z.infer<typeof BankAccountsFindAllResponseSchema>;

/** 
 * BankAccountsPaginateLabelsOrderParamEnumSchema 
 * @type { enum }
 */
export const BankAccountsPaginateLabelsOrderParamEnumSchema = z.enum(["name", "bankName", "createdAt", "updatedAt"]);
export type BankAccountsPaginateLabelsOrderParamEnum = z.infer<typeof BankAccountsPaginateLabelsOrderParamEnumSchema>;
export const BankAccountsPaginateLabelsOrderParamEnum = BankAccountsPaginateLabelsOrderParamEnumSchema.enum;

/** 
 * BankAccountsPaginateLabelsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { CommonModels.LabelResponseDTO[] } items  
 */
export const BankAccountsPaginateLabelsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).nullable() }).partial().shape });
export type BankAccountsPaginateLabelsResponse = z.infer<typeof BankAccountsPaginateLabelsResponseSchema>;

}
