import { AppRestClient } from "@/data/app-rest-client";
import { ZodExtended } from "@/data/zod.extended";
import { FactoringMergeModels } from "./factoringMerge.models";

export namespace FactoringMergeApi {
export const prepareUpload = (officeId: string, data: FactoringMergeModels.PrepareFactoringMergeRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: FactoringMergeModels.FactoringMergeUploadInstructionsResponseDtoSchema },
        `/offices/${officeId}/factoring-merge/prepare-upload`,
        ZodExtended.parse(FactoringMergeModels.PrepareFactoringMergeRequestDtoSchema, data),
        
    )
};
export const processMerge = (officeId: string, batchId: string, ) => {
    return AppRestClient.post(
        { resSchema: FactoringMergeModels.FactoringMergeBatchResponseDtoSchema },
        `/offices/${officeId}/factoring-merge/${batchId}/process`,
        
    )
};
export const getMergeBatch = (officeId: string, batchId: string, ) => {
    return AppRestClient.get(
        { resSchema: FactoringMergeModels.FactoringMergeBatchResponseDtoSchema },
        `/offices/${officeId}/factoring-merge/${batchId}`,
        
    )
};
}
