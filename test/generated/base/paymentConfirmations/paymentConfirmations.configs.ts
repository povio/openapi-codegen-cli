import { dynamicInputs } from "@povio/ui";
import { dynamicColumns } from "@povio/ui";
import { PaymentConfirmationsModels } from "./paymentConfirmations.models";
import { PaymentConfirmationsQueries } from "./paymentConfirmations.queries";
import { PaymentConfirmationsAcl } from "./paymentConfirmations.acl";

export namespace PaymentConfirmationsConfigs {
  export const paymentConfirmationsConfig = {
    meta: {
      title: "Payment Confirmations",
    },
    readAll: {
      acl: PaymentConfirmationsAcl.canUseGet,
      schema: PaymentConfirmationsModels.PaymentConfirmationItemDtoSchema,
      paginated: PaymentConfirmationsQueries.useGet,
      infinite: PaymentConfirmationsQueries.useGetInfinite,
      filters: {
        schema: PaymentConfirmationsModels.PaymentConfirmationItemFilterDtoSchema,
        filterDefs: dynamicInputs({
          schema: PaymentConfirmationsModels.PaymentConfirmationItemFilterDtoSchema,
          options: {
            inputs: {
              businessPartnerId: true,
              paymentDate: true,
            },
          },
        }),
      },
      columns: dynamicColumns({
        schema: PaymentConfirmationsModels.PaymentConfirmationItemDtoSchema,
        options: {
          columns: {
            invoiceId: true,
            invoiceNumber: true,
            invoiceDate: true,
            invoiceAmount: true,
            amount: true,
            currencyNotation: true,
            reference: true,
            position: true,
            paymentDate: true,
          },
          sortable: PaymentConfirmationsModels.PaymentConfirmationsGetOrderParamEnumSchema,
        },
      }),
    },
  };
}
