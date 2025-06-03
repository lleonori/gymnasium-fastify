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

describe(`PATCH /v1/coaches/:coachI`, () => {
  const pgDockerController = new PgDockerController();
  let server: FastifyInstance;
  let coachDao: CoachDao;
  const token = process.env.TEST_AUTH0_TOKEN;

  beforeAll(async () => {
    await pgDockerController.setup();
    server = await createServer();
  });

  afterAll(async () => {
    if (server) await server.close();
  });

  afterEach(async () => await pgDockerController.reset());

  beforeEach(() => {
    coachDao = new CoachDao(pgDockerController.db);
  });

  test("should edit a coach", async () => {
    const coach = await coachDao.create({
      name: "Mario",
      surname: "Rossi",
      notes: "Test",
    });

    const updatedCoach = {
      name: "Luigi",
      surname: "Verdi",
      notes: "Aggiornato",
    };

    const response = await server.inject({
      method: "PATCH",
      url: `/api/v1/coach/${coach.id}`,
      payload: updatedCoach,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toStrictEqual({
      id: coach.id,
      ...updatedCoach,
    });
  });

  test(`should return 404 if coach doesn't exist`, async () => {
    const response = await server.inject({
      method: "PATCH",
      url: `/api/v1/coach/9999`,
      payload: {
        name: "NonEsiste",
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(404);
  });
});
