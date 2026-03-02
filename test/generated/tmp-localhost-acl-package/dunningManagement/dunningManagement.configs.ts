import { dynamicInputs } from "@povio/ui";
import { dynamicColumns } from "@povio/ui";
import { DunningManagementModels } from "./dunningManagement.models";
import { DunningManagementQueries } from "./dunningManagement.queries";
import { DunningManagementAcl } from "./dunningManagement.acl";

export namespace DunningManagementConfigs {
export const dunningsConfig = {
    meta: {
        title: "Dunnings",
    },
    readAll: {
        acl: DunningManagementAcl.canUseListDunnings,
        schema: DunningManagementModels.DunningResponseDtoSchema,
        paginated: DunningManagementQueries.useListDunnings,
        infinite: DunningManagementQueries.useListDunningsInfinite,
        filters: {
            schema: DunningManagementModels.DunningFilterDtoSchema,
            filterDefs: dynamicInputs({
  schema: DunningManagementModels.DunningFilterDtoSchema,
  options: {
    inputs: {
      status: true,
      partnerId: true,
      level: true,
      outstandingAmountMin: true,
      outstandingAmountMax: true,
      createdFrom: true,
      createdTo: true,
      confirmedBy: true,
    },
  },
})
        },
        columns: dynamicColumns({
  schema: DunningManagementModels.DunningResponseDtoSchema,
  options: {
    columns: {
      id: true,
      partner: true,
      level: true,
      dunningLevelId: true,
      status: true,
      invoiceCount: true,
      outstandingAmount: true,
      currencyNotation: true,
      daysOverdue: true,
      dunningFee: true,
      createdAt: true,
      statusChangedOn: true,
      confirmedBy: true,
      documentUrl: true,
    },
    sortable: DunningManagementModels.ListDunningsOrderParamEnumSchema,
  },
}),
    },
};

}
