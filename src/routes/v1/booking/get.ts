import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { BookingSchemas } from "../../../schemas/index.ts";
import CommonSchemas from "../../../schemas/commons/index.ts";

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
      const booking = await app.db
        .selectFrom("bookings")
        .where("bookings.id", "=", bookingId)
        .selectAll()
        .executeTakeFirst();

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
    async ({ query: { offset, limit } }) => {
      const countQuery = app.db
        .selectFrom("bookings")
        .select(({ fn }) => [fn.count<number>("id").as("count")])
        .executeTakeFirst();
      const bookingQuery = app.db
        .selectFrom("bookings")
        .offset(offset)
        .limit(limit)
        .selectAll()
        .orderBy("created_at", "asc")
        .execute();
      const [countResult, bookingResult] = await Promise.all([
        countQuery,
        bookingQuery,
      ]);
      return {
        count: countResult?.count ?? 0,
        data: bookingResult,
      };
    }
  );
};

export default routes;
