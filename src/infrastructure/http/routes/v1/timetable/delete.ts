import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { TimetableSchemas } from "../../../schemas/index.js";

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
      // preHandler: async (request, reply) => {
      //   if (!app.authGuard(request, reply, [UserRoles.systemAdministrator])) {
      //     throw new UnauthorizedException(`User unauthorized`);
      //   }
      // },
    },
    async ({ params: { timetableId } }) =>
      app.timetablesService.delete(timetableId),
  );
};

export default routes;
