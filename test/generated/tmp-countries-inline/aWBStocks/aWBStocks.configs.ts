import { dynamicInputs } from "@povio/ui";
import { dynamicColumns } from "@povio/ui";
import { AWBStocksModels } from "./aWBStocks.models";
import { AWBStocksQueries } from "./aWBStocks.queries";
import { AWBStocksAcl } from "./aWBStocks.acl";

export namespace AWBStocksConfigs {
export const awbStocksConfig = {
    meta: {
        title: "Awb Stocks",
    },
    readAll: {
        acl: AWBStocksAcl.canUsePaginate,
        schema: AWBStocksModels.AWBStockResponseDTOSchema,
        paginated: AWBStocksQueries.usePaginate,
        infinite: AWBStocksQueries.usePaginateInfinite,
        filters: {
            schema: AWBStocksModels.AWBStockFilterDtoSchema,
            filterDefs: dynamicInputs({
  schema: AWBStocksModels.AWBStockFilterDtoSchema,
  options: {
    inputs: {
      archived: true,
      carrierId: true,
      searchQuery: true,
      used: true,
    },
  },
})
        },
        columns: dynamicColumns({
  schema: AWBStocksModels.AWBStockResponseDTOSchema,
  options: {
    columns: {
      id: true,
      carrier: true,
      startNumber: true,
      lastUsedNumber: true,
      stock: true,
      usedCodes: true,
      priority: true,
      archived: true,
      comments: true,
      createdAt: true,
      updatedAt: true,
      createdBy: true,
      updatedBy: true,
      officeId: true,
    },
    sortable: AWBStocksModels.AWBStocksPaginateOrderParamEnumSchema,
  },
}),
    },
    read: {
        acl: AWBStocksAcl.canUseFindById,
        schema: AWBStocksModels.AWBStockResponseDTOSchema,
        query: AWBStocksQueries.useFindById,
    },
    create: {
        acl: AWBStocksAcl.canUseCreate,
        schema: AWBStocksModels.CreateAWBStockRequestDTOSchema,
        mutation: AWBStocksQueries.useCreate,
        inputDefs: dynamicInputs({
  schema: AWBStocksModels.CreateAWBStockRequestDTOSchema,
  options: {
    inputs: {
      carrierId: true,
      startNumber: true,
      stock: true,
      priority: true,
      comments: true,
      officeId: true,
    },
  },
})
    },
    update: {
        acl: AWBStocksAcl.canUseUpdate,
        schema: AWBStocksModels.UpdateAWBStockRequestDTOSchema,
        mutation: AWBStocksQueries.useUpdate,
        inputDefs: dynamicInputs({
  schema: AWBStocksModels.UpdateAWBStockRequestDTOSchema,
  options: {
    inputs: {
      comments: true,
    },
  },
})
    },
};

}
