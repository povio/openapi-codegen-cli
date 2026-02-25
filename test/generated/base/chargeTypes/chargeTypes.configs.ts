import { dynamicInputs } from "@povio/ui";
import { dynamicColumns } from "@povio/ui";
import { ChargeTypesModels } from "./chargeTypes.models";
import { CommonModels } from "@/data/common/common.models";
import { ChargeTypesQueries } from "./chargeTypes.queries";
import { ChargeTypesAcl } from "./chargeTypes.acl";

export namespace ChargeTypesConfigs {
export const chargeTypesConfig = {
    meta: {
        title: "Charge Types",
    },
    readAll: {
        acl: ChargeTypesAcl.canUsePaginate,
        schema: ChargeTypesModels.ChargeTypeResponseDTOSchema,
        paginated: ChargeTypesQueries.usePaginate,
        infinite: ChargeTypesQueries.usePaginateInfinite,
        filters: {
            schema: ChargeTypesModels.ChargeTypePaginationFilterDtoSchema,
            filterDefs: dynamicInputs({
  schema: ChargeTypesModels.ChargeTypePaginationFilterDtoSchema,
  options: {
    inputs: {
      name: true,
      search: true,
      archived: true,
      direction: true,
      transportModes: true,
    },
  },
})
        },
        columns: dynamicColumns({
  schema: ChargeTypesModels.ChargeTypeResponseDTOSchema,
  options: {
    columns: {
      id: true,
      matchCode: true,
      englishName: true,
      archived: true,
      description: true,
      modules: true,
      directions: true,
      translations: true,
      createdById: true,
      createdBy: true,
      createdAt: true,
      updatedById: true,
      updatedBy: true,
      updatedAt: true,
    },
    sortable: ChargeTypesModels.ChargeTypesPaginateOrderParamEnumSchema,
  },
}),
    },
    read: {
        acl: ChargeTypesAcl.canUseFindById,
        schema: ChargeTypesModels.ChargeTypeResponseDTOSchema,
        query: ChargeTypesQueries.useFindById,
    },
    create: {
        acl: ChargeTypesAcl.canUseCreate,
        schema: ChargeTypesModels.CreateChargeTypeRequestDTOSchema,
        mutation: ChargeTypesQueries.useCreate,
        inputDefs: dynamicInputs({
  schema: ChargeTypesModels.CreateChargeTypeRequestDTOSchema,
  options: {
    inputs: {
      matchCode: true,
      englishName: true,
      archived: true,
      description: true,
      modules: true,
      directions: true,
      translations: true,
    },
  },
})
    },
    update: {
        acl: ChargeTypesAcl.canUseUpdate,
        schema: ChargeTypesModels.UpdateChargeTypeRequestDTOSchema,
        mutation: ChargeTypesQueries.useUpdate,
        inputDefs: dynamicInputs({
  schema: ChargeTypesModels.UpdateChargeTypeRequestDTOSchema,
  options: {
    inputs: {
      matchCode: true,
      englishName: true,
      archived: true,
      description: true,
      modules: true,
      directions: true,
      translations: true,
    },
  },
})
    },
};

export const labelsConfig = {
    meta: {
        title: "Labels",
    },
    readAll: {
        acl: ChargeTypesAcl.canUseFindAll,
        schema: CommonModels.LabelResponseDTOSchema,
        paginated: ChargeTypesQueries.useFindAll,
        infinite: ChargeTypesQueries.useFindAllInfinite,
        filters: {
            schema: ChargeTypesModels.ChargeTypeLabelFilterDtoSchema,
            filterDefs: dynamicInputs({
  schema: ChargeTypesModels.ChargeTypeLabelFilterDtoSchema,
  options: {
    inputs: {
      direction: true,
      transportModes: true,
      search: true,
    },
  },
})
        },
        columns: dynamicColumns({
  schema: CommonModels.LabelResponseDTOSchema,
  options: {
    columns: {
      id: true,
      label: true,
    },
    sortable: ChargeTypesModels.ChargeTypesFindAllOrderParamEnumSchema,
  },
}),
    },
};

}
