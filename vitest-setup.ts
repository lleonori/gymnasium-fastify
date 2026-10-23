/* eslint-disable @typescript-eslint/no-unused-vars */
import { createHmac } from "crypto";
import fp from "fastify-plugin";
import { vi } from "vitest";
import PgDockerController from "./test/PgDockerController.js";

const TEST_JWT_SECRET = "vitest-jwt-secret";

// Nei test i token non vengono verificati su Auth0 (JWKS) ma con un secret locale (HS256)
vi.mock("fastify-auth0-verify", async (importOriginal) => {
  const { fastifyAuth0Verify } =
    await importOriginal<typeof import("fastify-auth0-verify")>();
  return {
    default: fp(
      (app, opts, done) =>
        fastifyAuth0Verify(
          app,
          { ...opts, domain: undefined, secret: TEST_JWT_SECRET },
          done,
        ),
      { name: "fastify-auth0-verify" },
    ),
  };
});

const base64url = (value: object | string) =>
  Buffer.from(
    typeof value === "string" ? value : JSON.stringify(value),
  ).toString("base64url");

const signTestToken = (payload: object) => {
  const unsigned = `${base64url({ alg: "HS256", typ: "JWT" })}.${base64url(payload)}`;
  const signature = createHmac("sha256", TEST_JWT_SECRET)
    .update(unsigned)
    .digest("base64url");
  return `${unsigned}.${signature}`;
};

const now = Math.floor(Date.now() / 1000);

process.env["TEST_AUTH0_TOKEN"] = signTestToken({
  app_metadata: { is_active: true, roles: ["systemAdministrator"] },
  sub: "auth0|vitest",
  aud: process.env["AUDIENCE_AUTH0"],
  iat: now,
  exp: now + 3600,
});
