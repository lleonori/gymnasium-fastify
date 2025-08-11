import {
  formatTimeInSecond,
  getTime,
  getTodayAndTomorrow,
} from "../../infrastructure/http/utils/datetime.js";
import {
  BookingLimitHours,
  ClassBookingLimit,
} from "../../infrastructure/http/utils/enums.js";
import { validateBookingRequest } from "../../infrastructure/validations/booking.validation.js";
import { BookingService } from "../booking/bookingService.js";
import { IBookingRepository } from "../booking/index.js";
import { Booking, CreateBooking } from "../booking/models.js";
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
  TooManyRequestsException,
} from "../commons/exceptions.js";
import { Timetable, UpdateTimetable } from "../timetable/models.js";
import { ITimetableRepository } from "../timetable/timetableRepository.js";
import { TimetableService } from "../timetable/timetableService.js";

export class TimetableBookingManagerService {
  constructor(
    private readonly timetableService: TimetableService,
    private readonly bookingService: BookingService,
    private readonly timetableRepository: ITimetableRepository,
    private readonly bookingRepository: IBookingRepository,
  ) {}

  async create(booking: CreateBooking): Promise<Booking> {
    validateBookingRequest(booking);

    const timetable = await this.ensureTimetableExists(booking.timetableId);

    this.enforceTimeLimit(timetable.startHour, booking.day);

    await this.enforceDailyBookingLimit(booking.day, booking.mail);

    await this.enforceSlotCapacity(booking.day, booking.timetableId);

    const createdBooking = await this.bookingRepository.create(booking);
    return createdBooking;
  }

  private async ensureTimetableExists(timetableId: number | null) {
    if (timetableId === null)
      throw new ConflictException("Orario obbligatorio.");

    const timetable = await this.timetableService.findById(timetableId);

    return timetable;
  }

  private enforceTimeLimit(timetableStart: string, bookingDay: string) {
    const current = getTime();
    const now = new Date();
    const today = now;

    if (today.toDateString() === new Date(bookingDay).toDateString()) {
      const secondsUntilStart =
        formatTimeInSecond(timetableStart) - formatTimeInSecond(current);
      if (secondsUntilStart < BookingLimitHours.LIMIT) {
        throw new ForbiddenException(
          "Impossibile prenotare: il tempo limite è scaduto.",
        );
      }
    }
  }

  private async enforceDailyBookingLimit(day: string, mail: string) {
    const count = await this.bookingService.countBookingsForDayAndEmail(
      new Date(day),
      mail,
    );
    if (count > 0) {
      throw new ConflictException("La lezione è stata già prenotata.");
    }
  }

  private async enforceSlotCapacity(day: string, timetableId: number | null) {
    if (timetableId === null)
      throw new ConflictException("Orario obbligatorio.");

    const count = await this.bookingService.countBookingsForDayAndTimetableId(
      new Date(day),
      timetableId,
    );
    if (count >= ClassBookingLimit.LIMIT) {
      throw new TooManyRequestsException("Limite di prenotazione raggiunto.");
    }
  }

  async update(
    id: Timetable["id"],
    timetable: UpdateTimetable,
  ): Promise<Timetable> {
    const { today, tomorrow } = getTodayAndTomorrow();

    const bookings = await this.bookingService.findAll(
      {
        timetableId: id,
        dateFrom: today,
        dateTo: tomorrow,
      },
      { offset: 0, limit: 1 },
      [["id", "asc"]],
    );

    if (bookings.count === 0) {
      const updatedTimetable = await this.timetableRepository.update(
        id,
        timetable,
      );
      this.handleNotFound(updatedTimetable, id);
      return updatedTimetable;
    } else {
      throw new ConflictException("Impossibile modificare: l'orario è in uso.");
    }
  }

  async delete(id: Timetable["id"]): Promise<Timetable> {
    const { today, tomorrow } = getTodayAndTomorrow();

    const bookings = await this.bookingService.findAll(
      { timetableId: id, dateFrom: today, dateTo: tomorrow },
      { offset: 0, limit: 1 },
      [["id", "asc"]],
    );

    if (bookings.count === 0) {
      const deletedTimetable = await this.timetableRepository.delete(id);
      this.handleNotFound(deletedTimetable, id);
      return deletedTimetable;
    } else {
      throw new ConflictException("Impossibile eliminare: l'orario è in uso.");
    }
  }

  private handleNotFound(
    timetable: Timetable | undefined,
    id: Timetable["id"],
  ): asserts timetable is Timetable {
    if (!timetable)
      throw new NotFoundException(`Orario con id ${id} non trovato`);
  }
}
