import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { CoachSchemas } from "../../../schemas/index.ts";

const routes: FastifyPluginAsyncTypebox = async (app) => {
  app.post(
    "/",
    {
      schema: {
        tags: ["Coach"],
        body: CoachSchemas.Bodies.CreateCoach,
        response: {
          201: CoachSchemas.Bodies.Coach,
        },
      },
      // preHandler: async (request, reply) => {
      //   if (!app.authGuard(request, reply, [UserRoles.systemAdministrator])) {
      //     throw new UnauthorizedException(`User unauthorized`);
      //   }
      // },
    },
    async (request, reply) => {
      const newCoach = await app.coachsService.create(request.body);
      return reply.status(201).send(newCoach);
    },
  );
};

export default routes;
