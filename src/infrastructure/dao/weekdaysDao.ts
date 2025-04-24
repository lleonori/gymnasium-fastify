import { Kysely, SelectExpression } from "kysely";
import { DB } from "kysely-codegen";
import {
  PaginatedResult,
  Pagination,
  SortBy,
} from "../../application/commons/models.js";
import {
  IWeekdaysRepository,
  Weekdays,
} from "../../application/weekdays/index.js";
import { buildSortBy } from "./utils.js";

export class WeekdaysDao implements IWeekdaysRepository {
  protected readonly DEFAULT_SELECT_FIELDS = [
    "id",
    "name",
  ] satisfies ReadonlyArray<SelectExpression<DB, "weekdays">>;

  constructor(protected readonly db: Kysely<DB>) {}

  async findAll(
    pagination: Pagination,
    sortBy: SortBy<Weekdays>,
  ): Promise<PaginatedResult<Weekdays>> {
    const countQuery = this.db
      .selectFrom("weekdays")
      .select(({ fn }) => [fn.count<number>("id").as("count")])
      .executeTakeFirst();

    const weekdaysQuery = this.db
      .selectFrom("weekdays")
      .orderBy(buildSortBy<"weekdays", Weekdays>(sortBy))
      .limit(pagination.limit)
      .offset(pagination.offset)
      .select(this.DEFAULT_SELECT_FIELDS)
      .execute();

    const [countResult, weekdaysResult] = await Promise.all([
      countQuery,
      weekdaysQuery,
    ]);
    return {
      count: countResult?.count ?? 0,
      data: weekdaysResult,
    };
  }
}
