import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { hasRole } from "../../../../auth/hasRole.js";
import { isAuthenticated } from "../../../../auth/isAuthenticated.js";
import { WeekdayTimeSchemas } from "../../../schemas/index.js";
import { UserRoles } from "../../../utils/enums.js";

const routes: FastifyPluginAsyncTypebox = async (app) => {
  app.post(
    "/",
    {
      schema: {
        tags: ["Weekday-Time"],
        body: WeekdayTimeSchemas.Bodies.CreateWeekdayTime,
        response: {
          201: WeekdayTimeSchemas.Bodies.WeekdayTime,
        },
      },
      preHandler: app.auth(
        [isAuthenticated, hasRole([UserRoles.SYSTEM_ADMINISTRATOR])],
        { relation: "and" },
      ),
    },
    async (request, reply) => {
      const newWeekdayTime = await app.weekdayTimeService.create(request.body);
      return reply.status(201).send(newWeekdayTime);
    },
  );
};

export default routes;
