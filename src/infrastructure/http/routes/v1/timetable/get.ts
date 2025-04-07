import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { TimetableSchemas } from "../../../schemas/index.js";
import { decodeSort } from "../../../utils/decodeSort.js";
import { isAuthenticated } from "../../../../auth/isAuthenticated.js";
import { hasRole } from "../../../../auth/hasRole.js";
import { UserRoles } from "../../../utils/enums.js";

const routes: FastifyPluginAsyncTypebox = async (app) => {
  app.get(
    "/",
    {
      schema: {
        tags: ["Timetable"],
        querystring: TimetableSchemas.Queries.TimetablesQuery,
        response: {
          200: TimetableSchemas.Bodies.TimetablesPaginated,
        },
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
    async ({ query: { offset, limit, sort } }) =>
      app.timetablesService.findAll(
        { offset: offset!, limit: limit! },
        decodeSort(sort!),
      ),
  );

  app.get(
    "/:date",
    {
      schema: {
        tags: ["Timetable"],
        querystring: TimetableSchemas.Queries.TimetablesQuery,
        params: TimetableSchemas.Params.Date,
        response: {
          200: TimetableSchemas.Bodies.TimetablesPaginated,
        },
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
    async (request, reply) => {
      const { offset, limit, sort } = request.query;
      const { date } = request.params;

      const timetables = await app.timetablesService.findByDate(
        date,
        { offset: offset!, limit: limit! },
        decodeSort(sort!),
      );

      reply.send(timetables);
    },
  );
};

export default routes;
