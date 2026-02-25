import { dynamicInputs } from "@povio/ui";
import { dynamicColumns } from "@povio/ui";
import { CitiesModels } from "./cities.models";
import { CitiesQueries } from "./cities.queries";
import { CitiesAcl } from "./cities.acl";

export namespace CitiesConfigs {
  export const citiesConfig = {
    meta: {
      title: "Cities",
    },
    readAll: {
      acl: CitiesAcl.canUsePaginate,
      schema: CitiesModels.CityResponseDTOSchema,
      paginated: CitiesQueries.usePaginate,
      infinite: CitiesQueries.usePaginateInfinite,
      filters: {
        schema: CitiesModels.CityPaginationFilterDtoSchema,
        filterDefs: dynamicInputs({
          schema: CitiesModels.CityPaginationFilterDtoSchema,
          options: {
            inputs: {
              search: true,
              archived: true,
            },
          },
        }),
      },
      columns: dynamicColumns({
        schema: CitiesModels.CityResponseDTOSchema,
        options: {
          columns: {
            id: true,
            name: true,
            isoCode: true,
            stateCode: true,
            archived: true,
            countryId: true,
            country: true,
            createdById: true,
            createdBy: true,
            createdAt: true,
            updatedById: true,
            updatedBy: true,
            updatedAt: true,
          },
          sortable: CitiesModels.CitiesPaginateOrderParamEnumSchema,
        },
      }),
    },
    read: {
      acl: CitiesAcl.canUseFindById,
      schema: CitiesModels.CityResponseDTOSchema,
      query: CitiesQueries.useFindById,
    },
    create: {
      acl: CitiesAcl.canUseCreate,
      schema: CitiesModels.CreateCityRequestDTOSchema,
      mutation: CitiesQueries.useCreate,
      inputDefs: dynamicInputs({
        schema: CitiesModels.CreateCityRequestDTOSchema,
        options: {
          inputs: {
            name: true,
            isoCode: true,
            stateCode: true,
            countryId: true,
          },
        },
      }),
    },
    update: {
      acl: CitiesAcl.canUseUpdate,
      schema: CitiesModels.UpdateCityRequestDTOSchema,
      mutation: CitiesQueries.useUpdate,
      inputDefs: dynamicInputs({
        schema: CitiesModels.UpdateCityRequestDTOSchema,
        options: {
          inputs: {
            name: true,
            isoCode: true,
            stateCode: true,
            countryId: true,
          },
        },
      }),
    },
  };

  export const labelsConfig = {
    meta: {
      title: "Labels",
    },
    readAll: {
      acl: CitiesAcl.canUseListCityLabels,
      schema: CitiesModels.CityLabelResponseDTOSchema,
      paginated: CitiesQueries.useListCityLabels,
      infinite: CitiesQueries.useListCityLabelsInfinite,
      filters: {
        schema: CitiesModels.CityLabelFilterDtoSchema,
        filterDefs: dynamicInputs({
          schema: CitiesModels.CityLabelFilterDtoSchema,
          options: {
            inputs: {
              search: true,
            },
          },
        }),
      },
      columns: dynamicColumns({
        schema: CitiesModels.CityLabelResponseDTOSchema,
        options: {
          columns: {
            id: true,
            label: true,
            country: true,
          },
          sortable: CitiesModels.ListCityLabelsOrderParamEnumSchema,
        },
      }),
    },
  };
}
