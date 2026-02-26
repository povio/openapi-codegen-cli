import { PureAbility, AbilityTuple, Subject } from "@casl/ability";

export type AppAbilities = AbilityTuple<string, Subject>;

export type AppAbility = PureAbility<AppAbilities>;