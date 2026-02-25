import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { WorkingDocumentsAmsInstructionsModels } from "./workingDocumentsAmsInstructions.models";
import { CommonModels } from "@/data/common/common.models";

export namespace WorkingDocumentsAmsInstructionsApi {
  export const create = (positionId: string, officeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
      { resSchema: WorkingDocumentsAmsInstructionsModels.AMSInstructionsDocumentResponseDTOSchema },
      `/offices/${officeId}/positions/${positionId}/ams-instructions`,
      undefined,
      config,
    );
  };

  export const getAMSInstructionsData = (
    positionId: string,
    amsInstructionsId: string,
    officeId: string,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.get(
      { resSchema: WorkingDocumentsAmsInstructionsModels.AMSInstructionsDocumentResponseDTOSchema },
      `/offices/${officeId}/positions/${positionId}/ams-instructions/${amsInstructionsId}`,
      config,
    );
  };

  export const updateAMSInstructionsData = (
    positionId: string,
    amsInstructionsId: string,
    officeId: string,
    data: WorkingDocumentsAmsInstructionsModels.UpdateAMSInstructionsDocumentRequestDTO,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.patch(
      { resSchema: WorkingDocumentsAmsInstructionsModels.AMSInstructionsDocumentResponseDTOSchema },
      `/offices/${officeId}/positions/${positionId}/ams-instructions/${amsInstructionsId}`,
      ZodExtended.parse(WorkingDocumentsAmsInstructionsModels.UpdateAMSInstructionsDocumentRequestDTOSchema, data),
      config,
    );
  };

  export const deleteAMSInstructions = (
    positionId: string,
    amsInstructionsId: string,
    officeId: string,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.delete(
      { resSchema: z.void() },
      `/offices/${officeId}/positions/${positionId}/ams-instructions/${amsInstructionsId}`,
      undefined,
      config,
    );
  };

  export const previewAMSInstructions = (
    positionId: string,
    amsInstructionsId: string,
    officeId: string,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.get(
      { resSchema: z.instanceof(Blob) },
      `/offices/${officeId}/positions/${positionId}/ams-instructions/${amsInstructionsId}/preview`,
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

  export const generateAMSInstructions = (
    positionId: string,
    amsInstructionsId: string,
    officeId: string,
    data: CommonModels.GenerateWorkingDocumentRequestDto,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.post(
      { resSchema: z.void() },
      `/offices/${officeId}/positions/${positionId}/ams-instructions/${amsInstructionsId}/generate`,
      ZodExtended.parse(CommonModels.GenerateWorkingDocumentRequestDtoSchema, data),
      config,
    );
  };
}
