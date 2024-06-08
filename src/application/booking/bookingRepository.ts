import { PaginatedResult, Pagination, SortBy } from "../commons/models.ts";
import { CreateBooking, Booking, UpdateBooking } from "./models.ts";

export interface IBookingRepository {
  create(booking: CreateBooking): Promise<Booking>;
  findAll(
    pagination: Pagination,
    sortBy: SortBy<Booking>
  ): Promise<PaginatedResult<Booking>>;
  findByMail(mail: Booking["mail"]): Promise<Booking | undefined>;
  update(
    mail: Booking["mail"],
    booking: UpdateBooking
  ): Promise<Booking | undefined>;
  delete(mail: Booking["mail"]): Promise<Booking | undefined>;
}
