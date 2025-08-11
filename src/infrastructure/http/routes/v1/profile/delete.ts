import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { ProfileSchemas } from "../../../schemas/index.js";
import { UserRoles } from "../../../utils/enums.js";
import { hasRole } from "../../../../auth/hasRole.js";
import { isAuthenticated } from "../../../../auth/isAuthenticated.js";

const routes: FastifyPluginAsyncTypebox = async (app) => {
  app.delete(
    "/:userId",
    {
      schema: {
        tags: ["Profile"],
        params: ProfileSchemas.Params.UserId,
      },
      preHandler: app.auth(
        [
          isAuthenticated,
          hasRole([
            UserRoles.SYSTEM_ADMINISTRATOR,
            UserRoles.ADMINISTRATOR,
            UserRoles.USER,
          ]),
        ],
        { relation: "and" },
      ),
    },
    async ({ params: { userId } }) => app.profileService.delete(userId),
  );
};

export default routes;
