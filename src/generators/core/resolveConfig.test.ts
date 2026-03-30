import { describe, expect, it } from "vitest";

import { resolveConfig } from "@/generators/core/resolveConfig";

describe("resolveConfig", () => {
  it("normalizes workspaceContext from comma-separated CLI input", () => {
    const config = resolveConfig({
      params: {
        workspaceContext: " officeId,positionId,officeId ,, ",
      },
    });

    expect(config.workspaceContext).toEqual(["officeId", "positionId"]);
  });
});
