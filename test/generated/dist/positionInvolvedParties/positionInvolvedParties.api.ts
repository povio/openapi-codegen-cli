import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { PositionInvolvedPartiesModels } from "./positionInvolvedParties.models";
import { CommonModels } from "@/data/common/common.models";

export namespace PositionInvolvedPartiesApi {
  export const findByPositionId = (officeId: string, positionId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
      { resSchema: PositionInvolvedPartiesModels.FindByPositionIdResponseSchema },
      `/offices/${officeId}/positions/${positionId}/involved-parties`,
      config,
    );
  };
  export const create = (
    officeId: string,
    positionId: string,
    data: CommonModels.CreateInvolvedPartyRequestDto,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.post(
      { resSchema: CommonModels.InvolvedPartyResponseDtoSchema },
      `/offices/${officeId}/positions/${positionId}/involved-parties`,
      ZodExtended.parse(CommonModels.CreateInvolvedPartyRequestDtoSchema, data),
      config,
    );
  };
  export const update = (
    officeId: string,
    positionId: string,
    partyId: string,
    data: CommonModels.UpdateInvolvedPartyDto,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.patch(
      { resSchema: CommonModels.InvolvedPartyResponseDtoSchema },
      `/offices/${officeId}/positions/${positionId}/involved-parties/${partyId}`,
      ZodExtended.parse(CommonModels.UpdateInvolvedPartyDtoSchema, data),
      config,
    );
  };
  export const deleteOfficesPositionsInvolvedPartiesByPartyId = (
    officeId: string,
    positionId: string,
    partyId: string,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.delete(
      { resSchema: z.void() },
      `/offices/${officeId}/positions/${positionId}/involved-parties/${partyId}`,
      undefined,
      config,
    );
  };
}
