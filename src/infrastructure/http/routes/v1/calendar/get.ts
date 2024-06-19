import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { addDays, format } from "date-fns";
import { fromZonedTime } from "date-fns-tz";
import { CalendarSchemas } from "../../../schemas/index.ts";
import { Calendar } from "../../../../../application/calendar/models.ts";

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
    () => findAll()
  );
};

const findAll = (): Calendar => {
  const { today, tomorrow } = getDateTimeInItaly();
  return { today, tomorrow };
};

const getDateTimeInItaly = (): Calendar => {
  // Get the current date and time in Italy timezone
  const now: Date = fromZonedTime(new Date(), "Europe/Rome");

  // Format the dates as strings
  const today: string = format(
    fromZonedTime(now, "Europe/Rome"),
    "yyyy-MM-dd HH:mm:ssXXX"
  );
  const tomorrow: string = format(
    fromZonedTime(addDays(now, 1), "Europe/Rome"),
    "yyyy-MM-dd HH:mm:ssXXX"
  );

  return { today: today, tomorrow: tomorrow };
};

export default routes;
