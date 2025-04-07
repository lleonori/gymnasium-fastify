import { FastifyRequest } from "fastify";
import { ForbiddenException } from "../../application/commons/exceptions.js";

export function hasRole(requiredRoles: string[]) {
  return async function (request: FastifyRequest) {
    const isActive = request.user.app_metadata.is_active;
    if (!isActive) {
      throw new ForbiddenException(`User is not active`);
    }

    const userRoles = request.user.app_metadata.roles;
    const hasAllRoles = requiredRoles.some((r) => userRoles.includes(r));

    if (!hasAllRoles) {
      throw new ForbiddenException(
        `User does not have permission to access this resource`,
      );
    }
  };
}
