import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { UnauthorizedException } from "../../../../../application/commons/exceptions.ts";
import { CoachSchemas } from "../../../schemas/index.ts";
import { UserRoles } from "../../../utils/enums.ts";

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
      preHandler: async (request, reply) => {
        if (!app.authGuard(request, reply, [UserRoles.systemAdministrator])) {
          throw new UnauthorizedException(`User unauthorized`);
        }
      },
    },
    async (request) =>
      app.coachsService.update(request.params.coachId, request.body)
  );
};

export default routes;
