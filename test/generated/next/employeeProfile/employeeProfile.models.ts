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
export const EmployeeProfileResponseDTOSchema = z.object({ id: z.string(), firstName: z.string(), lastName: z.string(), email: z.string(), phone: z.string().nullish(), defaultUrl: z.string().nullish(), locale: CommonModels.LocaleEnumSchema.nullish() });
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
export const UpdateEmployeeProfileRequestDTOSchema = z.object({ firstName: z.string().nullable(), lastName: z.string().nullable(), email: z.email().nullable(), phone: z.string().nullable(), defaultUrl: z.url().nullable(), costCenter: z.string().nullable(), locale: CommonModels.LocaleEnumSchema.nullable() }).partial();
export type UpdateEmployeeProfileRequestDTO = z.infer<typeof UpdateEmployeeProfileRequestDTOSchema>;

}
