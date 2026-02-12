import type { AbilityTuple, PureAbility } from "@casl/ability";
import { type BoundCanProps, createContextualCan } from "@casl/react";

import { AbilityContext } from "./ability.context";
import type { AppAbilities } from "./appAbility.types";

type CanAbility = PureAbility<AbilityTuple<AppAbilities[0], AppAbilities[1]>>;

const ContextualCan = createContextualCan<CanAbility>(AbilityContext.Consumer);

type CanProps<TAppAbilities extends AppAbilities = AppAbilities> = {
  use: TAppAbilities;
} & Omit<BoundCanProps<CanAbility>, "do" | "I" | "on" | "a" | "an" | "this">;

export const Can = <TAppAbilities extends AppAbilities = AppAbilities>({ use, ...props }: CanProps<TAppAbilities>) => {
  const [action, subject] = use;

  return <ContextualCan {...props} do={action} on={subject} />;
};
