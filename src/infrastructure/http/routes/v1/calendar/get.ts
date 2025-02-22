import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { CalendarSchemas } from "../../../schemas/index.js";
import { getDateInItaly } from "../../../utils/dateTimeInItaly.js";

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
    () => getDateInItaly(),
  );
};

export default routes;
