import { Calendar } from "../calendar/models.js";
import { NotFoundException } from "../commons/exceptions.js";
import { PaginatedResult, Pagination, SortBy } from "../commons/models.js";
import { IBookingRepository } from "./bookingRepository.js";
import { Booking, CreateBooking, FilterBooking } from "./models.js";

export class BookingService {
  constructor(protected readonly bookingRepository: IBookingRepository) {}

  async create(booking: CreateBooking): Promise<Booking> {
    const createdBooking = await this.bookingRepository.create(booking);
    return createdBooking;
  }

  findAll(
    filterBy: FilterBooking,
    pagination: Pagination,
    sortBy: SortBy<Booking>,
  ): Promise<PaginatedResult<Booking>> {
    return this.bookingRepository.findAll(filterBy, pagination, sortBy);
  }

  findByMail(
    calendar: Calendar,
    mail: string,
    pagination: Pagination,
    sortBy: SortBy<Booking>,
  ): Promise<PaginatedResult<Booking>> {
    return this.bookingRepository.findByMail(
      calendar,
      mail,
      pagination,
      sortBy,
    );
  }

  countBookingsForDayAndEmail(day: Date, mail: string): Promise<number> {
    return this.bookingRepository.countBookingsForDayAndEmail(day, mail);
  }

  countBookingsForDay(day: Date): Promise<number> {
    return this.bookingRepository.countBookingsForDay(day);
  }

  async delete(id: Booking["id"]): Promise<Booking> {
    const deletedBooking = await this.bookingRepository.delete(id);
    this.handleNotFound(deletedBooking, id);
    return deletedBooking;
  }

  private handleNotFound(
    booking: Booking | undefined,
    id: Booking["id"],
  ): asserts booking is Booking {
    if (!booking)
      throw new NotFoundException(`Booking with id ${id} not found`);
  }
}
