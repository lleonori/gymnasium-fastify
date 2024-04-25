import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
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
    async ({ params: { bookingId } }, reply) => {
      const booking = await app.db
        .deleteFrom("bookings")
        .where("id", "=", bookingId)
        .returningAll()
        .executeTakeFirst();

      if (!booking) {
        return reply.status(204).send();
      }

      return booking;
    }
  );
};

export default routes;
