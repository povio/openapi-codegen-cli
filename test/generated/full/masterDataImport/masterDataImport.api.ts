import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { ZodExtended } from "@/data/zod.extended";
import { MasterDataImportModels } from "./masterDataImport.models";

export namespace MasterDataImportApi {
export const upload = (officeId: string, data: MasterDataImportModels.MasterDataImportUploadRequestDto, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: MasterDataImportModels.MasterDataImportUploadResponseDtoSchema },
        `/offices/${officeId}/master-data/upload`,
        ZodExtended.parse(MasterDataImportModels.MasterDataImportUploadRequestDtoSchema, data),
        config
    )
};
export const postOfficesMasterDataImportByOfficeId = (officeId: string, data: MasterDataImportModels.MasterDataImportRequestDto, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: MasterDataImportModels.MasterDataImportResponseDtoSchema },
        `/offices/${officeId}/master-data/import`,
        ZodExtended.parse(MasterDataImportModels.MasterDataImportRequestDtoSchema, data),
        config
    )
};
export const getImportStatus = (jobId: string, officeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: MasterDataImportModels.ImportStatusResponseDtoSchema },
        `/offices/${officeId}/master-data/import/${jobId}/status`,
        config
    )
};
}
