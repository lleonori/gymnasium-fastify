import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { CoachSchemas } from "../../../schemas/index.ts";

const routes: FastifyPluginAsyncTypebox = async (app) => {
  app.post(
    "/",
    {
      schema: {
        body: CoachSchemas.Bodies.CreateCoach,
        response: {
          201: CoachSchemas.Bodies.Coach,
        },
      },
    },
    async (request, reply) => {
      const newPost = await app.coachsService.create(request.body);
      return reply.status(201).send(newPost);
    }
  );
};

export default routes;
