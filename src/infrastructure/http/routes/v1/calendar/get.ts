import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { CalendarSchemas } from "../../../schemas/index.js";
import { getTodayAndTomorrow } from "../../../utils/datetime.js";

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
    () => getTodayAndTomorrow(),
  );
};

export default routes;
