import { z } from "zod";

export namespace InttraOfficeIntegrationModels {
/** 
 * OfficeInttraCredentialsResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } createdAt  
 * @property { string } updatedAt  
 * @property { string } rotatedByUserId  
 * @property { string } officeId  
 * @property { string } sftpUsername  
 * @property { string } sftpPublicKey  
 * @property { string } partnerCode  
 * @property { string } ediId  
 * @property { string } notificationEmail  
 */
export const OfficeInttraCredentialsResponseDtoSchema = z.object({ id: z.string(), createdAt: z.iso.datetime({ offset: true }), updatedAt: z.iso.datetime({ offset: true }), rotatedByUserId: z.string().nullish(), officeId: z.string(), sftpUsername: z.string().nullish(), sftpPublicKey: z.string().nullish(), partnerCode: z.string().nullish(), ediId: z.string().nullish(), notificationEmail: z.string().nullish() });
export type OfficeInttraCredentialsResponseDto = z.infer<typeof OfficeInttraCredentialsResponseDtoSchema>;

/** 
 * GenerateInttraCredentialsResponseDtoSchema 
 * @type { object }
 * @property { string } publicKey  
 * @property { string } rotatedAt  
 * @property { string } rotatedByUserId  
 */
export const GenerateInttraCredentialsResponseDtoSchema = z.object({ publicKey: z.string(), rotatedAt: z.iso.datetime({ offset: true }), rotatedByUserId: z.string() });
export type GenerateInttraCredentialsResponseDto = z.infer<typeof GenerateInttraCredentialsResponseDtoSchema>;

/** 
 * UpdateInttraCredentialsRequestDtoSchema 
 * @type { object }
 * @property { string } sftpUsername  
 * @property { string } sftpPassword  
 * @property { string } partnerCode  
 * @property { string } ediId  
 * @property { string } notificationEmail  
 */
export const UpdateInttraCredentialsRequestDtoSchema = z.object({ sftpUsername: z.string().nullable(), sftpPassword: z.string().nullable(), partnerCode: z.string().nullable(), ediId: z.string().nullable(), notificationEmail: z.string().nullable() }).partial();
export type UpdateInttraCredentialsRequestDto = z.infer<typeof UpdateInttraCredentialsRequestDtoSchema>;

/** 
 * UpdateInttraCredentialsResponseDtoSchema 
 * @type { object }
 * @property { string } rotatedAt  
 * @property { string } rotatedByUserId  
 */
export const UpdateInttraCredentialsResponseDtoSchema = z.object({ rotatedAt: z.iso.datetime({ offset: true }), rotatedByUserId: z.string() });
export type UpdateInttraCredentialsResponseDto = z.infer<typeof UpdateInttraCredentialsResponseDtoSchema>;

}
