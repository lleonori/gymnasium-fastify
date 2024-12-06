import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { CoachSchemas } from "../../../schemas/index.ts";
import { decodeSort } from "../../../utils/decodeSort.ts";

const routes: FastifyPluginAsyncTypebox = async (app) => {
  app.get(
    "/",
    {
      schema: {
        tags: ["Coach"],
        querystring: CoachSchemas.Queries.CoachsQuery,
        response: {
          200: CoachSchemas.Bodies.CoachsPaginated,
        },
      },
    },
    async ({ query: { offset, limit, sort } }) =>
      app.coachsService.findAll(
        { offset: offset!, limit: limit! },
        decodeSort(sort!),
      ),
  );
};

export default routes;
