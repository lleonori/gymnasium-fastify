import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { TimetableSchemas } from "../../../schemas/index.ts";
import { sql } from "kysely";

const routes: FastifyPluginAsyncTypebox = async (app) => {
  app.patch(
    "/:timetableId",
    {
      schema: {
        params: TimetableSchemas.Params.TimetableId,
        body: TimetableSchemas.Bodies.UpdateTimetable,
        response: {
          200: TimetableSchemas.Bodies.Timetable,
        },
      },
    },
    async (request) => {
      const { timetableId } = request.params;
      const timetable = await app.db
        .updateTable("timetables")
        .set({
          ...request.body,
          updated_at: () => sql`CURRENT_TIMESTAMP`,
        })
        .where("id", "=", timetableId)
        .returningAll()
        .executeTakeFirst();

      if (!timetable) {
        throw app.httpErrors.notFound();
      }

      return timetable;
    }
  );
};

export default routes;
