import { dynamicInputs } from "@povio/ui";
import { dynamicColumns } from "@povio/ui";
import { ControlTowerBookingsModels } from "./controlTowerBookings.models";
import { ControlTowerBookingsQueries } from "./controlTowerBookings.queries";

export namespace ControlTowerBookingsConfigs {
  export const bookingsConfig = {
    meta: {
      title: "Bookings",
    },
    readAll: {
      schema: ControlTowerBookingsModels.BookingListItemDtoSchema,
      paginated: ControlTowerBookingsQueries.useFindAll,
      infinite: ControlTowerBookingsQueries.useFindAllInfinite,
      filters: {
        schema: ControlTowerBookingsModels.BookingFilterDtoSchema,
        filterDefs: dynamicInputs({
          schema: ControlTowerBookingsModels.BookingFilterDtoSchema,
          options: {
            inputs: {
              projectId: true,
              search: true,
              companyIds: true,
              purchaseOrderId: true,
            },
          },
        }),
      },
      columns: dynamicColumns({
        schema: ControlTowerBookingsModels.BookingListItemDtoSchema,
        options: {
          columns: {
            id: true,
            bookingNumber: true,
            ets: true,
            eta: true,
            supplierName: true,
            supplierAddress: true,
            lastEvent: true,
            lastEventLocation: true,
            lastEventDate: true,
            journeyFrom: true,
            journeyTo: true,
            vessel: true,
          },
          sortable: ControlTowerBookingsModels.ControlTowerBookingsFindAllOrderParamEnumSchema,
        },
      }),
    },
    read: {
      schema: ControlTowerBookingsModels.BookingResponseDtoSchema,
      query: ControlTowerBookingsQueries.useFindById,
    },
  };
}
