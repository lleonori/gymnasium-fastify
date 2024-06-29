import { Kysely, SelectExpression, sql } from "kysely";
import { DB } from "kysely-codegen";
import { Calendar } from "../../application/calendar/models.ts";
import {
  PaginatedResult,
  Pagination,
  SortBy,
} from "../../application/commons/models.ts";
import {
  Booking,
  CreateBooking,
  IBookingRepository,
  UpdateBooking,
} from "../../application/index.ts";
import { buildSortBy } from "./utils.ts";

export class BookingDao implements IBookingRepository {
  constructor(protected readonly db: Kysely<DB>) {}

  protected readonly DEFAULT_SELECT_FIELDS = [
    "id",
    "mail",
    "day",
    "hour",
    "created_at as createdAt",
    "updated_at as updatedAt",
  ] satisfies ReadonlyArray<SelectExpression<DB, "bookings">>;

  create(newBooking: CreateBooking): Promise<Booking> {
    // Parse the string representation of the date
    const bookingDate = { ...newBooking, day: new Date(newBooking.day) };

    // Construct the fields to return, replacing the 'day' field with the SQL expression
    const returnFields = this.DEFAULT_SELECT_FIELDS.map((field) =>
      field === "day"
        ? sql<string>`to_char(day, 'YYYY-MM-DD')`.as("day")
        : field
    );

    return this.db
      .insertInto("bookings")
      .values(bookingDate)
      .returning(returnFields)
      .executeTakeFirstOrThrow();
  }

  async findAll(
    pagination: Pagination,
    sortBy: SortBy<Booking>
  ): Promise<PaginatedResult<Booking>> {
    const countQuery = this.db
      .selectFrom("bookings")
      .select(({ fn }) => [fn.count<number>("id").as("count")])
      .executeTakeFirst();

    // Construct the fields to return, replacing the 'day' field with the SQL expression
    const returnFields = this.DEFAULT_SELECT_FIELDS.map((field) =>
      field === "day"
        ? sql<string>`to_char(day, 'YYYY-MM-DD')`.as("day")
        : field
    );

    const bookingsQuery = this.db
      .selectFrom("bookings")
      .orderBy(buildSortBy<"bookings", Booking>(sortBy))
      .limit(pagination.limit)
      .offset(pagination.offset)
      .select(returnFields)
      .execute();

    const [countResult, bookingsResult] = await Promise.all([
      countQuery,
      bookingsQuery,
    ]);
    return {
      count: countResult?.count ?? 0,
      data: bookingsResult,
    };
  }

  async findByMail(
    calendar: Calendar,
    mail: string,
    pagination: Pagination,
    sortBy: SortBy<Booking>
  ): Promise<PaginatedResult<Booking>> {
    const countQuery = this.db
      .selectFrom("bookings")
      .select(({ fn }) => [fn.count<number>("id").as("count")])
      .where((eb) =>
        eb.and([
          eb("mail", "=", mail),
          eb("day", ">=", new Date(calendar.today)),
          eb("day", "<=", new Date(calendar.tomorrow)),
        ])
      )
      .executeTakeFirst();

    // Construct the fields to return, replacing the 'day' field with the SQL expression
    const returnFields = this.DEFAULT_SELECT_FIELDS.map((field) =>
      field === "day"
        ? sql<string>`to_char(day, 'YYYY-MM-DD')`.as("day")
        : field
    );

    const bookingsQuery = this.db
      .selectFrom("bookings")
      .where((eb) =>
        eb.and([
          eb("mail", "=", mail),
          eb("day", ">=", new Date(calendar.today)),
          eb("day", "<=", new Date(calendar.tomorrow)),
        ])
      )
      .orderBy(buildSortBy<"bookings", Booking>(sortBy))
      .limit(pagination.limit)
      .offset(pagination.offset)
      .select(returnFields)
      .execute();

    const [countResult, bookingsResult] = await Promise.all([
      countQuery,
      bookingsQuery,
    ]);
    return {
      count: countResult?.count ?? 0,
      data: bookingsResult,
    };
  }

  async countBookingsByDayAndMail(day: Date, mail: string): Promise<number> {
    const countResult = await this.db
      .selectFrom("bookings")
      .select(({ fn }) => [fn.count<number>("id").as("count")])
      .where((eb) => eb.and([eb("mail", "=", mail), eb("day", "=", day)]))
      .executeTakeFirst();

    return countResult?.count ?? 0;
  }

  async countAllBookingsByDay(day: Date): Promise<number> {
    const countResult = await this.db
      .selectFrom("bookings")
      .select(({ fn }) => [fn.count<number>("id").as("count")])
      .where("day", "=", day)
      .executeTakeFirst();

    return countResult?.count ?? 0;
  }

  update(
    id: Booking["id"],
    booking: UpdateBooking
  ): Promise<Booking | undefined> {
    // Construct the fields to return, replacing the 'day' field with the SQL expression
    const returnFields = this.DEFAULT_SELECT_FIELDS.map((field) =>
      field === "day"
        ? sql<string>`to_char(day, 'YYYY-MM-DD')`.as("day")
        : field
    );

    return this.db
      .updateTable("bookings")
      .set(booking)
      .where("id", "=", id)
      .returning(returnFields)
      .executeTakeFirst();
  }

  delete(id: Booking["id"]): Promise<Booking | undefined> {
    // Construct the fields to return, replacing the 'day' field with the SQL expression
    const returnFields = this.DEFAULT_SELECT_FIELDS.map((field) =>
      field === "day"
        ? sql<string>`to_char(day, 'YYYY-MM-DD')`.as("day")
        : field
    );

    return this.db
      .deleteFrom("bookings")
      .where("id", "=", id)
      .returning(returnFields)
      .executeTakeFirst();
  }
}
