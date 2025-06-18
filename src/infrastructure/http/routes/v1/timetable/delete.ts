import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { TimetableSchemas } from "../../../schemas/index.js";
import { UserRoles } from "../../../utils/enums.js";
import { hasRole } from "../../../../auth/hasRole.js";
import { isAuthenticated } from "../../../../auth/isAuthenticated.js";

const routes: FastifyPluginAsyncTypebox = async (app) => {
  app.delete(
    "/:timetableId",
    {
      schema: {
        tags: ["Timetable"],
        params: TimetableSchemas.Params.TimetableId,
        response: {
          200: TimetableSchemas.Bodies.Timetable,
        },
      },
      preHandler: app.auth(
        [isAuthenticated, hasRole([UserRoles.SYSTEM_ADMINISTRATOR])],
        { relation: "and" },
      ),
    },
    async ({ params: { timetableId } }) =>
      app.timetableBookingManagerService.delete(timetableId),
  );
};

export default routes;
