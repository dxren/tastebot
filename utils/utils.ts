import { env } from "bun";

export const getEnv = (variableName: string): string => {
  const result = env[variableName];
  if (!result) throw new Error(`Failed to loda ${variableName}`);
  return result;
};
