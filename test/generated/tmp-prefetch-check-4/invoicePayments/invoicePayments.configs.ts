import { dynamicInputs } from "@povio/ui";
import { dynamicColumns } from "@povio/ui";
import { InvoicePaymentsModels } from "./invoicePayments.models";
import { InvoicePaymentsQueries } from "./invoicePayments.queries";
import { InvoicePaymentsAcl } from "./invoicePayments.acl";

export namespace InvoicePaymentsConfigs {
export const paymentsConfig = {
    meta: {
        title: "Payments",
    },
    readAll: {
        acl: InvoicePaymentsAcl.canUseListOfficePayments,
        schema: InvoicePaymentsModels.OfficePaymentPreviewDtoSchema,
        paginated: InvoicePaymentsQueries.useListOfficePayments,
        infinite: InvoicePaymentsQueries.useListOfficePaymentsInfinite,
        filters: {
            schema: InvoicePaymentsModels.OfficeInvoicePaymentFilterDtoSchema,
            filterDefs: dynamicInputs({
  schema: InvoicePaymentsModels.OfficeInvoicePaymentFilterDtoSchema,
  options: {
    inputs: {
      search: true,
      paymentDate: true,
      invoiceIssuingDate: true,
      invoiceDirection: true,
      createdBy: true,
      businessPartner: true,
    },
  },
})
        },
        columns: dynamicColumns({
  schema: InvoicePaymentsModels.OfficePaymentPreviewDtoSchema,
  options: {
    columns: {
      id: true,
      amount: true,
      positionNumber: true,
      currencyNotation: true,
      paymentDate: true,
      paymentMethod: true,
      comment: true,
      createdAt: true,
      updatedAt: true,
      createdBy: true,
      invoice: true,
      businessPartner: true,
    },
    sortable: InvoicePaymentsModels.ListOfficePaymentsOrderParamEnumSchema,
  },
}),
    },
    create: {
        acl: InvoicePaymentsAcl.canUseBulkCreatePayments,
        schema: InvoicePaymentsModels.BulkCreatePaymentsRequestDtoSchema,
        mutation: InvoicePaymentsQueries.useBulkCreatePayments,
        inputDefs: dynamicInputs({
  schema: InvoicePaymentsModels.BulkCreatePaymentsRequestDtoSchema,
  options: {
    inputs: {
      paymentDate: true,
      invoiceIds: true,
      comment: true,
    },
  },
})
    },
};

export const invoicesPaymentsConfig = {
    meta: {
        title: "Invoices Payments",
    },
    readAll: {
        acl: InvoicePaymentsAcl.canUseList,
        schema: InvoicePaymentsModels.PaymentResponseDtoSchema,
        paginated: InvoicePaymentsQueries.useList,
        infinite: InvoicePaymentsQueries.useListInfinite,
        columns: dynamicColumns({
  schema: InvoicePaymentsModels.PaymentResponseDtoSchema,
  options: {
    columns: {
      id: true,
      amount: true,
      currencyNotation: true,
      paymentDate: true,
      paymentMethod: true,
      bankAccountId: true,
      bankAccount: true,
      comment: true,
      createdAt: true,
      updatedAt: true,
      createdBy: true,
    },
  },
}),
    },
    read: {
        acl: InvoicePaymentsAcl.canUseGetPaymentById,
        schema: InvoicePaymentsModels.PaymentResponseDtoSchema,
        query: InvoicePaymentsQueries.useGetPaymentById,
    },
    create: {
        acl: InvoicePaymentsAcl.canUseCreate,
        schema: InvoicePaymentsModels.CreateInvoicePaymentRequestDtoSchema,
        mutation: InvoicePaymentsQueries.useCreate,
        inputDefs: dynamicInputs({
  schema: InvoicePaymentsModels.CreateInvoicePaymentRequestDtoSchema,
  options: {
    inputs: {
      amount: true,
      paymentDate: true,
      paymentMethod: true,
      bankAccountId: true,
      comment: true,
    },
  },
})
    },
    update: {
        acl: InvoicePaymentsAcl.canUseUpdate,
        schema: InvoicePaymentsModels.UpdateInvoicePaymentRequestDtoSchema,
        mutation: InvoicePaymentsQueries.useUpdate,
        inputDefs: dynamicInputs({
  schema: InvoicePaymentsModels.UpdateInvoicePaymentRequestDtoSchema,
  options: {
    inputs: {
      amount: true,
      paymentDate: true,
      paymentMethod: true,
      bankAccountId: true,
      comment: true,
    },
  },
})
    },
    delete: {
        acl: InvoicePaymentsAcl.canUseDeleteInvoicePayment,
        mutation: InvoicePaymentsQueries.useDeleteInvoicePayment,
    },
};

}
