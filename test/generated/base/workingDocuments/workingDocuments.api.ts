import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { WorkingDocumentsModels } from "./workingDocuments.models";

export namespace WorkingDocumentsApi {
export const list = (positionId: string, officeId: string, limit: number, order?: string, filter?: WorkingDocumentsModels.WorkingDocumentFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: WorkingDocumentsModels.WorkingDocumentsListResponseSchema },
        `/offices/${officeId}/positions/${positionId}/working-documents`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(WorkingDocumentsModels.WorkingDocumentsListOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(WorkingDocumentsModels.WorkingDocumentFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const findById = (positionId: string, id: string, officeId: string, ) => {
    return AppRestClient.get(
        { resSchema: WorkingDocumentsModels.WorkingDocumentResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/working-documents/${id}`,
        
    )
};
}
