import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { CommonModels } from "@/data/common/common.models";

export namespace PositionCargoPackageApi {
  export const createPackage = (
    officeId: string,
    positionId: string,
    cargoId: string,
    data: CommonModels.CreatePositionCargoPackageDTO,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.post(
      { resSchema: CommonModels.PositionCargoPackageResponseDTOSchema },
      `/offices/${officeId}/positions/${positionId}/cargos/${cargoId}/packages`,
      ZodExtended.parse(CommonModels.CreatePositionCargoPackageDTOSchema, data),
      config,
    );
  };
  export const updatePackage = (
    officeId: string,
    positionId: string,
    cargoId: string,
    packageId: string,
    data: CommonModels.UpdatePositionCargoPackageDTO,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.patch(
      { resSchema: CommonModels.PositionCargoPackageResponseDTOSchema },
      `/offices/${officeId}/positions/${positionId}/cargos/${cargoId}/packages/${packageId}`,
      ZodExtended.parse(CommonModels.UpdatePositionCargoPackageDTOSchema, data),
      config,
    );
  };
  export const deletePackage = (
    officeId: string,
    positionId: string,
    cargoId: string,
    packageId: string,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.delete(
      { resSchema: z.void() },
      `/offices/${officeId}/positions/${positionId}/cargos/${cargoId}/packages/${packageId}`,
      undefined,
      config,
    );
  };
  export const duplicatePackage = (
    officeId: string,
    positionId: string,
    cargoId: string,
    packageId: string,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.post(
      { resSchema: CommonModels.PositionCargoPackageResponseDTOSchema },
      `/offices/${officeId}/positions/${positionId}/cargos/${cargoId}/packages/${packageId}/duplicate`,
      undefined,
      config,
    );
  };
  export const movePackage = (
    officeId: string,
    positionId: string,
    cargoId: string,
    packageId: string,
    data: CommonModels.MovePositionCargoPackageRequestDTO,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.patch(
      { resSchema: CommonModels.PositionCargoPackageResponseDTOSchema },
      `/offices/${officeId}/positions/${positionId}/cargos/${cargoId}/packages/${packageId}/move`,
      ZodExtended.parse(CommonModels.MovePositionCargoPackageRequestDTOSchema, data),
      config,
    );
  };
}
