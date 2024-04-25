import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { BookingSchemas } from "../../../schemas/index.ts";
import { sql } from "kysely";

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
      const booking = await app.db
        .updateTable("bookings")
        .set({
          ...request.body,
          updated_at: () => sql`CURRENT_TIMESTAMP`,
        })
        .where("id", "=", bookingId)
        .returningAll()
        .executeTakeFirst();

      if (!booking) {
        throw app.httpErrors.notFound();
      }

      return booking;
    }
  );
};

export default routes;
