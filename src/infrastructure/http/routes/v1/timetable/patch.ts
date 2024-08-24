import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { TimetableSchemas } from "../../../schemas/index.ts";
import { UserRoles } from "../../../utils/enums.ts";
import { UnauthorizedException } from "../../../../../application/commons/exceptions.ts";

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
      preHandler: async (request, reply) => {
        if (!app.authGuard(request, reply, [UserRoles.systemAdministrator])) {
          throw new UnauthorizedException(`User unauthorized`);
        }
      },
    },
    async (request) =>
      app.timetablesService.update(request.params.timetableId, request.body)
  );
};

export default routes;
