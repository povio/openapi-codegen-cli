import { dynamicInputs } from "@povio/ui";
import { dynamicColumns } from "@povio/ui";
import { ControlTowerContainersModels } from "./controlTowerContainers.models";
import { ControlTowerContainersQueries } from "./controlTowerContainers.queries";

export namespace ControlTowerContainersConfigs {
export const containersConfig = {
    meta: {
        title: "Containers",
    },
    readAll: {
        schema: ControlTowerContainersModels.ContainerListItemDtoSchema,
        paginated: ControlTowerContainersQueries.useFindAll,
        infinite: ControlTowerContainersQueries.useFindAllInfinite,
        filters: {
            schema: ControlTowerContainersModels.ContainerFilterDtoSchema,
            filterDefs: dynamicInputs({
  schema: ControlTowerContainersModels.ContainerFilterDtoSchema,
  options: {
    inputs: {
      companyIds: true,
      search: true,
    },
  },
})
        },
        columns: dynamicColumns({
  schema: ControlTowerContainersModels.ContainerListItemDtoSchema,
  options: {
    columns: {
      containerNumber: true,
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
    sortable: ControlTowerContainersModels.ControlTowerContainersFindAllOrderParamEnumSchema,
  },
}),
    },
    read: {
        schema: ControlTowerContainersModels.ContainerResponseDtoSchema,
        query: ControlTowerContainersQueries.useFindById,
    },
};

}
