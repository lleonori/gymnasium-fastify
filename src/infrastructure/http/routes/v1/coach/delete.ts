import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { CoachSchemas } from "../../../schemas/index.ts";
import { UserRoles } from "../../../utils/enums.ts";

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
      preHandler: async (request, reply) => {
        app.authGuard(request, reply, [UserRoles.systemAdministrator]);
      },
    },
    async ({ params: { coachId } }) => app.coachsService.delete(coachId)
  );
};

export default routes;
