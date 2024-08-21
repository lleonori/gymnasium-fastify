import { FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import { UnauthorizedException } from "../../application/commons/exceptions.ts";

interface AppMetadata {
  role: string[];
  active: boolean;
}

declare module "fastify" {
  interface FastifyInstance {
    authGuard(
      request: FastifyRequest,
      reply: FastifyReply,
      requiredRoles: string[]
    ): Promise<void>;
  }
}

export default fp(async (fastify) => {
  fastify.decorate(
    "authGuard",
    async function (
      request: FastifyRequest,
      reply: FastifyReply,
      requiredRoles: string[]
    ) {
      const user = request.user;

      if (
        typeof user === "object" &&
        user !== null &&
        "https://my-app.example.com/app_metadata" in user
      ) {
        const userActive = (
          user["https://my-app.example.com/app_metadata"] as AppMetadata
        ).active;

        const userRoles = (
          user["https://my-app.example.com/app_metadata"] as AppMetadata
        ).role;

        if (
          !hasRequiredActive(userActive) ||
          !hasRequiredRole(requiredRoles, userRoles)
        )
          reply.send(new UnauthorizedException(`User unauthorized`));
      } else reply.send(new UnauthorizedException(`User unauthorized`));
    }
  );
});

const hasRequiredActive = (userActive: boolean): boolean => {
  return userActive;
};

const hasRequiredRole = (
  requiredRoles: string[],
  userRoles: string[]
): boolean => {
  const hasRequiredRole = requiredRoles.every((role) =>
    userRoles.includes(role)
  );

  return hasRequiredRole;
};
