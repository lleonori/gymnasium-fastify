import { FastifyInstance } from "fastify";
import { CreateBooking } from "../../application/booking/models.js";
import {
  BadRequestException,
  ForbiddenException,
} from "../../application/commons/exceptions.js";
import {
  isSunday,
  formatTimeInSecond,
  getTime,
  isSaturday,
} from "../http/utils/datetime.js";
import { BookingLimitHours } from "../http/utils/enums.js";

export const validateBookingRequest = async (
  app: FastifyInstance,
  body: CreateBooking,
) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const bookingDate = new Date(body.day);

  bookingDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(23, 59, 59, 999);

  if (!(bookingDate >= today && bookingDate <= tomorrow)) {
    console.error("Errore: la data selezionata non è valida.");
    throw new BadRequestException(
      "Impossibile prenotare: la data selezionata non è valida.",
    );
  }

  if (today.toDateString() === bookingDate.toDateString()) {
    const currentTime = getTime();
    const timeDifference =
      formatTimeInSecond(body.hour) - formatTimeInSecond(currentTime);

    if (timeDifference < BookingLimitHours.LIMIT) {
      console.error("Errore: tempo limite scaduto.");
      throw new ForbiddenException(
        "Impossibile prenotare: il tempo limite è scaduto.",
      );
    }
  }

  if (isSunday(bookingDate)) {
    console.error("Errore: tentativo di prenotazione per domenica.");
    throw new BadRequestException(
      "Impossibile prenotare: il giorno selezionato è domenica.",
    );
  }

  const existTimetable =
    await app.timetablesService.findByHourAndIsValidOnWeekend(
      body.hour,
      isSaturday(bookingDate),
    );

  if (!existTimetable) {
    console.error("Errore: orario selezionato non valido.");
    throw new BadRequestException(
      "Impossibile prenotare: l'orario selezionato non è valido.",
    );
  }
};
