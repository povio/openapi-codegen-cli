import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { CommonModels } from "@/data/common/common.models";

export namespace QuoteCargoPackageApi {
export const createPackage = (officeId: string, quoteId: string, cargoId: string, data: QuoteCargoPackageModels.CreatePositionCargoPackageDTO, ) => {
    return AppRestClient.post(
        { resSchema: QuoteCargoPackageModels.PositionCargoPackageResponseDTOSchema },
        `/offices/${officeId}/quotes/${quoteId}/cargos/${cargoId}/packages`,
        ZodExtended.parse(QuoteCargoPackageModels.CreatePositionCargoPackageDTOSchema, data),
        
    )
};
export const updatePackage = (officeId: string, quoteId: string, cargoId: string, packageId: string, data: QuoteCargoPackageModels.UpdatePositionCargoPackageDTO, ) => {
    return AppRestClient.patch(
        { resSchema: QuoteCargoPackageModels.PositionCargoPackageResponseDTOSchema },
        `/offices/${officeId}/quotes/${quoteId}/cargos/${cargoId}/packages/${packageId}`,
        ZodExtended.parse(QuoteCargoPackageModels.UpdatePositionCargoPackageDTOSchema, data),
        
    )
};
export const deletePackage = (officeId: string, quoteId: string, cargoId: string, packageId: string, ) => {
    return AppRestClient.delete(
        { resSchema: z.void() },
        `/offices/${officeId}/quotes/${quoteId}/cargos/${cargoId}/packages/${packageId}`,
        
    )
};
export const duplicatePackage = (officeId: string, quoteId: string, cargoId: string, packageId: string, ) => {
    return AppRestClient.post(
        { resSchema: QuoteCargoPackageModels.PositionCargoPackageResponseDTOSchema },
        `/offices/${officeId}/quotes/${quoteId}/cargos/${cargoId}/packages/${packageId}/duplicate`,
        
    )
};
export const movePackage = (officeId: string, quoteId: string, cargoId: string, packageId: string, data: QuoteCargoPackageModels.MovePositionCargoPackageRequestDTO, ) => {
    return AppRestClient.patch(
        { resSchema: QuoteCargoPackageModels.PositionCargoPackageResponseDTOSchema },
        `/offices/${officeId}/quotes/${quoteId}/cargos/${cargoId}/packages/${packageId}/move`,
        ZodExtended.parse(QuoteCargoPackageModels.MovePositionCargoPackageRequestDTOSchema, data),
        
    )
};
}
