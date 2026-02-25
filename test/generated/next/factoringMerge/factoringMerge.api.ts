import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { ZodExtended } from "@/data/zod.extended";
import { FactoringMergeModels } from "./factoringMerge.models";

export namespace FactoringMergeApi {
export const prepareUpload = (officeId: string, data: FactoringMergeModels.PrepareFactoringMergeRequestDto, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: FactoringMergeModels.FactoringMergeUploadInstructionsResponseDtoSchema },
        `/offices/${officeId}/factoring-merge/prepare-upload`,
        ZodExtended.parse(FactoringMergeModels.PrepareFactoringMergeRequestDtoSchema, data),
        config
    )
};
export const processMerge = (officeId: string, batchId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: FactoringMergeModels.FactoringMergeBatchResponseDtoSchema },
        `/offices/${officeId}/factoring-merge/${batchId}/process`,
        undefined,
        config
    )
};
export const getMergeBatch = (officeId: string, batchId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: FactoringMergeModels.FactoringMergeBatchResponseDtoSchema },
        `/offices/${officeId}/factoring-merge/${batchId}`,
        config
    )
};
}
