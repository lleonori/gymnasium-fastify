import { Kysely, SelectExpression } from "kysely";
import { DB } from "kysely-codegen";
import {
  PaginatedResult,
  Pagination,
  SortBy,
} from "../../application/commons/models.ts";
import {
  CreateTimetable,
  ITimetableRepository,
  Timetable,
  UpdateTimetable,
} from "../../application/timetable/index.ts";
import { buildSortBy } from "./utils.ts";

export class TimetableDao implements ITimetableRepository {
  protected readonly DEFAULT_SELECT_FIELDS = [
    "id",
    "hour",
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
    sortBy: SortBy<Timetable>
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

  update(
    id: Timetable["id"],
    timetable: UpdateTimetable
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
