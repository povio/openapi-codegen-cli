import { dynamicInputs } from "@povio/ui";
import { dynamicColumns } from "@povio/ui";
import { InvoicesModels } from "./invoices.models";
import { CommonModels } from "@/data/common/common.models";
import { InvoicesQueries } from "./invoices.queries";
import { InvoicesAcl } from "./invoices.acl";

export namespace InvoicesConfigs {
  export const invoicesConfig = {
    meta: {
      title: "Invoices",
    },
    readAll: {
      acl: InvoicesAcl.canUseFindByOffice,
      schema: InvoicesModels.OfficeInvoicePreviewDtoSchema,
      paginated: InvoicesQueries.useFindByOffice,
      infinite: InvoicesQueries.useFindByOfficeInfinite,
      filters: {
        schema: CommonModels.OfficeInvoiceFilterDtoSchema,
        filterDefs: dynamicInputs({
          schema: CommonModels.OfficeInvoiceFilterDtoSchema,
          options: {
            inputs: {
              search: true,
              issuingDate: true,
              serviceDate: true,
              invoiceDirection: true,
              invoiceType: true,
              collective: true,
              amountMin: true,
              amountMax: true,
              currencyNotation: true,
              vatRule: true,
              dueDate: true,
              status: true,
              receiver: true,
              receiverCountry: true,
              salesRep: true,
              positionNumbersString: true,
              positionNumbers: true,
              invoiceNumbersString: true,
              invoiceNumbers: true,
              bookkeepingExportStatus: true,
              dunningBlock: true,
              invoiceInReview: true,
              isInvoiceOk: true,
              isVatOk: true,
              invoiceNumberMin: true,
              invoiceNumberMax: true,
              internalNumberMin: true,
              internalNumberMax: true,
              externalSystemId: true,
              hblNumber: true,
              mblNumber: true,
              bookingNumber: true,
              vessel: true,
              voyage: true,
              creditorId: true,
              debtorId: true,
            },
          },
        }),
      },
      columns: dynamicColumns({
        schema: InvoicesModels.OfficeInvoicePreviewDtoSchema,
        options: {
          columns: {
            id: true,
            createdAt: true,
            invoiceNumber: true,
            invoiceDirection: true,
            issuingDate: true,
            invoiceType: true,
            collective: true,
            serviceDate: true,
            internalNumber: true,
            reference: true,
            amount: true,
            netAmount: true,
            tax: true,
            currency: true,
            dueDate: true,
            status: true,
            payDate: true,
            paidAmount: true,
            position: true,
            receiver: true,
            receiverCountry: true,
            clerk: true,
            cancelled: true,
            ok: true,
            isExportedToBookkeeping: true,
            dunningBlock: true,
            invoiceInReview: true,
            vatOk: true,
            comments: true,
            paymentComment: true,
            creditorId: true,
            debtorId: true,
            hblNumber: true,
            mblNumber: true,
            bookingNumber: true,
            vessel: true,
            voyage: true,
            vatRules: true,
          },
          sortable: InvoicesModels.FindByOfficeOrderParamEnumSchema,
        },
      }),
    },
    read: {
      acl: InvoicesAcl.canUseGetDetail,
      schema: InvoicesModels.InvoiceDetailDtoSchema,
      query: InvoicesQueries.useGetDetail,
    },
    create: {
      acl: InvoicesAcl.canUseCreateDraft,
      schema: InvoicesModels.CreateDraftInvoiceRequestDtoSchema,
      mutation: InvoicesQueries.useCreateDraft,
      inputDefs: dynamicInputs({
        schema: InvoicesModels.CreateDraftInvoiceRequestDtoSchema,
        options: {
          inputs: {
            chargeItemIds: true,
            invoiceType: true,
            customerId: true,
            direction: true,
          },
        },
      }),
    },
    update: {
      acl: InvoicesAcl.canUseUpdate,
      schema: InvoicesModels.UpdateInvoiceRequestDtoSchema,
      mutation: InvoicesQueries.useUpdate,
      inputDefs: dynamicInputs({
        schema: InvoicesModels.UpdateInvoiceRequestDtoSchema,
        options: {
          inputs: {
            issuingDate: true,
            receiptDate: true,
            serviceDate: true,
            serviceDateUntil: true,
            dueDate: true,
            invoiceNumber: true,
            internalNumber: true,
            paymentTermDays: true,
            paymentTermType: true,
            serviceRecipientId: true,
            bankAccountId: true,
            remarks: true,
            language: true,
            showPaymentInstructions: true,
            customer: true,
            salesRepId: true,
            currencyNotation: true,
            exchangeRate: true,
          },
        },
      }),
    },
    delete: {
      acl: InvoicesAcl.canUseDeleteInvoice,
      mutation: InvoicesQueries.useDeleteInvoice,
    },
  };

