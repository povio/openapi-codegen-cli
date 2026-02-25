import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { CommonModels } from "@/data/common/common.models";

export namespace PositionCargoPackageApi {
export const createPackage = (officeId: string, positionId: string, cargoId: string, data: CommonModels.CreatePositionCargoPackageDTO, ) => {
    return AppRestClient.post(
        { resSchema: CommonModels.PositionCargoPackageResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/cargos/${cargoId}/packages`,
        ZodExtended.parse(CommonModels.CreatePositionCargoPackageDTOSchema, data),
        
    )
};
export const updatePackage = (officeId: string, positionId: string, cargoId: string, packageId: string, data: CommonModels.UpdatePositionCargoPackageDTO, ) => {
    return AppRestClient.patch(
        { resSchema: CommonModels.PositionCargoPackageResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/cargos/${cargoId}/packages/${packageId}`,
        ZodExtended.parse(CommonModels.UpdatePositionCargoPackageDTOSchema, data),
        
    )
};
export const deletePackage = (officeId: string, positionId: string, cargoId: string, packageId: string, ) => {
    return AppRestClient.delete(
        { resSchema: z.void() },
        `/offices/${officeId}/positions/${positionId}/cargos/${cargoId}/packages/${packageId}`,
        
    )
};
export const duplicatePackage = (officeId: string, positionId: string, cargoId: string, packageId: string, ) => {
    return AppRestClient.post(
        { resSchema: CommonModels.PositionCargoPackageResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/cargos/${cargoId}/packages/${packageId}/duplicate`,
        
    )
};
export const movePackage = (officeId: string, positionId: string, cargoId: string, packageId: string, data: CommonModels.MovePositionCargoPackageRequestDTO, ) => {
    return AppRestClient.patch(
        { resSchema: CommonModels.PositionCargoPackageResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/cargos/${cargoId}/packages/${packageId}/move`,
        ZodExtended.parse(CommonModels.MovePositionCargoPackageRequestDTOSchema, data),
        
    )
};
}
