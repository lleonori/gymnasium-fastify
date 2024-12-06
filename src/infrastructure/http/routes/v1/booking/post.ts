import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { BookingSchemas } from "../../../schemas/index.ts";
import { DailyBookingLimit } from "../../../utils/enums.ts";
import { ConflictException } from "../../../../../application/commons/exceptions.ts";

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
      const countAllBookingsByDayAndMail =
        await app.bookingsService.countAllBookingsByDayAndMail(
          new Date(request.body.day),
          request.body.mail
        );

      const countAllBookingsByDay =
        await app.bookingsService.countAllBookingsByDay(
          new Date(request.body.day)
        );

      if (
        countAllBookingsByDayAndMail === 0 &&
        countAllBookingsByDay <= DailyBookingLimit.Limit
      ) {
        const newBooking = await app.bookingsService.create(request.body);
        return reply.status(201).send(newBooking);
      } else {
        if (countAllBookingsByDayAndMail > 0)
          throw new ConflictException("La lezione è stata già prenotata.");
        else if (countAllBookingsByDay === DailyBookingLimit.Limit)
          throw new ConflictException("Limite di prenotazione raggiunto.");
      }
    }
  );
};

export default routes;
