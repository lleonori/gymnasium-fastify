import autoLoad from "@fastify/autoload";
import dotenv from "dotenv";
import { FastifyInstance } from "fastify";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { errorHandler } from "./http/errors/index.ts";
import fastifyAuth0Verifiy from "fastify-auth0-verify";
import { UnauthorizedException } from "../application/commons/exceptions.ts";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function (app: FastifyInstance) {
  app.register(import("@fastify/cors"));
  app.register(import("@fastify/sensible"));
  app.register(import("@fastify/swagger"));
  app.register(import("@fastify/swagger-ui"), {
    routePrefix: "/documentation",
  });
  app.register(fastifyAuth0Verifiy, {
    domain: process.env.DOMAIN_AUTH0,
    secret: process.env.SECRET_AUTH0,
  });
  app.register(autoLoad, {
    dir: join(__dirname, "plugins"),
    forceESM: true,
  });
  app.register(autoLoad, {
    dir: join(__dirname, "services"),
    forceESM: true,
  });
  app.register(autoLoad, {
    dir: join(__dirname, "http/routes"),
    options: { prefix: "/api" },
    forceESM: true,
  });
  app.setErrorHandler(errorHandler);
  app.ready(() => {
    app.log.info(app.printRoutes());
  });
  app.addHook("onRequest", async (request) => {
    try {
      await request.jwtVerify();
    } catch {
      throw new UnauthorizedException(`User unauthorized`);
    }
  });
}
