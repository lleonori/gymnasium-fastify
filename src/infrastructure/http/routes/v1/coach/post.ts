import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { CoachSchemas } from "../../../schemas/index.ts";
import { sql } from "kysely";

const routes: FastifyPluginAsyncTypebox = async (app) => {
  app.post(
    "/",
    {
      schema: {
        body: CoachSchemas.Bodies.CreateCoach,
        response: {
          201: CoachSchemas.Bodies.Coach,
        },
      },
    },
    async (request, reply) => {
      const coach = await app.db
        .insertInto("coachs")
        .values({
          ...request.body,
          created_at: () => sql`CURRENT_TIMESTAMP`,
        })
        .returningAll()
        .executeTakeFirst();

      reply.status(201).send(coach);

      return coach;
    }
  );
};

export default routes;
