import { Calendar } from "../calendar/models.ts";
import { PaginatedResult, Pagination, SortBy } from "../commons/models.ts";
import {
  CreateBooking,
  Booking,
  UpdateBooking,
  FilterBooking,
} from "./models.ts";

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
  countAllBookingsByDayAndMail(day: Date, mail: string): Promise<number>;
  countAllBookingsByDay(day: Date): Promise<number>;
  update(
    id: Booking["id"],
    booking: UpdateBooking,
  ): Promise<Booking | undefined>;
  delete(id: Booking["id"]): Promise<Booking | undefined>;
}
