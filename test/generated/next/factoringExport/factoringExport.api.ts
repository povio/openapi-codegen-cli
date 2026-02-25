import { AppRestClient } from "@/data/app-rest-client";
import { ZodExtended } from "@/data/zod.extended";
import { FactoringExportModels } from "./factoringExport.models";

export namespace FactoringExportApi {
export const create = (officeId: string, data: FactoringExportModels.CreateFactoringExportRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: FactoringExportModels.FactoringExportBatchResponseDtoSchema },
        `/offices/${officeId}/factoring-exports`,
        ZodExtended.parse(FactoringExportModels.CreateFactoringExportRequestDtoSchema, data),
        
    )
};
export const getBatch = (batchId: string, officeId: string, ) => {
    return AppRestClient.get(
        { resSchema: FactoringExportModels.FactoringExportBatchResponseDtoSchema },
        `/offices/${officeId}/factoring-exports/${batchId}`,
        
    )
};
}
