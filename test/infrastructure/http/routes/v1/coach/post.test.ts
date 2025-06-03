import { FastifyInstance } from "fastify";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from "vitest";
import PgDockerController from "../../../../../PgDockerController.js";
import { createServer } from "../../../../../utils/buildServer.js";

describe(`POST /v1/coaches`, () => {
  const pgDockerController = new PgDockerController();
  let server: FastifyInstance;
  const token = process.env.TEST_AUTH0_TOKEN;

  beforeAll(async () => {
    await pgDockerController.setup();
    server = await createServer();
  });

  afterAll(async () => {
    if (server) await server.close();
  });

  afterEach(async () => await pgDockerController.reset());

  beforeEach(() => {});

  test("should create a coach", async () => {
    const coachData = {
      name: "Mario",
      surname: "Rossi",
      notes: "Test",
    };

    const response = await server.inject({
      method: "POST",
      url: `/api/v1/coach`,
      payload: coachData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toStrictEqual({
      id: expect.any(Number),
      ...coachData,
    });
  });
});
