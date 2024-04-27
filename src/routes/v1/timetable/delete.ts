import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { TimetableSchemas } from "../../../schemas/index.ts";

const routes: FastifyPluginAsyncTypebox = async (app) => {
  app.delete(
    "/:timetableId",
    {
      schema: {
        params: TimetableSchemas.Params.TimetableId,
        response: {
          200: TimetableSchemas.Bodies.Timetable,
        },
      },
    },
    async ({ params: { timetableId } }, reply) => {
      const timetable = await app.db
        .deleteFrom("timetables")
        .where("id", "=", timetableId)
        .returningAll()
        .executeTakeFirst();

      if (!timetable) {
        return reply.status(204).send();
      }

      return timetable;
    }
  );
};

export default routes;
