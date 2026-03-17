import { dynamicInputs } from "@povio/ui";
import { dynamicColumns } from "@povio/ui";
import { BusinessPartnersModels } from "./businessPartners.models";
import { BusinessPartnersQueries } from "./businessPartners.queries";
import { BusinessPartnersAcl } from "./businessPartners.acl";

export namespace BusinessPartnersConfigs {
export const businessPartnersConfig = {
    meta: {
        title: "Business Partners",
    },
    readAll: {
        acl: BusinessPartnersAcl.canUsePaginate,
        schema: BusinessPartnersModels.BusinessPartnerListResponseDTOSchema,
        paginated: BusinessPartnersQueries.usePaginate,
        infinite: BusinessPartnersQueries.usePaginateInfinite,
        filters: {
            schema: BusinessPartnersModels.BusinessPartnerFilterDtoSchema,
            filterDefs: dynamicInputs({
  schema: BusinessPartnersModels.BusinessPartnerFilterDtoSchema,
  options: {
    inputs: {
      search: true,
      types: true,
      shortName: true,
      name: true,
      vat: true,
      debtorId: true,
      creditorId: true,
      matchCode: true,
      archived: true,
    },
  },
})
        },
        columns: dynamicColumns({
  schema: BusinessPartnersModels.BusinessPartnerListResponseDTOSchema,
  options: {
    columns: {
      id: true,
      name: true,
      matchCode: true,
      address: true,
      types: true,
      archived: true,
      shortName: true,
      vat: true,
      debtorId: true,
      creditorId: true,
      locked: true,
      currency: true,
      remarks: true,
      createdById: true,
      createdBy: true,
      createdAt: true,
      updatedById: true,
      updatedBy: true,
      updatedAt: true,
    },
    sortable: BusinessPartnersModels.BusinessPartnersPaginateOrderParamEnumSchema,
  },
}),
    },
    read: {
        acl: BusinessPartnersAcl.canUseGetById,
        schema: BusinessPartnersModels.BusinessPartnerDetailResponseDTOSchema,
        query: BusinessPartnersQueries.useGetById,
    },
    create: {
        acl: BusinessPartnersAcl.canUseCreate,
        schema: BusinessPartnersModels.CreateBusinessPartnerRequestDTOSchema,
        mutation: BusinessPartnersQueries.useCreate,
        inputDefs: dynamicInputs({
  schema: BusinessPartnersModels.CreateBusinessPartnerRequestDTOSchema,
  options: {
    inputs: {
      name: true,
      secondaryName: true,
      types: true,
      matchCode: true,
      shortName: true,
      address: true,
    },
  },
})
    },
    update: {
        acl: BusinessPartnersAcl.canUseUpdate,
        schema: BusinessPartnersModels.UpdateBusinessPartnerRequestDTOSchema,
        mutation: BusinessPartnersQueries.useUpdate,
        inputDefs: dynamicInputs({
  schema: BusinessPartnersModels.UpdateBusinessPartnerRequestDTOSchema,
  options: {
    inputs: {
      matchCode: true,
      shortName: true,
      name: true,
      secondaryName: true,
      types: true,
      address: true,
      blAddress: true,
      belongsToId: true,
      salesRepId: true,
      operationsId: true,
      addressIsDifferentForBl: true,
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
        acl: BusinessPartnersAcl.canUsePaginateLabels,
        schema: BusinessPartnersModels.BusinessPartnerPaginatedLabelResponseDTOSchema,
        paginated: BusinessPartnersQueries.usePaginateLabels,
        infinite: BusinessPartnersQueries.usePaginateLabelsInfinite,
        filters: {
            schema: BusinessPartnersModels.BusinessPartnerLabelsFilterDtoSchema,
            filterDefs: dynamicInputs({
  schema: BusinessPartnersModels.BusinessPartnerLabelsFilterDtoSchema,
  options: {
    inputs: {
      search: true,
      ids: true,
      types: true,
      archived: true,
    },
  },
})
        },
        columns: dynamicColumns({
  schema: BusinessPartnersModels.BusinessPartnerPaginatedLabelResponseDTOSchema,
  options: {
    columns: {
      id: true,
      label: true,
      types: true,
    },
    sortable: BusinessPartnersModels.BusinessPartnersPaginateLabelsOrderParamEnumSchema,
  },
}),
    },
};

}
