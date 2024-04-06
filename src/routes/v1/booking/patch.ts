import { FastifyInstance } from "fastify";
import db from "../../../db/index.ts";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { BookingSchemas } from "../../../schemas/index.ts";

const routes: FastifyPluginAsyncTypebox = async (app) => {
  app.patch(
    "/:bookingId",
    {
      schema: {
        params: BookingSchemas.Params.BookingId,
        body: BookingSchemas.Bodies.UpdateBooking,
        response: {
          200: BookingSchemas.Bodies.Booking,
        },
      },
    },
    async (request) => {
      const { bookingId } = request.params;
      const booking = db.bookings.find((b) => b.id === bookingId);
      if (!booking) {
        throw app.httpErrors.notFound();
      }

      const updatedBooking = {
        ...booking,
        ...request.body,
        id: booking.id,
      };
      db.bookings = db.bookings.map((b) => {
        if (b.id === bookingId) {
          return updatedBooking;
        }
        return b;
      });
      return updatedBooking;
    }
  );
};

export default routes;
