import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { WorkingDocumentsMasterAwbModels } from "./workingDocumentsMasterAwb.models";
import { CommonModels } from "@/data/common/common.models";

export namespace WorkingDocumentsMasterAwbApi {
  export const create = (positionId: string, officeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
      { resSchema: WorkingDocumentsMasterAwbModels.MasterAwbDocumentResponseDTOSchema },
      `/offices/${officeId}/positions/${positionId}/mawbs`,
      undefined,
      config,
    );
  };
  export const getMasterAwbData = (
    positionId: string,
    mawbId: string,
    officeId: string,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.get(
      { resSchema: WorkingDocumentsMasterAwbModels.MasterAwbDocumentResponseDTOSchema },
      `/offices/${officeId}/positions/${positionId}/mawbs/${mawbId}`,
      config,
    );
  };
  export const updateMasterAwbData = (
    positionId: string,
    mawbId: string,
    officeId: string,
    data: WorkingDocumentsMasterAwbModels.UpdateMasterAwbDocumentRequestDTO,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.patch(
      { resSchema: WorkingDocumentsMasterAwbModels.MasterAwbDocumentResponseDTOSchema },
      `/offices/${officeId}/positions/${positionId}/mawbs/${mawbId}`,
      ZodExtended.parse(WorkingDocumentsMasterAwbModels.UpdateMasterAwbDocumentRequestDTOSchema, data),
      config,
    );
  };
  export const deleteMasterAwb = (
    positionId: string,
    mawbId: string,
    officeId: string,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.delete(
      { resSchema: z.void() },
      `/offices/${officeId}/positions/${positionId}/mawbs/${mawbId}`,
      undefined,
      config,
    );
  };
  export const previewMasterAwb = (
    positionId: string,
    mawbId: string,
    officeId: string,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.get(
      { resSchema: z.instanceof(Blob) },
      `/offices/${officeId}/positions/${positionId}/mawbs/${mawbId}/preview`,
      {
        ...config,
        headers: {
          Accept: "application/pdf",
        },
        responseType: "blob",
        rawResponse: true,
      },
    );
  };
  export const generateMasterAwb = (
    positionId: string,
    mawbId: string,
    officeId: string,
    data: CommonModels.GenerateWorkingDocumentRequestDto,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.post(
      { resSchema: z.void() },
      `/offices/${officeId}/positions/${positionId}/mawbs/${mawbId}/generate`,
      ZodExtended.parse(CommonModels.GenerateWorkingDocumentRequestDtoSchema, data),
      config,
    );
  };
}
