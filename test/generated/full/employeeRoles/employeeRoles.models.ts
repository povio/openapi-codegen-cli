import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace EmployeeRolesModels {
/** 
 * EmployeeRoleListItemResponseSchema 
 * @type { object }
 * @property { string } id Unique identifier of the role 
 * @property { string } name Name of the role 
 * @property { string } color Color associated with the role 
 * @property { string } description Description of the role 
 * @property { string } context Role context 
 * @property { string[] } permissions Permissions associated with the role 
 * @property { number } numberOfUsers Number of users associated with the role 
 */
export const EmployeeRoleListItemResponseSchema = z.object({ id: z.string().describe("Unique identifier of the role"), name: z.string().describe("Name of the role"), color: z.string().describe("Color associated with the role").nullish(), description: z.string().describe("Description of the role").nullish(), context: CommonModels.EmployeeRoleContextSchema.describe("Role context").nullish(), permissions: z.array(z.string()).readonly().describe("Permissions associated with the role"), numberOfUsers: z.number().describe("Number of users associated with the role") }).readonly();
export type EmployeeRoleListItemResponse = z.infer<typeof EmployeeRoleListItemResponseSchema>;

/** 
 * EmployeeRolePaginationFilterDtoSchema 
 * @type { object }
 * @property { string } name Name 
 * @property { string } context Role context 
 * @property { string } search  
 */
export const EmployeeRolePaginationFilterDtoSchema = z.object({ name: z.string().describe("Name"), context: CommonModels.EmployeeRoleContextSchema.describe("Role context"), search: z.string() }).readonly();
export type EmployeeRolePaginationFilterDto = z.infer<typeof EmployeeRolePaginationFilterDtoSchema>;

/** 
 * EmployeeRoleCreateRequestSchema 
 * @type { object }
 * @property { string } name Name of the role 
 * @property { string } color Color of the role 
 * @property { string } description Color of the role 
 * @property { string } context Role context
 * - office or global 
 * @property { string[] } permissions Permission IDs associated with the role
 * can only be either office or global. Default: `` 
 */
export const EmployeeRoleCreateRequestSchema = z.object({ name: z.string().describe("Name of the role"), color: z.string().describe("Color of the role"), description: z.string().describe("Color of the role").nullish(), context: CommonModels.EmployeeRoleContextSchema.describe(`Role context
 - office or global`), permissions: z.array(z.string()).readonly().describe(`Permission IDs associated with the role
 can only be either office or global`).default([]) }).readonly();
export type EmployeeRoleCreateRequest = z.infer<typeof EmployeeRoleCreateRequestSchema>;

/** 
 * EmployeeRolePermissionDtoSchema 
 * @type { object }
 * @property { string } id Employee Permission unique identifier 
 * @property { string } label  
 * @property { string } group  
 * @property { string } description  
 * @property { string } context Scope where this rule is applied 
 * @property { boolean } enabled  
 */
export const EmployeeRolePermissionDtoSchema = z.object({ id: z.string().describe("Employee Permission unique identifier"), label: z.string(), group: z.string(), description: z.string().nullish(), context: CommonModels.EmployeeRoleContextSchema.describe("Scope where this rule is applied"), enabled: z.boolean() }).readonly();
export type EmployeeRolePermissionDto = z.infer<typeof EmployeeRolePermissionDtoSchema>;

/** 
 * EmployeeRoleUpdateRequestSchema 
 * @type { object }
 * @property { string } name Role Id 
 * @property { string } color Role Color 
 * @property { string } description Role Description 
 */
export const EmployeeRoleUpdateRequestSchema = z.object({ name: z.string().describe("Role Id"), color: z.string().describe("Role Color"), description: z.string().describe("Role Description") }).readonly();
export type EmployeeRoleUpdateRequest = z.infer<typeof EmployeeRoleUpdateRequestSchema>;

/** 
 * EmployeeRoleTogglePermissionRequestSchema 
 * @type { object }
 * @property { boolean } toggled Turn the permission on or off 
 */
export const EmployeeRoleTogglePermissionRequestSchema = z.object({ toggled: z.boolean().describe("Turn the permission on or off") }).readonly();
export type EmployeeRoleTogglePermissionRequest = z.infer<typeof EmployeeRoleTogglePermissionRequestSchema>;

/** 
 * CopyEmployeeRoleDtoSchema 
 * @type { object }
 * @property { string } newRoleName  
 */
export const CopyEmployeeRoleDtoSchema = z.object({ newRoleName: z.string() }).readonly();
export type CopyEmployeeRoleDto = z.infer<typeof CopyEmployeeRoleDtoSchema>;

/** 
 * EmployeeRolesListOrderParamEnumSchema 
 * @type { enum }
 */
export const EmployeeRolesListOrderParamEnumSchema = z.enum(["name", "numberOfUsers"]);
export type EmployeeRolesListOrderParamEnum = z.infer<typeof EmployeeRolesListOrderParamEnumSchema>;
export const EmployeeRolesListOrderParamEnum = EmployeeRolesListOrderParamEnumSchema.enum;

/** 
 * EmployeeRolesListResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { EmployeeRoleListItemResponse[] } items  
 */
export const EmployeeRolesListResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(EmployeeRoleListItemResponseSchema).readonly() }).readonly().shape });
export type EmployeeRolesListResponse = z.infer<typeof EmployeeRolesListResponseSchema>;

/** 
 * LabelsResponseSchema 
 * @type { array }
 */
export const LabelsResponseSchema = z.array(CommonModels.LabelResponseDTOSchema).readonly();
export type LabelsResponse = z.infer<typeof LabelsResponseSchema>;

/** 
 * EmployeeRolesPaginatePermissionsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { EmployeeRolePermissionDto[] } items  
 */
export const EmployeeRolesPaginatePermissionsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(EmployeeRolePermissionDtoSchema).readonly() }).readonly().shape });
export type EmployeeRolesPaginatePermissionsResponse = z.infer<typeof EmployeeRolesPaginatePermissionsResponseSchema>;

}
