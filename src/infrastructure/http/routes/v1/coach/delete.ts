import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { CoachSchemas } from "../../../schemas/index.ts";
import { UserRoles } from "../../../utils/enums.ts";
import { UnauthorizedException } from "../../../../../application/commons/exceptions.ts";

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
        if (!app.authGuard(request, reply, [UserRoles.systemAdministrator])) {
          throw new UnauthorizedException(`User unauthorized`);
        }
      },
    },
    async ({ params: { coachId } }) => app.coachsService.delete(coachId)
  );
};

export default routes;
