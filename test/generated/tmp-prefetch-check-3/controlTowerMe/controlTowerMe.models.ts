import { z } from "zod";

export namespace ControlTowerMeModels {
/** 
 * LinksDtoSchema 
 * @type { object }
 * @property { string } self  
 * @property { string } related  
 */
export const LinksDtoSchema = z.object({ self: z.string().nullable(), related: z.string().nullable() }).partial();
export type LinksDto = z.infer<typeof LinksDtoSchema>;

/** 
 * ApiResponseDataDtoSchema 
 * @type { object }
 * @property { string } type  
 * @property { string } id  
 * @property { object } attributes  
 * @property { object } relationships  
 * @property { LinksDto } links  
 */
export const ApiResponseDataDtoSchema = z.object({ type: z.string(), id: z.string(), attributes: z.object({}).nullish(), relationships: z.object({}).nullish(), links: LinksDtoSchema.nullish() });
export type ApiResponseDataDto = z.infer<typeof ApiResponseDataDtoSchema>;

/** 
 * PaginationLinksDtoSchema 
 * @type { object }
 * @property { string } next  
 * @property { string } self  
 * @property { string } last  
 */
export const PaginationLinksDtoSchema = z.object({ next: z.string().nullable(), self: z.string().nullable(), last: z.string().nullable() }).partial();
export type PaginationLinksDto = z.infer<typeof PaginationLinksDtoSchema>;

/** 
 * ApiResponseDtoSchema 
 * @type { object }
 * @property { ApiResponseDataDto } data  
 * @property { PaginationLinksDto } links  
 */
export const ApiResponseDtoSchema = z.object({ data: ApiResponseDataDtoSchema, links: PaginationLinksDtoSchema.nullish() });
export type ApiResponseDto = z.infer<typeof ApiResponseDtoSchema>;

/** 
 * DelayNotificationEnumSchema 
 * @type { enum }
 */
export const DelayNotificationEnumSchema = z.enum(["EveryDelay", "LongerThan24Hours", "LongerThan3Days"]);
export type DelayNotificationEnum = z.infer<typeof DelayNotificationEnumSchema>;
export const DelayNotificationEnum = DelayNotificationEnumSchema.enum;

/** 
 * UserEmailPreferencesDtoSchema 
 * @type { object }
 * @property { boolean } originDeparture  
 * @property { boolean } loadedOnVessel  
 * @property { boolean } destinationArrival  
 * @property { boolean } onsiteDelivery  
 * @property { DelayNotificationEnum } delay  
 */
export const UserEmailPreferencesDtoSchema = z.object({ originDeparture: z.boolean(), loadedOnVessel: z.boolean(), destinationArrival: z.boolean(), onsiteDelivery: z.boolean(), delay: DelayNotificationEnumSchema });
export type UserEmailPreferencesDto = z.infer<typeof UserEmailPreferencesDtoSchema>;

/** 
 * UserProjectAccessDtoSchema 
 * @type { object }
 * @property { string[] } projectIds  
 */
export const UserProjectAccessDtoSchema = z.object({ projectIds: z.array(z.string()) });
export type UserProjectAccessDto = z.infer<typeof UserProjectAccessDtoSchema>;

/** 
 * UserRoleEnumSchema 
 * @type { enum }
 */
export const UserRoleEnumSchema = z.enum(["User", "Admin"]);
export type UserRoleEnum = z.infer<typeof UserRoleEnumSchema>;
export const UserRoleEnum = UserRoleEnumSchema.enum;

/** 
 * UserDetailDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name Min Length: `3` 
 * @property { string } email  
 * @property { UserEmailPreferencesDto } emailPreferences  
 * @property { UserProjectAccessDto } projectAccess  
 * @property { UserRoleEnum } role  
 * @property { boolean } isAdmin  
 */
export const UserDetailDtoSchema = z.object({ id: z.string(), name: z.string().min(3), email: z.email(), emailPreferences: UserEmailPreferencesDtoSchema.nullable(), projectAccess: UserProjectAccessDtoSchema.nullable(), role: UserRoleEnumSchema.nullable(), isAdmin: z.boolean() });
export type UserDetailDto = z.infer<typeof UserDetailDtoSchema>;

/** 
 * UserEmailPreferencesUpdateDtoSchema 
 * @type { object }
 * @property { boolean } originDeparture  
 * @property { boolean } loadedOnVessel  
 * @property { boolean } destinationArrival  
 * @property { boolean } onsiteDelivery  
 * @property { DelayNotificationEnum } delay  
 */
export const UserEmailPreferencesUpdateDtoSchema = z.object({ originDeparture: z.boolean(), loadedOnVessel: z.boolean(), destinationArrival: z.boolean(), onsiteDelivery: z.boolean(), delay: DelayNotificationEnumSchema });
export type UserEmailPreferencesUpdateDto = z.infer<typeof UserEmailPreferencesUpdateDtoSchema>;

/** 
 * UserProjectAccessUpdateDtoSchema 
 * @type { object }
 * @property { number[] } projectIds  
 */
export const UserProjectAccessUpdateDtoSchema = z.object({ projectIds: z.array(z.number()) });
export type UserProjectAccessUpdateDto = z.infer<typeof UserProjectAccessUpdateDtoSchema>;

/** 
 * UserUpdateDtoSchema 
 * @type { object }
 * @property { string } name  
 * @property { string } email  
 * @property { string } password  
 * @property { UserEmailPreferencesUpdateDto } emailPreferences  
 * @property { UserProjectAccessUpdateDto } projectAccess  
 */
export const UserUpdateDtoSchema = z.object({ name: z.string(), email: z.email(), password: z.string(), emailPreferences: UserEmailPreferencesUpdateDtoSchema, projectAccess: UserProjectAccessUpdateDtoSchema });
export type UserUpdateDto = z.infer<typeof UserUpdateDtoSchema>;

/** 
 * UserBasicUpdateDtoSchema 
 * @type { object }
 * @property { string } name  
 * @property { string } email  
 */
export const UserBasicUpdateDtoSchema = z.object({ name: z.string(), email: z.email() });
export type UserBasicUpdateDto = z.infer<typeof UserBasicUpdateDtoSchema>;

/** 
 * UserPasswordUpdateDtoSchema 
 * @type { object }
 * @property { string } password  
 */
export const UserPasswordUpdateDtoSchema = z.object({ password: z.string() });
export type UserPasswordUpdateDto = z.infer<typeof UserPasswordUpdateDtoSchema>;

/** 
 * GetUserProfileResponseSchema 
 * @type { object }
 * @property { ApiResponseDataDto } data  
 * @property { PaginationLinksDto } links  
 * @property { UserDetailDto } data.attributes  
 */
export const GetUserProfileResponseSchema = z.object({ ...ApiResponseDtoSchema.shape, ...z.object({ data: z.object({ attributes: UserDetailDtoSchema.nullable() }).partial().nullable() }).partial().shape });
export type GetUserProfileResponse = z.infer<typeof GetUserProfileResponseSchema>;

/** 
 * UpdateUserDataResponseSchema 
 * @type { object }
 * @property { ApiResponseDataDto } data  
 * @property { PaginationLinksDto } links  
 * @property { UserDetailDto } data.attributes  
 */
export const UpdateUserDataResponseSchema = z.object({ ...ApiResponseDtoSchema.shape, ...z.object({ data: z.object({ attributes: UserDetailDtoSchema.nullable() }).partial().nullable() }).partial().shape });
export type UpdateUserDataResponse = z.infer<typeof UpdateUserDataResponseSchema>;

/** 
 * UpdateUserProfileResponseSchema 
 * @type { object }
 * @property { ApiResponseDataDto } data  
 * @property { PaginationLinksDto } links  
 * @property { UserDetailDto } data.attributes  
 */
export const UpdateUserProfileResponseSchema = z.object({ ...ApiResponseDtoSchema.shape, ...z.object({ data: z.object({ attributes: UserDetailDtoSchema.nullable() }).partial().nullable() }).partial().shape });
export type UpdateUserProfileResponse = z.infer<typeof UpdateUserProfileResponseSchema>;

}
