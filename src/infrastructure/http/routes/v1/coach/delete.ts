import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { CoachSchemas } from "../../../schemas/index.js";
import { UserRoles } from "../../../utils/enums.js";
import { isAuthenticated } from "../../../../auth/isAuthenticated.js";
import { hasRole } from "../../../../auth/hasRole.js";

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
      preHandler: app.auth(
        [isAuthenticated, hasRole([UserRoles.SYSTEM_ADMINISTRATOR])],
        { relation: "and" },
      ),
    },
    async ({ params: { coachId } }) => app.coachsService.delete(coachId),
  );
};

export default routes;
