import { Calendar } from "../calendar/models.ts";
import { ConflictException, NotFoundException } from "../commons/exceptions.ts";
import { PaginatedResult, Pagination, SortBy } from "../commons/models.ts";
import { IBookingRepository } from "./bookingRepository.ts";
import { Booking, CreateBooking, UpdateBooking } from "./models.ts";

export class BookingService {
  constructor(protected readonly bookingRepository: IBookingRepository) {}

  async create(booking: CreateBooking): Promise<Booking> {
    const createdBooking = await this.bookingRepository.create(booking);
    this.handleConflictError(createdBooking);
    return createdBooking;
  }

  findAll(
    pagination: Pagination,
    sortBy: SortBy<Booking>
  ): Promise<PaginatedResult<Booking>> {
    return this.bookingRepository.findAll(pagination, sortBy);
  }

  findByMail(
    calendar: Calendar,
    mail: string,
    pagination: Pagination,
    sortBy: SortBy<Booking>
  ): Promise<PaginatedResult<Booking>> {
    return this.bookingRepository.findByMail(
      calendar,
      mail,
      pagination,
      sortBy
    );
  }

  countBookingsByDayAndMail(day: Date, mail: string): Promise<number> {
    return this.bookingRepository.countBookingsByDayAndMail(day, mail);
  }

  countAllBookingsByDay(day: Date): Promise<number> {
    return this.bookingRepository.countAllBookingsByDay(day);
  }

  async update(id: Booking["id"], booking: UpdateBooking): Promise<Booking> {
    const updatedBooking = await this.bookingRepository.update(id, booking);
    this.handleNotFound(updatedBooking, id);
    return updatedBooking;
  }

  async delete(id: Booking["id"]): Promise<Booking> {
    const deletedBooking = await this.bookingRepository.delete(id);
    this.handleNotFound(deletedBooking, id);
    return deletedBooking;
  }

  private handleNotFound(
    booking: Booking | undefined,
    id: Booking["id"]
  ): asserts booking is Booking {
    if (!booking)
      throw new NotFoundException(`Booking with id ${id} not found`);
  }

  private handleConflictError(
    booking: Booking | undefined
  ): asserts booking is Booking {
    if (!booking) throw new ConflictException(`Something wrong`);
  }
}
