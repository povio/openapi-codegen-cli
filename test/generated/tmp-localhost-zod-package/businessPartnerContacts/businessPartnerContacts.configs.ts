import { dynamicInputs } from "@povio/ui";
import { dynamicColumns } from "@povio/ui";
import { BusinessPartnerContactsModels } from "./businessPartnerContacts.models";
import { BusinessPartnerContactsQueries } from "./businessPartnerContacts.queries";
import { BusinessPartnerContactsAcl } from "./businessPartnerContacts.acl";

export namespace BusinessPartnerContactsConfigs {
export const paginateConfig = {
    meta: {
        title: "Paginate",
    },
    readAll: {
        acl: BusinessPartnerContactsAcl.canUsePaginateContactLabels,
        schema: CommonModels.LabelResponseDTOSchema,
        paginated: BusinessPartnerContactsQueries.usePaginateContactLabels,
        infinite: BusinessPartnerContactsQueries.usePaginateContactLabelsInfinite,
        filters: {
            schema: BusinessPartnerContactsModels.BusinessPartnerContactFilterDtoSchema,
            filterDefs: dynamicInputs({
  schema: BusinessPartnerContactsModels.BusinessPartnerContactFilterDtoSchema,
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
    sortable: BusinessPartnerContactsModels.PaginateContactLabelsOrderParamEnumSchema,
  },
}),
    },
};

}
