import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { WeekdaySchemas } from "../../../schemas/index.js";
import { decodeSort } from "../../../utils/decodeSort.js";
import { isAuthenticated } from "../../../../auth/isAuthenticated.js";
import { hasRole } from "../../../../auth/hasRole.js";
import { UserRoles } from "../../../utils/enums.js";

const routes: FastifyPluginAsyncTypebox = async (app) => {
  app.get(
    "/",
    {
      schema: {
        tags: ["Weekday"],
        querystring: WeekdaySchemas.Queries.WeekdayQuery,
        response: {
          200: WeekdaySchemas.Bodies.WeekdayPaginated,
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
      app.weekdayService.findAll(
        { offset: offset!, limit: limit! },
        decodeSort(sort!),
      ),
  );
};

export default routes;
