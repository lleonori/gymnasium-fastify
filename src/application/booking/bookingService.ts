import { NotFoundException } from "../commons/exceptions.ts";
import { PaginatedResult, Pagination, SortBy } from "../commons/models.ts";
import { CreateBooking, Booking, UpdateBooking } from "./models.ts";
import { IBookingRepository } from "./bookingRepository.ts";

export class BookingService {
  constructor(protected readonly bookingRepository: IBookingRepository) {}

  create(booking: CreateBooking): Promise<Booking> {
    return this.bookingRepository.create(booking);
  }

  findAll(
    pagination: Pagination,
    sortBy: SortBy<Booking>
  ): Promise<PaginatedResult<Booking>> {
    return this.bookingRepository.findAll(pagination, sortBy);
  }

  async findByMail(mail: Booking["mail"]): Promise<Booking> {
    const booking = await this.bookingRepository.findByMail(mail);
    this.handleNotFound(booking, mail);
    return booking;
  }

  async update(
    mail: Booking["mail"],
    booking: UpdateBooking
  ): Promise<Booking> {
    const updatedBooking = await this.bookingRepository.update(mail, booking);
    this.handleNotFound(updatedBooking, mail);
    return updatedBooking;
  }

  async delete(mail: Booking["mail"]): Promise<Booking> {
    const deletedBooking = await this.bookingRepository.delete(mail);
    this.handleNotFound(deletedBooking, mail);
    return deletedBooking;
  }

  private handleNotFound(
    booking: Booking | undefined,
    mail: Booking["mail"]
  ): asserts booking is Booking {
    if (!booking)
      throw new NotFoundException(`Booking with mail ${mail} not found`);
  }
}
