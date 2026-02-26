import { AppRestClient } from "../app-rest-client";
import { z } from "zod";
import { ZodExtended } from "../zod.extended";
import { PetModels } from "./pet.models";

export namespace PetApi {
export const update = (data: PetModels.Pet, ) => {
    return AppRestClient.put(
        { resSchema: PetModels.PetSchema },
        `/pet`,
        ZodExtended.parse(PetModels.PetSchema, data),
        
    )
};
export const add = (data: PetModels.Pet, ) => {
    return AppRestClient.post(
        { resSchema: PetModels.PetSchema },
        `/pet`,
        ZodExtended.parse(PetModels.PetSchema, data),
        
    )
};
export const findByStatus = (status?: PetModels.FindByStatusStatusParam, ) => {
    return AppRestClient.get(
        { resSchema: PetModels.FindByStatusResponseSchema },
        `/pet/findByStatus`,
        {
            params: {
                status: ZodExtended.parse(PetModels.FindByStatusStatusParamSchema.optional(), status, { type: "query", name: "status" }),
            },
        }
    )
};
export const findByTags = (tags?: PetModels.FindByTagsTagsParam, ) => {
    return AppRestClient.get(
        { resSchema: PetModels.FindByTagsResponseSchema },
        `/pet/findByTags`,
        {
            params: {
                tags: ZodExtended.parse(PetModels.FindByTagsTagsParamSchema.optional(), tags, { type: "query", name: "tags" }),
            },
        }
    )
};
export const getById = (petId: number, ) => {
    return AppRestClient.get(
        { resSchema: PetModels.PetSchema },
        `/pet/${petId}`,
        
    )
};
export const updateWithForm = (petId: number, name: string, status: string, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/pet/${petId}`,
        undefined,
        {
            params: {
                name: ZodExtended.parse(z.string().nullish(), name, { type: "query", name: "name" }),
                status: ZodExtended.parse(z.string().nullish(), status, { type: "query", name: "status" }),
            },
        }
    )
};
export const deletePet = (petId: number, api_key?: string, ) => {
    return AppRestClient.delete(
        { resSchema: z.void() },
        `/pet/${petId}`,
        undefined,
        {
            headers: {
                'api_key': api_key,
            },
        }
    )
};
export const uploadFile = (petId: number, data: string, additionalMetadata?: string, ) => {
    return AppRestClient.post(
        { resSchema: PetModels.ApiResponseSchema },
        `/pet/${petId}/uploadImage`,
        ZodExtended.parse(z.instanceof(Blob), data),
        {
            params: {
                additionalMetadata: ZodExtended.parse(z.string().nullish(), additionalMetadata, { type: "query", name: "additionalMetadata" }),
            },
            headers: {
                'Content-Type': 'application/octet-stream',
            },
        }
    )
};
}
