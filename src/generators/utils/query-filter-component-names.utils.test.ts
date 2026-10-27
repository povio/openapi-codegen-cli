import { describe, expect, it } from "vitest";

import { resolveQueryFilterComponentName } from "./query-filter-component-names.utils";

describe("resolveQueryFilterComponentName", () => {
  const queryFilterComponentNames = {
    BusinessPartnersController_paginate: "BusinessPartnerFilterDto",
    VatRuleController_list: "VatRuleFilterDto",
  };

  it("maps operation ids to configured filter component names", () => {
    expect(
      resolveQueryFilterComponentName("BusinessPartnersController_paginate", queryFilterComponentNames),
    ).toBe("BusinessPartnerFilterDto");
    expect(resolveQueryFilterComponentName("VatRuleController_list", queryFilterComponentNames)).toBe(
      "VatRuleFilterDto",
    );
  });

  it("returns undefined when the map or operation id is missing", () => {
    expect(resolveQueryFilterComponentName("UnknownController_action", queryFilterComponentNames)).toBeUndefined();
    expect(resolveQueryFilterComponentName("VatRuleController_list", undefined)).toBeUndefined();
    expect(resolveQueryFilterComponentName(undefined, queryFilterComponentNames)).toBeUndefined();
  });
});
