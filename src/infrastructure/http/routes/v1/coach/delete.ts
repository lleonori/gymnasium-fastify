import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { CoachSchemas } from "../../../schemas/index.ts";

const routes: FastifyPluginAsyncTypebox = async (app) => {
  app.delete(
    "/:coachId",
    {
      schema: {
        tags: ["Coach"],
        params: CoachSchemas.Params.CoachId,
        response: {
          200: CoachSchemas.Bodies.Coach,
        },
      },
    },
    ({ params: { coachId } }) => app.coachsService.delete(coachId)
  );
};

export default routes;
