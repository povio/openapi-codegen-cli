import { z } from "zod";

export namespace UserActivityModels {
/** 
 * ActivityTypeEnumSchema 
 * @type { enum }
 */
export const ActivityTypeEnumSchema = z.enum(["View", "Modify"]);
export type ActivityTypeEnum = z.infer<typeof ActivityTypeEnumSchema>;
export const ActivityTypeEnum = ActivityTypeEnumSchema.enum;

/** 
 * UserSectionActivityDtoSchema 
 * @type { object }
 * @property { string } section Section name 
 * @property { ActivityTypeEnum } activityType Type of activity 
 * @property { string } lastSeen Last seen timestamp 
 */
export const UserSectionActivityDtoSchema = z.object({ section: z.string(), activityType: ActivityTypeEnumSchema, lastSeen: z.iso.datetime({ offset: true }) });
export type UserSectionActivityDto = z.infer<typeof UserSectionActivityDtoSchema>;

/** 
 * ActiveUserDtoSchema 
 * @type { object }
 * @property { string } userId User ID 
 * @property { string } firstName User first name 
 * @property { string } lastName User last name 
 * @property { string } userAvatar User avatar URL 
 * @property { UserSectionActivityDto } section User section activity 
 * @property { string } lastSeen Last seen timestamp 
 * @property { boolean } isCurrentlyActive Is currently active 
 */
export const ActiveUserDtoSchema = z.object({ userId: z.string(), firstName: z.string(), lastName: z.string(), userAvatar: z.string().nullish(), section: UserSectionActivityDtoSchema, lastSeen: z.iso.datetime({ offset: true }), isCurrentlyActive: z.boolean() });
export type ActiveUserDto = z.infer<typeof ActiveUserDtoSchema>;

/** 
 * ActivityEntityTypeEnumSchema 
 * @type { enum }
 */
export const ActivityEntityTypeEnumSchema = z.enum(["Position", "Invoice", "BusinessPartner", "Quote"]);
export type ActivityEntityTypeEnum = z.infer<typeof ActivityEntityTypeEnumSchema>;
export const ActivityEntityTypeEnum = ActivityEntityTypeEnumSchema.enum;

/** 
 * ActivityMetadataDtoSchema 
 * @type { object }
 * @property { number } totalActiveUsers Total number of active users 
 * @property { string } entityId Entity ID 
 * @property { ActivityEntityTypeEnum } entityType Entity type 
 * @property { number } activeThresholdMinutes Active threshold in minutes 
 */
export const ActivityMetadataDtoSchema = z.object({ totalActiveUsers: z.number(), entityId: z.string(), entityType: ActivityEntityTypeEnumSchema, activeThresholdMinutes: z.number() });
export type ActivityMetadataDto = z.infer<typeof ActivityMetadataDtoSchema>;

/** 
 * UserActivityResponseDtoSchema 
 * @type { object }
 * @property { ActiveUserDto[] } activeUsers List of active users 
 * @property { ActivityMetadataDto } metadata Activity metadata 
 */
export const UserActivityResponseDtoSchema = z.object({ activeUsers: z.array(ActiveUserDtoSchema), metadata: ActivityMetadataDtoSchema });
export type UserActivityResponseDto = z.infer<typeof UserActivityResponseDtoSchema>;

}
