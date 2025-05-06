import { Kysely, SelectExpression, SelectQueryBuilder } from "kysely";
import { DB } from "kysely-codegen";
import {
  PaginatedResult,
  Pagination,
  SortBy,
} from "../../application/commons/models.js";
import {
  CreateTimetable,
  FilterTimetable,
  ITimetableRepository,
  Timetable,
  UpdateTimetable,
} from "../../application/timetable/index.js";
import { buildSortBy } from "./utils.js";

export class TimetableDao implements ITimetableRepository {
  protected readonly DEFAULT_SELECT_FIELDS = [
    "timetables.id",
    "timetables.hour",
    "timetables.created_at as createdAt",
    "timetables.updated_at as updatedAt",
  ] satisfies ReadonlyArray<
    SelectExpression<DB, "timetables" | "weekday_times">
  >;

  constructor(protected readonly db: Kysely<DB>) {}

  create(newTimetable: CreateTimetable): Promise<Timetable> {
    return this.db
      .insertInto("timetables")
      .values(newTimetable)
      .returning(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirstOrThrow();
  }

  async findAll(
    filterBy: FilterTimetable,
    pagination: Pagination,
    sortBy: SortBy<Timetable>,
  ): Promise<PaginatedResult<Timetable>> {
    let countQuery = this.db
      .selectFrom("timetables")
      .innerJoin("weekday_times", "weekday_times.timetable_id", "timetables.id")
      .select((eb) =>
        eb.fn.count<number>("timetables.id").distinct().as("count"),
      );
    countQuery = this.applyTimetableFilters(countQuery, filterBy);

    let timetablesQuery = this.db
      .selectFrom("timetables")
      .distinct()
      .innerJoin("weekday_times", "weekday_times.timetable_id", "timetables.id")
      .orderBy(buildSortBy<"timetables", Timetable>(sortBy))
      .limit(pagination.limit)
      .offset(pagination.offset)
      .select(this.DEFAULT_SELECT_FIELDS);
    timetablesQuery = this.applyTimetableFilters(timetablesQuery, filterBy);

    const [countResult, timetablesResult] = await Promise.all([
      countQuery.executeTakeFirst(),
      timetablesQuery.execute(),
    ]);
    return {
      count: countResult?.count ?? 0,
      data: timetablesResult,
    };
  }

  private applyTimetableFilters<O>(
    query: SelectQueryBuilder<DB, "timetables" | "weekday_times", O>,
    filterBy: FilterTimetable,
  ): SelectQueryBuilder<DB, "timetables" | "weekday_times", O> {
    if (filterBy.weekdayId !== null && filterBy.weekdayId !== undefined) {
      query = query.where("weekday_times.weekday_id", "=", filterBy.weekdayId);
    }

    return query;
  }

  findById(id: Timetable["id"]): Promise<Timetable | undefined> {
    return this.db
      .selectFrom("timetables")
      .where("id", "=", id)
      .select(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirst();
  }

  update(
    id: Timetable["id"],
    timetable: UpdateTimetable,
  ): Promise<Timetable | undefined> {
    return this.db
      .updateTable("timetables")
      .set(timetable)
      .where("id", "=", id)
      .returning(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirst();
  }

  delete(id: Timetable["id"]): Promise<Timetable | undefined> {
    return this.db
      .deleteFrom("timetables")
      .where("id", "=", id)
      .returning(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirst();
  }
}
