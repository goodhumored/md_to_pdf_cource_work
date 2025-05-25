export function dbStringifyValue(value: unknown) {
  if (value === undefined || value === null) return null;
  if (value instanceof Date) return "'" + value.toISOString() + "'";
  return `'${value}'`;
}
