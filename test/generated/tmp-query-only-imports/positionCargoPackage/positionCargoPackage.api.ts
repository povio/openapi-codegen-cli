import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { CommonModels } from "@/data/common/common.models";

export namespace PositionCargoPackageApi {
export const createPackage = (officeId: string, positionId: string, cargoId: string, data: PositionCargoPackageModels.CreatePositionCargoPackageDTO, ) => {
    return AppRestClient.post(
        { resSchema: PositionCargoPackageModels.PositionCargoPackageResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/cargos/${cargoId}/packages`,
        ZodExtended.parse(PositionCargoPackageModels.CreatePositionCargoPackageDTOSchema, data),
        
    )
};
export const updatePackage = (officeId: string, positionId: string, cargoId: string, packageId: string, data: PositionCargoPackageModels.UpdatePositionCargoPackageDTO, ) => {
    return AppRestClient.patch(
        { resSchema: PositionCargoPackageModels.PositionCargoPackageResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/cargos/${cargoId}/packages/${packageId}`,
        ZodExtended.parse(PositionCargoPackageModels.UpdatePositionCargoPackageDTOSchema, data),
        
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
        { resSchema: PositionCargoPackageModels.PositionCargoPackageResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/cargos/${cargoId}/packages/${packageId}/duplicate`,
        
    )
};
export const movePackage = (officeId: string, positionId: string, cargoId: string, packageId: string, data: PositionCargoPackageModels.MovePositionCargoPackageRequestDTO, ) => {
    return AppRestClient.patch(
        { resSchema: PositionCargoPackageModels.PositionCargoPackageResponseDTOSchema },
        `/offices/${officeId}/positions/${positionId}/cargos/${cargoId}/packages/${packageId}/move`,
        ZodExtended.parse(PositionCargoPackageModels.MovePositionCargoPackageRequestDTOSchema, data),
        
    )
};
}
