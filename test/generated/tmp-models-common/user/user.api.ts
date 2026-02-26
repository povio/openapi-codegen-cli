import { AppRestClient } from "../app-rest-client";
import { z } from "zod";
import { ZodExtended } from "../zod.extended";
import { UserModels } from "./user.models";

export namespace UserApi {
export const create = (data: UserModels.User, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/user`,
        ZodExtended.parse(UserModels.UserSchema.optional(), data),
        
    )
};
export const createWithListInput = (data: UserModels.CreateWithListInputBody, ) => {
    return AppRestClient.post(
        { resSchema: UserModels.UserSchema },
        `/user/createWithList`,
        ZodExtended.parse(UserModels.CreateWithListInputBodySchema.optional(), data),
        
    )
};
export const login = (username?: string, password?: string, ) => {
    return AppRestClient.get(
        { resSchema: z.string() },
        `/user/login`,
        {
            params: {
                username: ZodExtended.parse(z.string().nullish(), username, { type: "query", name: "username" }),
                password: ZodExtended.parse(z.string().nullish(), password, { type: "query", name: "password" }),
            },
            headers: {
                'Accept': 'application/xml',
            },
        }
    )
};
export const logout = () => {
    return AppRestClient.get(
        { resSchema: z.void() },
        `/user/logout`,
        
    )
};
export const getByName = (username: string, ) => {
    return AppRestClient.get(
        { resSchema: UserModels.UserSchema },
        `/user/${username}`,
        
    )
};
export const update = (username: string, data: UserModels.User, ) => {
    return AppRestClient.put(
        { resSchema: z.void() },
        `/user/${username}`,
        ZodExtended.parse(UserModels.UserSchema.optional(), data),
        
    )
};
export const deleteUser = (username: string, ) => {
    return AppRestClient.delete(
        { resSchema: z.void() },
        `/user/${username}`,
        
    )
};
}
