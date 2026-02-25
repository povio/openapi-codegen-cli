import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace EmployeeModels {
/** 
 * EmployeeResponseSchema 
 * @type { object }
 * @property { string } id Employee ID 
 * @property { string } email Email 
 * @property { string } firstName First name 
 * @property { string } lastName Last name 
 * @property { CommonModels.LocaleEnum } locale  
 * @property { string } phone Phone number 
 * @property { boolean } archived Archived 
 * @property { string } primaryOfficeId Primary office id 
 * @property { CommonModels.EmployeeOfficeResponse } primaryOffice Primary office 
 * @property { CommonModels.EmploymentResponse[] } employments Employments 
 * @property { CommonModels.EmployeeRoleResponse[] } roles Global Roles 
 * @property { string } createdAt  
 * @property { string } updatedAt  
 */
export const EmployeeResponseSchema = z.object({ id: z.string().describe("Employee ID"), email: z.email().describe("Email"), firstName: z.string().describe("First name"), lastName: z.string().describe("Last name"), locale: CommonModels.LocaleEnumSchema.nullish(), phone: z.string().describe("Phone number").nullish(), archived: z.boolean().describe("Archived").nullish(), primaryOfficeId: z.string().describe("Primary office id").nullish(), primaryOffice: CommonModels.EmployeeOfficeResponseSchema.describe("Primary office").nullish(), employments: z.array(CommonModels.EmploymentResponseSchema).readonly().describe("Employments").nullish(), roles: z.array(CommonModels.EmployeeRoleResponseSchema).readonly().describe("Global Roles").nullish(), createdAt: z.iso.datetime({ offset: true }), updatedAt: z.iso.datetime({ offset: true }) }).readonly();
export type EmployeeResponse = z.infer<typeof EmployeeResponseSchema>;

/** 
 * EmployeeCreateRequestSchema 
 * @type { object }
 * @property { string } firstName First name 
 * @property { string } lastName Last name 
 * @property { string } email Email 
 * @property { CommonModels.LocaleEnum } locale  
 * @property { string } primaryOfficeId Primary office ID 
 * @property { string } phone Phone number 
 */
export const EmployeeCreateRequestSchema = z.object({ firstName: z.string().describe("First name"), lastName: z.string().describe("Last name"), email: z.email().describe("Email"), locale: CommonModels.LocaleEnumSchema.nullish(), primaryOfficeId: z.string().describe("Primary office ID").nullish(), phone: z.string().describe("Phone number").nullish() }).readonly();
export type EmployeeCreateRequest = z.infer<typeof EmployeeCreateRequestSchema>;

/** 
 * EmployeeOneStepCreateEmploymentRequestSchema 
 * @type { object }
 * @property { string } officeId  
 * @property { string[] } roleIds Array of office role IDs 
 */
export const EmployeeOneStepCreateEmploymentRequestSchema = z.object({ officeId: z.string(), roleIds: z.array(z.string()).readonly().describe("Array of office role IDs").nullish() }).readonly();
export type EmployeeOneStepCreateEmploymentRequest = z.infer<typeof EmployeeOneStepCreateEmploymentRequestSchema>;

/** 
 * EmployeeOneStepCreateRequestSchema 
 * @type { object }
 * @property { CommonModels.LocaleEnum } locale  
 * @property { string } firstName First name 
 * @property { string } lastName Last name 
 * @property { string } email Email 
 * @property { string } phone Phone number 
 * @property { string[] } roleIds Array of global role IDs 
 * @property { string } primaryOfficeId Primary office ID 
 * @property { EmployeeOneStepCreateEmploymentRequest[] } employments Employments. Min Items: `1` 
 */
export const EmployeeOneStepCreateRequestSchema = z.object({ locale: CommonModels.LocaleEnumSchema.nullish(), firstName: z.string().describe("First name"), lastName: z.string().describe("Last name"), email: z.email().describe("Email"), phone: z.string().describe("Phone number").nullish(), roleIds: z.array(z.string()).readonly().describe("Array of global role IDs").nullish(), primaryOfficeId: z.string().describe("Primary office ID").nullish(), employments: z.array(EmployeeOneStepCreateEmploymentRequestSchema).readonly().min(1).describe("Employments") }).readonly();
export type EmployeeOneStepCreateRequest = z.infer<typeof EmployeeOneStepCreateRequestSchema>;

/** 
 * EmployeeUpdateRequestSchema 
 * @type { object }
 * @property { string } firstName First name 
 * @property { string } lastName Last name 
 * @property { string } phone Phone number of the employee 
 * @property { CommonModels.LocaleEnum } locale  
 * @property { string } primaryOfficeId  
 */
export const EmployeeUpdateRequestSchema = z.object({ firstName: z.string().describe("First name"), lastName: z.string().describe("Last name"), phone: z.string().describe("Phone number of the employee"), locale: CommonModels.LocaleEnumSchema, primaryOfficeId: z.string() }).readonly();
export type EmployeeUpdateRequest = z.infer<typeof EmployeeUpdateRequestSchema>;

/** 
 * EmployeeFilterDtoSchema 
 * @type { object }
 * @property { string } office Office ID (single select, offices the user has access to) 
 * @property { string[] } roles Role IDs (multiselect) 
 * @property { string } primaryOfficeId Primary office id 
 * @property { string } firstName First name 
 * @property { string } lastName Last name 
 * @property { string } email Email 
 * @property { string[] } ids Ids 
 * @property { boolean } archived Archived
 * set to true to only return archived employees
 * does not return archived employees by default. Default: `false` 
 * @property { string } search Free text search multiple fields 
 * @property { string } officeRole Office role 
 */
export const EmployeeFilterDtoSchema = z.object({ office: z.string().describe("Office ID (single select, offices the user has access to)"), roles: z.array(z.string()).readonly().describe("Role IDs (multiselect)"), primaryOfficeId: z.string().describe("Primary office id"), firstName: z.string().describe("First name"), lastName: z.string().describe("Last name"), email: z.string().describe("Email"), ids: z.array(z.string()).readonly().describe("Ids"), archived: z.boolean().describe(`Archived
 set to true to only return archived employees
 does not return archived employees by default`).default(false), search: z.string().describe("Free text search multiple fields"), officeRole: z.string().describe("Office role") }).readonly();
export type EmployeeFilterDto = z.infer<typeof EmployeeFilterDtoSchema>;

/** 
 * EmployeeLabelFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 */
export const EmployeeLabelFilterDtoSchema = z.object({ search: z.string() }).readonly();
export type EmployeeLabelFilterDto = z.infer<typeof EmployeeLabelFilterDtoSchema>;

/** 
 * EmployeeRoleMemberResponseSchema 
 * @type { object }
 * @property { string } roleId  
 * @property { string } name Name of the role 
 * @property { string } color Color associated with the role 
 * @property { string } description Description of the role 
 * @property { string[] } permissions Permissions associated with the role 
 */
export const EmployeeRoleMemberResponseSchema = z.object({ roleId: z.string(), name: z.string().describe("Name of the role"), color: z.string().describe("Color associated with the role").nullish(), description: z.string().describe("Description of the role").nullish(), permissions: z.array(z.string()).readonly().describe("Permissions associated with the role") }).readonly();
export type EmployeeRoleMemberResponse = z.infer<typeof EmployeeRoleMemberResponseSchema>;

/** 
 * EmployeeRoleMembershipsUpdateRequestSchema 
 * @type { object }
 * @property { string[] } roleIds Array of role IDs 
 */
export const EmployeeRoleMembershipsUpdateRequestSchema = z.object({ roleIds: z.array(z.string()).readonly().describe("Array of role IDs") }).readonly();
export type EmployeeRoleMembershipsUpdateRequest = z.infer<typeof EmployeeRoleMembershipsUpdateRequestSchema>;

/** 
 * EmployeePaginateOrderParamEnumSchema 
 * @type { enum }
 */
export const EmployeePaginateOrderParamEnumSchema = z.enum(["firstName", "lastName", "email", "name", "createdAt"]);
export type EmployeePaginateOrderParamEnum = z.infer<typeof EmployeePaginateOrderParamEnumSchema>;
export const EmployeePaginateOrderParamEnum = EmployeePaginateOrderParamEnumSchema.enum;

/** 
 * EmployeePopulateFieldSchema 
 * @type { enum }
 */
export const EmployeePopulateFieldSchema = z.enum(["employments", "primaryOffice", "roles", "employments.roles", "employments.office"]);
export type EmployeePopulateField = z.infer<typeof EmployeePopulateFieldSchema>;
export const EmployeePopulateField = EmployeePopulateFieldSchema.enum;

/** 
 * EmployeePaginatePopulateParamSchema 
 * @type { array }
 */
export const EmployeePaginatePopulateParamSchema = z.array(EmployeePopulateFieldSchema).readonly().nullish();
export type EmployeePaginatePopulateParam = z.infer<typeof EmployeePaginatePopulateParamSchema>;

/** 
 * EmployeePaginateResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { EmployeeResponse[] } items  
 */
export const EmployeePaginateResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(EmployeeResponseSchema).readonly() }).readonly().shape });
export type EmployeePaginateResponse = z.infer<typeof EmployeePaginateResponseSchema>;

