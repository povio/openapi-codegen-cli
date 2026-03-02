import { dynamicInputs } from "@povio/ui";
import { dynamicColumns } from "@povio/ui";
import { DunningPartnerOutstandingInvoicesModels } from "./dunningPartnerOutstandingInvoices.models";
import { DunningPartnerOutstandingInvoicesQueries } from "./dunningPartnerOutstandingInvoices.queries";
import { DunningPartnerOutstandingInvoicesAcl } from "./dunningPartnerOutstandingInvoices.acl";

export namespace DunningPartnerOutstandingInvoicesConfigs {
export const partnerOutstandingInvoicesConfig = {
    meta: {
        title: "Partner Outstanding Invoices",
    },
    readAll: {
        acl: DunningPartnerOutstandingInvoicesAcl.canUseListPartnerOutstandingInvoiceSummaries,
        schema: DunningPartnerOutstandingInvoicesModels.PartnerOutstandingInvoiceSummaryResponseDtoSchema,
        paginated: DunningPartnerOutstandingInvoicesQueries.useListPartnerOutstandingInvoiceSummaries,
        infinite: DunningPartnerOutstandingInvoicesQueries.useListPartnerOutstandingInvoiceSummariesInfinite,
        filters: {
            schema: DunningPartnerOutstandingInvoicesModels.PartnerOutstandingInvoiceSummaryFilterDtoSchema,
            filterDefs: dynamicInputs({
  schema: DunningPartnerOutstandingInvoicesModels.PartnerOutstandingInvoiceSummaryFilterDtoSchema,
  options: {
    inputs: {
      search: true,
      daysOverdueMin: true,
      partnerId: true,
      outstandingAmountMin: true,
      currency: true,
      dunningSystemId: true,
      lastDunningDate: true,
    },
  },
})
        },
        columns: dynamicColumns({
  schema: DunningPartnerOutstandingInvoicesModels.PartnerOutstandingInvoiceSummaryResponseDtoSchema,
  options: {
    columns: {
      partnerId: true,
      partnerName: true,
      partnerCountry: true,
      dunningSystemId: true,
      dunningSystemName: true,
      invoiceCount: true,
      daysOverdue: true,
      outstandingAmount: true,
      currencyNotation: true,
      lastDunningDate: true,
    },
    sortable: DunningPartnerOutstandingInvoicesModels.ListPartnerOutstandingInvoiceSummariesOrderParamEnumSchema,
  },
}),
    },
};

export const outstandingInvoicesConfig = {
    meta: {
        title: "Outstanding Invoices",
    },
    readAll: {
        acl: DunningPartnerOutstandingInvoicesAcl.canUseListPartnerOutstandingInvoices,
        schema: DunningPartnerOutstandingInvoicesModels.PartnerOutstandingInvoiceResponseDtoSchema,
        paginated: DunningPartnerOutstandingInvoicesQueries.useListPartnerOutstandingInvoices,
        infinite: DunningPartnerOutstandingInvoicesQueries.useListPartnerOutstandingInvoicesInfinite,
        filters: {
            schema: DunningPartnerOutstandingInvoicesModels.PartnerOutstandingInvoiceFilterDtoSchema,
            filterDefs: dynamicInputs({
  schema: DunningPartnerOutstandingInvoicesModels.PartnerOutstandingInvoiceFilterDtoSchema,
  options: {
    inputs: {
      partnerId: true,
      currency: true,
    },
  },
})
        },
        columns: dynamicColumns({
  schema: DunningPartnerOutstandingInvoicesModels.PartnerOutstandingInvoiceResponseDtoSchema,
  options: {
    columns: {
      invoiceId: true,
      invoiceNumber: true,
      invoiceDate: true,
      invoiceAmount: true,
      owedAmount: true,
      currencyNotation: true,
      daysOverdue: true,
      dueDate: true,
      invoiceInReview: true,
      dunningBlock: true,
    },
    sortable: DunningPartnerOutstandingInvoicesModels.ListPartnerOutstandingInvoicesOrderParamEnumSchema,
  },
}),
    },
};

}
