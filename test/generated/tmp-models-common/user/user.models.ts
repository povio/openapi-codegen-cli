import { CommonModels } from "../common/common.models";

export namespace UserModels {
  export const UserSchema = CommonModels.UserSchema;
  export const CreateWithListInputBodySchema = CommonModels.CreateWithListInputBodySchema;
  export type User = CommonModels.User;
  export type CreateWithListInputBody = CommonModels.CreateWithListInputBody;
}
