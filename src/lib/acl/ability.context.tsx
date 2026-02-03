import { type PropsWithChildren, createContext, useEffect, useState } from "react";

import { AbilityBuilder, type PureAbility, type RawRuleOf, createMongoAbility } from "@casl/ability";
import { type PackRule, unpackRules } from "@casl/ability/extra";
import { useAbility as useCaslAbility } from "@casl/react";

import { AuthContext } from "../auth/auth.context";
import type { AppAbilities, AppAbility } from "./appAbility.types";

export namespace AbilityContext {
  const createAppAbilityBuilder = () => new AbilityBuilder<AppAbility>(createMongoAbility);

  const initialAppAbility = createAppAbilityBuilder().build();

  const Context = createContext<AppAbility>({} as never);

  export const { Consumer } = Context;

  interface ProviderProps {
    user?: { aclRules?: PackRule<RawRuleOf<AppAbility>>[] } | null;
  }

  export const Provider = ({ children }: PropsWithChildren<ProviderProps>) => {
    const [ability, setAbility] = useState<AppAbility>(initialAppAbility);

    const { user } = AuthContext.useAuth<{ aclRules: PackRule<RawRuleOf<AppAbility>>[] }>();
    useEffect(() => {
      if (!user || !("aclRules" in user)) {
        return;
      }

      const { can, build } = createAppAbilityBuilder();
      const packedRules = user.aclRules;
      const rules = unpackRules(packedRules);
      rules.forEach(({ action, subject, conditions }) => {
        can(action, subject, conditions);
      });
      setAbility(build());
    }, [user]);

    return <Context.Provider value={ability}>{children}</Context.Provider>;
  };

  export const useAbility = <TAppAbilities extends AppAbilities = AppAbilities>() => {
    const ability = useCaslAbility(Context);
    return ability as PureAbility<TAppAbilities>;
  };
}
