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

  if (error instanceof BadRequestException) {
    return reply.badRequest(error.message);
  }

  if (error instanceof InternalServerError) {
    return reply.internalServerError(error.message);
  }

  if (error instanceof TooManyRequestsException) {
    return reply.tooManyRequests(error.message);
  }

  if (error instanceof ForbiddenException) {
    return reply.forbidden(error.message);
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
        stack: error.stack,
        validation: error.validation,
      },
      error,
    },
    "Unhandled error occurred.",
  );
  return reply.code(500).send(error.message);
};
