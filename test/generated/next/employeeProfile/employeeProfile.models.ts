import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace EmployeeProfileModels {
/** 
 * EmployeeProfileResponseDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } firstName Employee first name 
 * @property { string } lastName Employee last name 
 * @property { string } email Employee email 
 * @property { string } phone Employee phone number 
 * @property { string } defaultUrl Employee default URL 
 * @property { CommonModels.LocaleEnum } locale Employee locale 
 */
export const EmployeeProfileResponseDTOSchema = z.object({ id: z.string(), firstName: z.string().describe("Employee first name"), lastName: z.string().describe("Employee last name"), email: z.string().describe("Employee email"), phone: z.string().describe("Employee phone number").nullish(), defaultUrl: z.string().describe("Employee default URL").nullish(), locale: CommonModels.LocaleEnumSchema.describe("Employee locale").nullish() }).readonly();
export type EmployeeProfileResponseDTO = z.infer<typeof EmployeeProfileResponseDTOSchema>;

/** 
 * UpdateEmployeeProfileRequestDTOSchema 
 * @type { object }
 * @property { string } firstName Employee first name. Example: `John` 
 * @property { string } lastName Employee last name. Example: `Doe` 
 * @property { string } email Employee email address. Example: `john.doe@example.com` 
 * @property { string } phone Employee phone number. Example: `+1234567890` 
 * @property { string } defaultUrl Default URL for the employee profile. Example: `https://example.com` 
 * @property { string } costCenter Employee cost center 
 * @property { CommonModels.LocaleEnum } locale Employee locale preference. Example: `en-US` 
 */
export const UpdateEmployeeProfileRequestDTOSchema = z.object({ firstName: z.string().describe("Employee first name"), lastName: z.string().describe("Employee last name"), email: z.email().describe("Employee email address"), phone: z.string().describe("Employee phone number"), defaultUrl: z.url().describe("Default URL for the employee profile"), costCenter: z.string().describe("Employee cost center"), locale: CommonModels.LocaleEnumSchema.describe("Employee locale preference") }).readonly();
export type UpdateEmployeeProfileRequestDTO = z.infer<typeof UpdateEmployeeProfileRequestDTOSchema>;

}
