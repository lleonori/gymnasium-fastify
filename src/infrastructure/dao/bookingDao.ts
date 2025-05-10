import { Kysely, SelectExpression, SelectQueryBuilder, sql } from "kysely";
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
    countQuery = this.applyBookingFilters(countQuery, filterBy);

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
    bookingsQuery = this.applyBookingFilters(bookingsQuery, filterBy);

    const [countResult, bookingsResult] = await Promise.all([
      countQuery.executeTakeFirst(),
      bookingsQuery.execute(),
    ]);
    return {
      count: countResult?.count ?? 0,
      data: bookingsResult,
    };
  }

  private applyBookingFilters<O>(
    query: SelectQueryBuilder<DB, "bookings", O>,
    filterBy: FilterBooking,
  ): SelectQueryBuilder<DB, "bookings", O> {
    if (filterBy.day) {
      query = query.where("bookings.day", "=", new Date(filterBy.day));
    }

    if (filterBy.hour) {
      query = query.where("bookings.hour", "=", filterBy.hour);
    }

    if (filterBy.mail) {
      query = query.where("bookings.mail", "=", filterBy.mail);
    }

    if (filterBy.dateFrom && filterBy.dateTo) {
      query = query
        .where("bookings.day", ">=", new Date(filterBy.dateFrom))
        .where("bookings.day", "<=", new Date(filterBy.dateTo));
    } else if (filterBy.dateFrom) {
      query = query.where("bookings.day", ">=", new Date(filterBy.dateFrom));
    } else if (filterBy.dateTo) {
      query = query.where("bookings.day", "<=", new Date(filterBy.dateTo));
    }

    return query;
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
