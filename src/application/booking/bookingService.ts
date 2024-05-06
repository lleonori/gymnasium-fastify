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

  async findById(id: Booking["id"]): Promise<Booking> {
    const booking = await this.bookingRepository.findById(id);
    this.handleNotFound(booking, id);
    return booking;
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
}
