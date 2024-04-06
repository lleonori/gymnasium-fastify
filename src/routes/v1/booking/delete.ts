import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import db from "../../../db/index.ts";
import { BookingSchemas } from "../../../schemas/index.ts";

const routes: FastifyPluginAsyncTypebox = async (app) => {
  app.delete(
    "/:bookingId",
    {
      schema: {
        params: BookingSchemas.Params.BookingId,
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
      db.bookings = db.bookings.filter((b) => b.id !== bookingId);
      return booking;
    }
  );
};

export default routes;
