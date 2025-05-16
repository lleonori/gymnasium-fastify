import { FastifyInstance } from "fastify";
import { CreateBooking } from "../../application/booking/models.js";
import { BadRequestException } from "../../application/commons/exceptions.js";

export const validateBookingRequest = async (
  _: FastifyInstance,
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
};