  export const uninvoicedChargesConfig = {
    meta: {
      title: "Uninvoiced Charges",
    },
    readAll: {
      acl: InvoicesAcl.canUseGetOfficeUnCharges,
      schema: InvoicesModels.UninvoicedChargeDtoSchema,
      paginated: InvoicesQueries.useGetOfficeUnCharges,
      infinite: InvoicesQueries.useGetOfficeUnChargesInfinite,
      filters: {
        schema: InvoicesModels.UninvoicedChargesFilterDtoSchema,
        filterDefs: dynamicInputs({
          schema: InvoicesModels.UninvoicedChargesFilterDtoSchema,
          options: {
            inputs: {
              direction: true,
              chargeItemId: true,
              receiverIds: true,
              positionIds: true,
              chargeTypeIds: true,
              serviceDate: true,
              currencies: true,
              vatRuleIds: true,
              employeeIds: true,
            },
          },
        }),
      },
      columns: dynamicColumns({
        schema: InvoicesModels.UninvoicedChargeDtoSchema,
        options: {
          columns: {
            chargeItemId: true,
            invoiceDirection: true,
            receiver: true,
            position: true,
            chargeType: true,
            currencyNotation: true,
            amount: true,
            amountInOfficeCurrency: true,
            officeCurrency: true,
            exchangeRate: true,
            vatRule: true,
            serviceDate: true,
            status: true,
            missingInformation: true,
            employee: true,
          },
          sortable: InvoicesModels.GetOfficeUnChargesOrderParamEnumSchema,
        },
      }),
    },
  };

  export const positionsInvoicesConfig = {
    meta: {
      title: "Positions Invoices",
    },
    readAll: {
      acl: InvoicesAcl.canUseFind,
      schema: InvoicesModels.InvoicePreviewDtoSchema,
      paginated: InvoicesQueries.useFind,
      infinite: InvoicesQueries.useFindInfinite,
      filters: {
        schema: InvoicesModels.InvoiceFilterDtoSchema,
        filterDefs: dynamicInputs({
          schema: InvoicesModels.InvoiceFilterDtoSchema,
          options: {
            inputs: {
              status: true,
              direction: true,
              receiver: true,
            },
          },
        }),
      },
      columns: dynamicColumns({
        schema: InvoicesModels.InvoicePreviewDtoSchema,
        options: {
          columns: {
            id: true,
            invoiceDirection: true,
            invoiceType: true,
            invoiceNumber: true,
            issuingDate: true,
            amount: true,
            currencyNotation: true,
            status: true,
            isExportedToBookkeeping: true,
            internalNumber: true,
            receiver: true,
            representative: true,
            collective: true,
            creditNote: true,
            cancelledInvoice: true,
          },
          sortable: InvoicesModels.InvoicesFindOrderParamEnumSchema,
        },
      }),
    },
  };

  export const positionsUninvoicedChargesConfig = {
    meta: {
      title: "Positions Uninvoiced Charges",
    },
    readAll: {
      acl: InvoicesAcl.canUseGetUnCharges,
      schema: InvoicesModels.UninvoicedChargeDtoSchema,
      paginated: InvoicesQueries.useGetUnCharges,
      infinite: InvoicesQueries.useGetUnChargesInfinite,
      filters: {
        schema: InvoicesModels.UninvoicedChargePaginationDtoSchema,
        filterDefs: dynamicInputs({
          schema: InvoicesModels.UninvoicedChargePaginationDtoSchema,
          options: {
            inputs: {
              direction: true,
              chargeItemId: true,
              receiverId: true,
              chargeTypeId: true,
              serviceDate: true,
              currency: true,
              vatRuleId: true,
            },
          },
        }),
      },
      columns: dynamicColumns({
        schema: InvoicesModels.UninvoicedChargeDtoSchema,
        options: {
          columns: {
            chargeItemId: true,
            invoiceDirection: true,
            receiver: true,
            position: true,
            chargeType: true,
            currencyNotation: true,
            amount: true,
            amountInOfficeCurrency: true,
            officeCurrency: true,
            exchangeRate: true,
            vatRule: true,
            serviceDate: true,
            status: true,
            missingInformation: true,
            employee: true,
          },
          sortable: InvoicesModels.GetUnChargesOrderParamEnumSchema,
        },
      }),
    },
  };
}
