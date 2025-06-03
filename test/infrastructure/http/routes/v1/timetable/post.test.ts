import { FastifyInstance } from "fastify";
import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import PgDockerController from "../../../../../PgDockerController.js";
import { createServer } from "../../../../../utils/buildServer.js";

describe(`POST /v1/timetable`, () => {
  let server: FastifyInstance;
  const pgDockerController = new PgDockerController();
  const token = process.env.TEST_AUTH0_TOKEN;

  beforeAll(async () => {
    await pgDockerController.setup();
    server = await createServer();
  });

  afterAll(async () => {
    if (server) await server.close();
  });

  afterEach(async () => await pgDockerController.reset());

  test("should create a new timetable", async () => {
    const timetableData = {
      startHour: "09:00:00Z",
      endHour: "10:00:00Z",
    };

    const response = await server.inject({
      method: "POST",
      url: "/api/v1/timetable",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      payload: timetableData,
    });

    expect(response.statusCode).toBe(201);

    // Verifica che il formato sia HH:mm:ss senza Z
    const { id, startHour, endHour } = response.json();
    expect(id).toEqual(expect.any(Number));
    expect(startHour).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    expect(endHour).toMatch(/^\d{2}:\d{2}:\d{2}$/);
  });
});
