import { GenerateFile, Import } from "../types/generate";

export const ACL_APP_ABILITY_FILE: GenerateFile = { fileName: "acl/app.ability", extension: "ts" };
export const ACL_ALL_ABILITIES = "AllAbilities";

export const CASL_ABILITY_BINDING = {
  abilityTuple: "AbilityTuple",
  pureAbility: "PureAbility",
  forcedSubject: "ForcedSubject",
  subject: "subject",
};
export const CASL_ABILITY_IMPORT: Import = {
  bindings: [
    CASL_ABILITY_BINDING.abilityTuple,
    CASL_ABILITY_BINDING.pureAbility,
    CASL_ABILITY_BINDING.forcedSubject,
    CASL_ABILITY_BINDING.subject,
  ],
  from: "@casl/ability",
};
