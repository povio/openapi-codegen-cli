import { GenerateFile, Import } from "@/generators/types/generate";

export const ACL_APP_ABILITY_FILE: GenerateFile = { fileName: "acl/app.ability", extension: "ts" };
export const ACL_APP_ABILITIES = "AppAbilities";

export const ACL_CHECK_HOOK = "useAclCheck";

export const CASL_ABILITY_BINDING = {
  abilityTuple: "AbilityTuple",
  pureAbility: "PureAbility",
  forcedSubject: "ForcedSubject",
  subjectType: "Subject",
  subject: "subject",
};
export const CASL_ABILITY_IMPORT: Import = {
  bindings: [
    CASL_ABILITY_BINDING.abilityTuple,
    CASL_ABILITY_BINDING.pureAbility,
    CASL_ABILITY_BINDING.forcedSubject,
    CASL_ABILITY_BINDING.subjectType,
    CASL_ABILITY_BINDING.subject,
  ],
  from: "@casl/ability",
};
