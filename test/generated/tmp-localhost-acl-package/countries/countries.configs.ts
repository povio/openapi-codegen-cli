import { dynamicInputs } from "@povio/ui";
import { dynamicColumns } from "@povio/ui";
import { CountriesModels } from "./countries.models";
import { CountriesQueries } from "./countries.queries";
import { CountriesAcl } from "./countries.acl";

export namespace CountriesConfigs {
export const paginateConfig = {
    meta: {
        title: "Paginate",
    },
    readAll: {
        acl: CountriesAcl.canUsePaginate,
        schema: CountriesModels.CountryResponseDTOSchema,
        paginated: CountriesQueries.usePaginate,
        infinite: CountriesQueries.usePaginateInfinite,
        filters: {
            schema: CountriesModels.CountryPaginationFilterDtoSchema,
            filterDefs: dynamicInputs({
  schema: CountriesModels.CountryPaginationFilterDtoSchema,
  options: {
    inputs: {
      search: true,
    },
  },
})
        },
        columns: dynamicColumns({
  schema: CountriesModels.CountryResponseDTOSchema,
  options: {
    columns: {
      id: true,
      name: true,
      isoCode2: true,
      isoCode3: true,
      currencyNotation: true,
      createdById: true,
      createdBy: true,
      createdAt: true,
      updatedById: true,
      updatedBy: true,
      updatedAt: true,
    },
    sortable: CountriesModels.CountriesPaginateOrderParamEnumSchema,
  },
}),
    },
};

export const labelsPaginateConfig = {
    meta: {
        title: "Labels Paginate",
    },
    readAll: {
        acl: CountriesAcl.canUsePaginateCountryLabels,
        schema: CommonModels.LabelResponseDTOSchema,
        paginated: CountriesQueries.usePaginateCountryLabels,
        infinite: CountriesQueries.usePaginateCountryLabelsInfinite,
        filters: {
            schema: CountriesModels.CountryPaginationFilterDtoSchema,
            filterDefs: dynamicInputs({
  schema: CountriesModels.CountryPaginationFilterDtoSchema,
  options: {
    inputs: {
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
    sortable: CountriesModels.PaginateCountryLabelsOrderParamEnumSchema,
  },
}),
    },
};

}
