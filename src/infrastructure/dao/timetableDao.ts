import { Kysely, SelectExpression } from "kysely";
import { DB } from "kysely-codegen";
import {
  PaginatedResult,
  Pagination,
  SortBy,
} from "../../application/commons/models.js";
import {
  CreateTimetable,
  ITimetableRepository,
  Timetable,
  UpdateTimetable,
} from "../../application/timetable/index.js";
import { buildSortBy, isSaturday, isSunday } from "./utils.js";

export class TimetableDao implements ITimetableRepository {
  protected readonly DEFAULT_SELECT_FIELDS = [
    "id",
    "hour",
    "is_valid_on_weekend as isValidOnWeekend",
    "created_at as createdAt",
    "updated_at as updatedAt",
  ] satisfies ReadonlyArray<SelectExpression<DB, "timetables">>;

  constructor(protected readonly db: Kysely<DB>) {}

  create(newTimetable: CreateTimetable): Promise<Timetable> {
    return this.db
      .insertInto("timetables")
      .values(newTimetable)
      .returning(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirstOrThrow();
  }

  async findAll(
    pagination: Pagination,
    sortBy: SortBy<Timetable>,
  ): Promise<PaginatedResult<Timetable>> {
    const countQuery = this.db
      .selectFrom("timetables")
      .select(({ fn }) => [fn.count<number>("id").as("count")])
      .executeTakeFirst();

    const timetablesQuery = this.db
      .selectFrom("timetables")
      .orderBy(buildSortBy<"timetables", Timetable>(sortBy))
      .limit(pagination.limit)
      .offset(pagination.offset)
      .select(this.DEFAULT_SELECT_FIELDS)
      .execute();

    const [countResult, timetablesResult] = await Promise.all([
      countQuery,
      timetablesQuery,
    ]);
    return {
      count: countResult?.count ?? 0,
      data: timetablesResult,
    };
  }

  findById(id: Timetable["id"]): Promise<Timetable | undefined> {
    return this.db
      .selectFrom("timetables")
      .where("id", "=", id)
      .select(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirst();
  }

  async findByDate(
    date: string,
    pagination: Pagination,
    sortBy: SortBy<Timetable>,
  ): Promise<PaginatedResult<Timetable>> {
    if (!isSunday(new Date(date))) {
      const countQuery = this.db
        .selectFrom("timetables")
        .$if(isSaturday(new Date(date)), (qb) =>
          qb.where("is_valid_on_weekend", "=", true),
        )
        .select(({ fn }) => [fn.count<number>("id").as("count")])
        .executeTakeFirst();

      const timetablesQuery = this.db
        .selectFrom("timetables")
        .$if(isSaturday(new Date(date)), (qb) =>
          qb.where("is_valid_on_weekend", "=", true),
        )
        .orderBy(buildSortBy<"timetables", Timetable>(sortBy))
        .limit(pagination.limit)
        .offset(pagination.offset)
        .select(this.DEFAULT_SELECT_FIELDS)
        .execute();

      const [countResult, timetablesResult] = await Promise.all([
        countQuery,
        timetablesQuery,
      ]);
      return {
        count: countResult?.count ?? 0,
        data: timetablesResult,
      };
    } else {
      return {
        count: 0,
        data: [],
      };
    }
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
