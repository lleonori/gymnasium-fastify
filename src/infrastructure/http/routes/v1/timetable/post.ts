import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { TimetableSchemas } from "../../../schemas/index.ts";

const routes: FastifyPluginAsyncTypebox = async (app) => {
  app.post(
    "/",
    {
      schema: {
        tags: ["Timetable"],
        body: TimetableSchemas.Bodies.CreateTimetable,
        response: {
          201: TimetableSchemas.Bodies.Timetable,
        },
      },
    },
    async (request) => app.timetablesService.create(request.body)
  );
};

export default routes;
