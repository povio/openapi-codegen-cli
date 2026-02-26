import { z } from "zod";

export namespace UserModels {
/** 
 * UserSchema 
 * @type { object }
 * @property { integer } id Example: `10` 
 * @property { string } username Example: `theUser` 
 * @property { string } firstName Example: `John` 
 * @property { string } lastName Example: `James` 
 * @property { string } email Example: `john@email.com` 
 * @property { string } password Example: `12345` 
 * @property { string } phone Example: `12345` 
 * @property { integer } userStatus User Status. Example: `1` 
 */
export const UserSchema = z.object({ id: z.int().nullable(), username: z.string().nullable(), firstName: z.string().nullable(), lastName: z.string().nullable(), email: z.string().nullable(), password: z.string().nullable(), phone: z.string().nullable(), userStatus: z.int().nullable() }).partial();
export type User = z.infer<typeof UserSchema>;

/** 
 * CreateWithListInputBodySchema 
 * @type { array }
 */
export const CreateWithListInputBodySchema = z.array(UserSchema);
export type CreateWithListInputBody = z.infer<typeof CreateWithListInputBodySchema>;

}
