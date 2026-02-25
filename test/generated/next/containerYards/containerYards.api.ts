import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { ContainerYardsModels } from "./containerYards.models";
import { CommonModels } from "@/data/common/common.models";

export namespace ContainerYardsApi {
export const paginate = (limit: number, order?: string, filter?: ContainerYardsModels.ContainerYardFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: ContainerYardsModels.ContainerYardsPaginateResponseSchema },
        `/container-yards`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(ContainerYardsModels.ContainerYardsPaginateOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(ContainerYardsModels.ContainerYardFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const create = (data: ContainerYardsModels.CreateContainerYardRequestDTO, ) => {
    return AppRestClient.post(
        { resSchema: ContainerYardsModels.ContainerYardResponseDTOSchema },
        `/container-yards`,
        ZodExtended.parse(ContainerYardsModels.CreateContainerYardRequestDTOSchema, data),
        
    )
};
export const paginateLabels = (limit: number, order?: string, filter?: ContainerYardsModels.ContainerYardLabelFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: ContainerYardsModels.ContainerYardsPaginateLabelsResponseSchema },
        `/container-yards/paginate/labels`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(ContainerYardsModels.ContainerYardsPaginateLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(ContainerYardsModels.ContainerYardLabelFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const getLabelById = (id: string, ) => {
    return AppRestClient.get(
        { resSchema: CommonModels.LabelResponseDTOSchema },
        `/container-yards/${id}/labels`,
        
    )
};
export const archive = (id: string, ) => {
    return AppRestClient.patch(
        { resSchema: ContainerYardsModels.ContainerYardResponseDTOSchema },
        `/container-yards/${id}/archive`,
        
    )
};
export const unarchive = (id: string, ) => {
    return AppRestClient.patch(
        { resSchema: ContainerYardsModels.ContainerYardResponseDTOSchema },
        `/container-yards/${id}/unarchive`,
        
    )
};
export const update = (id: string, data: ContainerYardsModels.UpdateContainerYardRequestDTO, ) => {
    return AppRestClient.patch(
        { resSchema: ContainerYardsModels.ContainerYardResponseDTOSchema },
        `/container-yards/${id}`,
        ZodExtended.parse(ContainerYardsModels.UpdateContainerYardRequestDTOSchema, data),
        
    )
};
export const findById = (id: string, ) => {
    return AppRestClient.get(
        { resSchema: ContainerYardsModels.ContainerYardResponseDTOSchema },
        `/container-yards/${id}`,
        
    )
};
}
