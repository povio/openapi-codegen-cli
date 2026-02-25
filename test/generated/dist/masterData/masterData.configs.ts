import { dynamicColumns } from "@povio/ui";
import { MasterDataModels } from "./masterData.models";
import { MasterDataQueries } from "./masterData.queries";
import { MasterDataAcl } from "./masterData.acl";

export namespace MasterDataConfigs {
  export const paginatedConfig = {
    meta: {
      title: "Paginated",
    },
    readAll: {
      acl: MasterDataAcl.canUsePaginate,
      schema: MasterDataModels.MasterDataLabelResponseDTOSchema,
      paginated: MasterDataQueries.usePaginate,
      infinite: MasterDataQueries.usePaginateInfinite,
      columns: dynamicColumns({
        schema: MasterDataModels.MasterDataLabelResponseDTOSchema,
        options: {
          columns: {
            id: true,
            label: true,
            type: true,
          },
        },
      }),
    },
  };
}
