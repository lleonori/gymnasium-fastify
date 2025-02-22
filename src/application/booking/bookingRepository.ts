import { Calendar } from "../calendar/models.js";
import { PaginatedResult, Pagination, SortBy } from "../commons/models.js";
import { CreateBooking, Booking, FilterBooking } from "./models.js";

export interface IBookingRepository {
  create(booking: CreateBooking): Promise<Booking>;
  findAll(
    filterBy: FilterBooking,
    pagination: Pagination,
    sortBy: SortBy<Booking>,
  ): Promise<PaginatedResult<Booking>>;
  findByMail(
    calendar: Calendar,
    mail: Booking["mail"],
    pagination: Pagination,
    sortBy: SortBy<Booking>,
  ): Promise<PaginatedResult<Booking>>;
  countBookingsForDayAndEmail(day: Date, mail: string): Promise<number>;
  countBookingsForDay(day: Date): Promise<number>;
  delete(id: Booking["id"]): Promise<Booking | undefined>;
}
