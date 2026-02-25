import { z } from "zod";

export namespace EmployeeSettingsModels {
  /**
   * EmployeeSettingsResponseDtoSchema
   * @type { object }
   * @property { object } settings Map of all settings for the employee
   */
  export const EmployeeSettingsResponseDtoSchema = z
    .object({
      settings: z
        .union([
          z.object({}).catchall(z.any()).readonly(),
          z.array(z.object({}).catchall(z.any()).readonly()).readonly(),
          z.string(),
          z.array(z.string()).readonly(),
          z.array(z.number()).readonly(),
        ])
        .describe("Map of all settings for the employee"),
    })
    .readonly();
  export type EmployeeSettingsResponseDto = z.infer<typeof EmployeeSettingsResponseDtoSchema>;

  /**
   * UpdateEmployeeSettingDtoSchema
   * @type { object }
   * @property { object } value The value to store for the setting. If null, the setting will be deleted.
   */
  export const UpdateEmployeeSettingDtoSchema = z
    .object({
      value: z
        .union([
          z.object({}).catchall(z.any()).readonly(),
          z.array(z.unknown()).readonly(),
          z.string(),
          z.number(),
          z.boolean(),
        ])
        .describe("The value to store for the setting. If null, the setting will be deleted.")
        .nullable(),
    })
    .readonly();
  export type UpdateEmployeeSettingDto = z.infer<typeof UpdateEmployeeSettingDtoSchema>;
}
