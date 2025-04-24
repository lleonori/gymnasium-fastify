import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { WeekdayTimeSchemas } from "../../../schemas/index.js";
import { decodeSort } from "../../../utils/decodeSort.js";
import { isAuthenticated } from "../../../../auth/isAuthenticated.js";
import { hasRole } from "../../../../auth/hasRole.js";
import { UserRoles } from "../../../utils/enums.js";

const routes: FastifyPluginAsyncTypebox = async (app) => {
  app.get(
    "/",
    {
      schema: {
        tags: ["Weekday-Time"],
        querystring: WeekdayTimeSchemas.Queries.WeekdayTimeQuery,
        response: {
          200: WeekdayTimeSchemas.Bodies.WeekdayTimePaginated,
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
      app.weekdayTimeService.findAll(
        { offset: offset!, limit: limit! },
        decodeSort(sort!),
      ),
  );
};

export default routes;
