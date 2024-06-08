import { Kysely, SelectExpression } from "kysely";
import { DB } from "kysely-codegen";
import {
  PaginatedResult,
  Pagination,
  SortBy,
} from "../../application/commons/models.ts";
import {
  CreateBooking,
  IBookingRepository,
  Booking,
  UpdateBooking,
} from "../../application/index.ts";
import { buildSortBy } from "./utils.ts";

export class BookingDao implements IBookingRepository {
  protected readonly DEFAULT_SELECT_FIELDS = [
    "id",
    "mail",
    "day",
    "hour",
    "created_at as createdAt",
    "updated_at as updatedAt",
  ] satisfies ReadonlyArray<SelectExpression<DB, "bookings">>;

  constructor(protected readonly db: Kysely<DB>) {}

  create(newBooking: CreateBooking): Promise<Booking> {
    return this.db
      .insertInto("bookings")
      .values(newBooking)
      .returning(this.DEFAULT_SELECT_FIELDS)
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

    const bookingsQuery = this.db
      .selectFrom("bookings")
      .orderBy(buildSortBy<"bookings", Booking>(sortBy))
      .limit(pagination.limit)
      .offset(pagination.offset)
      .select(this.DEFAULT_SELECT_FIELDS)
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

  findByMail(mail: Booking["mail"]): Promise<Booking | undefined> {
    return this.db
      .selectFrom("bookings")
      .where("mail", "=", mail)
      .select(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirst();
  }

  update(
    mail: Booking["mail"],
    booking: UpdateBooking
  ): Promise<Booking | undefined> {
    return this.db
      .updateTable("bookings")
      .set(booking)
      .where("mail", "=", mail)
      .returning(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirst();
  }

  delete(mail: Booking["mail"]): Promise<Booking | undefined> {
    return this.db
      .deleteFrom("bookings")
      .where("mail", "=", mail)
      .returning(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirst();
  }
}
