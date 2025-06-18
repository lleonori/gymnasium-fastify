import { Kysely, SelectExpression } from "kysely";
import { DB } from "kysely-codegen";
import {
  PaginatedResult,
  Pagination,
  SortBy,
} from "../../application/commons/models.js";
import {
  IWeekdayRepository,
  Weekday,
} from "../../application/weekday/index.js";
import { buildSortBy } from "./utils.js";

export class WeekdayDao implements IWeekdayRepository {
  protected readonly DEFAULT_SELECT_FIELDS = [
    "id",
    "name",
  ] satisfies ReadonlyArray<SelectExpression<DB, "weekdays">>;

  constructor(protected readonly db: Kysely<DB>) {}

  async findAll(
    pagination: Pagination,
    sortBy: SortBy<Weekday>,
  ): Promise<PaginatedResult<Weekday>> {
    const countQuery = this.db
      .selectFrom("weekdays")
      .select(({ fn }) => [fn.count<number>("id").as("count")])
      .executeTakeFirst();

    const weekdaysQuery = this.db
      .selectFrom("weekdays")
      .orderBy(buildSortBy<"weekdays", Weekday>(sortBy))
      .limit(pagination.limit)
      .offset(pagination.offset)
      .select(this.DEFAULT_SELECT_FIELDS)
      .execute();

    const [countResult, weekdaysResult] = await Promise.all([
      countQuery,
      weekdaysQuery,
    ]);
    return {
      count: Number(countResult?.count ?? 0),
      data: weekdaysResult,
    };
  }
}
