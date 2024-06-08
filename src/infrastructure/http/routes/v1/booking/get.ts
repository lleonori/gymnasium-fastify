import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { BookingSchemas } from "../../../schemas/index.ts";
import { decodeSort } from "../../../utils/decodeSort.ts";

const routes: FastifyPluginAsyncTypebox = async (app) => {
  app.get(
    "/:bookingMail",
    {
      schema: {
        tags: ["Booking"],
        params: BookingSchemas.Params.BookingMail,
        response: {
          200: BookingSchemas.Bodies.Booking,
        },
      },
    },
    (request) => app.bookingsService.findByMail(request.params.bookingMail)
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
