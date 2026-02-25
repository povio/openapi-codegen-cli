import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace EmployeeAccountModels {
/** 
 * EmployeeAccountEmploymentDtoSchema 
 * @type { object }
 * @property { string } officeId Office ID 
 * @property { string } officeName Office name 
 */
export const EmployeeAccountEmploymentDtoSchema = z.object({ officeId: z.string().describe("Office ID"), officeName: z.string().describe("Office name") }).readonly();
export type EmployeeAccountEmploymentDto = z.infer<typeof EmployeeAccountEmploymentDtoSchema>;

/** 
 * EmployeeAccountPrimaryOfficeDtoSchema 
 * @type { object }
 * @property { string } officeId Office ID 
 * @property { string } officeName Office name 
 */
export const EmployeeAccountPrimaryOfficeDtoSchema = z.object({ officeId: z.string().describe("Office ID"), officeName: z.string().describe("Office name") }).readonly();
export type EmployeeAccountPrimaryOfficeDto = z.infer<typeof EmployeeAccountPrimaryOfficeDtoSchema>;

/** 
 * EmployeeAccountRoleDtoSchema 
 * @type { object }
 * @property { string } name Role name 
 * @property { string[] } permissions Role permissions 
 * @property { string } officeId Office ID 
 */
export const EmployeeAccountRoleDtoSchema = z.object({ name: z.string().describe("Role name"), permissions: z.array(z.string()).readonly().describe("Role permissions"), officeId: z.string().describe("Office ID").nullish() }).readonly();
export type EmployeeAccountRoleDto = z.infer<typeof EmployeeAccountRoleDtoSchema>;

/** 
 * EmployeeAccountDtoSchema 
 * @type { object }
 * @property { string } defaultUrl  
 * @property { string } costCenter  
 * @property { CommonModels.LocaleEnum } locale  
 * @property { array[] } aclRules Can hold any type of value 
 * @property { object } settings Employee settings keyed by setting name 
 * @property { string } id Employee ID 
 * @property { string } email Email 
 * @property { string } firstName First name 
 * @property { string } lastName Last name 
 * @property { string } phone Phone number 
 * @property { EmployeeAccountEmploymentDto[] } employments Employments 
 * @property { EmployeeAccountPrimaryOfficeDto } primaryOffice Primary office 
 * @property { EmployeeAccountRoleDto[] } roles Roles 
 */
export const EmployeeAccountDtoSchema = z.object({ defaultUrl: z.string().nullish(), costCenter: z.string().nullish(), locale: CommonModels.LocaleEnumSchema.nullish(), aclRules: z.array(z.array(z.any()).readonly()).readonly().describe("Can hold any type of value"), settings: z.union([z.object({}).catchall(z.any()).readonly(), z.array(z.object({}).catchall(z.any()).readonly()).readonly(), z.string(), z.array(z.string()).readonly(), z.array(z.number()).readonly()]).describe("Employee settings keyed by setting name"), id: z.string().describe("Employee ID"), email: z.email().describe("Email"), firstName: z.string().describe("First name"), lastName: z.string().describe("Last name"), phone: z.string().describe("Phone number").nullish(), employments: z.array(EmployeeAccountEmploymentDtoSchema).readonly().describe("Employments"), primaryOffice: EmployeeAccountPrimaryOfficeDtoSchema.describe("Primary office"), roles: z.array(EmployeeAccountRoleDtoSchema).readonly().describe("Roles") }).readonly();
export type EmployeeAccountDto = z.infer<typeof EmployeeAccountDtoSchema>;

}
