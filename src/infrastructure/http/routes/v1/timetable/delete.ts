import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { TimetableSchemas } from "../../../schemas/index.ts";

const routes: FastifyPluginAsyncTypebox = async (app) => {
  app.delete(
    "/:timetableId",
    {
      schema: {
        tags: ["Timetable"],
        params: TimetableSchemas.Params.TimetableId,
        response: {
          200: TimetableSchemas.Bodies.Timetable,
        },
      },
    },
    async ({ params: { timetableId } }) =>
      app.timetablesService.delete(timetableId)
  );
};

export default routes;
