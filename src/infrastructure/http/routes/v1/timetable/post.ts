import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { TimetableSchemas } from "../../../schemas/index.ts";

const routes: FastifyPluginAsyncTypebox = async (app) => {
  app.post(
    "/",
    {
      schema: {
        tags: ["Timetable"],
        body: TimetableSchemas.Bodies.CreateTimetable,
        response: {
          201: TimetableSchemas.Bodies.Timetable,
        },
      },
      // preHandler: async (request, reply) => {
      //   if (!app.authGuard(request, reply, [UserRoles.systemAdministrator])) {
      //     throw new UnauthorizedException(`User unauthorized`);
      //   }
      // },
    },
    async (request, reply) => {
      const newTimetable = await app.timetablesService.create(request.body);
      return reply.status(201).send(newTimetable);
    },
  );
};

export default routes;
