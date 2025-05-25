import { dbStringifyValue } from "./db-stringify-value";

export function dbInsertStringify(object: Record<string, unknown>): string {
  return `(${Object.keys(object).join(", ")}) VALUES (${Object.values(object)
    .map(dbStringifyValue)
    .join(", ")})`;
}
