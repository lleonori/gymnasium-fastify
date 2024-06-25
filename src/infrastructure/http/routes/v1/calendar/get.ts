import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { CalendarSchemas } from "../../../schemas/index.ts";
import {
  clearBookedDaysFromCalendar,
  getDateTimeInItaly,
} from "../../../utils/dateTimeInItaly.ts";
import { decodeSort } from "../../../utils/decodeSort.ts";

const routes: FastifyPluginAsyncTypebox = async (app) => {
  app.get(
    "/",
    {
      schema: {
        tags: ["Calendar"],
        response: {
          200: CalendarSchemas.Bodies.Calendar,
        },
      },
    },
    () => app.calendarService.getDateTimeInItaly()
  );

  app.get(
    "/:mail",
    {
      schema: {
        tags: ["Calendar"],
        querystring: CalendarSchemas.Queries.CalendarQuery,
        params: CalendarSchemas.Params.Mail,
        response: {
          200: CalendarSchemas.Bodies.Calendar,
        },
      },
    },
    async (request, reply) => {
      const { offset, limit, sort } = request.query;
      const { mail } = request.params;

      const calendar = getDateTimeInItaly();

      const bookings = await app.bookingsService.findByMail(
        calendar,
        mail,
        { offset: offset!, limit: limit! },
        decodeSort(sort!)
      );

      reply.send(clearBookedDaysFromCalendar(bookings, calendar));
    }
  );
};

export default routes;
