import { FastifyInstance } from "fastify";
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  InternalServerError,
  NotFoundException,
  TooManyRequestsException,
  UnauthorizedException,
} from "../../../application/commons/exceptions.js";

export const errorHandler: FastifyInstance["errorHandler"] = function (
  error,
  request,
  reply,
) {
  // Type guard per verificare se è un Error
  const err = error instanceof Error ? error : new Error(String(error));

  if (err instanceof NotFoundException) {
    if (request.method === "DELETE") {
      return reply.code(204).send();
    }
    return reply.notFound(err.message);
  }

  if (err instanceof UnauthorizedException) {
    return reply.unauthorized(err.message);
  }

  if (err instanceof ConflictException) {
    return reply.conflict(err.message);
  }

  if (err instanceof BadRequestException) {
    return reply.badRequest(err.message);
  }

  if (err instanceof InternalServerError) {
    return reply.internalServerError(err.message);
  }

  if (err instanceof TooManyRequestsException) {
    return reply.tooManyRequests(err.message);
  }

  if (err instanceof ForbiddenException) {
    return reply.forbidden(err.message);
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
        stack: err.stack,
      },
      error: err,
    },
    "Unhandled error occurred.",
  );

  return reply.internalServerError(err.message || "Internal Server Error");
};
