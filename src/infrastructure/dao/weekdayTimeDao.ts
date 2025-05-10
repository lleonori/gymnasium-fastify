import { Kysely, SelectExpression, sql } from "kysely";
import { DB } from "kysely-codegen";
import {
  PaginatedResult,
  Pagination,
  SortBy,
} from "../../application/commons/models.js";
import {
  CreateWeekdayTime,
  IWeekdayTimeRepository,
  WeekdayTime,
  WeekdayTimesHour,
} from "../../application/weekday-time/index.js";
import { buildSortBy } from "./utils.js";

export class WeekdayTimeDao implements IWeekdayTimeRepository {
  protected readonly DEFAULT_SELECT_FIELDS = [
    "weekdays.id as weekdayId",
    "weekdays.name as weekdayName",
  ] satisfies ReadonlyArray<
    SelectExpression<DB, "weekdayTimes" | "weekdays" | "timetables">
  >;

  constructor(protected readonly db: Kysely<DB>) {}

  create(weekdayTime: CreateWeekdayTime): Promise<WeekdayTime> {
    return this.db.transaction().execute(async (trx) => {
      await trx
        .deleteFrom("weekdayTimes")
        .where("weekdayId", "=", weekdayTime.weekdayId)
        .execute();

      if (weekdayTime.timetableId.length > 0) {
        await trx
          .insertInto("weekdayTimes")
          .values(
            weekdayTime.timetableId.map((t) => ({
              weekdayId: weekdayTime.weekdayId,
              timetableId: t,
            })),
          )
          .execute();
      }

      const weekdayTimesQuery = await trx
        .selectFrom("weekdayTimes")
        .innerJoin("weekdays", "weekdays.id", "weekdayTimes.weekdayId")
        .innerJoin("timetables", "timetables.id", "weekdayTimes.timetableId")
        .select(() => [
          sql<WeekdayTimesHour[]>`
          array_agg(
            json_build_object('id', "timetables"."id", 'hour', "timetables"."hour")
            ORDER BY "timetables"."hour"
          )
        `.as("hour"),
          ...this.DEFAULT_SELECT_FIELDS,
        ])
        .where("weekdayTimes.weekdayId", "=", weekdayTime.weekdayId)
        .groupBy("weekdays.id")
        .executeTakeFirst();

      if (!weekdayTimesQuery) {
        const fallback = await trx
          .selectFrom("weekdays")
          .select(["id as weekdayId", "name as weekdayName"])
          .where("id", "=", weekdayTime.weekdayId)
          .executeTakeFirstOrThrow();

        return { ...fallback, hour: [] };
      }

      return weekdayTimesQuery;
    });
  }

  async findAll(
    pagination: Pagination,
    sortBy: SortBy<WeekdayTime>,
  ): Promise<PaginatedResult<WeekdayTime>> {
    const countQuery = await this.db
      .selectFrom("weekdays")
      .leftJoin("weekdayTimes", "weekdayTimes.weekdayId", "weekdays.id")
      .leftJoin("timetables", "timetables.id", "weekdayTimes.timetableId")
      .select(({ fn }) => [
        fn.count<number>(sql`distinct "weekdays"."id"`).as("count"),
      ])
      .executeTakeFirst();

    const weekdayTimesQuery = await this.db
      .selectFrom("weekdays")
      .orderBy(buildSortBy<"weekdays", WeekdayTime>(sortBy))
      .leftJoin("weekdayTimes", "weekdayTimes.weekdayId", "weekdays.id")
      .leftJoin("timetables", "timetables.id", "weekdayTimes.timetableId")
      .limit(pagination.limit)
      .offset(pagination.offset)
      .select([
        "weekdays.id as weekdayId",
        "weekdays.name as weekdayName",
        sql<WeekdayTimesHour[]>`
      coalesce(
        json_agg(
          json_build_object(
            'id', "timetables"."id",
            'hour', "timetables"."hour"
          )
          order by "timetables"."hour"
        )
        filter (where "timetables"."id" is not null),
        '[]'::json
      )
    `.as("hour"),
      ])
      .groupBy(["weekdays.id", "weekdays.name"])
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
