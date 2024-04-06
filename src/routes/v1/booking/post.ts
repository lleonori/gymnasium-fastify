import db from "../../../db/index.ts";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { BookingSchemas } from "../../../schemas/index.ts";

const routes: FastifyPluginAsyncTypebox = async (app) => {
  app.post(
    "/",
    {
      schema: {
        body: BookingSchemas.Bodies.CreateBooking,
        response: {
          201: BookingSchemas.Bodies.Booking,
        },
      },
    },
    async (request, reply) => {
      const { name, surname, bookingDate } = request.body;
      const booking = {
        id: db.bookings.length + 1,
        name,
        surname,
        bookingDate,
      };
      db.bookings.push(booking);

      reply.status(201);
      return booking;
    }
  );
};

export default routes;
