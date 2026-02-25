import { dynamicInputs } from "@povio/ui";
import { dynamicColumns } from "@povio/ui";
import { CommonModels } from "@/data/common/common.models";
import { BankAccountsModels } from "./bankAccounts.models";
import { BankAccountsQueries } from "./bankAccounts.queries";
import { BankAccountsAcl } from "./bankAccounts.acl";

export namespace BankAccountsConfigs {
  export const paginateConfig = {
    meta: {
      title: "Paginate",
    },
    readAll: {
      acl: BankAccountsAcl.canUsePaginateLabels,
      schema: CommonModels.LabelResponseDTOSchema,
      paginated: BankAccountsQueries.usePaginateLabels,
      infinite: BankAccountsQueries.usePaginateLabelsInfinite,
      filters: {
        schema: BankAccountsModels.BankAccountFilterDtoSchema,
        filterDefs: dynamicInputs({
          schema: BankAccountsModels.BankAccountFilterDtoSchema,
          options: {
            inputs: {
              search: true,
              officeId: true,
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
          sortable: BankAccountsModels.BankAccountsPaginateLabelsOrderParamEnumSchema,
        },
      }),
    },
  };
}
