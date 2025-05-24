import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { hasRole } from "../../../../auth/hasRole.js";
import { isAuthenticated } from "../../../../auth/isAuthenticated.js";
import { CoachSchemas } from "../../../schemas/index.js";
import { UserRoles } from "../../../utils/enums.js";

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
      preHandler: app.auth(
        [isAuthenticated, hasRole([UserRoles.SYSTEM_ADMINISTRATOR])],
        { relation: "and" },
      ),
    },
    async (request, reply) => {
      const newCoach = await app.coachesService.create(request.body);
      return reply.status(201).send(newCoach);
    },
  );
};

export default routes;
