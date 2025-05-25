import { dbStringifyValue } from "./db-stringify-value";

export function dbUpdateStringify(object: Record<string, unknown>): string {
  return Object.entries(object)
    .map(([key, value]) => `${key}=${dbStringifyValue(value)}`)
    .join(", ");
}
