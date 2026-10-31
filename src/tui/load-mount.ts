import type { MountApp } from "./start";

export async function withProductionNodeEnv<T>(
  load: () => Promise<T>,
  env: NodeJS.ProcessEnv = process.env,
): Promise<T> {
  const previous = env.NODE_ENV;
  env.NODE_ENV = "production";
  try {
    return await load();
  } finally {
    if (previous === undefined) delete env.NODE_ENV;
    else env.NODE_ENV = previous;
  }
}

export function loadMountApp(): Promise<MountApp> {
  return withProductionNodeEnv(async () => (await import("./mount")).mountApp);
}
