import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { CoachSchemas } from "../../../schemas/index.ts";
import { sql } from "kysely";

const routes: FastifyPluginAsyncTypebox = async (app) => {
  app.patch(
    "/:coachId",
    {
      schema: {
        tags: ["Coach"],
        params: CoachSchemas.Params.CoachId,
        body: CoachSchemas.Bodies.UpdateCoach,
        response: {
          200: CoachSchemas.Bodies.Coach,
        },
      },
    },
    async (request) =>
      app.coachsService.update(request.params.coachId, request.body)
  );
};

export default routes;
