import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { CoachSchemas } from "../../../schemas/index.ts";
import CommonSchemas from "../../../schemas/commons/index.ts";

const routes: FastifyPluginAsyncTypebox = async (app) => {
  app.get(
    "/",
    {
      schema: {
        querystring: CommonSchemas.Queries.Pagination,
        response: {
          200: CoachSchemas.Bodies.CoachsPaginated,
        },
      },
    },
    async ({ query: { offset, limit } }) => {
      const countQuery = app.db
        .selectFrom("coachs")
        .select(({ fn }) => [fn.count<number>("id").as("count")])
        .executeTakeFirst();
      const coachQuery = app.db
        .selectFrom("coachs")
        .offset(offset)
        .limit(limit)
        .selectAll()
        .orderBy("id", "asc")
        .execute();
      const [countResult, coachResult] = await Promise.all([
        countQuery,
        coachQuery,
      ]);
      return {
        count: countResult?.count ?? 0,
        data: coachResult,
      };
    }
  );
};

export default routes;
