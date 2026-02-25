import { AppRestClient } from "@/data/app-rest-client";
import { ZodExtended } from "@/data/zod.extended";
import { MasterDataImportModels } from "./masterDataImport.models";

export namespace MasterDataImportApi {
export const upload = (officeId: string, data: MasterDataImportModels.MasterDataImportUploadRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: MasterDataImportModels.MasterDataImportUploadResponseDtoSchema },
        `/offices/${officeId}/master-data/upload`,
        ZodExtended.parse(MasterDataImportModels.MasterDataImportUploadRequestDtoSchema, data),
        
    )
};
export const postOfficesMasterDataImportByOfficeId = (officeId: string, data: MasterDataImportModels.MasterDataImportRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: MasterDataImportModels.MasterDataImportResponseDtoSchema },
        `/offices/${officeId}/master-data/import`,
        ZodExtended.parse(MasterDataImportModels.MasterDataImportRequestDtoSchema, data),
        
    )
};
export const getImportStatus = (jobId: string, officeId: string, ) => {
    return AppRestClient.get(
        { resSchema: MasterDataImportModels.ImportStatusResponseDtoSchema },
        `/offices/${officeId}/master-data/import/${jobId}/status`,
        
    )
};
}
