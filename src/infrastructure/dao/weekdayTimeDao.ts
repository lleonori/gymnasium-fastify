import { Kysely, SelectExpression } from "kysely";
import { DB } from "kysely-codegen";
import {
  PaginatedResult,
  Pagination,
  SortBy,
} from "../../application/commons/models.js";
import { buildSortBy } from "./utils.js";
import {
  IWeekdayTimeRepository,
  WeekdayTime,
} from "../../application/weekday-time/index.js";

export class WeekdayTimeDao implements IWeekdayTimeRepository {
  protected readonly DEFAULT_SELECT_FIELDS = [
    "id",
    "weekday",
    "timetable_id as timetableId",
    "created_at as createdAt",
    "updated_at as updatedAt",
  ] satisfies ReadonlyArray<SelectExpression<DB, "weekday_times">>;

  constructor(protected readonly db: Kysely<DB>) {}

  async findAll(
    pagination: Pagination,
    sortBy: SortBy<WeekdayTime>,
  ): Promise<PaginatedResult<WeekdayTime>> {
    const countQuery = this.db
      .selectFrom("weekday_times")
      .select(({ fn }) => [fn.count<number>("id").as("count")])
      .executeTakeFirst();

    const weekdayTimesQuery = this.db
      .selectFrom("weekday_times")
      .orderBy(buildSortBy<"weekday_times", WeekdayTime>(sortBy))
      .limit(pagination.limit)
      .offset(pagination.offset)
      .select(this.DEFAULT_SELECT_FIELDS)
      .execute();

    const [countResult, weekdayTimesResult] = await Promise.all([
      countQuery,
      weekdayTimesQuery,
    ]);
    return {
      count: countResult?.count ?? 0,
      data: weekdayTimesResult,
    };
  }
}
