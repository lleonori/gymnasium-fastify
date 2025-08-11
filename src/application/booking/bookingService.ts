import { NotFoundException } from "../commons/exceptions.js";
import { PaginatedResult, Pagination, SortBy } from "../commons/models.js";
import { IBookingRepository } from "./bookingRepository.js";
import { Booking, FilterBooking } from "./models.js";

export class BookingService {
  constructor(protected readonly bookingRepository: IBookingRepository) {}

  findAll(
    filterBy: FilterBooking,
    pagination: Pagination,
    sortBy: SortBy<Booking>,
  ): Promise<PaginatedResult<Booking>> {
    return this.bookingRepository.findAll(filterBy, pagination, sortBy);
  }

  async findById(id: Booking["id"]): Promise<Booking> {
    const booking = await this.bookingRepository.findById(id);
    this.handleNotFound(booking, id);
    return booking;
  }

  countBookingsForDayAndEmail(day: Date, mail: string): Promise<number> {
    return this.bookingRepository.countBookingsForDayAndEmail(day, mail);
  }

  countBookingsForDayAndTimetableId(
    day: Date,
    timetableId: number,
  ): Promise<number> {
    return this.bookingRepository.countBookingsForDayAndTimetableId(
      day,
      timetableId,
    );
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
      throw new NotFoundException(`Prenotazione con id ${id} non trovata`);
  }
}
