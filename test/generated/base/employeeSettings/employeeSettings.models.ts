import { z } from "zod";

export namespace EmployeeSettingsModels {
/** 
 * EmployeeSettingsResponseDtoSchema 
 * @type { object }
 * @property { object } settings Map of all settings for the employee 
 */
export const EmployeeSettingsResponseDtoSchema = z.object({ settings: z.union([z.object({}).catchall(z.any()), z.array(z.object({}).catchall(z.any())), z.string(), z.array(z.string()), z.array(z.number())]) });
export type EmployeeSettingsResponseDto = z.infer<typeof EmployeeSettingsResponseDtoSchema>;

/** 
 * UpdateEmployeeSettingDtoSchema 
 * @type { object }
 * @property { object } value The value to store for the setting. If null, the setting will be deleted. 
 */
export const UpdateEmployeeSettingDtoSchema = z.object({ value: z.union([z.object({}).catchall(z.any()), z.array(z.unknown()), z.string(), z.number(), z.boolean()]).nullable() }).partial();
export type UpdateEmployeeSettingDto = z.infer<typeof UpdateEmployeeSettingDtoSchema>;

}
