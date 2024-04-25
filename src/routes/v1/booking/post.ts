import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { BookingSchemas } from "../../../schemas/index.ts";
import { sql } from "kysely";

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
      const booking = await app.db
        .insertInto("bookings")
        .values({
          ...request.body,
          created_at: () => sql`CURRENT_TIMESTAMP`,
        })
        .returningAll()
        .executeTakeFirst();

      reply.status(201).send(booking);

      return booking;
    }
  );
};

export default routes;
