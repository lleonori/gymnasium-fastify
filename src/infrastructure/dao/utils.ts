import { snakeCase } from "change-case";
import { OrderByExpression } from "kysely";
import { DB } from "kysely-codegen";
import { SortBy } from "../../application/commons/models.js";

export function buildSortBy<
  Table extends Exclude<keyof DB, "schemaversion">,
  Model extends Record<string, unknown>,
  Alias extends string = Table,
  O extends object = object,
>(
  sortBy: SortBy<Model>,
  alias?: Alias,
): ReadonlyArray<OrderByExpression<DB, Table, O>> {
  return sortBy.map(
    ([field, order]) =>
      `${alias ? `${alias}.` : ""}${snakeCase(field as string)} ${order ?? "asc"}`,
  ) as unknown as ReadonlyArray<OrderByExpression<DB, Table, O>>;
}

export function isSaturday(date: Date): boolean {
  const day = date.getDay(); // getDay() returns the day of the week (6 for Saturday)
  return day === 6;
}

export function isSunday(date: Date): boolean {
  const day = date.getDay(); // getDay() returns the day of the week (0 for Sunday)
  return day === 0;
}
