import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { hasRole } from "../../../../auth/hasRole.js";
import { isAuthenticated } from "../../../../auth/isAuthenticated.js";
import { BookingSchemas } from "../../../schemas/index.js";
import { decodeSort } from "../../../utils/decodeSort.js";
import { UserRoles } from "../../../utils/enums.js";

const routes: FastifyPluginAsyncTypebox = async (app) => {
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
    async ({
      query: { day, timetableId, mail, dateFrom, dateTo, offset, limit, sort },
    }) =>
      app.bookingsService.findAll(
        { day, timetableId, mail, dateFrom, dateTo },
        { offset: offset!, limit: limit! },
        decodeSort(sort!),
      ),
  );
};

export default routes;
