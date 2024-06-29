import { FastifyInstance } from "fastify";
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from "../../../application/commons/exceptions.ts";

export const errorHandler: FastifyInstance["errorHandler"] = function (
  error,
  request,
  reply
) {
  if (error instanceof NotFoundException) {
    if (request.method === "DELETE") {
      return reply.code(204).send();
    }
    return reply.notFound(error.message);
  }

  if (error instanceof UnauthorizedException) {
    return reply.unauthorized(error.message);
  }

  if (error instanceof ConflictException) {
    return reply.conflict(error.message);
  }

  reply.log.error(
    {
      request: {
        method: request.method,
        url: request.url,
        headers: request.headers,
        body: request.body,
        query: request.query,
        params: request.params,
      },
      error,
    },
    "Unhandled error occurred."
  );
  return reply.code(500).send(error.message);
};
