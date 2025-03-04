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

  if (
    !(
      bookingDate.valueOf() >= today.valueOf() &&
      bookingDate.valueOf() <= tomorrow.valueOf()
    )
  ) {
    throw new BadRequestException(
      "Impossibile prenotare: la data selezionata non è valida.",
    );
  }

  if (isSunday(bookingDate)) {
    throw new BadRequestException(
      "Impossibile prenotare: il giorno selezionato è domenica.",
    );
  }

  if (today.valueOf() === bookingDate.valueOf()) {
    const currentTime = getTime();
    const requestedTimeInSeconds = formatTimeInSecond(body.hour);
    const currentTimeInSeconds = formatTimeInSecond(currentTime);
    const timeDifference = requestedTimeInSeconds - currentTimeInSeconds;

    if (timeDifference < BookingLimitHours.Limit) {
      throw new ForbiddenException(
        "Impossibile prenotare: il tempo limite è scaduto.",
      );
    }
  }

  const existTimetable = await app.timetablesService.findByHour(body.hour);
  if (!existTimetable) {
    throw new BadRequestException(
      "Impossibile prenotare: l'orario selezionato non è valido.",
    );
  }
};
