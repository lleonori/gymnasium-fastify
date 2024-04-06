import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import db from "../../../db/index.ts";
import CommonSchemas from "../../../schemas/commons/index.ts";
import { BookingSchemas } from "../../../schemas/index.ts";

const routes: FastifyPluginAsyncTypebox = async (app) => {
  app.get(
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
      return booking;
    }
  );

  app.get(
    "/",
    {
      schema: {
        querystring: CommonSchemas.Queries.Pagination,
        response: {
          200: BookingSchemas.Bodies.BookingsPaginated,
        },
      },
    },
    ({ query: { offset, limit } }) => ({
      count: db.bookings.length,
      data: db.bookings.slice(offset, offset + limit),
    })
  );
};

export default routes;
