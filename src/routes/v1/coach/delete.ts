import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { CoachSchemas } from "../../../schemas/index.ts";

const routes: FastifyPluginAsyncTypebox = async (app) => {
  app.delete(
    "/:coachId",
    {
      schema: {
        params: CoachSchemas.Params.CoachId,
        response: {
          200: CoachSchemas.Bodies.Coach,
        },
      },
    },
    async ({ params: { coachId } }, reply) => {
      const coach = await app.db
        .deleteFrom("coachs")
        .where("id", "=", coachId)
        .returningAll()
        .executeTakeFirst();

      if (!coach) {
        return reply.status(204).send();
      }

      return coach;
    }
  );
};

export default routes;
