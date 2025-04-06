import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { BookingSchemas } from "../../../schemas/index.js";
import { DailyBookingLimit } from "../../../utils/enums.js";
import {
  ConflictException,
  TooManyRequestsException,
} from "../../../../../application/commons/exceptions.js";
import { validateBookingRequest } from "../../../../validations/booking.validation.js";

const routes: FastifyPluginAsyncTypebox = async (app) => {
  app.post(
    "/",
    {
      schema: {
        tags: ["Booking"],
        body: BookingSchemas.Bodies.CreateBooking,
        response: {
          201: BookingSchemas.Bodies.Booking,
        },
      },
    },
    async (request, reply) => {
      await validateBookingRequest(app, request.body);

      const countBookingsForDayAndEmail =
        await app.bookingsService.countBookingsForDayAndEmail(
          new Date(request.body.day),
          request.body.mail,
        );

      const countBookingsForDay = await app.bookingsService.countBookingsForDay(
        new Date(request.body.day),
      );

      if (
        countBookingsForDayAndEmail === 0 &&
        countBookingsForDay <= DailyBookingLimit.LIMIT
      ) {
        const newBooking = await app.bookingsService.create(request.body);
        return reply.status(201).send(newBooking);
      } else {
        if (countBookingsForDayAndEmail > 0)
          throw new ConflictException("La lezione è stata già prenotata.");
        else if (countBookingsForDay >= DailyBookingLimit.LIMIT)
          throw new TooManyRequestsException(
            "Limite di prenotazione raggiunto.",
          );
      }
    },
  );
};

export default routes;
