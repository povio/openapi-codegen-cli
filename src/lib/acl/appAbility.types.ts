import type { AbilityTuple, Ability, Subject } from "@casl/ability";

export type AppAbilities = AbilityTuple<string, Subject>;

export type AppAbility = Ability<AppAbilities>;
