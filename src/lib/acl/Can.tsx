import type { ReactNode } from "react";

import { Can as CaslCan, type CanProps as CaslCanProps } from "@casl/react";

import type { AppAbilities, AppAbility } from "./appAbility.types";

type CanProps<TAppAbilities extends AppAbilities = AppAbilities> = {
  use: TAppAbilities;
  children: ReactNode | ((isAllowed: boolean, ability: AppAbility) => ReactNode);
} & Omit<CaslCanProps<AppAbility>, "do" | "I" | "on" | "a" | "an" | "this" | "children">;

export const Can = <TAppAbilities extends AppAbilities = AppAbilities>({
  use,
  children,
  ...props
}: CanProps<TAppAbilities>) => {
  const [action, subject] = use;

  return (
    <CaslCan<AppAbility> {...props} do={action} on={subject}>
      {typeof children === "function"
        ? ({ isAllowed, ability }) => (props.passThrough || isAllowed ? children(isAllowed, ability) : null)
        : children}
    </CaslCan>
  );
};
