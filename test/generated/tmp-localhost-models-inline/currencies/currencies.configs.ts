import { dynamicInputs } from "@povio/ui";
import { dynamicColumns } from "@povio/ui";
import { CurrenciesModels } from "./currencies.models";
import { CurrenciesQueries } from "./currencies.queries";
import { CurrenciesAcl } from "./currencies.acl";

export namespace CurrenciesConfigs {
export const currenciesConfig = {
    meta: {
        title: "Currencies",
    },
    readAll: {
        acl: CurrenciesAcl.canUseList,
        schema: CurrenciesModels.CurrencyResponseDtoSchema,
        paginated: CurrenciesQueries.useList,
        infinite: CurrenciesQueries.useListInfinite,
        filters: {
            schema: CurrenciesModels.CurrencyPaginationFilterDtoSchema,
            filterDefs: dynamicInputs({
  schema: CurrenciesModels.CurrencyPaginationFilterDtoSchema,
  options: {
    inputs: {
      officeId: true,
      search: true,
    },
  },
})
        },
        columns: dynamicColumns({
  schema: CurrenciesModels.CurrencyResponseDtoSchema,
  options: {
    columns: {
      isoCode: true,
      name: true,
      symbol: true,
      alignment: true,
      createdById: true,
      createdBy: true,
      createdAt: true,
      updatedById: true,
      updatedBy: true,
      updatedAt: true,
    },
    sortable: CurrenciesModels.CurrenciesListOrderParamEnumSchema,
  },
}),
    },
    read: {
        acl: CurrenciesAcl.canUseGetCurrencyById,
        schema: CurrenciesModels.CurrencyResponseDtoSchema,
        query: CurrenciesQueries.useGetCurrencyById,
    },
    create: {
        acl: CurrenciesAcl.canUseCreateCurrency,
        schema: CurrenciesModels.CreateCurrencyRequestDTOSchema,
        mutation: CurrenciesQueries.useCreateCurrency,
        inputDefs: dynamicInputs({
  schema: CurrenciesModels.CreateCurrencyRequestDTOSchema,
  options: {
    inputs: {
      isoCode: true,
      name: true,
      symbol: true,
      alignment: true,
    },
  },
})
    },
    update: {
        acl: CurrenciesAcl.canUseUpdateCurrency,
        schema: CurrenciesModels.UpdateCurrencyRequestDTOSchema,
        mutation: CurrenciesQueries.useUpdateCurrency,
        inputDefs: dynamicInputs({
  schema: CurrenciesModels.UpdateCurrencyRequestDTOSchema,
  options: {
    inputs: {
      name: true,
    },
  },
})
    },
};

export const paginateConfig = {
    meta: {
        title: "Paginate",
    },
    readAll: {
        acl: CurrenciesAcl.canUsePaginateCurrencyLabels,
        schema: CommonModels.LabelResponseDTOSchema,
        paginated: CurrenciesQueries.usePaginateCurrencyLabels,
        infinite: CurrenciesQueries.usePaginateCurrencyLabelsInfinite,
        filters: {
            schema: CurrenciesModels.CurrencyPaginationFilterDtoSchema,
            filterDefs: dynamicInputs({
  schema: CurrenciesModels.CurrencyPaginationFilterDtoSchema,
  options: {
    inputs: {
      officeId: true,
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
    sortable: CurrenciesModels.PaginateCurrencyLabelsOrderParamEnumSchema,
  },
}),
    },
};

export const labelsPaginateConfig = {
    meta: {
        title: "Labels Paginate",
    },
    readAll: {
        acl: CurrenciesAcl.canUsePaginateCurrencyLabelsByOffice,
        schema: CommonModels.LabelResponseDTOSchema,
        paginated: CurrenciesQueries.usePaginateCurrencyLabelsByOffice,
        infinite: CurrenciesQueries.usePaginateCurrencyLabelsByOfficeInfinite,
        filters: {
            schema: CurrenciesModels.CurrencyPaginationFilterDtoSchema,
            filterDefs: dynamicInputs({
  schema: CurrenciesModels.CurrencyPaginationFilterDtoSchema,
  options: {
    inputs: {
      officeId: true,
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
    sortable: CurrenciesModels.PaginateCurrencyLabelsByOfficeOrderParamEnumSchema,
  },
}),
    },
};

}
