import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { TimetableSchemas } from "../../../schemas/index.js";
import { UserRoles } from "../../../utils/enums.js";
import { hasRole } from "../../../../auth/hasRole.js";
import { isAuthenticated } from "../../../../auth/isAuthenticated.js";

const routes: FastifyPluginAsyncTypebox = async (app) => {
  app.patch(
    "/:timetableId",
    {
      schema: {
        tags: ["Timetable"],
        params: TimetableSchemas.Params.TimetableId,
        body: TimetableSchemas.Bodies.UpdateTimetable,
        response: {
          200: TimetableSchemas.Bodies.Timetable,
        },
      },
      preHandler: app.auth(
        [isAuthenticated, hasRole([UserRoles.SYSTEM_ADMINISTRATOR])],
        { relation: "and" },
      ),
    },
    async (request) =>
      app.timetableBookingManagerService.update(
        request.params.timetableId,
        request.body,
      ),
  );
};

export default routes;
