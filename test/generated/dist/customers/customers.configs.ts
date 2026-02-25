import { dynamicInputs } from "@povio/ui";
import { dynamicColumns } from "@povio/ui";
import { CustomersModels } from "./customers.models";
import { CustomersQueries } from "./customers.queries";
import { CustomersAcl } from "./customers.acl";

export namespace CustomersConfigs {
  export const customersConfig = {
    meta: {
      title: "Customers",
    },
    readAll: {
      acl: CustomersAcl.canUseList,
      schema: CustomersModels.CustomerListItemDTOSchema,
      paginated: CustomersQueries.useList,
      infinite: CustomersQueries.useListInfinite,
      filters: {
        schema: CustomersModels.CustomerPaginationFilterDtoSchema,
        filterDefs: dynamicInputs({
          schema: CustomersModels.CustomerPaginationFilterDtoSchema,
          options: {
            inputs: {
              firstName: true,
              lastName: true,
              email: true,
              companyId: true,
              businessPartnerId: true,
              search: true,
            },
          },
        }),
      },
      columns: dynamicColumns({
        schema: CustomersModels.CustomerListItemDTOSchema,
        options: {
          columns: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            companyId: true,
            businessPartnerId: true,
            businessPartner: true,
          },
          sortable: CustomersModels.CustomersListOrderParamEnumSchema,
        },
      }),
    },
    read: {
      acl: CustomersAcl.canUseFindById,
      schema: CustomersModels.CustomerResponseDTOSchema,
      query: CustomersQueries.useFindById,
    },
    create: {
      acl: CustomersAcl.canUseCreate,
      schema: CustomersModels.CreateCustomerDTOSchema,
      mutation: CustomersQueries.useCreate,
      inputDefs: dynamicInputs({
        schema: CustomersModels.CreateCustomerDTOSchema,
        options: {
          inputs: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            companyId: true,
            businessPartnerId: true,
          },
        },
      }),
    },
    update: {
      acl: CustomersAcl.canUseUpdate,
      schema: CustomersModels.UpdateCustomerDTOSchema,
      mutation: CustomersQueries.useUpdate,
      inputDefs: dynamicInputs({
        schema: CustomersModels.UpdateCustomerDTOSchema,
        options: {
          inputs: {
            firstName: true,
            lastName: true,
            phone: true,
            companyId: true,
            businessPartnerId: true,
          },
        },
      }),
    },
  };
}
