import { dynamicInputs } from "@povio/ui";
import { dynamicColumns } from "@povio/ui";
import { CommonModels } from "@/data/common/common.models";
import { QuoteCargoQueries } from "./quoteCargo.queries";
import { QuoteCargoAcl } from "./quoteCargo.acl";

export namespace QuoteCargoConfigs {
  export const cargosConfig = {
    meta: {
      title: "Cargos",
    },
    readAll: {
      acl: QuoteCargoAcl.canUseListCargosByQuoteId,
      schema: CommonModels.PositionCargoResponseDTOSchema,
      paginated: QuoteCargoQueries.useListCargosByQuoteId,
      infinite: QuoteCargoQueries.useListCargosByQuoteIdInfinite,
      columns: dynamicColumns({
        schema: CommonModels.PositionCargoResponseDTOSchema,
        options: {
          columns: {
            id: true,
            positionId: true,
            quoteId: true,
            rootFolderId: true,
            cargoType: true,
            autoCalculateTotals: true,
            autoCalculateRates: true,
            autoCalculateVgm: true,
            transportUnitNumber: true,
            seal1: true,
            seal2: true,
            rateOptions: true,
            rateClass: true,
            textForCustoms: true,
            totalVolume: true,
            totalGrossWeight: true,
            totalNetWeight: true,
            totalVolumetricWeight: true,
            totalChargeableWeight: true,
            totalLoadMeter: true,
            ratePerKg: true,
            totalRate: true,
            tare: true,
            vgm: true,
            hsCodeLabels: true,
            note: true,
            packages: true,
            createdAt: true,
            updatedAt: true,
            completeWeight: true,
            packageTotals: true,
          },
        },
      }),
    },
    read: {
      acl: QuoteCargoAcl.canUseGetCargoById,
      schema: CommonModels.PositionCargoResponseDTOSchema,
      query: QuoteCargoQueries.useGetCargoById,
    },
    update: {
      acl: QuoteCargoAcl.canUseUpdateCargo,
      schema: CommonModels.UpdatePositionCargoDTOSchema,
      mutation: QuoteCargoQueries.useUpdateCargo,
      inputDefs: dynamicInputs({
        schema: CommonModels.UpdatePositionCargoDTOSchema,
        options: {
          inputs: {
            cargoTypeId: true,
            note: true,
            autoCalculateTotals: true,
            transportUnitNumber: true,
            seal1: true,
            seal2: true,
            totalVolume: true,
            totalGrossWeight: true,
            totalNetWeight: true,
            totalVolumetricWeight: true,
            totalChargeableWeight: true,
            totalLoadMeter: true,
            rateOptions: true,
            rateClass: true,
            ratePerKg: true,
            totalRate: true,
            textForCustoms: true,
            tare: true,
            vgm: true,
            autoCalculateRates: true,
            autoCalculateVgm: true,
          },
        },
      }),
    },
    delete: {
      acl: QuoteCargoAcl.canUseDeleteCargo,
      mutation: QuoteCargoQueries.useDeleteCargo,
    },
  };
}
