import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { CoachSchemas } from "../../../schemas/index.ts";
import { sql } from "kysely";

const routes: FastifyPluginAsyncTypebox = async (app) => {
  app.patch(
    "/:coachId",
    {
      schema: {
        params: CoachSchemas.Params.CoachId,
        body: CoachSchemas.Bodies.UpdateCoach,
        response: {
          200: CoachSchemas.Bodies.Coach,
        },
      },
    },
    async (request) => {
      const { coachId } = request.params;
      const coach = await app.db
        .updateTable("coachs")
        .set({
          ...request.body,
          updated_at: () => sql`CURRENT_TIMESTAMP`,
        })
        .where("id", "=", coachId)
        .returningAll()
        .executeTakeFirst();

      if (!coach) {
        throw app.httpErrors.notFound();
      }

      return coach;
    }
  );
};

export default routes;
