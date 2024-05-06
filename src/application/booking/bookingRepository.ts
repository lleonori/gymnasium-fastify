import { PaginatedResult, Pagination, SortBy } from "../commons/models.ts";
import { CreateBooking, Booking, UpdateBooking } from "./models.ts";

export interface IBookingRepository {
  create(booking: CreateBooking): Promise<Booking>;
  findAll(
    pagination: Pagination,
    sortBy: SortBy<Booking>
  ): Promise<PaginatedResult<Booking>>;
  findById(id: Booking["id"]): Promise<Booking | undefined>;
  update(
    id: Booking["id"],
    booking: UpdateBooking
  ): Promise<Booking | undefined>;
  delete(id: Booking["id"]): Promise<Booking | undefined>;
}
