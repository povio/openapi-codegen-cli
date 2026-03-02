import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace EmployeeAccountModels {
/** 
 * EmployeeAccountEmploymentDtoSchema 
 * @type { object }
 * @property { string } officeId Office ID 
 * @property { string } officeName Office name 
 */
export const EmployeeAccountEmploymentDtoSchema = z.object({ officeId: z.string(), officeName: z.string() });
export type EmployeeAccountEmploymentDto = z.infer<typeof EmployeeAccountEmploymentDtoSchema>;

/** 
 * EmployeeAccountPrimaryOfficeDtoSchema 
 * @type { object }
 * @property { string } officeId Office ID 
 * @property { string } officeName Office name 
 */
export const EmployeeAccountPrimaryOfficeDtoSchema = z.object({ officeId: z.string(), officeName: z.string() });
export type EmployeeAccountPrimaryOfficeDto = z.infer<typeof EmployeeAccountPrimaryOfficeDtoSchema>;

/** 
 * EmployeeAccountRoleDtoSchema 
 * @type { object }
 * @property { string } name Role name 
 * @property { string[] } permissions Role permissions 
 * @property { string } officeId Office ID 
 */
export const EmployeeAccountRoleDtoSchema = z.object({ name: z.string(), permissions: z.array(z.string()), officeId: z.string().nullish() });
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
export const EmployeeAccountDtoSchema = z.object({ defaultUrl: z.string().nullish(), costCenter: z.string().nullish(), locale: CommonModels.LocaleEnumSchema.nullish(), aclRules: z.array(z.array(z.any())), settings: z.union([z.object({}).catchall(z.any()), z.array(z.object({}).catchall(z.any())), z.string(), z.array(z.string()), z.array(z.number())]), id: z.string(), email: z.email(), firstName: z.string(), lastName: z.string(), phone: z.string().nullish(), employments: z.array(EmployeeAccountEmploymentDtoSchema), primaryOffice: EmployeeAccountPrimaryOfficeDtoSchema, roles: z.array(EmployeeAccountRoleDtoSchema) });
export type EmployeeAccountDto = z.infer<typeof EmployeeAccountDtoSchema>;

}
