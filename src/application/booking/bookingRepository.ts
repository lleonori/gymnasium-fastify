import { PaginatedResult, Pagination, SortBy } from "../commons/models.js";
import { Booking, CreateBooking, FilterBooking } from "./models.js";

export interface IBookingRepository {
  create(booking: CreateBooking): Promise<Booking>;
  findAll(
    filterBy: FilterBooking,
    pagination: Pagination,
    sortBy: SortBy<Booking>,
  ): Promise<PaginatedResult<Booking>>;
  findById(id: Booking["id"]): Promise<Booking | undefined>;
  countBookingsForDayAndEmail(day: Date, mail: string): Promise<number>;
  countBookingsForDayAndTimetableId(
    day: Date,
    timetableId: number,
  ): Promise<number>;
  delete(id: Booking["id"]): Promise<Booking | undefined>;
}
