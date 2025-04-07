import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { BookingSchemas } from "../../../schemas/index.js";
import { decodeSort } from "../../../utils/decodeSort.js";
import { getTodayAndTomorrow } from "../../../utils/datetime.js";
import { hasRole } from "../../../../auth/hasRole.js";
import { isAuthenticated } from "../../../../auth/isAuthenticated.js";
import { UserRoles } from "../../../utils/enums.js";

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
      preHandler: app.auth(
        [
          isAuthenticated,
          hasRole([
            UserRoles.SYSTEM_ADMINISTRATOR,
            UserRoles.ADMINISTRATOR,
            UserRoles.USER,
          ]),
        ],
        { relation: "and" },
      ),
    },
    async (request, reply) => {
      const { offset, limit, sort } = request.query;
      const { bookingMail } = request.params;

      const calendar = getTodayAndTomorrow();

      const bookings = await app.bookingsService.findByMail(
        calendar,
        bookingMail,
        { offset: offset!, limit: limit! },
        decodeSort(sort!),
      );

      reply.send(bookings);
    },
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
      preHandler: app.auth(
        [
          isAuthenticated,
          hasRole([
            UserRoles.SYSTEM_ADMINISTRATOR,
            UserRoles.ADMINISTRATOR,
            UserRoles.USER,
          ]),
        ],
        { relation: "and" },
      ),
    },
    async ({ query: { day, hour, offset, limit, sort } }) =>
      app.bookingsService.findAll(
        { day: day, hour: hour },
        { offset: offset!, limit: limit! },
        decodeSort(sort!),
      ),
  );
};

export default routes;