/** 
 * EmployeeFindAllResponseSchema 
 * @type { array }
 */
export const EmployeeFindAllResponseSchema = z.array(CommonModels.LabelResponseDTOSchema).readonly();
export type EmployeeFindAllResponse = z.infer<typeof EmployeeFindAllResponseSchema>;

/** 
 * EmployeePaginateLabelsOrderParamEnumSchema 
 * @type { enum }
 */
export const EmployeePaginateLabelsOrderParamEnumSchema = z.enum(["firstName", "lastName", "email", "name", "createdAt"]);
export type EmployeePaginateLabelsOrderParamEnum = z.infer<typeof EmployeePaginateLabelsOrderParamEnumSchema>;
export const EmployeePaginateLabelsOrderParamEnum = EmployeePaginateLabelsOrderParamEnumSchema.enum;

/** 
 * EmployeePaginateLabelsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { CommonModels.LabelResponseDTO[] } items  
 */
export const EmployeePaginateLabelsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).readonly() }).readonly().shape });
export type EmployeePaginateLabelsResponse = z.infer<typeof EmployeePaginateLabelsResponseSchema>;

/** 
 * EmployeeGetPopulateParamSchema 
 * @type { array }
 */
export const EmployeeGetPopulateParamSchema = z.array(EmployeePopulateFieldSchema).readonly().nullish();
export type EmployeeGetPopulateParam = z.infer<typeof EmployeeGetPopulateParamSchema>;

/** 
 * GetWithOfficePopulateParamSchema 
 * @type { array }
 */
export const GetWithOfficePopulateParamSchema = z.array(EmployeePopulateFieldSchema).readonly().nullish();
export type GetWithOfficePopulateParam = z.infer<typeof GetWithOfficePopulateParamSchema>;

/** 
 * EmployeeListRolesResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { EmployeeRoleMemberResponse[] } items  
 */
export const EmployeeListRolesResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(EmployeeRoleMemberResponseSchema).readonly() }).readonly().shape });
export type EmployeeListRolesResponse = z.infer<typeof EmployeeListRolesResponseSchema>;

/** 
 * EmployeeUpdateRolesResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { EmployeeRoleMemberResponse[] } items  
 */
export const EmployeeUpdateRolesResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(EmployeeRoleMemberResponseSchema).readonly() }).readonly().shape });
export type EmployeeUpdateRolesResponse = z.infer<typeof EmployeeUpdateRolesResponseSchema>;

}
