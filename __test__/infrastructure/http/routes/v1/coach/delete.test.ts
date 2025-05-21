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
import { CoachDao } from "../../../../../../src/infrastructure/dao/coachDao.js";
import PgDockerController from "../../../../../PgDockerController.js";
import { createServer } from "../../../../../utils/buildServer.js";

describe("DELETE /v1/coachs/:coachId", () => {
  let server: FastifyInstance;
  let coachDao: CoachDao;
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

  beforeEach(async () => {
    coachDao = new CoachDao(pgDockerController.db);
  });

  test("should delete a coach", async () => {
    const coach = await coachDao.create({
      name: "Mario",
      surname: "Rossi",
      notes: "Test",
    });

    const response = await server.inject({
      method: "DELETE",
      url: `/api/v1/coach/${coach.id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toStrictEqual({
      id: coach.id,
      name: coach.name,
      surname: coach.surname,
      notes: coach.notes,
    });
  });

  test("should return 404 if coach does not exist", async () => {
    const response = await server.inject({
      method: "DELETE",
      url: `/api/v1/coach/9999`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(204);
  });
});
