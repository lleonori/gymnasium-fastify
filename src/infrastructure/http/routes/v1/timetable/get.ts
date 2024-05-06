import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { TimetableSchemas } from "../../../schemas/index.ts";
import { decodeSort } from "../../../utils/decodeSort.ts";

const routes: FastifyPluginAsyncTypebox = async (app) => {
  app.get(
    "/",
    {
      schema: {
        querystring: TimetableSchemas.Queries.CoachsQuery,
        response: {
          200: TimetableSchemas.Bodies.TimetablesPaginated,
        },
      },
    },
    async ({ query: { offset, limit, sort } }) =>
      app.timetablesService.findAll(
        { offset: offset!, limit: limit! },
        decodeSort(sort!)
      )
  );
};

export default routes;
