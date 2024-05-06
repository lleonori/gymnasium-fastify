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
    "name",
    "surname",
    "booking_at",
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

  findById(id: Booking["id"]): Promise<Booking | undefined> {
    return this.db
      .selectFrom("bookings")
      .where("id", "=", id)
      .select(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirst();
  }

  update(
    id: Booking["id"],
    booking: UpdateBooking
  ): Promise<Booking | undefined> {
    return this.db
      .updateTable("bookings")
      .set(booking)
      .where("id", "=", id)
      .returning(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirst();
  }

  delete(id: Booking["id"]): Promise<Booking | undefined> {
    return this.db
      .deleteFrom("bookings")
      .where("id", "=", id)
      .returning(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirst();
  }
}
