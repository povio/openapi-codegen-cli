import { dynamicInputs } from "@povio/ui";
import { dynamicColumns } from "@povio/ui";
import { CargoTypesModels } from "./cargoTypes.models";
import { CommonModels } from "@/data/common/common.models";
import { CargoTypesQueries } from "./cargoTypes.queries";
import { CargoTypesAcl } from "./cargoTypes.acl";

export namespace CargoTypesConfigs {
  export const cargoTypesConfig = {
    meta: {
      title: "Cargo Types",
    },
    readAll: {
      acl: CargoTypesAcl.canUsePaginate,
      schema: CargoTypesModels.CargoTypeResponseDTOSchema,
      paginated: CargoTypesQueries.usePaginate,
      infinite: CargoTypesQueries.usePaginateInfinite,
      filters: {
        schema: CargoTypesModels.CargoTypePaginationFilterDtoSchema,
        filterDefs: dynamicInputs({
          schema: CargoTypesModels.CargoTypePaginationFilterDtoSchema,
          options: {
            inputs: {
              module: true,
              archived: true,
              search: true,
            },
          },
        }),
      },
      columns: dynamicColumns({
        schema: CargoTypesModels.CargoTypeResponseDTOSchema,
        options: {
          columns: {
            id: true,
            name: true,
            shortName: true,
            length: true,
            width: true,
            height: true,
            unit: true,
            emptyWeight: true,
            containerIsoCode: true,
            isContainer: true,
            modules: true,
            archived: true,
            createdById: true,
            createdBy: true,
            createdAt: true,
            updatedById: true,
            updatedBy: true,
            updatedAt: true,
          },
          sortable: CargoTypesModels.CargoTypesPaginateOrderParamEnumSchema,
        },
      }),
    },
    read: {
      acl: CargoTypesAcl.canUseFindById,
      schema: CargoTypesModels.CargoTypeResponseDTOSchema,
      query: CargoTypesQueries.useFindById,
    },
    create: {
      acl: CargoTypesAcl.canUseCreate,
      schema: CargoTypesModels.CreateCargoTypeRequestDTOSchema,
      mutation: CargoTypesQueries.useCreate,
      inputDefs: dynamicInputs({
        schema: CargoTypesModels.CreateCargoTypeRequestDTOSchema,
        options: {
          inputs: {
            name: true,
            shortName: true,
            length: true,
            width: true,
            height: true,
            emptyWeight: true,
            containerIsoCode: true,
            isContainer: true,
            unit: true,
            modules: true,
          },
        },
      }),
    },
    update: {
      acl: CargoTypesAcl.canUseUpdate,
      schema: CargoTypesModels.UpdateCargoTypeRequestDTOSchema,
      mutation: CargoTypesQueries.useUpdate,
      inputDefs: dynamicInputs({
        schema: CargoTypesModels.UpdateCargoTypeRequestDTOSchema,
        options: {
          inputs: {
            name: true,
            shortName: true,
            length: true,
            width: true,
            height: true,
            emptyWeight: true,
            containerIsoCode: true,
            isContainer: true,
            unit: true,
            modules: true,
          },
        },
      }),
    },
  };

  export const paginateConfig = {
    meta: {
      title: "Paginate",
    },
    readAll: {
      acl: CargoTypesAcl.canUsePaginateLabels,
      schema: CommonModels.LabelResponseDTOSchema,
      paginated: CargoTypesQueries.usePaginateLabels,
      infinite: CargoTypesQueries.usePaginateLabelsInfinite,
      filters: {
        schema: CargoTypesModels.CargoTypeLabelFilterDtoSchema,
        filterDefs: dynamicInputs({
          schema: CargoTypesModels.CargoTypeLabelFilterDtoSchema,
          options: {
            inputs: {
              search: true,
            },
          },
        }),
      },
      columns: dynamicColumns({
        schema: CommonModels.LabelResponseDTOSchema,
        options: {
          columns: {
            id: true,
            label: true,
          },
          sortable: CargoTypesModels.CargoTypesPaginateLabelsOrderParamEnumSchema,
        },
      }),
    },
  };
}
