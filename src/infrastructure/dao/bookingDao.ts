import { Kysely, SelectExpression, sql } from "kysely";
import { DB } from "kysely-codegen";
import {
  PaginatedResult,
  Pagination,
  SortBy,
} from "../../application/commons/models.js";

import {
  Booking,
  CreateBooking,
  FilterBooking,
  IBookingRepository,
} from "../../application/booking/index.js";
import { buildSortBy } from "./utils.js";

export class BookingDao implements IBookingRepository {
  constructor(protected readonly db: Kysely<DB>) {}

  protected readonly DEFAULT_SELECT_FIELDS = [
    "id",
    "fullname",
    "mail",
    "day",
    "hour",
    "createdAt",
    "updatedAt",
  ] satisfies ReadonlyArray<SelectExpression<DB, "bookings">>;

  create(newBooking: CreateBooking): Promise<Booking> {
    // Parse the string representation of the date
    const bookingDate = { ...newBooking, day: new Date(newBooking.day) };

    // Construct the fields to return, replacing the 'day' field with the SQL expression
    const returnFields = this.DEFAULT_SELECT_FIELDS.map((field) =>
      field === "day"
        ? sql<string>`to_char(day, 'YYYY-MM-DD')`.as("day")
        : field,
    );

    return this.db
      .insertInto("bookings")
      .values(bookingDate)
      .returning(returnFields)
      .executeTakeFirstOrThrow();
  }

  async findAll(
    filterBy: FilterBooking,
    pagination: Pagination,
    sortBy: SortBy<Booking>,
  ): Promise<PaginatedResult<Booking>> {
    let countQuery = this.db
      .selectFrom("bookings")
      .select(({ fn }) => [fn.count<number>("id").as("count")]);

    // Construct the fields to return, replacing the 'day' field with the SQL expression
    const returnFields = this.DEFAULT_SELECT_FIELDS.map((field) =>
      field === "day"
        ? sql<string>`to_char(day, 'YYYY-MM-DD')`.as("day")
        : field,
    );

    let bookingsQuery = this.db
      .selectFrom("bookings")
      .orderBy(buildSortBy<"bookings", Booking>(sortBy))
      .limit(pagination.limit)
      .offset(pagination.offset)
      .select(returnFields);

    if (filterBy.day) {
      countQuery = countQuery.where(
        "bookings.day",
        "=",
        new Date(filterBy.day),
      );
    }

    if (filterBy.hour) {
      countQuery = countQuery.where("bookings.hour", "=", filterBy.hour);
      bookingsQuery = bookingsQuery.where("bookings.hour", "=", filterBy.hour);
    }

    if (filterBy.mail) {
      countQuery = countQuery.where("bookings.mail", "=", filterBy.mail);
      bookingsQuery = bookingsQuery.where("bookings.mail", "=", filterBy.mail);
    }

    if (filterBy.dateFrom && filterBy.dateTo) {
      countQuery = countQuery
        .where("bookings.day", ">=", new Date(filterBy.dateFrom))
        .where("bookings.day", "<=", new Date(filterBy.dateTo));
      bookingsQuery = bookingsQuery
        .where("bookings.day", ">=", new Date(filterBy.dateFrom))
        .where("bookings.day", "<=", new Date(filterBy.dateTo));
    } else if (filterBy.dateFrom) {
      countQuery = countQuery.where(
        "bookings.day",
        ">=",
        new Date(filterBy.dateFrom),
      );
      bookingsQuery = bookingsQuery.where(
        "bookings.day",
        ">=",
        new Date(filterBy.dateFrom),
      );
    } else if (filterBy.dateTo) {
      countQuery = countQuery.where(
        "bookings.day",
        "<=",
        new Date(filterBy.dateTo),
      );
      bookingsQuery = bookingsQuery.where(
        "bookings.day",
        "<=",
        new Date(filterBy.dateTo),
      );
    }

    const [countResult, bookingsResult] = await Promise.all([
      countQuery.executeTakeFirst(),
      bookingsQuery.execute(),
    ]);
    return {
      count: countResult?.count ?? 0,
      data: bookingsResult,
    };
  }

  async countBookingsForDayAndEmail(day: Date, mail: string): Promise<number> {
    const countResult = await this.db
      .selectFrom("bookings")
      .select(({ fn }) => [fn.count<number>("id").as("count")])
      .where((eb) => eb.and([eb("mail", "=", mail), eb("day", "=", day)]))
      .executeTakeFirst();

    return Number(countResult?.count ?? 0);
  }

  async countBookingsForDayAndHour(day: Date, hour: string): Promise<number> {
    const countResult = await this.db
      .selectFrom("bookings")
      .select(({ fn }) => [fn.count<number>("id").as("count")])
      .where((eb) => eb.and([eb("day", "=", day), eb("hour", "=", hour)]))
      .executeTakeFirst();

    return Number(countResult?.count ?? 0);
  }

  delete(id: Booking["id"]): Promise<Booking | undefined> {
    // Construct the fields to return, replacing the 'day' field with the SQL expression
    const returnFields = this.DEFAULT_SELECT_FIELDS.map((field) =>
      field === "day"
        ? sql<string>`to_char(day, 'YYYY-MM-DD')`.as("day")
        : field,
    );

    return this.db
      .deleteFrom("bookings")
      .where("id", "=", id)
      .returning(returnFields)
      .executeTakeFirst();
  }
}
