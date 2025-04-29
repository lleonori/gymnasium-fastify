import { Kysely, SelectExpression, sql } from "kysely";
import { DB } from "kysely-codegen";
import {
  PaginatedResult,
  Pagination,
} from "../../application/commons/models.js";
import {
  CreateWeekdayTime,
  IWeekdayTimeRepository,
  WeekdayTime,
  WeekdayTimesHour,
} from "../../application/weekday-time/index.js";

export class WeekdayTimeDao implements IWeekdayTimeRepository {
  protected readonly DEFAULT_SELECT_FIELDS = [
    "weekdays.id as weekdayId",
    "weekdays.name as weekdayName",
  ] satisfies ReadonlyArray<
    SelectExpression<DB, "weekday_times" | "weekdays" | "timetables">
  >;

  constructor(protected readonly db: Kysely<DB>) {}

  create(weekdayTime: CreateWeekdayTime): Promise<WeekdayTime> {
    return this.db.transaction().execute(async (trx) => {
      await trx
        .deleteFrom("weekday_times")
        .where("weekday_id", "=", weekdayTime.weekdayId)
        .execute();

      if (weekdayTime.timetableId.length > 0) {
        await trx
          .insertInto("weekday_times")
          .values(
            weekdayTime.timetableId.map((t) => ({
              weekday_id: weekdayTime.weekdayId,
              timetable_id: t,
            })),
          )
          .execute();
      }

      const weekdayTimesQuery = await trx
        .selectFrom("weekday_times")
        .innerJoin("weekdays", "weekdays.id", "weekday_times.weekday_id")
        .innerJoin("timetables", "timetables.id", "weekday_times.timetable_id")
        .select(() => [
          sql<WeekdayTimesHour[]>`
          array_agg(
            json_build_object('id', "timetables"."id", 'hour', "timetables"."hour")
            ORDER BY "timetables"."hour"
          )
        `.as("hour"),
          ...this.DEFAULT_SELECT_FIELDS,
        ])
        .where("weekday_times.weekday_id", "=", weekdayTime.weekdayId)
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

  async findAll(pagination: Pagination): Promise<PaginatedResult<WeekdayTime>> {
    const countQuery = await this.db
      .selectFrom("weekdays")
      .leftJoin("weekday_times", "weekday_times.weekday_id", "weekdays.id")
      .leftJoin("timetables", "timetables.id", "weekday_times.timetable_id")
      .select(({ fn }) => [
        fn.count<number>(sql`distinct "weekdays"."id"`).as("count"),
      ])
      .executeTakeFirst();

    const weekdayTimesQuery = await this.db
      .selectFrom("weekdays")
      .leftJoin("weekday_times", "weekday_times.weekday_id", "weekdays.id")
      .leftJoin("timetables", "timetables.id", "weekday_times.timetable_id")
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
      .orderBy("weekdays.id")
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
