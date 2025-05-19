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
import { NotFoundException } from "../../application/commons/exceptions.js";

export class BookingDao implements IBookingRepository {
  constructor(protected readonly db: Kysely<DB>) {}

  protected readonly DEFAULT_SELECT_FIELDS = [
    "bookings.id",
    "bookings.fullname",
    "bookings.mail",
    "bookings.day",
    "bookings.timetableId",
    "timetables.startHour",
    "timetables.endHour",
    "bookings.createdAt",
    "bookings.updatedAt",
  ] satisfies ReadonlyArray<SelectExpression<DB, "bookings" | "timetables">>;

  async create(newBooking: CreateBooking): Promise<Booking> {
    const parsedBooking = { ...newBooking, day: new Date(newBooking.day) };

    const inserted = await this.db
      .insertInto("bookings")
      .values(parsedBooking)
      .returning(["bookings.id"])
      .executeTakeFirstOrThrow();

    const insertedBooking = await this.db
      .selectFrom("bookings")
      .innerJoin("timetables", "bookings.timetableId", "timetables.id")
      .select(
        this.DEFAULT_SELECT_FIELDS.map((field) =>
          field === "bookings.day"
            ? sql<string>`to_char(bookings.day, 'YYYY-MM-DD')`.as("day")
            : field,
        ),
      )
      .where("bookings.id", "=", inserted.id)
      .executeTakeFirstOrThrow();

    return insertedBooking;
  }

  async findAll(
    filterBy: FilterBooking,
    pagination: Pagination,
    sortBy: SortBy<Booking>,
  ): Promise<PaginatedResult<Booking>> {
    let countQuery = this.db
      .selectFrom("bookings")
      .select(({ fn }) => [fn.count<number>("bookings.id").as("count")]);

    // Construct the fields to return, replacing the 'day' field with the SQL expression
    const returnFields = this.DEFAULT_SELECT_FIELDS.map((field) =>
      field === "bookings.day"
        ? sql<string>`to_char(bookings.day, 'YYYY-MM-DD')`.as("day")
        : field,
    );

    let bookingsQuery = this.db
      .selectFrom("bookings")
      .innerJoin("timetables", "timetables.id", "bookings.timetableId")
      .orderBy(buildSortBy<"bookings", Booking>(sortBy))
      .limit(pagination.limit)
      .offset(pagination.offset)
      .select(returnFields);

    if (filterBy.timetableId) {
      countQuery = countQuery.where(
        "bookings.timetableId",
        "=",
        filterBy.timetableId,
      );
      bookingsQuery = bookingsQuery.where(
        "bookings.timetableId",
        "=",
        filterBy.timetableId,
      );
    }

    if (filterBy.day) {
      countQuery = countQuery.where(
        "bookings.day",
        "=",
        new Date(filterBy.day),
      );
      bookingsQuery = bookingsQuery.where(
        "bookings.day",
        "=",
        new Date(filterBy.day),
      );
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

  findById(id: Booking["id"]): Promise<Booking | undefined> {
    // Construct the fields to return, replacing the 'day' field with the SQL expression
    const returnFields = this.DEFAULT_SELECT_FIELDS.map((field) =>
      field === "bookings.day"
        ? sql<string>`to_char(bookings.day, 'YYYY-MM-DD')`.as("day")
        : field,
    );

    return this.db
      .selectFrom("bookings")
      .innerJoin("timetables", "timetables.id", "bookings.timetableId")
      .where("bookings.id", "=", id)
      .select(returnFields)
      .executeTakeFirst();
  }

  async countBookingsForDayAndEmail(day: Date, mail: string): Promise<number> {
    const countResult = await this.db
      .selectFrom("bookings")
      .select(({ fn }) => [fn.count<number>("bookings.id").as("count")])
      .where((eb) =>
        eb.and([eb("bookings.mail", "=", mail), eb("bookings.day", "=", day)]),
      )
      .executeTakeFirst();

    return Number(countResult?.count ?? 0);
  }

  async countBookingsForDayAndTimetableId(
    day: Date,
    timetableId: number,
  ): Promise<number> {
    const countResult = await this.db
      .selectFrom("bookings")
      .innerJoin("timetables", "timetables.id", "bookings.timetableId")
      .select(({ fn }) => [fn.count<number>("bookings.id").as("count")])
      .where((eb) =>
        eb.and([
          eb("bookings.day", "=", day),
          eb("bookings.timetableId", "=", timetableId),
        ]),
      )
      .executeTakeFirst();

    return Number(countResult?.count ?? 0);
  }

  async delete(id: Booking["id"]): Promise<Booking | undefined> {
    const bookingToDelete = await this.db
      .selectFrom("bookings")
      .innerJoin("timetables", "bookings.timetableId", "timetables.id")
      .select(
        this.DEFAULT_SELECT_FIELDS.map((field) =>
          field === "bookings.day"
            ? sql<string>`to_char(bookings.day, 'YYYY-MM-DD')`.as("day")
            : field,
        ),
      )
      .where("bookings.id", "=", id)
      .executeTakeFirst();

    if (!bookingToDelete) {
      throw new NotFoundException(`Booking with id ${id} not found`);
    }

    await this.db
      .deleteFrom("bookings")
      .where("bookings.id", "=", id)
      .executeTakeFirstOrThrow();

    return bookingToDelete;
  }
}
