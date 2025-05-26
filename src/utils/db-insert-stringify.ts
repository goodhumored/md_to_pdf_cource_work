import { dbStringifyValue } from "./db-stringify-value";

export function dbInsertStringify(object: Record<string, unknown>): string {
  return `(${Object.keys(object).join(", ")}) VALUES (${Object.values(object)
    .map((v) => {
      const s = dbStringifyValue(v);
      if (s === null) return "NULL";
      return s;
    })
    .join(", ")})`;
}
