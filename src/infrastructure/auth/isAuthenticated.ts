import { FastifyRequest } from "fastify";
import { UnauthorizedException } from "../../application/commons/exceptions.js";

export async function isAuthenticated(request: FastifyRequest) {
  if (!request.user) {
    throw new UnauthorizedException(`User unauthorized`);
  }
}
