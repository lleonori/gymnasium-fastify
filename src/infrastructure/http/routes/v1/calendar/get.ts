import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { CalendarSchemas } from "../../../schemas/index.ts";
import { log } from "console";

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
    async () => {
      const { today, tomorrow } = getDateTimeInItaly();
      return { today: today, tomorrow: tomorrow };
    }
  );

  function getDateTimeInItaly() {
    // Get the current date and time in Italy
    const italyTime = new Date().toLocaleString("it-IT", {
      timeZone: "Europe/Rome",
      dateStyle: "short",
    });

    // Get the date and time for tomorrow in Italy
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowItalyTime = tomorrow.toLocaleString("it-IT", {
      timeZone: "Europe/Rome",
      dateStyle: "short",
    });

    return { today: italyTime, tomorrow: tomorrowItalyTime };
  }
};

export default routes;
