import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace EmploymentModels {
/** 
 * EmploymentCreateRequestSchema 
 * @type { object }
 * @property { string } officeId  
 * @property { string } employeeId  
 */
export const EmploymentCreateRequestSchema = z.object({ officeId: z.string(), employeeId: z.string() });
export type EmploymentCreateRequest = z.infer<typeof EmploymentCreateRequestSchema>;

/** 
 * EmploymentFilterDtoSchema 
 * @type { object }
 * @property { string } officeId Office IDs 
 * @property { string } employeeId Employee IDs 
 */
export const EmploymentFilterDtoSchema = z.object({ officeId: z.string().nullable(), employeeId: z.string().nullable() }).partial();
export type EmploymentFilterDto = z.infer<typeof EmploymentFilterDtoSchema>;

/** 
 * EmploymentRoleMemberResponseSchema 
 * @type { object }
 * @property { string } roleId  
 * @property { string } name Name of the role 
 * @property { string } color Color associated with the role 
 * @property { string } description Description of the role 
 * @property { string[] } permissions Permissions associated with the role 
 */
export const EmploymentRoleMemberResponseSchema = z.object({ roleId: z.string(), name: z.string(), color: z.string().nullish(), description: z.string().nullish(), permissions: z.array(z.string()) });
export type EmploymentRoleMemberResponse = z.infer<typeof EmploymentRoleMemberResponseSchema>;

/** 
 * EmploymentRoleMembershipsUpdateRequestSchema 
 * @type { object }
 * @property { string[] } roleIds Array of role IDs 
 */
export const EmploymentRoleMembershipsUpdateRequestSchema = z.object({ roleIds: z.array(z.string()) });
export type EmploymentRoleMembershipsUpdateRequest = z.infer<typeof EmploymentRoleMembershipsUpdateRequestSchema>;

/** 
 * UpdateEmploymentRequestDtoSchema 
 * @type { object }
 * @property { string } costCenter  
 * @property { string[] } roleIds  
 */
export const UpdateEmploymentRequestDtoSchema = z.object({ costCenter: z.string().nullable(), roleIds: z.array(z.string()).nullable() }).partial();
export type UpdateEmploymentRequestDto = z.infer<typeof UpdateEmploymentRequestDtoSchema>;

/** 
 * EmploymentListOrderParamEnumSchema 
 * @type { enum }
 */
export const EmploymentListOrderParamEnumSchema = z.enum(["officeId", "createdAt"]);
export type EmploymentListOrderParamEnum = z.infer<typeof EmploymentListOrderParamEnumSchema>;
export const EmploymentListOrderParamEnum = EmploymentListOrderParamEnumSchema.enum;

/** 
 * EmploymentPaginationPopulateFieldsSchema 
 * @type { enum }
 */
export const EmploymentPaginationPopulateFieldsSchema = z.enum(["office", "employee"]);
export type EmploymentPaginationPopulateFields = z.infer<typeof EmploymentPaginationPopulateFieldsSchema>;
export const EmploymentPaginationPopulateFields = EmploymentPaginationPopulateFieldsSchema.enum;

/** 
 * EmploymentListPopulateParamSchema 
 * @type { array }
 */
export const EmploymentListPopulateParamSchema = z.array(EmploymentPaginationPopulateFieldsSchema).nullish();
export type EmploymentListPopulateParam = z.infer<typeof EmploymentListPopulateParamSchema>;

/** 
 * EmploymentListResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { CommonModels.EmploymentResponse[] } items  
 */
export const EmploymentListResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.EmploymentResponseSchema).nullable() }).partial().shape });
export type EmploymentListResponse = z.infer<typeof EmploymentListResponseSchema>;

/** 
 * EmploymentListRolesResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { EmploymentRoleMemberResponse[] } items  
 */
export const EmploymentListRolesResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(EmploymentRoleMemberResponseSchema).nullable() }).partial().shape });
export type EmploymentListRolesResponse = z.infer<typeof EmploymentListRolesResponseSchema>;

/** 
 * EmploymentUpdateRolesResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { EmploymentRoleMemberResponse[] } items  
 */
export const EmploymentUpdateRolesResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(EmploymentRoleMemberResponseSchema).nullable() }).partial().shape });
export type EmploymentUpdateRolesResponse = z.infer<typeof EmploymentUpdateRolesResponseSchema>;

}
