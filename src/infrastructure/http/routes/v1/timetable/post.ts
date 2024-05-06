import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { TimetableSchemas } from "../../../schemas/index.ts";
import { sql } from "kysely";

const routes: FastifyPluginAsyncTypebox = async (app) => {
  app.post(
    "/",
    {
      schema: {
        body: TimetableSchemas.Bodies.CreateTimetable,
        response: {
          201: TimetableSchemas.Bodies.Timetable,
        },
      },
    },
    async (request, reply) => {
      const timetable = await app.db
        .insertInto("timetables")
        .values({
          ...request.body,
          created_at: () => sql`CURRENT_TIMESTAMP`,
        })
        .returningAll()
        .executeTakeFirst();

      reply.status(201).send(timetable);

      return timetable;
    }
  );
};

export default routes;
