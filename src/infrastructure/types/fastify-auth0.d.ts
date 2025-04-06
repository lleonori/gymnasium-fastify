import "@fastify/jwt";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: {
      app_metadata: {
        is_active: boolean;
        roles: string[];
      };
    };
  }
}
