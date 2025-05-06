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
    async ({ query: { weekdayId, offset, limit, sort } }) =>
      app.timetablesService.findAll(
        { weekdayId },
        { offset: offset!, limit: limit! },
        decodeSort(sort!),
      ),
  );
};

export default routes;
