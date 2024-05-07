import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { CalendarSchemas } from "../../../schemas/index.ts";

const routes: FastifyPluginAsyncTypebox = async (app) => {
  app.get(
    "/",
    {
      schema: {
        response: {
          200: CalendarSchemas.Bodies.Calendar,
        },
      },
    },
    () => app.calendarsService.findAll()
  );
};

export default routes;
