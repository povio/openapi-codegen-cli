import { z } from "zod";

export namespace ControlTowerAuthModels {
/** 
 * LoginRequestDtoSchema 
 * @type { object }
 * @property { string } username  
 * @property { string } password  
 */
export const LoginRequestDtoSchema = z.object({ username: z.string(), password: z.string() });
export type LoginRequestDto = z.infer<typeof LoginRequestDtoSchema>;

/** 
 * LoginResponseDtoSchema 
 * @type { object }
 * @property { string } accessToken  
 * @property { boolean } resetPasswordRequired  
 * @property { string } passwordResetToken  
 * @property { string } username  
 */
export const LoginResponseDtoSchema = z.object({ accessToken: z.string().nullable(), resetPasswordRequired: z.boolean().nullish(), passwordResetToken: z.string().nullish(), username: z.string().nullish() });
export type LoginResponseDto = z.infer<typeof LoginResponseDtoSchema>;

/** 
 * PasswordResetDtoSchema 
 * @type { object }
 * @property { string } password  
 * @property { string } username  
 * @property { string } token  
 */
export const PasswordResetDtoSchema = z.object({ password: z.string(), username: z.string(), token: z.string() });
export type PasswordResetDto = z.infer<typeof PasswordResetDtoSchema>;

}
