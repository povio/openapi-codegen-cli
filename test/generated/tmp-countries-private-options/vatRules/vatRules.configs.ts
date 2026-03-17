import { dynamicInputs } from "@povio/ui";
import { dynamicColumns } from "@povio/ui";
import { VatRulesModels } from "./vatRules.models";
import { CommonModels } from "@/data/common/common.models";
import { VatRulesQueries } from "./vatRules.queries";
import { VatRulesAcl } from "./vatRules.acl";

export namespace VatRulesConfigs {
export const vatRulesConfig = {
    meta: {
        title: "Vat Rules",
    },
    readAll: {
        acl: VatRulesAcl.canUseList,
        schema: VatRulesModels.VatRuleResponseDTOSchema,
        paginated: VatRulesQueries.useList,
        infinite: VatRulesQueries.useListInfinite,
        filters: {
            schema: VatRulesModels.VatRuleFilterDtoSchema,
            filterDefs: dynamicInputs({
  schema: VatRulesModels.VatRuleFilterDtoSchema,
  options: {
    inputs: {
      matchcode: true,
      name: true,
      type: true,
      officeId: true,
      archived: true,
      search: true,
    },
  },
})
        },
        columns: dynamicColumns({
  schema: VatRulesModels.VatRuleResponseDTOSchema,
  options: {
    columns: {
      id: true,
      matchcode: true,
      name: true,
      vatPercentage: true,
      vatNumber: true,
      noTax: true,
      type: true,
      archived: true,
      isReverseCharge: true,
      createdById: true,
      createdBy: true,
      createdAt: true,
      updatedById: true,
      updatedBy: true,
      updatedAt: true,
      officeId: true,
      office: true,
      bookkeepingId: true,
      bookkeepingTargetAccountNumber: true,
    },
    sortable: VatRulesModels.VatRulesListOrderParamEnumSchema,
  },
}),
    },
    read: {
        acl: VatRulesAcl.canUseFindById,
        schema: VatRulesModels.VatRuleResponseDTOSchema,
        query: VatRulesQueries.useFindById,
    },
    create: {
        acl: VatRulesAcl.canUseCreate,
        schema: VatRulesModels.CreateVatRuleRequestDTOSchema,
        mutation: VatRulesQueries.useCreate,
        inputDefs: dynamicInputs({
  schema: VatRulesModels.CreateVatRuleRequestDTOSchema,
  options: {
    inputs: {
      matchcode: true,
      name: true,
      noTax: true,
      vatPercentage: true,
      vatNumber: true,
      type: true,
      officeId: true,
      isReverseCharge: true,
      bookkeepingId: true,
      bookkeepingTargetAccountNumber: true,
    },
  },
})
    },
    update: {
        acl: VatRulesAcl.canUseUpdate,
        schema: VatRulesModels.UpdateVatRuleRequestDTOSchema,
        mutation: VatRulesQueries.useUpdate,
        inputDefs: dynamicInputs({
  schema: VatRulesModels.UpdateVatRuleRequestDTOSchema,
  options: {
    inputs: {
      matchcode: true,
      name: true,
      noTax: true,
      vatPercentage: true,
      vatNumber: true,
      type: true,
      officeId: true,
      isReverseCharge: true,
      bookkeepingId: true,
      bookkeepingTargetAccountNumber: true,
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
        acl: VatRulesAcl.canUsePaginateLabels,
        schema: CommonModels.LabelResponseDTOSchema,
        paginated: VatRulesQueries.usePaginateLabels,
        infinite: VatRulesQueries.usePaginateLabelsInfinite,
        filters: {
            schema: VatRulesModels.VatRuleFilterDtoSchema,
            filterDefs: dynamicInputs({
  schema: VatRulesModels.VatRuleFilterDtoSchema,
  options: {
    inputs: {
      matchcode: true,
      name: true,
      type: true,
      officeId: true,
      archived: true,
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
    sortable: VatRulesModels.VatRulesPaginateLabelsOrderParamEnumSchema,
  },
}),
    },
};

}
