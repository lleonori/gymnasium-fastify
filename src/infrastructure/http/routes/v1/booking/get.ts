import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { BookingSchemas } from "../../../schemas/index.ts";
import { decodeSort } from "../../../utils/decodeSort.ts";

const routes: FastifyPluginAsyncTypebox = async (app) => {
  app.get(
    "/:bookingMail",
    {
      schema: {
        tags: ["Booking"],
        querystring: BookingSchemas.Queries.BookingsQuery,
        params: BookingSchemas.Params.BookingMail,
        response: {
          200: BookingSchemas.Bodies.BookingsPaginated,
        },
      },
    },
    async (request, reply) => {
      const { offset, limit, sort } = request.query;
      const { bookingMail } = request.params;

      // const calendar = await ;

      const bookings = await app.bookingsService.findByMail(
        calendar,
        bookingMail,
        { offset: offset!, limit: limit! },
        decodeSort(sort!)
      );

      reply.send(bookings);
    }
  );

  app.get(
    "/",
    {
      schema: {
        tags: ["Booking"],
        querystring: BookingSchemas.Queries.BookingsQuery,
        response: {
          200: BookingSchemas.Bodies.BookingsPaginated,
        },
      },
    },
    async ({ query: { offset, limit, sort } }) =>
      app.bookingsService.findAll(
        { offset: offset!, limit: limit! },
        decodeSort(sort!)
      )
  );
};

export default routes;
