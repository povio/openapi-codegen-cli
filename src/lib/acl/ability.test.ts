import { createElement } from "react";

import { subject, type RawRuleOf } from "@casl/ability";
import { packRules } from "@casl/ability/extra";
import { act, create, type ReactTestRenderer } from "react-test-renderer";
import { describe, expect, it } from "vitest";

import { AuthContext } from "../auth/auth.context";
import { AbilityContext } from "./ability.context";
import { Can } from "./Can";
import type { AppAbility } from "./appAbility.types";

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

const noop = () => {};

describe("CASL 7 runtime integration", () => {
  it("provides the same ability to hooks, Consumer and Can, and updates packed conditional rules", async () => {
    let ability!: AppAbility;
    let consumedAbility!: AppAbility;
    const callbacks: boolean[] = [];
    function Probe() {
      ability = AbilityContext.useAbility();
      return createElement(AbilityContext.Consumer, {
        children: (value: AppAbility) => {
          consumedAbility = value;
          return createElement(Can, {
            use: ["read", subject("Item", { workspaceId: "mine" })],
            passThrough: true,
            children: (isAllowed: boolean, currentAbility: AppAbility) => {
              expect(currentAbility).toBe(ability);
              callbacks.push(isAllowed);
              return createElement("span", null, String(isAllowed));
            },
          });
        },
      });
    }
    const tree = (rules: RawRuleOf<AppAbility>[]) =>
      createElement(AuthContext.Provider, {
        isAuthenticated: true,
        isInitializing: false,
        logout: noop,
        user: { aclRules: packRules(rules) },
        children: createElement(AbilityContext.Provider, { children: createElement(Probe) }),
      });
    let renderer!: ReactTestRenderer;
    try {
      await act(async () => {
        renderer = create(tree([{ action: "read", subject: "Item", conditions: { workspaceId: "mine" } }]));
      });
      expect(consumedAbility).toBe(ability);
      expect(ability.can("read", subject("Item", { workspaceId: "mine" }))).toBe(true);
      expect(ability.can("read", subject("Item", { workspaceId: "other" }))).toBe(false);
      expect(renderer.toJSON()).toMatchObject({ children: ["true"] });
      await act(async () => renderer.update(tree([])));
      expect(renderer.toJSON()).toMatchObject({ children: ["false"] });
      expect(callbacks).toContain(true);
      expect(callbacks.at(-1)).toBe(false);
      await act(async () => renderer.update(tree([{ action: "read", subject: "Item", conditions: {} }])));
      expect(ability.can("read", subject("Item", { workspaceId: "other" }))).toBe(true);
      expect(renderer.toJSON()).toMatchObject({ children: ["true"] });
      await act(async () => {
        ability.update([]);
      });
      expect(renderer.toJSON()).toMatchObject({ children: ["false"] });
      expect(consumedAbility).toBe(ability);
    } finally {
      await act(async () => renderer?.unmount());
    }
  });

  it("renders Can children for allow, deny, and not checks", async () => {
    let renderer!: ReactTestRenderer;
    try {
      await act(async () => {
        renderer = create(
          createElement(AuthContext.Provider, {
            isAuthenticated: true,
            isInitializing: false,
            logout: noop,
            user: { aclRules: packRules([{ action: "read", subject: "Item" }]) },
            children: createElement(AbilityContext.Provider, {
              children: [
                createElement(Can, { key: "allow", use: ["read", "Item"], children: "allowed" }),
                createElement(Can, { key: "deny", use: ["delete", "Item"], children: "denied" }),
                createElement(Can, { key: "not", use: ["delete", "Item"], not: true, children: "inverted" }),
              ],
            }),
          }),
        );
      });
      expect(renderer.toJSON()).toEqual(["allowed", "inverted"]);
    } finally {
      await act(async () => renderer?.unmount());
    }
  });
});
