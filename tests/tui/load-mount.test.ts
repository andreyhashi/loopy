import { describe, expect, it } from "vitest";
import { withProductionNodeEnv } from "../../src/tui/load-mount";

describe("withProductionNodeEnv", () => {
  it("loads under NODE_ENV=production and removes it again when it was unset", async () => {
    const env: NodeJS.ProcessEnv = {};

    const seen = await withProductionNodeEnv(async () => env.NODE_ENV, env);

    expect(seen).toBe("production");
    expect("NODE_ENV" in env).toBe(false);
  });

  it("restores the previous NODE_ENV so child processes inherit the caller's value", async () => {
    const env: NodeJS.ProcessEnv = { NODE_ENV: "development" };

    const seen = await withProductionNodeEnv(async () => env.NODE_ENV, env);

    expect(seen).toBe("production");
    expect(env.NODE_ENV).toBe("development");
  });

  it("restores NODE_ENV when the load fails", async () => {
    const env: NodeJS.ProcessEnv = { NODE_ENV: "test" };

    await expect(
      withProductionNodeEnv(async () => {
        throw new Error("load failed");
      }, env),
    ).rejects.toThrow("load failed");

    expect(env.NODE_ENV).toBe("test");
  });
});
