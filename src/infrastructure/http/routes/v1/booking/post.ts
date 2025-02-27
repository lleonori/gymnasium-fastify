import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { BookingSchemas } from "../../../schemas/index.js";
import { BookingLimitHours, DailyBookingLimit } from "../../../utils/enums.js";
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  TooManyRequestsException,
} from "../../../../../application/commons/exceptions.js";
import { formatTimeInSecond, getTime } from "../../../utils/datetime.js";

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
      const data = new Date(request.body.day);
      // Normalize the request date to remove the time
      data.setHours(0, 0, 0, 0);

      const today = new Date();
      // Normalize the today date to remove the time
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      // Set tomorrow date
      tomorrow.setDate(today.getDate() + 1);

      // Check if the date is between today and tomorrow
      if (data < today || data > tomorrow) {
        throw new BadRequestException(
          "Impossibile prenotare: la data deve essere compresa tra oggi e domani.",
        );
      }

      const countBookingsForDayAndEmail =
        await app.bookingsService.countBookingsForDayAndEmail(
          new Date(request.body.day),
          request.body.mail,
        );

      const countBookingsForDay = await app.bookingsService.countBookingsForDay(
        new Date(request.body.day),
      );

      const isBookingAllowed =
        formatTimeInSecond(request.body.hour) - formatTimeInSecond(getTime()) >=
        BookingLimitHours.Limit;

      if (
        countBookingsForDayAndEmail === 0 &&
        countBookingsForDay <= DailyBookingLimit.Limit &&
        isBookingAllowed
      ) {
        const newBooking = await app.bookingsService.create(request.body);
        return reply.status(201).send(newBooking);
      } else {
        if (countBookingsForDayAndEmail > 0)
          throw new ConflictException("La lezione è stata già prenotata.");
        else if (countBookingsForDay >= DailyBookingLimit.Limit)
          throw new TooManyRequestsException(
            "Limite di prenotazione raggiunto.",
          );
        else if (!isBookingAllowed)
          throw new ForbiddenException(
            "Impossibile prenotare: il tempo limite è scaduto.",
          );
      }
    },
  );
};

export default routes;
