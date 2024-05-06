import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { TimetableSchemas } from "../../../schemas/index.ts";
import CommonSchemas from "../../../schemas/commons/index.ts";

const routes: FastifyPluginAsyncTypebox = async (app) => {
  app.get(
    "/",
    {
      schema: {
        querystring: CommonSchemas.Queries.Pagination,
        response: {
          200: TimetableSchemas.Bodies.TimetablesPaginated,
        },
      },
    },
    async ({ query: { offset, limit } }) => {
      const countQuery = app.db
        .selectFrom("timetables")
        .select(({ fn }) => [fn.count<number>("id").as("count")])
        .executeTakeFirst();
      const timetableQuery = app.db
        .selectFrom("timetables")
        .offset(offset)
        .limit(limit)
        .selectAll()
        .orderBy("id", "asc")
        .execute();
      const [countResult, timetableResult] = await Promise.all([
        countQuery,
        timetableQuery,
      ]);
      return {
        count: countResult?.count ?? 0,
        data: timetableResult,
      };
    }
  );
};

export default routes;
