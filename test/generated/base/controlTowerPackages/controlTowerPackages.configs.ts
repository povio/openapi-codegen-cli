import { dynamicInputs } from "@povio/ui";
import { dynamicColumns } from "@povio/ui";
import { ControlTowerPackagesModels } from "./controlTowerPackages.models";
import { ControlTowerPackagesQueries } from "./controlTowerPackages.queries";

export namespace ControlTowerPackagesConfigs {
  export const packagesConfig = {
    meta: {
      title: "Packages",
    },
    readAll: {
      schema: ControlTowerPackagesModels.PackageListItemDtoSchema,
      paginated: ControlTowerPackagesQueries.useFindAll,
      infinite: ControlTowerPackagesQueries.useFindAllInfinite,
      filters: {
        schema: ControlTowerPackagesModels.PackageFilterDtoSchema,
        filterDefs: dynamicInputs({
          schema: ControlTowerPackagesModels.PackageFilterDtoSchema,
          options: {
            inputs: {
              search: true,
            },
          },
        }),
      },
      columns: dynamicColumns({
        schema: ControlTowerPackagesModels.PackageListItemDtoSchema,
        options: {
          columns: {
            packageNumber: true,
            bookingId: true,
            id: true,
            ets: true,
            eta: true,
            supplierName: true,
            supplierAddress: true,
            lastEvent: true,
            lastEventLocation: true,
            lastEventDate: true,
            journeyFrom: true,
            journeyTo: true,
            vessel: true,
          },
          sortable: ControlTowerPackagesModels.ControlTowerPackagesFindAllOrderParamEnumSchema,
        },
      }),
    },
  };
}
