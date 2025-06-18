import { Kysely, SelectExpression } from "kysely";
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
    "timetables.startHour",
    "timetables.endHour",
    "timetables.createdAt",
    "timetables.updatedAt",
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
    filterBy: FilterTimetable,
    pagination: Pagination,
    sortBy: SortBy<Timetable>,
  ): Promise<PaginatedResult<Timetable>> {
    let countQuery = this.db
      .selectFrom("timetables")
      .leftJoin("weekdayTimes", "weekdayTimes.timetableId", "timetables.id")
      .select((eb) =>
        eb.fn.count<number>("timetables.id").distinct().as("count"),
      );

    let timetablesQuery = this.db
      .selectFrom("timetables")
      .distinct()
      .leftJoin("weekdayTimes", "weekdayTimes.timetableId", "timetables.id")
      .orderBy(buildSortBy<"timetables", Timetable>(sortBy))
      .limit(pagination.limit)
      .offset(pagination.offset)
      .select(this.DEFAULT_SELECT_FIELDS);

    if (filterBy.weekdayId !== undefined) {
      countQuery = countQuery.where(
        "weekdayTimes.weekdayId",
        "=",
        filterBy.weekdayId,
      );
      timetablesQuery = timetablesQuery.where(
        "weekdayTimes.weekdayId",
        "=",
        filterBy.weekdayId,
      );
    }

    const [countResult, timetablesResult] = await Promise.all([
      countQuery.executeTakeFirst(),
      timetablesQuery.execute(),
    ]);
    return {
      count: Number(countResult?.count ?? 0),
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
