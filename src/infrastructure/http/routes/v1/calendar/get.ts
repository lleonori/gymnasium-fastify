import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { CalendarSchemas } from "../../../schemas/index.ts";

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
};

export default routes;
