import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace EmployeePermissionsModels {
/** 
 * EmployeePermissionResponseSchema 
 * @type { object }
 * @property { string } id Employee Permission unique identifier 
 * @property { string } label  
 * @property { string } group  
 * @property { string } description  
 * @property { string } context Scope where this rule is applied 
 */
export const EmployeePermissionResponseSchema = z.object({ id: z.string(), label: z.string(), group: z.string(), description: z.string().nullish(), context: CommonModels.EmployeeRoleContextSchema });
export type EmployeePermissionResponse = z.infer<typeof EmployeePermissionResponseSchema>;

/** 
 * EmployeePermissionFilterDtoSchema 
 * @type { object }
 * @property { string } context Role context 
 * @property { string[] } ids Ids 
 */
export const EmployeePermissionFilterDtoSchema = z.object({ context: CommonModels.EmployeeRoleContextSchema.nullable(), ids: z.array(z.string()).nullable() }).partial();
export type EmployeePermissionFilterDto = z.infer<typeof EmployeePermissionFilterDtoSchema>;

/** 
 * EmployeePermissionsPaginatePermissionsOrderParamEnumSchema 
 * @type { enum }
 */
export const EmployeePermissionsPaginatePermissionsOrderParamEnumSchema = z.enum(["id"]);
export type EmployeePermissionsPaginatePermissionsOrderParamEnum = z.infer<typeof EmployeePermissionsPaginatePermissionsOrderParamEnumSchema>;
export const EmployeePermissionsPaginatePermissionsOrderParamEnum = EmployeePermissionsPaginatePermissionsOrderParamEnumSchema.enum;

/** 
 * EmployeePermissionsPaginatePermissionsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { EmployeePermissionResponse[] } items  
 */
export const EmployeePermissionsPaginatePermissionsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(EmployeePermissionResponseSchema).nullable() }).partial().shape });
export type EmployeePermissionsPaginatePermissionsResponse = z.infer<typeof EmployeePermissionsPaginatePermissionsResponseSchema>;

/** 
 * EmployeePermissionsFindAllResponseSchema 
 * @type { array }
 */
export const EmployeePermissionsFindAllResponseSchema = z.array(CommonModels.LabelResponseDTOSchema);
export type EmployeePermissionsFindAllResponse = z.infer<typeof EmployeePermissionsFindAllResponseSchema>;

}
