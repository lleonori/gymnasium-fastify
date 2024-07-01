import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { CalendarSchemas } from "../../../schemas/index.ts";
import { getDateTimeInItaly } from "../../../utils/dateTimeInItaly.ts";

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
    () => getDateTimeInItaly()
  );

  // app.get(
  //   "/:mail",
  //   {
  //     schema: {
  //       tags: ["Calendar"],
  //       querystring: CalendarSchemas.Queries.CalendarQuery,
  //       params: CalendarSchemas.Params.Mail,
  //       response: {
  //         200: CalendarSchemas.Bodies.Calendar,
  //       },
  //     },
  //   },
  //   async (request, reply) => {
  //     const { offset, limit, sort } = request.query;
  //     const { mail } = request.params;

  //     const calendar = getDateTimeInItaly();

  //     const bookings = await app.bookingsService.findByMail(
  //       calendar,
  //       mail,
  //       { offset: offset!, limit: limit! },
  //       decodeSort(sort!)
  //     );

  //     reply.send(clearBookedDaysFromCalendar(bookings, calendar));
  //   }
  // );
};

export default routes;
